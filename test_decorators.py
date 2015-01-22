COMMAND_LINE_OPTIONS={}

class InvalidCommandLine(Exception):
    pass

def decor2(g):
    print ">   d2: decorator 2 called on %s"%(g,)
    return g


def command_line_option(*args,**kwargs):
   print ">   d1: decorator 1 called on ?"
   print ">   d1: args= %s"%(repr(args),)
   print ">   d1: args= %s"%(repr(kwargs),)
   def dec(f):
      print ">>  d1.dec> inner decorator is called on f=%s"%(repr(f),)
      print ">>  d1.dec> f.__name__ = %s"%(repr(f.__name__),)
      f.__name__
      COMMAND_LINE_OPTIONS[f.__name__]=f
      f.args=args
      f.kwargs=kwargs
      return f
   return dec


@command_line_option() #the decorator is actually returned by this
def start(child_target_uid,pipeio_with_scheduler,worker_id=-1):
    print "start is called"
    pass

@decor2
def stop(child_target_uid,pipeio_with_scheduler,worker_id=-1):
    print "start is called"
    pass
