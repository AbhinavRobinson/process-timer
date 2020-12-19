from ctypes import wintypes, windll, create_unicode_buffer, byref
import psutil

import json


def getForegroundWindowTitle():
    hWnd = windll.user32.GetForegroundWindow()
    length = windll.user32.GetWindowTextLengthW(hWnd)
    buf = create_unicode_buffer(length + 1)
    windll.user32.GetWindowTextW(hWnd, buf, length + 1)
    pid = wintypes.DWORD()

    windll.user32.GetWindowThreadProcessId(hWnd, byref(pid))
    # print(pid)
    if buf.value:
        return buf.value, pid
    else:
        return None


# while(True):
title, pid = getForegroundWindowTitle()
print(json.dumps({'title': title, 'app': psutil.Process(
    pid.value).name(), 'pid': pid.value}))
