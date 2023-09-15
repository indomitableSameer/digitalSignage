# importing time and vlc
import vlc, time
import threading
import globalVariables as gv

class vlcplayer(threading.Thread):
    
    def __init__(self, logger, media_file):
        threading.Thread.__init__(self, daemon=False, name='player')
        self.is_playing = False
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

    def stopplay(self):
        self.player.stop()

    def run(self):
        try:
            while True:
                if self.is_playing != True and gv.schedule_active.wait() == True:
                    #self.playnow()
                    self.logger.info('received schedule_active event set, start playing')
                    self.is_playing = True
                elif gv.schedule_active.is_set() != True:
                    self.stopplay()
                    self.logger.info('received schedule_active event cleared, stoping playing..')
                    self.is_playing = False
        except:
            self.logger.info('exeption')
