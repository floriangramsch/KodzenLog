DEVICE = /dev/tty.wchusbserial1120
SRC = examples/servo_test.py
TARGET = main.py

.PHONY: upload run clean reset repl ls

upload:
	mpremote connect $(DEVICE) fs cp $(SRC) :$(TARGET)
	
cp:
	mpremote connect $(DEVICE) fs cp $(SRC)

ls:
	mpremote connect $(DEVICE) fs ls

run:
	mpremote connect $(DEVICE) run $(SRC)

clean:
	mpremote connect $(DEVICE) fs rm $(TARGET)

reset:
	mpremote connect $(DEVICE) reset

repl:
	mpremote connect $(DEVICE) repl
