import cron from 'node-cron'
import Task from './Tasks/Task'

abstract class Engine {
  static tasks: Task[]

  static run() {
    cron.schedule('* * * * * *', () => {
      // This function will be called every second.
      this.tasks.forEach(task => {
        if (task.isSleeping()) {
          return
        }

        task.handle()
      })
    })
  }
}

export default Engine
