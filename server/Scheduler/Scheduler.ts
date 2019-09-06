import Engine from './Engine'
import ITask from './Tasks/ITask'
import ProcessFiles from './Tasks/ProcessFiles'

class Scheduler extends Engine {
  static tasks: ITask[] = [
    new ProcessFiles,
  ]
}

export default Scheduler
