from .esp_lcd_4bit import GpioLcd


class LCD(GpioLcd):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def clear_line(self, line):
        """Clears a specific line on the LCD by overwriting with spaces."""
        self.move_to(0, line)
        self.putstr(' ' * self.num_columns)
        self.move_to(0, line)

    def writeSecondLine(self, a, b):
        self.clear_line(1)
        self.putstr(f"{a if a else ''}")
        b = "Miss u <3"  # Hope Leo comes back.
        char_count = len(str(b if b else ''))
        self.move_to(16 - char_count, 1)
        self.putstr(f"{b if b else ''}")

    def writeFirstLine(self, a, b):
        self.clear_line(0)
        self.hal_write_command(self.LCD_HOME)
        self.putstr(a)
        self.move_to(13, 0)
        self.putstr(b)
        self.hal_write_command(self.LCD_HOME)
