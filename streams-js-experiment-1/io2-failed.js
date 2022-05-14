function sleep_msec(msec) {
  // Thanks to 8ctopus: https://stackoverflow.com/a/70765396/4374258
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, msec);
}
  let buffstr = '';
  let fin=false;
async function* inpgenrate(_stdin) {
  _stdin.on('data', data=>{
    //console.log('data>' + data.toString());
    //yield data.toString();
    buffstr = buffstr + data.toString();
    console.log(buffer.slice(0,100))
    //yield buffstr;
    //buffstr='';
  });
  _stdin.on('end', x=>{
    //yield 'end'+ x.toString();
  });
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
}

(async () => {
  for await(const chunk of inpgenrate(process.stdin)) {
    console.log(await chunk);
  }
})();

