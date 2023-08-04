
// FFplay, Copyright (c) 2003 Fabrice Bellard,
// Tutorial by Martin Bohme (boehme@inb.uni-luebeckREMOVETHIS.de)
// Updates from https://github.com/illuusio/ffmpeg-tutorial


extern "C" {
#include <libavutil/opt.h>
#include <libavutil/time.h>
#include <libavcodec/avcodec.h>
#include <libavformat/avformat.h>
#include <libavformat/avio.h>
#include <libavutil/avstring.h>
#include <libswscale/swscale.h>
#include <libswresample/swresample.h>
}

#include <SDL2/SDL.h>
#include <SDL2/SDL_thread.h>
#undef main     // prevent SDL from overriding main()

#include <math.h>
#include <stdio.h>

#define AV_SYNC_THRESHOLD 0.01
#define AV_NOSYNC_THRESHOLD 10.0

#define SDL_AUDIO_BUFFER_SIZE 1024
#define MAX_AUDIO_FRAME_SIZE 192000

#define MAX_audio_queue_SIZE (5 * 16 * 1024)
#define MAX_VIDEOQ_SIZE (5 * 256 * 1024)

#define FF_ALLOC_EVENT (SDL_USEREVENT)
#define FF_REFRESH_EVENT (SDL_USEREVENT + 1)

#define VIDEO_PICTURE_QUEUE_SIZE 1
#define AVCODEC_MAX_AUDIO_FRAME_SIZE 192000 // 1 second of 48khz 32bit audio

typedef struct PacketQueue {
	AVPacketList *first_pkt, *last_pkt;
	int nb_packets;
	int size;
	SDL_mutex *mutex;
	SDL_cond *cond;
} PacketQueue;


typedef struct VideoPicture {
	SDL_Texture *texture;
	Uint8 *yPlane, *uPlane, *vPlane;
	size_t yPlaneSz, uvPlaneSz;
	int uvPitch;
	int width, height;
	int allocated;
	double pts;
} VideoPicture;

typedef struct VideoState {
	AVFormatContext *pFormatCtx;
	int             videoStream, audioStream;

	AVStream        *audio_st;
	AVCodecContext  *audio_ctx;
	PacketQueue     audio_queue;
	uint8_t         audio_buf[(AVCODEC_MAX_AUDIO_FRAME_SIZE * 3) / 2];
	unsigned int    audio_buf_size;
	unsigned int    audio_buf_index;
	AVFrame         audio_frame;
	AVPacket        audio_pkt;
	uint8_t         *audio_pkt_data;
	int             audio_pkt_size;
	int             audio_hw_buf_size;

	double          frame_timer;
	double          frame_last_pts;
	double          frame_last_delay;

	double          video_clock;
	AVStream        *video_st;
	AVCodecContext  *video_ctx;
	PacketQueue     videoq;
	struct SwsContext *sws_ctx;

	VideoPicture    pictq[VIDEO_PICTURE_QUEUE_SIZE];
	int             pictq_size, pictq_rindex, pictq_windex;
	SDL_mutex       *pictq_mutex;
	SDL_cond        *pictq_cond;

	SDL_Thread      *parse_tid;
	SDL_Thread      *video_tid;

	double          audio_clock;
	char            filename[1024];
	int             quit;
} VideoState;

SDL_Window *screen;
SDL_mutex *screen_mutex;
SDL_Renderer *renderer;

VideoState *global_video_state;


void packet_queue_init(PacketQueue *queue) {
	memset(queue, 0, sizeof(PacketQueue));
	queue->mutex = SDL_CreateMutex();
	queue->cond = SDL_CreateCond();
}

int packet_queue_put(PacketQueue *queue, AVPacket *pkt) {

	AVPacketList *pkt1;
	if (av_dup_packet(pkt) < 0) {
		return -1;
	}

	pkt1 = (struct AVPacketList *) av_malloc(sizeof(AVPacketList));

	if (!pkt1)
		return -1;

	pkt1->pkt = *pkt;
	pkt1->next = nullptr;

	SDL_LockMutex(queue->mutex);

	if (!queue->last_pkt)
		queue->first_pkt = pkt1;
	else
		queue->last_pkt->next = pkt1;

	queue->last_pkt = pkt1;
	queue->nb_packets++;
	queue->size += pkt1->pkt.size;

	SDL_CondSignal(queue->cond);

	SDL_UnlockMutex(queue->mutex);

	return 0;
}

