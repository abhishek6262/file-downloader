import cron from 'node-cron'
import ITask from './Tasks/ITask'

abstract class Engine {
  static tasks: ITask[]

  static run() {
    cron.schedule('* * * * * *', () => {
      // This function will be called every second.
      this.tasks.forEach(task => task.handle())
    })
  }
}

export default Engine
