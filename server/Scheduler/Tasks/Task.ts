abstract class Task {
  private sleepDuration: number = 0 // milliseconds

  abstract handle(): void

  isSleeping(): boolean {
    return this.sleepDuration !== 0
  }

  sleep(seconds: number) {
    this.sleepDuration = seconds * 1000

    setTimeout(() => this.sleepDuration = 0, this.sleepDuration)
  }
}

export default Task