static int packet_queue_get(PacketQueue *queue, AVPacket *pkt, int block) {

	AVPacketList *pkt1;
	int ret;

	SDL_LockMutex(queue->mutex);

	for (;;) {

		if (global_video_state->quit) {
			ret = -1;
			break;
		}

		pkt1 = queue->first_pkt;

		if (pkt1) {
			queue->first_pkt = pkt1->next;

			if (!queue->first_pkt)
				queue->last_pkt = nullptr;

			queue->nb_packets--;
			queue->size -= pkt1->pkt.size;
			*pkt = pkt1->pkt;
			av_free(pkt1);

			ret = 1;

			break;
		}
		else if (!block) {
			ret = 0;
			break;
		}
		else
			SDL_CondWait(queue->cond, queue->mutex);
	}

	SDL_UnlockMutex(queue->mutex);

	return ret;
}

double get_audio_clock(VideoState *videoState) {
	double pts;
	int hw_buf_size, bytes_per_sec, n;

	pts = videoState->audio_clock; /* maintained in the audio thread */
	hw_buf_size = videoState->audio_buf_size - videoState->audio_buf_index;
	bytes_per_sec = 0;
	n = videoState->audio_st->codec->channels * 2;

	if (videoState->audio_st) {
		bytes_per_sec = videoState->audio_st->codec->sample_rate * n;
	}

	if (bytes_per_sec) {
		pts -= (double)hw_buf_size / bytes_per_sec;
	}

	return pts;
}

int audio_decode_frame(VideoState *videoState, double *pts_ptr) {

	int len1, data_size = 0;
	AVPacket *pkt = &videoState->audio_pkt;
	double pts;
	int n;

	for (;;) {

		while (videoState->audio_pkt_size > 0) {

			int got_frame = 0;
			len1 = avcodec_decode_audio4(videoState->audio_ctx, &videoState->audio_frame, &got_frame, pkt);
			
			if (len1 < 0) {
				/* if error, skip frame */
				videoState->audio_pkt_size = 0;
				break;
			}

			data_size = 0;


			if (got_frame) {

				data_size =
					av_samples_get_buffer_size( NULL,
						videoState->audio_st->codec->channels,
						videoState->audio_frame.nb_samples,
						videoState->audio_st->codec->sample_fmt,
						1);

				if (data_size <= 0)
					continue;

				memcpy(videoState->audio_buf, videoState->audio_frame.data[0], data_size);
			}

			videoState->audio_pkt_data += len1;
			videoState->audio_pkt_size -= len1;

			if (data_size <= 0)
				continue;

			pts = videoState->audio_clock;
			*pts_ptr = pts;

			n = 2 * videoState->audio_ctx->channels;
			videoState->audio_clock += (double)data_size / (double)(n * videoState->audio_ctx->sample_rate);

			return data_size;
		}

		if (pkt->data)
			av_free_packet(pkt);

		if (videoState->quit)
			return -1;

		if (packet_queue_get(&videoState->audio_queue, pkt, 1) < 0)
			return -1;

		videoState->audio_pkt_data = pkt->data;
		videoState->audio_pkt_size = pkt->size;

		if (pkt->pts != AV_NOPTS_VALUE)
			videoState->audio_clock = av_q2d(videoState->audio_st->time_base)*pkt->pts;
	}
}

void audio_callback(void *userdata, Uint8 *stream, int len) {

	VideoState *videoState = (VideoState *)userdata;
	long len1, audio_size;
	double pts;

	while (len > 0) {

		if (videoState->audio_buf_index >= videoState->audio_buf_size) {
			audio_size = audio_decode_frame(videoState, &pts);

			if (audio_size < 0) {
				videoState->audio_buf_size = 1024;
				memset(videoState->audio_buf, 0, videoState->audio_buf_size);

			}
			else {
				videoState->audio_buf_size = audio_size;
			}

			videoState->audio_buf_index = 0;
		}

		len1 = videoState->audio_buf_size - videoState->audio_buf_index;

		if (len1 > len) {
			len1 = len;
		}

		memcpy(stream, (uint8_t *)videoState->audio_buf + videoState->audio_buf_index, len1);
		
		len -= len1;
		stream += len1;

		videoState->audio_buf_index += len1;
	}
}

