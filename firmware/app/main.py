from utime import sleep_ms, ticks_ms
from machine import Pin
import machine

from packages.lcd.lcd import LCD
from packages.kodzenbox.kodzenbox import Kodzenbox, Cat
from packages.mqtt.mqtt import Mqtt
from misc import wifi


def button_pressed(mqtt: Mqtt, last_state: int | None, new_state: int | None, callback):
    if last_state == 1 and new_state == 0:
        callback()
        print("Fed")
        mqtt.pub(b"kodzenbox/button/01/state", b"Button pressed")
        sleep_ms(50)  # Debounce delay
    elif last_state == 0 and new_state == 1:
        mqtt.pub(b"kodzenbox/button/01/state", b"Button released")


def publish_all(mqtt: Mqtt, lcd: LCD, led: Pin):
    mqtt.pub(b'kodzenbox/led/state', b"ON" if led.value() else b"OFF")
    mqtt.pub(b'kodzenbox/lcd/state', b"ON" if lcd.backlight else b"OFF")


def main():
    print("Initializing everything...")
    lcd = LCD(rs_pin=Pin(15),
              enable_pin=Pin(2),
              d4_pin=Pin(4),
              d5_pin=Pin(16),
              d6_pin=Pin(17),
              d7_pin=Pin(5),
              backlight_pin=None,
              num_lines=2, num_columns=16)

    led = machine.Pin(27, machine.Pin.OUT)

    wifi(lcd)

    mqtt = Mqtt(led, lcd)
    mqtt.init()

    kodzenbox = Kodzenbox(lcd, led, mqtt)
    kodzenbox.add_cat(Cat("Naseweis", Pin(32, Pin.IN, Pin.PULL_UP)))
    kodzenbox.add_cat(Cat("Leo", Pin(14, Pin.IN, Pin.PULL_UP)))
    kodzenbox.init()

    last_state_Naseweis = kodzenbox.get_button_value("Naseweis")
    last_state_Leo = kodzenbox.get_button_value("Leo")
    last_refresh = ticks_ms()
    print("Starting loop..")
    while True:
        mqtt.check_msg()
        current_state_Naseweis = kodzenbox.get_button_value("Naseweis")
        current_state_Leo = kodzenbox.get_button_value("Leo")

        button_pressed(mqtt, last_state_Naseweis, current_state_Naseweis,
                       lambda: kodzenbox.feed("Naseweis"))
        button_pressed(mqtt, last_state_Leo, current_state_Leo,
                       lambda: kodzenbox.feed("Leo"))

        # alle 5 Minuten aktualisieren
        if ticks_ms() - last_refresh >= 300_000:  # 300000 ms = 5 Minuten
            kodzenbox.fetch_time()

            last_refresh = ticks_ms()
            kodzenbox.checkIfFed()

        last_state_Naseweis = current_state_Naseweis
        last_state_Leo = current_state_Leo
        sleep_ms(10)


print(__name__)
if __name__ == "__main__":
    main()
