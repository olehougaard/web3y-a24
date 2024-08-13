// Provider
type Counter = () => number

function counter(start: number = 0, step: number = 1): Counter {
  let counter = start
  return () => counter++
}

const cnt = counter(1)

// Callback
function forEach<T>(ts: T[], cb: (t: T) => void) {
  for(let t of ts) {
    cb(t)
  }
}

let ns = [1, 2, 3]
forEach(ns, console.log)

// Function
function map<T, U>(ts: T[], f: (t: T) => U) {
  const result: U[] = []
  for(let t of ts) {
    result.push(f(t))
  }
}

let doubles = map(ns, x => 2 * x)
console.log(doubles) // [2, 4, 6]
