console.log('첫번째로 실행됩니다.');
(() => {console.log('두번째로 실행됩니다.');})();
setTimeout(() => console.log('최소 1초 후에 실행됩니다.'), 0);
console.log('언제 실행될까요?');