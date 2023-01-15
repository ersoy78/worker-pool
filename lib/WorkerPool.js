const EventEmitter = require('events').EventEmitter

class WorkerPool extends EventEmitter {
  constructor(poolSize, workerFunction, taskList, retry = false, delay = 10) {
    super()
    this.workers = []
    this.poolSize = poolSize
    this.worker = workerFunction
    this.taskList = Array.from(taskList)
    this.retry = retry
    this.delay = delay
    this.working = false
    this.idleTimer = null
  }
  info() {
    console.log(this.workers, this.poolSize, this.worker, this.taskList)
  }
  add(worker) {
    this.workers.push(worker)
  }
  push(task, unique = true) {
    if (unique) {
      if (this.taskList.indexOf(task) === -1 && this.workers.indexOf(task) === -1) {
        this.taskList.push(task)
      }
    } else {
      this.taskList.push(task)
    }
  }
  isQueued(worker) {
    return this.workers.indexOf(worker) > -1
  }
  list() {
    return this.taskList.concat(this.workers)
  }
  isWorking() {
    return this.working
  }
  remove(worker) {
    this.workers.splice(this.workers.indexOf(worker), 1)
  }
  idle() {
    this.idleTimer = setInterval(() => {
      if (!this.working && this.taskList.length > 0) {
        this.start()
      }
    }, 10)
  }
  off() {
    clearInterval(this.idleTimer)
  }
  start() {
    return new Promise((resolve, reject) => {
      this.working = true
      let results = {
        ok: [],
        fail: []
      }
      const timer = setInterval(async () => {
        if (this.taskList.length > 0) {
          let currentItem = this.taskList.shift()
          if (this.workers.length < this.poolSize && !this.isQueued(currentItem)) {
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
                this.working = false
              }
            }
          } else {
            this.taskList.push(currentItem)
          }
        } else {
          if (!this.working) {
            clearInterval(timer)
            resolve(results)
          }
        }
      }, this.delay)
    })
  }
}

module.exports = WorkerPool