static Uint32 sdl_refresh_timer_cb(Uint32 interval, void *opaque) {

	SDL_Event event;
	event.type = FF_REFRESH_EVENT;
	event.user.data1 = opaque;
	SDL_PushEvent(&event);

	return 0;
}

static void schedule_refresh(VideoState *videoState, int delay) {
	SDL_AddTimer(delay, sdl_refresh_timer_cb, videoState);
}

void video_display(VideoState *videoState) {

	SDL_Rect rect;
	VideoPicture *vp;
	float aspect_ratio;
	int w, h, x, y;
	int i;

	vp = &videoState->pictq[videoState->pictq_rindex];

	if (vp->texture) {
		if (videoState->video_ctx->sample_aspect_ratio.num == 0)
			aspect_ratio = 0;
		else
			aspect_ratio = av_q2d(videoState->video_ctx->sample_aspect_ratio) * videoState->video_ctx->width / videoState->video_ctx->height;

		if (aspect_ratio <= 0.0) {
			aspect_ratio = (float)videoState->video_ctx->width /
				(float)videoState->video_ctx->height;
		}

		SDL_LockMutex(screen_mutex);

		SDL_UpdateYUVTexture(
			vp->texture,
			nullptr,
			vp->yPlane,
			videoState->video_ctx->width,
			vp->uPlane,
			vp->uvPitch,
			vp->vPlane,
			vp->uvPitch
		);

		SDL_RenderClear(renderer);
		SDL_RenderCopy(renderer, vp->texture, nullptr, nullptr);
		SDL_RenderPresent(renderer);
		SDL_UnlockMutex(screen_mutex);

	}
}

void video_refresh_timer(void *userdata) {

	VideoPicture *vp;
	VideoState *videoState = (VideoState *)userdata;
	double actual_delay, delay, sync_threshold, ref_clock, diff;

	if (videoState->video_st) {

		if (videoState->pictq_size == 0)
			schedule_refresh(videoState, 1);
		else {
			vp = &videoState->pictq[videoState->pictq_rindex];

			delay = vp->pts - videoState->frame_last_pts;

			if (delay <= 0 || delay >= 1.0)
				delay = videoState->frame_last_delay;

			videoState->frame_last_delay = delay;
			videoState->frame_last_pts = vp->pts;

			ref_clock = get_audio_clock(videoState);
			diff = vp->pts - ref_clock;

			sync_threshold = (delay > AV_SYNC_THRESHOLD) ? delay : AV_SYNC_THRESHOLD;

			if (fabs(diff) < AV_NOSYNC_THRESHOLD) {
				if (diff <= -sync_threshold)
					delay = 0;
				else if (diff >= sync_threshold)
					delay = 2 * delay;
			}

			videoState->frame_timer += delay;

			actual_delay = videoState->frame_timer - (av_gettime() / 1000000.0);

			if (actual_delay < 0.010)
				actual_delay = 0.010;

			schedule_refresh(videoState, (int)(actual_delay * 1000 + 0.5));

			video_display(videoState);

			if (++videoState->pictq_rindex == VIDEO_PICTURE_QUEUE_SIZE)
				videoState->pictq_rindex = 0;

			SDL_LockMutex(videoState->pictq_mutex);
			videoState->pictq_size--;
			SDL_CondSignal(videoState->pictq_cond);
			SDL_UnlockMutex(videoState->pictq_mutex);
		}
	}
	else
		schedule_refresh(videoState, 100);
}

