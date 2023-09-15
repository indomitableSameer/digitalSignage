import threading

schedule_active = threading.Event()

def set_schedule_event():
    schedule_active.set()

def unset_scheduler_event():
    schedule_active.is_set()