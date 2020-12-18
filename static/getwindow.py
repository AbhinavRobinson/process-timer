from typing import Optional
from ctypes import wintypes, windll, create_unicode_buffer

def getForegroundWindowTitle():
    hWnd = windll.user32.GetForegroundWindow()
    length = windll.user32.GetWindowTextLengthW(hWnd)
    buf = create_unicode_buffer(length + 1)
    windll.user32.GetWindowTextW(hWnd, buf, length + 1)
    
    if buf.value:
        return buf.value
    else:
        return None

from time import sleep

while(True):
    print(getForegroundWindowTitle())
    sleep(1)