void alloc_picture(void *userdata) {

	VideoState *videoState = (VideoState *)userdata;
	VideoPicture *vp;
	float aspect_ratio;
	int w, h, x, y;
	int scr_w, scr_h;
	int i;

	vp = &videoState->pictq[videoState->pictq_windex];

	if (vp->texture)
		SDL_DestroyTexture(vp->texture);

	SDL_LockMutex(screen_mutex);

	if (videoState->video_ctx->sample_aspect_ratio.num == 0)
		aspect_ratio = 0;
	else
		aspect_ratio = av_q2d(videoState->video_ctx->sample_aspect_ratio) * videoState->video_ctx->width / videoState->video_ctx->height;

	if (aspect_ratio <= 0.0)
		aspect_ratio = (float)videoState->video_ctx->width / (float)videoState->video_ctx->height;

	SDL_GetWindowSize(screen, &scr_w, &scr_h);

	h = scr_h;
	w = ((int)rint(h * aspect_ratio)) & -3;

	if (w > scr_w) {
		w = scr_w;
		h = ((int)rint(w / aspect_ratio)) & -3;
	}

	x = (scr_w - w) / 2; y = (scr_h - h) / 2;
	printf("screen final size: %dx%d\n", w, h);

	vp->texture = SDL_CreateTexture(
		renderer,
		SDL_PIXELFORMAT_YV12,
		SDL_TEXTUREACCESS_STREAMING,
		w,
		h
	);

	vp->yPlaneSz = w * h;
	vp->uvPlaneSz = w * h / 4;
	vp->yPlane = (Uint8*)malloc(vp->yPlaneSz);
	vp->uPlane = (Uint8*)malloc(vp->uvPlaneSz);
	vp->vPlane = (Uint8*)malloc(vp->uvPlaneSz);

	if (!vp->yPlane || !vp->uPlane || !vp->vPlane) {
		fprintf(stderr, "Could not allocate pixel buffers - exiting\n");
		exit(1);
	}

	vp->uvPitch = videoState->video_ctx->width / 2;

	SDL_UnlockMutex(screen_mutex);

	vp->width = videoState->video_ctx->width;
	vp->height = videoState->video_ctx->height;
	vp->allocated = 1;
}

int queue_picture(VideoState *videoState, AVFrame *pFrame, double pts) {

	VideoPicture *vp;
	int dst_pix_fmt;
	AVPicture pict;

	SDL_LockMutex(videoState->pictq_mutex);

	while (videoState->pictq_size >= VIDEO_PICTURE_QUEUE_SIZE && !videoState->quit)
		SDL_CondWait(videoState->pictq_cond, videoState->pictq_mutex);

	SDL_UnlockMutex(videoState->pictq_mutex);

	if (videoState->quit)
		return -1;

	vp = &videoState->pictq[videoState->pictq_windex];

	if (!vp->texture ||
		vp->width != videoState->video_ctx->width ||
		vp->height != videoState->video_ctx->height) {

		SDL_Event event;

		vp->allocated = 0;
		alloc_picture(videoState);

		if (videoState->quit)
			return -1;
	}

	if (vp->texture) {

		vp->pts = pts;

		dst_pix_fmt = AV_PIX_FMT_YUV420P;

		pict.data[0] = vp->yPlane;
		pict.data[1] = vp->uPlane;
		pict.data[2] = vp->vPlane;

		pict.linesize[0] = vp->width;
		pict.linesize[1] = vp->uvPitch;
		pict.linesize[2] = vp->uvPitch;

		sws_scale(videoState->sws_ctx, (uint8_t const * const *)pFrame->data,
			pFrame->linesize, 0, videoState->video_ctx->height,
			pict.data, pict.linesize);

		if (++videoState->pictq_windex == VIDEO_PICTURE_QUEUE_SIZE)
			videoState->pictq_windex = 0;

		SDL_LockMutex(videoState->pictq_mutex);
		videoState->pictq_size++;
		SDL_UnlockMutex(videoState->pictq_mutex);
	}

	return 0;
}

double synchronize_video(VideoState *videoState, AVFrame *src_frame, double pts) {

	double frame_delay;

	if (pts != 0)
		videoState->video_clock = pts;
	else
		pts = videoState->video_clock;

	frame_delay = av_q2d(videoState->video_ctx->time_base);
	frame_delay += src_frame->repeat_pict * (frame_delay * 0.5);

	videoState->video_clock += frame_delay;

	return pts;
}

