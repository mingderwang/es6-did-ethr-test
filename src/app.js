import React, { useEffect } from 'react';

const test = () => {
  var s = 'aaa_aa_a';
  var r1 = /_a+/g;
  var r2 = /_a+/y;

  console.log(r1.exec(s));  // ["_aa"]
  console.log(r2.exec(s));  // null
}

export default () => {
  useEffect(() => {
    test();
  }, []);
  return (
    <div>
      1
    </div>
  );
}

// const str = `"foo" and "bar" and "baz"`;
// const matchs = str.matchAll(/"([^"]*)"/g);
// console.log([...matchs]);