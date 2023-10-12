import threading

schedule_active = threading.Event()
registration_event = threading.Event()
status_update_event = threading.Event()
play_sched_event = threading.Event()
content_event = threading.Event()
cloud_sync_ok_event = threading.Event()

