# importing time and vlc
import vlc
import time
import globalVariables as gv
import os


class vlcplayer():
    def __init__(self, logger, media_file):
        self.is_playing = False
        self.media_file = media_file
        self.logger = logger
        # self.vlc_instance = vlc.Instance("--aout=adummy --embedded-video --file-logging --logfile=vlc-log.txt --verbose 3")
        self.vlc_instance = vlc.Instance("--aout=adummy --embedded-video")
        # self.vlc_instance.vlm_set_loop(media_file, True)
        self.player = self.vlc_instance.media_player_new()
        self.media_list = self.vlc_instance.media_list_new([self.media_file])
        self.media_list_player = self.vlc_instance.media_list_player_new()
        self.media_list_player.set_media_list(self.media_list)
        logger.info('vlc player init done.')

    def _setup(self):
        self.logger.info('setting up media to player..')
        # media = self.vlc_instance.media_new(self.media_file)
        # self.vlc_instance.vlm_set_loop("content", True)
        # self.player.set_media(media)
        self.media_list_player.set_playback_mode(vlc.PlaybackMode.loop)
        self.logger.info('ready to play..')

    def _startplay(self):
        self._setup()
        # self.player.play()
        self.media_list_player.play()

    def _stopplay(self):
        #self.player.stop()
        self.media_list_player.stop()

    def run(self):
        while True:
            try:
                if self.is_playing != True and gv.content_event.is_set() != True and gv.schedule_active.wait() == True:
                    if self._checkFileExistance() == True:
                        self._startplay()  # uncomment to run actual
                        self.logger.info(
                            'received schedule_active event set, start playing')
                        self.is_playing = True
                    else:
                        self.logger.info(
                            'content file not found, setting content event..')
                        gv.content_event.set()
                elif gv.schedule_active.is_set() != True:
                    self._stopplay()
                    self.logger.info(
                        'received schedule_active event cleared, stoping playing..')
                    self.is_playing = False
            except Exception as e:
                self.logger.info(e)
                time.sleep(30)

    def _checkFileExistance(self):
        if os.path.exists(self.media_file) == True and os.path.getsize(self.media_file) != 0:
            return True
        else:
            return False
