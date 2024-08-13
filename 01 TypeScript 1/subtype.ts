type Point = {x: number, y: number}

const distanceFromOrigin = (p: Point) => Math.sqrt(p.x * p.x + p.y * p.y)

const p = {
  x: 20,
  y: 35,
  unit: 'px'
}

const dist = distanceFromOrigin(p)