int video_thread(void *arg) {

	VideoState *videoState = (VideoState *)arg;
	AVPacket pkt1, *packet = &pkt1;
	int frameFinished;
	AVFrame *pFrame;
	double pts;

	pFrame = av_frame_alloc();

	for (;;) {

		if (packet_queue_get(&videoState->videoq, packet, 1) < 0)
			break;

		pts = 0;

		avcodec_decode_video2(videoState->video_ctx, pFrame, &frameFinished, packet);

		if ((pts = av_frame_get_best_effort_timestamp(pFrame)) == AV_NOPTS_VALUE)
			pts = 0;

		pts *= av_q2d(videoState->video_st->time_base);

		if (frameFinished) {
			pts = synchronize_video(videoState, pFrame, pts);
			if (queue_picture(videoState, pFrame, pts) < 0)
				break;
		}

		av_free_packet(packet);
	}

	av_frame_free(&pFrame);

	return 0;
}

int stream_component_open(VideoState *videoState, int stream_index) {

	AVFormatContext *pFormatCtx = videoState->pFormatCtx;
	AVCodecContext *codecCtx = nullptr;
	AVCodec *codec = nullptr;
	SDL_AudioSpec wanted_spec, spec;

	if (stream_index < 0 || stream_index >= pFormatCtx->nb_streams)
		return -1;

	codec = avcodec_find_decoder(pFormatCtx->streams[stream_index]->codec->codec_id);
	
	if (!codec) {
		fprintf(stderr, "Unsupported codec!\n");
		return -1;
	}

	codecCtx = avcodec_alloc_context3(codec);

	if (avcodec_copy_context(codecCtx, pFormatCtx->streams[stream_index]->codec) != 0) {
		fprintf(stderr, "Couldn't copy codec context");
		return -1;
	}

	if (codecCtx->codec_type == AVMEDIA_TYPE_VIDEO)
		SDL_SetWindowSize(screen, codecCtx->width, codecCtx->height);

	if (codecCtx->codec_type == AVMEDIA_TYPE_AUDIO) {
		wanted_spec.freq = codecCtx->sample_rate;
		wanted_spec.format = AUDIO_S16SYS;
		wanted_spec.channels = codecCtx->channels;
		wanted_spec.samples = SDL_AUDIO_BUFFER_SIZE;
		wanted_spec.callback = audio_callback;
		wanted_spec.userdata = videoState;
		wanted_spec.silence = 0;

		if (SDL_OpenAudio(&wanted_spec, &spec) < 0) {
			fprintf(stderr, "SDL_OpenAudio: %s\n", SDL_GetError());
			return -1;
		}

		videoState->audio_hw_buf_size = spec.size;
	}

	if (avcodec_open2(codecCtx, codec, nullptr) < 0) {
		fprintf(stderr, "Unsupported codec!\n");
		return -1;
	}

	switch (codecCtx->codec_type) {

		case AVMEDIA_TYPE_AUDIO:
			videoState->audioStream = stream_index;
			videoState->audio_st = pFormatCtx->streams[stream_index];
			videoState->audio_ctx = codecCtx;
			videoState->audio_buf_size = 0;
			videoState->audio_buf_index = 0;
			memset(&videoState->audio_pkt, 0, sizeof(videoState->audio_pkt));
			packet_queue_init(&videoState->audio_queue);

			SDL_PauseAudio(0);
			break;

		case AVMEDIA_TYPE_VIDEO:
			videoState->videoStream = stream_index;
			videoState->video_st = pFormatCtx->streams[stream_index];
			videoState->video_ctx = codecCtx;

			videoState->frame_timer = (double)av_gettime() / 1000000.0;
			videoState->frame_last_delay = 40e-3;

			packet_queue_init(&videoState->videoq);

			videoState->video_tid = SDL_CreateThread(video_thread, "video_thread", videoState);
			videoState->sws_ctx = sws_getContext(videoState->video_ctx->width, videoState->video_ctx->height,
				videoState->video_ctx->pix_fmt, videoState->video_ctx->width,
				videoState->video_ctx->height, AV_PIX_FMT_YUV420P,
				SWS_BILINEAR, nullptr, nullptr, nullptr);
			break;

		default:
			break;
	}
}

