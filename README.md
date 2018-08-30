# worker-pool

```javascript
const worker = (task) => {
  return new Promise(async (resolve, reject) => {
    try {
      let fetchResult = await fetch(`https://jsonplaceholder.typicode.com/todos/${task}`)
      if (fetchResult.ok) {
        let pageContents = await fetchResult.text()
        resolve(pageContents)
      }
    } catch (err) {
      reject(err)
    }
  })
}

const main = async () => {
  const workerPool = new WorkerPool(20, worker, workList)
  workerPool.on('ok', r => {
    console.log(r)
  })
  workerPool.on('fail', r => {
    console.log(r)
  })
  let results = await workerPool.start()
  console.log(results)
}
```