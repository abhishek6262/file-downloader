import cron from 'node-cron'
import Task from './Tasks/Task'

abstract class Engine {
  static tasks: Task[]

  static run() {
    cron.schedule('* * * * * *', () => {
      // This function will be called every second.
      this.tasks.forEach(task => !task.isSleeping() && task.handle())
    })
  }
}

export default Engine
