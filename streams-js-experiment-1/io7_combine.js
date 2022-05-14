
/*
  1. outchunk, piece (spike, discharge)
  2. buffer (integrator)
  3. inchunk (input)
*/
function gen(__stdin, muwMuch, consume) {
    const assert = cond => {if(!cond) {
        throw new Error('assertion failed');
    }}
    let buffstr = '';
    function push_as_much_as_you_can() {
      while(true) {
        const hm = muwMuch(buffstr);
        (hm!==null) && assert(hm <= buffstr.length && hm > 0);
        if (hm !== null) {
          const ej = buffstr.slice(0, hm);
          consume(ej);
          consumedLen = ej.length;
          buffstr = buffstr.slice(consumedLen);
        } else {
          break;
        }
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
      }
    }

    function attach_stream(_stdin) {
      _stdin.on('data', data => bring(data.toString()));
      _stdin.on('end',() => bring_end());
    }
    attach_stream(__stdin);
}
gen(process.stdin,
  function muwMuch(_buffstr) {
    if (_buffstr.length >= 20) {
      return 20;
    }
    return null;
  },
  function consume(outchunk, isLastPiece) {
  console.log(
    JSON.stringify(outchunk) + (isLastPiece?'🕯 ':'⏎ ')
   );
});
