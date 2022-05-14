
/*
  1. outchunk, piece (spike, discharge)
  2. buffer (integrator)
  3. inchunk (input)
*/

function consume(outchunk, defo_it_was_the_last_outchunk) {
  // it was the last bit
  console.log(
    JSON.stringify(outchunk) + (defo_it_was_the_last_outchunk?'.':'<')
   );
}

function assert(cond) {
  if (!cond) {
    throw new Error('assertion failed')
  }
}

/*
   Have shared access: push_as_much_as_you_can(), bring(), bring_end().
   Exclusive access to consume()
   No access to (global) `buffstr`
*/
function changed(_buffstr, nothing_more_after_this) {
  // consume the part you want, but only if reached the "spike".
  // decides how much it wants to consume (but only if !nothing_more_after_this)
  // no access to global buffstr

  // nothing_more_after_this => last call, I returned 0
  if (_buffstr.length >= 20) {
    assert(!nothing_more_after_this);
    const ej = _buffstr.slice(0,20);
    consume(ej);
    return ej.length;
  } else {
    /*
    if (nothing_more_after_this) {
      // can we guaraantee length <0 ?!
      consume(ej)
      return _buffstr.length;
    }
    */
    // buffer is small, it is not consumable. "wait":
    // NOTHING_ENOUGH_TO_CONSUME_PROVIDE_ME_MORE
    // wait
    return WAS_NOT_ENOUGH = 0;
  }
}

/*
   Have shared access: push_as_much_as_you_can(), bring(), bring_end().
   Exclusive access to buffstr
   No access/call to consume()
*/
let buffstr = '';
function push_as_much_as_you_can() {
  while(true) {
    const consumedLen = changed(buffstr);
    if (consumedLen === 0) {
      break;
    }
    buffstr = buffstr.slice(consumedLen); // why
  }
  // invariant: last attempt to `changed()` returned 0
}
function bring(dataStr) {
  buffstr = buffstr + dataStr;
  push_as_much_as_you_can();
}
function bring_end() {
  push_as_much_as_you_can();
  //last residue
  if(buffstr.length > 0) {
    consume(buffstr, true);
    buffstr = '';
  }
  assert(buffstr.length === 0);
}

/*
   Exclusive access to _stdin
   No access to buffstr
*/
function attach_stream(_stdin) {
  _stdin.on('data', data=>{
    bring(data.toString());
  });
  _stdin.on('end',()=>{
    bring_end();
  });
}

attach_stream(process.stdin);
