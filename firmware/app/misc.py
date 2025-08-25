from packages.wifi.wifi import connect_wifi

from utime import sleep_ms
from time import localtime
import ntptime


def get_local_time(offset_hours=2):  # Sommerzeit = 2, Winterzeit = 1
    t = localtime()
    hour = (t[3] + offset_hours) % 24
    # return (hour, t[4])  # (Stunde, Minute)
    return hour  # (Stunde, Minute)


def wifi(lcd):
    lcd.putstr("Connecting wifi...")
    connect_wifi()
    ntptime.settime()
    lcd.clear()
    lcd.putstr("Connected!")
    sleep_ms(1000)
    lcd.clear()
