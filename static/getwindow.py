from ctypes import wintypes, windll, create_unicode_buffer,byref
import psutil

def getForegroundWindowTitle():
    hWnd = windll.user32.GetForegroundWindow()
    length = windll.user32.GetWindowTextLengthW(hWnd)
    buf = create_unicode_buffer(length + 1)
    windll.user32.GetWindowTextW(hWnd, buf, length + 1)
    pid = wintypes.DWORD()
    
    active_window = windll.user32.GetWindowThreadProcessId(hWnd,byref(pid)) 
    # print(pid)
    if buf.value:
        return buf.value,pid
    else:
        return None

# while(True):
title,pid=getForegroundWindowTitle()
print({'title':title,'app':pid.value,'pid':pid.value})
