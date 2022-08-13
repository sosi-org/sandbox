import inspect

# Experimenting with decorators inspired by FastAPI
# decorators + function signature (arguments-spec) + typing = magic

def decor1(f):
   print('decor:', f)
   print(dir(f))
   print()
   print(inspect.getfullargspec(f))
   # FullArgSpec(args=['a', 'b'], varargs=None, varkw=None, defaults=(5,), kwonlyargs=[], kwonlydefaults=None, annotations={'a': <class 'int'>, 'b': <class 'str'>})

def myfunc1(*largs, **kwargs):
    print(largs, kwargs)

myfunc1(3, 'hi', g='ok')


# args_spec1 = [, {}]

def check_args_spec(args_spec):
    assert len(args_spec) >= 1
    assert type(args_spec[-1]) == dict, type(args_spec[-1])
    largs = args_spec[:-1]
    kwargs = args_spec[-1]
    return largs, kwargs


args_spec1 = [{}]

check_args_spec(args_spec1)

# @decor1
def myfunc2(a: int, b:str = 5):
    print('trivial')

print(inspect.getfullargspec(myfunc2))
#   # FullArgSpec(args=['a', 'b'], varargs=None, varkw=None, defaults=(5,), kwonlyargs=[], kwonlydefaults=None, annotations={'a': <class 'int'>, 'b': <class 'str'>})
annots_dict = inspect.getfullargspec(myfunc2).annotations
print(annots_dict)
# {'a': <class 'int'>, 'b': <class 'str'>}
print(annots_dict['a'])
print(annots_dict['b'])
# print(type(2))
# print(int)

print('inspect.signature(myfunc2):')
print(inspect.signature(myfunc2))
# (a: int, b: str = 5)

# see `decohints``
# https://stackoverflow.com/questions/47060133/python-3-type-hinting-for-decorator
# pip install decohints


# plan:
"""
@decorator([int, str])  # specify the "args struct"
lambda (largs,kwargs):
    ...
"""

#a = lambda (*largs, **kwargs):
a = lambda largs, kwargs: \
    print(largs) + \
    print(kwargs)

# plan failed miserably