int decode_thread(void *arg) {

	VideoState *videoState = (VideoState *)arg;
	AVFormatContext *pFormatCtx = nullptr;
	AVPacket pkt1, *packet = &pkt1;

	int video_index = -1;
	int audio_index = -1;
	int i;

	videoState->videoStream = -1;
	videoState->audioStream = -1;

	global_video_state = videoState;

	if (avformat_open_input(&pFormatCtx, videoState->filename, nullptr, nullptr) != 0) {
		fprintf(stderr, "Couldn't open file!\n");
		return -1;
	}

	videoState->pFormatCtx = pFormatCtx;

	if (avformat_find_stream_info(pFormatCtx, nullptr) < 0) {
		fprintf(stderr, "Couldn't find stream information!\n");
		return -1;
	}

	av_dump_format(pFormatCtx, 0, videoState->filename, 0);

	for (i = 0; i<pFormatCtx->nb_streams; i++) {

		if (pFormatCtx->streams[i]->codec->codec_type == AVMEDIA_TYPE_VIDEO && video_index < 0)
			video_index = i;

		if (pFormatCtx->streams[i]->codec->codec_type == AVMEDIA_TYPE_AUDIO && audio_index < 0)
			audio_index = i;
	}

	if (audio_index >= 0)
		stream_component_open(videoState, audio_index);

	if (video_index >= 0)
		stream_component_open(videoState, video_index);

	if ((videoState->videoStream < 0) || (videoState->audioStream < 0)) {
		fprintf(stderr, "%s: could not open codecs\n", videoState->filename);

		SDL_Event event;
		event.type = SDL_QUIT;
		event.user.data1 = videoState;
		SDL_PushEvent(&event);
	}

	for (;;) {

		if (videoState->quit)
			break;

		if (videoState->audio_queue.size > MAX_audio_queue_SIZE ||
			videoState->videoq.size > MAX_VIDEOQ_SIZE) {
			SDL_Delay(10);
			continue;
		}

		if (av_read_frame(videoState->pFormatCtx, packet) < 0) {
			if (videoState->pFormatCtx->pb->error == 0) {
				SDL_Delay(100);
				continue;
			}
			else
				break;
		}

		if (packet->stream_index == videoState->videoStream)
			packet_queue_put(&videoState->videoq, packet);
		else if (packet->stream_index == videoState->audioStream)
			packet_queue_put(&videoState->audio_queue, packet);
		else
			av_free_packet(packet);
	}

	while (!videoState->quit)
		SDL_Delay(100);

	return 0;
}

int main(int argc, char *argv[]) {

	SDL_Event event;
	VideoState  *videoState;

	videoState= (struct VideoState *) av_mallocz(sizeof(VideoState));

	if (argc < 2) {
		fprintf(stderr, "Usage: test <file>\n");
		exit(1);
	}

	// register all formats and codecs
	av_register_all();

	if (SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO | SDL_INIT_TIMER)) {
		fprintf(stderr, "Could not initialize SDL - %s\n", SDL_GetError());
		exit(1);
	}

	screen = SDL_CreateWindow( "FFmpeg Tutorial",
		SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED,
		1280, 800, 0);

	if (!screen) {
		fprintf(stderr, "SDL: could not set video mode - exiting\n");
		exit(1);
	}

	renderer = SDL_CreateRenderer(screen, -1, 0);

	if (!renderer) {
		fprintf(stderr, "SDL: could not create renderer - exiting\n");
		exit(1);
	}

	screen_mutex = SDL_CreateMutex();

	av_strlcpy(videoState->filename, argv[1], sizeof(videoState->filename));

	videoState->pictq_mutex = SDL_CreateMutex();
	videoState->pictq_cond = SDL_CreateCond();

	schedule_refresh(videoState, 100);

	videoState->parse_tid = SDL_CreateThread(decode_thread, "video_thread", videoState);

	if (!videoState->parse_tid) {
		fprintf(stderr, "SDL: could not create parse_tid - exiting\n");
		av_free(videoState);
		return -1;
	}

	for (;;) {

		SDL_WaitEvent(&event);

		switch (event.type) {

			case SDL_QUIT:
				videoState->quit = 1;

				SDL_CondSignal(videoState->audio_queue.cond);
				SDL_CondSignal(videoState->videoq.cond);

				SDL_Quit();
				exit(0);

				break;

			case FF_ALLOC_EVENT:
				alloc_picture(event.user.data1);
				break;

			case FF_REFRESH_EVENT:
				video_refresh_timer(event.user.data1);
				break;

			default:
				break;
		}
	}

	return 0;
}
