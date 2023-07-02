function delayedResultPromise(n1, n2, delayTime) {
    return new Promise((res, rej) => {
        setTimeout(() => {
          const sum = n1 + n2;
          res(sum);
        }, delayTime);
      });
    }

//delayedResultPromise(4, 5, 3000).then(console.log);
    // 9 (4+5) will be shown in the console after 3 seconds


async function main() {
    const result = await delayedResultPromise(4, 5, 3000);
    console.log(result);
    }
    
main(); // result will be shown in the console after 3 seconds