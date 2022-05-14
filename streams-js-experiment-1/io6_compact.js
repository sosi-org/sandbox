
/*
  1. outchunk, piece (spike, discharge)
  2. buffer (integrator)
  3. inchunk (input)
*/
function gen(__stdin, consume) {
    const assert = cond => {if(!cond) {
        throw new Error('assertion failed');
    }}

    function muwMuch(_buffstr) {
      // assert return > 0 if not null
      if (_buffstr.length >= 20) {
        return 20;
      }
      return null;
    }
    function changed(_buffstr, nothing_more_after_this) {
      const hm = muwMuch(_buffstr);
      if (hm !== null) {
        assert(!nothing_more_after_this);
        const ej = _buffstr.slice(0, hm);
        consume(ej);
        // assert ej.length > 0
        return ej.length;
      } else {
        return null;
      }
    }

    let buffstr = '';
    function push_as_much_as_you_can() {
      while(true) {
        const consumedLen = changed(buffstr);
        if (consumedLen === null) {
          break;
        }
        buffstr = buffstr.slice(consumedLen);
      }
    }
    function bring(dataStr) {
      buffstr = buffstr + dataStr;
      push_as_much_as_you_can();
    }
    function bring_end() {
      push_as_much_as_you_can();
      if(buffstr.length > 0) {
        consume(buffstr, true);
        buffstr = '';
      }
      assert(buffstr.length === 0);
    }

    function attach_stream(_stdin) {
      _stdin.on('data', data => bring(data.toString()));
      _stdin.on('end',() => bring_end());
    }
    attach_stream(__stdin);
}
gen(process.stdin,
  function consume(outchunk, isLastPiece) {
  console.log(
    JSON.stringify(outchunk) + (isLastPiece?'🕯 ':'⏎ ')
   );
});
