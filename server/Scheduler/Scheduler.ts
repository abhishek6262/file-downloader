import Engine from './Engine'
import Task from './Tasks/Task'
import CleanDiskSpace from './Tasks/CleanDiskSpace'
import ProcessPendingFiles from './Tasks/ProcessPendingFiles'
import RequeueFailedFiles from "./Tasks/RequeueFailedFiles"

class Scheduler extends Engine {
  static tasks: Task[] = [
    new CleanDiskSpace,
    new ProcessPendingFiles,
    new RequeueFailedFiles,
  ]
}

export default Scheduler
