#!/usr/bin/env python
#synchronizing using signals
#from https://docs.python.org/2/library/signal.html

import signal, os
import sys


def log_debug1(msg):
    #no newline version
    sys.stdout.write(msg)
    sys.stdout.flush()

def delay2(num=1000):
    for i in range(num):
        for j in range(1000):
            sys.stdout.write("")
            sys.stdout.flush()  # even slower

#if the parent is dead, this will be detached.
def handler(signum, frame):
    print 'Signal handler called with signal', signum
    print 'frame=%s'%(repr(frame),)
    print 'frame dir =%s'%(dir(frame),)
    print 'type frame =%s'%(type(frame),)

    print 'frame.f_code =%s'%(repr(frame.f_code ),)
    #frame.f_code =<code object delay2 at 0x7f63dfb03530, file "signal_sync.py", line 14>

    #raise IOError("Couldn't open device!")


is_child=None
try:
    pid = os.fork()
    if pid==0:
        is_child=True
        delay2(2000)
        log_debug1( "delayed")
        os._exit(0)
    else:
        is_child=False
        child_pid=pid

except Exception,e:
    print "Error happened "
    print e


# Set the signal handler and a 5-second alarm
if not is_child:
    signal.signal(signal.SIGCHLD, handler)
    delay2(5000)

#kills the handler if on the parent side
exit(0)

#######################

signal.alarm(5)

print "Wait 5 sec"
# This open() may hang indefinitely
#fd = os.open('/dev/tty', os.O_RDWR)
fd = os.open('/dev/tty', os.O_RDWR)
print fd
buff=os.read(fd,1000)
print buff

signal.alarm(0)          # Disable the alarm


#why wait?
