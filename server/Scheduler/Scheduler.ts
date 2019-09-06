import Engine from './Engine'
import Task from './Tasks/Task'
import ProcessFiles from './Tasks/ProcessFiles'

class Scheduler extends Engine {
  static tasks: Task[] = [
    new ProcessFiles,
  ]
}

export default Scheduler
