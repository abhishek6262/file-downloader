import cron from 'node-cron'
import Task from './Tasks/Task'

abstract class Engine {
  static tasks: Task[]

  static run() {
    cron.schedule('*/30 * * * * *', () => {
      // This function will be called every second.
      this.tasks.forEach(async (task) => !task.isSleeping() && await task.handle())
    })
  }
}

export default Engine
