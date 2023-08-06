# importing time and vlc
import vlc
import threading

class vlcplayer(threading.Thread):
    
    def __init__(self, logger, media_file):
        threading.Thread.__init__(self, daemon=True, name='player')
        self.media_file = media_file
        self.logger = logger
        #self.vlc_instance = vlc.Instance("--aout=adummy --embedded-video --file-logging --logfile=vlc-log.txt --verbose 3")
        self.vlc_instance = vlc.Instance("--aout=adummy --embedded-video")
        #self.vlc_instance.vlm_set_loop(media_file, True)
        self.player = self.vlc_instance.media_player_new()
        logger.info('vlc player init done.')

    def playnow(self):
        media = self.vlc_instance.media_new(self.media_file)
        self.vlc_instance.vlm_set_loop('vv', True)
        self.player.set_media(media)
        self.logger.info('ready to play..')
        self.player.play()
        self.logger.info('playing..')

    def run(self):
        self.playnow()
