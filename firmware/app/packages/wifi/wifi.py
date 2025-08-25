import network
import time
import env


def connect_wifi(ssid=env.WIFI_SSID, password=env.WIFI_PASSWORD):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print(f"Connecting to {ssid}...")
        wlan.connect(ssid, password)
        for _ in range(20):  # max 10 Sekunden warten
            if wlan.isconnected():
                break
            time.sleep(0.5)
    if wlan.isconnected():
        print("Connected:", wlan.ifconfig())
    else:
        print("Failed to connect")
