from umqtt.simple import MQTTClient
from packages.lcd.lcd import LCD
from machine import Pin
import env


class Mqtt():
    def __init__(self, led: Pin, lcd: LCD) -> None:
        self.led = led
        self.led_manual = 1  # set in HA to disable led
        self.led_auto = 0  # set through esp

        self.lcd = lcd

    def init(self):
        self.client: MQTTClient = MQTTClient('homeassistant', server=env.MQTT_SERVER,
                                             port=env.MQTT_PORT, user=env.MQTT_USER, password=env.MQTT_PASSWORD)

        self.client.set_callback(self.sub)
        self.client.connect()
        print("MQTT connected")

        # topics
        # kodzenbox/button/01/state
        # kodzenbox/button/02/state
        # kodzenbox/led/state
        # kodzenbox/led/set
        # kodzenbox/led_manual/set
        # kodzenbox/led_manual/state
        # kodzenbox/lcd/state
        # kodzenbox/lcd/set
        self.topics = [
            b"kodzenbox/button/01/state",
            b"kodzenbox/button/02/state",
            b"kodzenbox/led_manual/set",
            b"kodzenbox/lcd/set",
        ]
        for t in self.topics:
            self.client.subscribe(t)

    def sub(self, topic, msg):
        msg = msg.decode()
        topic = topic.decode()
        print('received: ', topic, msg)
        if topic == "kodzenbox/led_manual/set":
            self.led_manual = 1 if msg == 'ON' else 0
            self.client.publish(b"kodzenbox/led_manual/state", msg.encode())
            self.update_led()

        if topic == "kodzenbox/lcd/set":
            self.lcd.backlight_on() if msg == 'ON' else self.lcd.backlight_off()
            lcd_backlight = self.lcd.backlight
            self.client.publish(b"kodzenbox/lcd/state",
                                b"ON" if lcd_backlight else b"OFF")

        if msg == "QUIT":
            self.client.publish(b"test/topic", b"QUIT2")
            self.client.disconnect()

    def pub(self, topic, msg):
        self.client.publish(topic, msg)

    def check_msg(self):
        self.client.check_msg()

    def update_led(self):
        self.led.value(self.led_auto and self.led_manual)
        self.client.publish(b"kodzenbox/led/state",
                            b"ON" if self.led.value() else b"OFF")
