import logging
import subprocess

def setupSystemTimezoneAndTimeSync(log:logging, timezone):
    command = f'sudo timedatectl set-timezone {timezone}'
    subprocess.run(command, shell=True)
    subprocess.run('sudo ntpdate -s time.nist.gov', shell=True)

    log.info(f"timezone{timezone} set successfully.")