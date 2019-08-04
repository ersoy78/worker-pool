const fetch = async () => {
  return setTimeout(async () => {
    return 1
  }, 10000)
}
const WorkerPool = require('./lib/WorkerPool')
// const workList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const workList = [1, 2, 3]

const worker = async (task) => {
  try {
    await fetch(`https://jsonplaceholder.typicode.com/todos/${task}`)

    return 0
  } catch (err) {
    console.log('err')
    throw new Error(`Error: ${err.message}`)
  }
}

const main = async () => {
  const workerPool = new WorkerPool(1, worker, Array.from(workList))
  workerPool.on('ok', r => {
    console.log(r)
  })
  workerPool.on('fail', r => {
    console.log(r)
  })
  let results = await workerPool.start()
  console.log(results)
  console.log(workList)
}

main()
