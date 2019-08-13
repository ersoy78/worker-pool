const fetch = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      resolve()
    }, 1000)
  })
}
const WorkerPool = require('./lib/WorkerPool')
// const workList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const workList = [0, 1, 2, 3, 5, 6, 7, 8, 9]

const worker = async (task) => {
  try {
    await fetch(`https://jsonplaceholder.typicode.com/todos/${task}`)
    return `${task} done`
  } catch (err) {
    console.log('err')
    throw err
  }
}

const main = async () => {
  const workerPool = new WorkerPool(1, worker, Array.from(workList))
  let i = 10
  const addWork = setInterval(() => {
    console.log(workerPool.isWorking())
    if (workerPool.isWorking()) {
      workerPool.push(i)
      console.log(`Added more work ${i}`)
      i++
    }
  }, 1000)
  setTimeout(() => {
    clearInterval(addWork)
    console.log(`Stop adding Work`)
  }, 60000)
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
