import inspect
FNC_LIST={}

class InvalidCommandLine(Exception):
    pass

def decor2(g):
    print ">   d2: decorator 2 called on %s"%(g,)
    return g


def deco1(*args,**kwargs):
   print ">   d1: decorator 1 called on:"
   print ">   d1:     args= %s"%(repr(args),)
   print ">   d1:     kwargs= %s"%(repr(kwargs),)
   def dec2_inner(f):
      print "> >  d1.dec> inner decorator is called on f=%s"%(repr(f),)
      print type(f)
      if type(f) is inspect.types.FunctionType:
          print "> >  d1.dec> f.__name__ = %s"%(repr(f.__name__),)
          print "**********************"
          f.__name__
          FNC_LIST[f.__name__]=f
          f.args=args
          f.kwargs=kwargs
      else:
          print "> >  d1.dec>   on (%s)"%(repr(f),)
      #return f
      def dec3_innermost(x):
         	print "> > >   dec3_innermost: %s"%(repr(x),)
         	pass
      return dec3_innermost
   return dec2_inner


#if @deco1 ---> dec is not called
#if @deco1() ---> dec Is called


#USING () :
# @deco1()
#the decorator is actually returned by this


#NOT USING ()
# calls def on the function's parameters. Calls dec each time the function is called. The main ddddddddd is called once, with args (f)
#

@deco1()
def start(p1,p2=-1):
    print "**** start() is called"
    pass

print " -- "
@deco1
def begin(p1,p2=-1):
    print "***** begin() is called"
    pass

#@decor2
#def stop(child_target_uid,worker_id=-1):
#    print "stop is called"
#    pass

print "1111111"
start("p1") #acually innermost (dec3_innermost) is called
print "2222222"
begin("a1") #acually innermost () is called
print "3333333"
#stop("p1")


""" Output:

>   d1: decorator 1 called on:
>   d1:     args= ()
>   d1:     kwargs= {}
> >  d1.dec> inner decorator is called on f=<function start at 0x7f91b5a02de8>
<type 'function'>
> >  d1.dec> f.__name__ = 'start'
**********************
 -- 
>   d1: decorator 1 called on:
>   d1:     args= (<function begin at 0x7f91b5a02d70>,)
>   d1:     kwargs= {}
1111111
> > >   dec3_innermost: 'p1'
2222222
> >  d1.dec> inner decorator is called on f='a1'
<type 'str'>
> >  d1.dec>   on ('a1')
3333333
"""
