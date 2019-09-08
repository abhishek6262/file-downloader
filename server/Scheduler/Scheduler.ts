import Engine from './Engine'
import Task from './Tasks/Task'
import CleanDiskSpace from './Tasks/CleanDiskSpace'
import ProcessFiles from './Tasks/ProcessFiles'

class Scheduler extends Engine {
  static tasks: Task[] = [
    new CleanDiskSpace,
    new ProcessFiles,
  ]
}

export default Scheduler
