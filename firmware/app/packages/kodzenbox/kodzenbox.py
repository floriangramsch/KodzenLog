import ujson
import urequests
from utime import sleep_ms
from misc import get_local_time, wifi
from machine import Pin
from packages.mqtt.mqtt import Mqtt
import env


class Cat():
    def __init__(self, name: str, button: Pin) -> None:
        self.name = name
        self.button = button
        self.ate: str | None = None

    def get_button_value(self):
        return self.button.value()

    def __repr__(self) -> str:
        if (not self.ate):
            return self.name + ": None"
        else:
            return self.name + ": " + self.ate


class Kodzenbox():
    def __init__(self, lcd, led: Pin, mqtt: Mqtt) -> None:
        self.lcd = lcd
        self.led = led
        self.mqtt = mqtt
        self.cats: list[Cat] = []

    def init(self):
        self.fetch_time()

        self.lcd.writeFirstLine("Naseweis", "Leo")
        self.lcd.writeSecondLine(self.cats[0].ate, self.cats[1].ate)

        self.checkIfFed()

    def add_cat(self, cat: Cat):
        self.cats.append(cat)

    def fetch_time(self) -> None:
        for cat in self.cats:
            # url = f"https://cats.floxsite.de/api/ate/today/{cat.name}"
            url = env.API_ATE + str(cat.name)
            response = urequests.get(url)
            data = response.json()
            response.close()

            # Array → Erstes Element → "time"
            if len(data) == 0:
                continue
            # z.B. "2025-07-08T23:08:37.000Z"
            last_time: str = data[-1]["time"]
            [_, uhrzeit] = last_time.split("T")
            time_str = uhrzeit[:5]
            cat.ate = time_str

        self.write_second_line()

    def feed(self, cat_name):
        # url = "https://cats.floxsite.de/api/feed"
        url = env.API_FEED
        headers = {
            "Content-Type": "application/json"
        }

        payload = {
            "cat": cat_name,
        }

        response = urequests.post(
            url, data=ujson.dumps(payload), headers=headers)
        data = response.json()
        response.close()

        # z.B. "2025-07-08T23:08:37.000Z"
        last_time: str = data["time"]
        [_, time_str] = last_time.split(",")
        uhrzeit = time_str.strip()[:5]

        # time_str = data["time"]
        # uhrzeit = time_str[10:15]  # "23:08"

        self.lcd.clear()
        self.lcd.putstr("Feeding...")
        sleep_ms(2000)
        self.lcd.writeFirstLine("Naseweis", "Leo")
        self.led.value(0)

        for cat in self.cats:
            if cat.name == cat_name:
                cat.ate = uhrzeit

        self.write_second_line()

    def checkIfFed(self):
        """
            Checks if the cats have been fed based on the current local hour and updates the LED indicator accordingly.
        """
        hour_now = get_local_time()
        # Automatische LED-Berechnung
        self.mqtt.led_auto = 0
        led_auto = 0

        for cat in [self.cats[0]]:
            if cat.ate is None:
                led_auto = 1
                break

            last_fed_hour = int(cat.ate[:2])
            if 5 <= hour_now < 17 and last_fed_hour < 5:
                led_auto = 1
                break
            elif hour_now >= 17 and last_fed_hour < 17:
                led_auto = 1
                break
        self.mqtt.led_auto = led_auto
        self.mqtt.update_led()

    # def checkIfFed(self):
    #     """
    #         Checks if the cats have been fed based on the current local hour and updates the LED indicator accordingly.
    #     """
    #     hour_now = get_local_time()
    #     a = self.cats[0].ate
    #     b = self.cats[1].ate

    #     if hour_now < 5:
    #         self.led.value(0)
    #         return

    #     if ((not a)):
    #         self.led.value(1)
    #         return

    #     if (int(hour_now) < 17 and int(a[:2]) < 17):
    #         self.led.value(0)
    #         return
    #     elif (int(hour_now) >= 17 and int(a[:2]) >= 17):
    #         self.led.value(0)
    #         return
    #     self.led.value(1)
    #     self.mqtt.update_led()

    def get_button_value(self, cat_name: str):
        for cat in self.cats:
            if cat.name == cat_name:
                return cat.get_button_value()
        return None

    def write_second_line(self):
        self.lcd.writeSecondLine(self.cats[0].ate, self.cats[1].ate)
