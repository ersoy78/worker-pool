const fetch = require('node-fetch')
const WorkerPool = require('./lib/WorkerPool')
const workList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]

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
