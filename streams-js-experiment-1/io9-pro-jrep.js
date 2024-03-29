
/*
const transffile = inpstr => inpstr.split('\n').map(transfline).filter(x=>x!==null).join('\n');
const read_from_stdin = () => fs.readFileSync(0).toString();
console.log(transffile(read_from_stdin()));
*/
// const transmid = map(transfline).filter(x=>x!==null)


const assert = cond => {if(!cond) {
  throw new Error('assertion failed');
}}
const _lastNum = arr => Number(arr.slice(-1));
const _lastNum0 = arr => (arr.length===0) ? 0 : _lastNum(arr);
const _cumsum = arr => arr.reduce((acc,e)=>[...acc, _lastNum0(acc)+e],[]);
const _sum = arr => arr.reduce((s,x)=>s+x,0);
// const _mutislice = (str, arr) => _cumsum(arr).reduce((acc,x)=>[...acc, str.substring(_lastNum0[acc],x)], []);
const _mutislice0 = (str, arr) => _cumsum(arr).map((si,i,cums)=>str.substring(i===0?0:cums[i-1], cums[i]));

function tests() {
  console.log(_lastNum([8,9])===9);
  console.log(_lastNum0([])===0);
  console.log(_lastNum([-2])===-2);
  console.log(_lastNum0([-2])===-2);
  console.log(_cumsum([]),[]);
  console.log(_cumsum([100,2]),[100,102]);
  console.log(_cumsum([100]),[100]);
  console.log(_cumsum([100,-2]),[100,98]);
  console.log(_cumsum([10,2,4,5]),[10,12,16,21]);
  console.log(_cumsum([1,3,1,2]), [1,4,5,7]);
  console.log(_mutislice0('a2345678',[1,3,1,2]), ['a','234','5','67']);
}
//tests();

let countr = 0;
function consumeStream(__stdin, muwMuch, consumer) {
  let buffstr = '';
  function push_as_much_as_you_can() {
    while(true) {
      const hm = muwMuch(buffstr);
      if (hm === null) break;
      const hmsum = _sum(hm);
      assert(hmsum <= buffstr.length && hmsum > 0);
      //const outchunk = buffstr.slice(0, hmsum);
      const o_cumsum = _cumsum(hm);
      //const outchunks = buffstr.reduce(0, hmsum);
      const outchunks = _mutislice0(buffstr, hm);
      //consumer(outchunk, false);
      consumer(outchunks, false);
      //buffstr = buffstr.slice(/*consumedLen*/ outchunk.length);
      //console.log(buffstr);
      console.log('hm', hm);
      console.log('outchunks', outchunks);
      buffstr = buffstr.slice(/*consumedLen*/ hmsum);
      //const mutislice = _mutislice0(buffstr, hm);
      //buffstr = buffstr.slice
      //console.log(buffstr);
      countr = countr + 1;
      if (countr > 4) {
        //process.exit(1);
      }

    }
  }
  function bring(inchunk) {
    console.log('inchunk: '+inchunk);
    console.log('inchunk.len: '+inchunk.length);
    buffstr = buffstr + inchunk;
    push_as_much_as_you_can();
  }
  function bring_end() {
    console.log('endchunk:'+buffstr.length)
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
// todo: chain output (already 3 stages)
function processio(inpipe, re, transfline, outpipe) {
consumeStream(inpipe,
  /*acceptor*/ (_buffstr) => {
    //console.log(JSON.stringify(_buffstr))
    const m = new RegExp(re).exec(_buffstr);
    //console.log(m)
    if (!m) return null;
    // m[1] is trivially === '\n'
    //console.log('m.index', m.index)
    const l=[m.index, m[1].length];
    assert(l[0] + l[1] > 0); //assert(m.index > 0);
    //assert(hm <= buffstr.length && hm > 0);
    return l; // discharge size
  },
  /*consumer*/(outchunks, isLastPiece) => {
    outpipe.write(transfline(outchunks[0]) + (isLastPiece?'🕯 ':'⏎ ') );
    const transfline2 = x=>x; // preserve the newline
    outpipe.write(transfline2(outchunks[1]) )
    assert(outchunks.length === 2);
  });
}
processio(process.stdin, /(\n)/, transfline, process.stdout);

/*
forked from https://github.com/sohale/jrep/blob/main/src/jrep.js
*/
