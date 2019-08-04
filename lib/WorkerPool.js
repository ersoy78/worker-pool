const EventEmitter = require('events').EventEmitter

class WorkerPool extends EventEmitter {
  constructor (poolSize, workerFunction, taskList, retry = false) {
    super()
    this.workers = []
    this.poolSize = poolSize
    this.worker = workerFunction
    this.taskList = taskList
    this.retry = retry
  }
  info () {
    console.log(this.workers, this.poolSize, this.worker, this.taskList)
  }
  add (worker) {
    this.workers.push(worker)
  }
  check (worker) {
    return this.workers.indexOf(worker) > -1
  }
  list () {
    return this.workers
  }
  remove (worker) {
    this.workers.splice(this.workers.indexOf(worker), 1)
  }
  start () {
    return new Promise((resolve, reject) => {
      let tasksDone = false
      let results = {
        ok: [],
        fail: []
      }
      const timer = setInterval(async () => {
        if (this.taskList.length > 0) {
          let currentItem = this.taskList.shift()
          if (this.workers.length < this.poolSize && !this.check(currentItem)) {
            try {
              this.add(currentItem)
              let r = await this.worker(currentItem)
              this.emit('ok', r)
              results.ok.push(r)
              this.remove(currentItem)
            } catch (e) {
              this.remove(currentItem)
              this.emit('fail', { item: currentItem, error: e })
              results.fail.push({ item: currentItem, error: e })
              if (this.retry) {
                this.taskList.push(currentItem)
              }
            } finally {
              if (this.taskList.length === 0 && this.workers.length === 0) {
                tasksDone = true
              }
            }
          } else {
            this.taskList.push(currentItem)
          }
        } else {
          if (tasksDone) {
            clearInterval(timer)
            resolve(results)
          }
        }
      }, 10)
    })
  }
}

module.exports = WorkerPool
