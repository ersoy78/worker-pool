const fetch = require('node-fetch')
const WorkerPool = require('./lib/WorkerPool')
// const workList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const workList = [1, 2, 3]

const worker = (task) => {
  return new Promise(async (resolve, reject) => {
    try {
      let fetchResult = await fetch(`https://jsonplaceholder.typicode.com/todos/${task}`)
      if (fetchResult.ok) {
        let pageContents = await fetchResult.text()
        resolve(pageContents)
      } else {
        reject(fetchResult.statusText)
      }
    } catch (err) {
      console.log('err')
      reject(err)
    }
  })
}

const main = async () => {
  const workerPool = new WorkerPool(1, worker, workList)
  workerPool.on('ok', r => {
    console.log(r)
  })
  workerPool.on('fail', r => {
    console.log(r)
  })
  let results = await workerPool.start()
  console.log(results)
}

main()
