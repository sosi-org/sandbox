
/*
  1. outchunk, piece (spike, discharge)
  2. buffer (integrator)
  3. inchunk (input)
*/
function consumeStream(__stdin, muwMuch, consumer) {
    const assert = cond => {if(!cond) {
        throw new Error('assertion failed');
    }}
    let buffstr = '';
    function push_as_much_as_you_can() {
      while(true) {
        const hm = muwMuch(buffstr);
        if (hm === null) break;
        assert(hm <= buffstr.length && hm > 0);
        const outchunk = buffstr.slice(0, hm);
        consumer(outchunk, false);
        buffstr = buffstr.slice(/*consumedLen*/ outchunk.length);
      }
    }
    function bring(inchunk) {
      buffstr = buffstr + inchunk;
      push_as_much_as_you_can();
    }
    function bring_end() {
      push_as_much_as_you_can();
      if(buffstr.length > 0) {
        consumer(buffstr, true);
      }
    }

    function attach_stream(_stdin) {
      _stdin.on('data', inchunk => bring(inchunk.toString()));
      _stdin.on('end',() => bring_end());
    }
    attach_stream(__stdin);
}

consumeStream(process.stdin,
  function muwMuch(_buffstr) {
    if (_buffstr.length < 20 /* threshold */) return null;
    return 20; // discharge size
  },
  function consumer(outchunk, isLastPiece) {
  console.log(
    JSON.stringify(outchunk) + (isLastPiece?'🕯 ':'⏎ ')
   );
});
/*
consumeStream(process.stdin,
  //acceptor
  (_buffstr) => {
    if (_buffstr.length < 20 ) return null;  // threshold
    return 20; // discharge size
  },
  //consumer
  (outchunk, isLastPiece) => {
  console.log(
    JSON.stringify(outchunk) + (isLastPiece?'🕯 ':'⏎ ')
   );
});
*/