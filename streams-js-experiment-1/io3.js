/*function sleep_msec(msec) {
  // Thanks to 8ctopus: https://stackoverflow.com/a/70765396/4374258
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, msec);
}*/

function consume(chunk2, defo_it_was_the_last_piece) {
  // optionala flag: it was the last bit
  console.log(JSON.stringify(chunk2) /*+'...'*/ + (defo_it_was_the_last_piece?'.':'<'));
}

function assert(cond) {
  if (!cond) {
    throw new Error('assertion failed')
  }
}
// buffer is small, it is not consumable. "wait":
const NOTHING_ENOUGH_TO_CONSUME_PROVIDE_ME_MORE = 0;
// consume the part you want, but only if reached the "spike".
function changed(buffstr, nothing_more_after_this) {
   // decides how much it wants to consume (but only if !nothing_more_after_this)
  // console.log(buffstr.slice(0,20)+'...')
  // return buffstr.length;

  // nothing_more_after_this => last call, I returned 0
  if (buffstr.length >= 20) {
    assert(!nothing_more_after_this);
    const ej = buffstr.slice(0,20);
    consume(ej);
    return ej.length;
  } else {
    /*
    if (nothing_more_after_this) {
      // can we guaraantee length <0 ?!
      consume(ej)
      return buffstr.length;
    }
    */
    // wait
    return NOTHING_ENOUGH_TO_CONSUME_PROVIDE_ME_MORE;
  }
}
function push_as_much_as_you_can() {
  while(true) {
    const consumedLen = changed(buffstr);
    if (consumedLen === 0) {
      break;
    }
    //yield buffstr;
    buffstr = buffstr.slice(consumedLen); // why
  }
}
//process_chaan()
  let buffstr = '';
  let fin=false;

  _stdin = process.stdin;
  _stdin.on('data', data=>{
    //console.log('data>' + data.toString());
    //yield data.toString();
    buffstr = buffstr + data.toString();
    push_as_much_as_you_can();

  });
  _stdin.on('end',()=>{
    //yield 'end'+ x.toString();
    //console.log('end' + ':::');
    push_as_much_as_you_can();
    //last residue
    if(buffstr.length > 0) {
      consume(buffstr, true);
      buffstr = '';
    }
    assert(buffstr.length === 0);
  });
  /*
  //wait!
  while(true) {
    sleep_msec(150);
    //yield JSON.stringify(buffstr);
    yield Promise.resolve( JSON.stringify(buffstr) );
    buffstr='';
    if (fin) {
      return;
    }
  }
  */
 /*
async function* inpgenrate() {
}
*/
/*
(async () => {
  for await(const chunk of inpgenrate(process.stdin)) {
    console.log(await chunk);
  }
})();
*/
/*
(async () => {
  for (const chunk of inpgenrate(process.stdin)) {
    console.log(await chunk);
  }
})();
*/
