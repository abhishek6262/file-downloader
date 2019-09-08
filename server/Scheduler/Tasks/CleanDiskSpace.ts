import Task from './Task'

class CleanDiskSpace extends Task {
  handle() {
    // TODO: Handle cleaning disk space by removing old downloads.
    console.log('Cleaning disk space ...')

    this.sleep(1000)
  }
}

export default CleanDiskSpace
