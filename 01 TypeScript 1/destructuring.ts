// Destructuring
const numbers2 = [1, 2, 3]
const [a, b, c] = numbers1 // a === 1, b === 2, c === 3

const [x1, y1] = numbers2 // x === 1, y === 2

const [i, j, k, l] = numbers2 // l === undefined

const [first, ...rest] = numbers2
// first === 1, rest is [2, 3]

const point3D = {x: 75, y: 120, z: 80}

const {x, y} = point3D // x === 75, y === 120
const {z, ...point2D_2} = point3D 
// z === 80, point2D is {x: 75, y: 120}

const point2D_3 = {x, y}
