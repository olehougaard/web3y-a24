interface Counter {
  next(): number
}

function counter(start: number = 0, step: number = 1): Counter {
  let counter = start
  const next = () => counter++
  return { next }
}

const cnt = counter(1)

class MyCounter implements Counter {
  private counter: number
  private step: number

  constructor(start: number = 0, step: number = 1) {
    this.counter = start
    this.step = step
  }

  next(): number {
    const current = this.counter
    this.counter += this.step
    return current
  }
}

const myCounter = new MyCounter(1)

console.log(myCounter.next()) // 1
console.log(myCounter.next()) // 2

let nextFunc = myCounter.next

nextFunc()  // Cannot read properties of undefined
