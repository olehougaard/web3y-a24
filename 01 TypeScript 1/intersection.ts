type Point = {x: number, y: number}

type Measurable = {unit: 'px' | 'pt' | 'cm' | 'in'}

const p: Point = {x: 100, y: 200}

const m: Measurable = {unit: 'px'}

const screenPoint: Point & Measurable = {...p, ...m}
