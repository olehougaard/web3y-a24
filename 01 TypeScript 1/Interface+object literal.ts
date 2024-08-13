interface Counter {
  next(): number
}

function counter(start: number = 0, step: number = 1): Counter {
  let counter = start
  const next = () => counter++
  return { next }
}

const cnt = counter(1)
