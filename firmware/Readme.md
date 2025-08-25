https://micropython.org/download/esp32/
https://micropython-stubs.readthedocs.io/en/main/11_install_stubs.html#install-stubs
https://micropython-stubs.readthedocs.io/en/main/22_vscode.html

`ls /dev/tty.*`
`ls /dev/tty.wchusbserial1130`

`esptool --chip esp32 --port /dev/tty.wchusbserial1130 erase-flash`
`esptool --chip esp32 --port /dev/tty.wchusbserial1130 --baud 460800`
`write-flash -z 0x1000 ESP32_GENERIC-20250415-v1.25.0.bin`

`mpremote connect /dev/tty.wchusbserial1130`

`mpremote connect /dev/tty.wchusbserial1130 run led.py`

`mpremote connect /dev/tty.wchusbserial1130 fs cp main.py :main.py`
`mpremote connect /dev/tty.wchusbserial1120 exec "import main"`
