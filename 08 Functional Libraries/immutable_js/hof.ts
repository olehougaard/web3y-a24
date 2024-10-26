import { fromJS, Map, List, Seq, Range } from 'immutable'

const pets = [
    {type: 'dog', name:'Fido', age: 7}, 
    {type: 'cat', name: 'Hannibal', age: 2}, 
    {type: 'dog', name: 'Rover', age: 3},
    {type: 'dragon', name: 'Fluffykins', age: 673}]

let rover = Map(pets[2])
console.log(rover)
console.log(rover.toJS())
rover = rover.set('age', (rover.get('age') as number) + 1)
console.log(rover.toJS())

const list = List(pets)    

let agesOfPets = list.map(p => p.age)
console.log(agesOfPets.toJS())

console.log(list.filter(p => p.type === 'dragon').toJS())

let sumOfAgeOfDragons = list
  .filter(p => p.type === 'dragon')
  .map(p => p.age)
  .reduce((sum: number, a: number) => sum + a, 0)

console.log(sumOfAgeOfDragons)

const listOfMaps = fromJS(pets)
let agesOfPets2 = listOfMaps.map(p => p.get('age'))
console.log(agesOfPets2.toJS())

console.log(listOfMaps.filter(p => p['type'] === 'dragon').toJS())

sumOfAgeOfDragons = listOfMaps
  .filter(p => p.get('type') === 'dragon')
  .map(p => p.get('age') as number)
  .reduce((sum: number, a: number) => sum + a, 0)

console.log(sumOfAgeOfDragons)

let agesOfPets3 = (Seq(pets)).map(p => p.age)
console.log(agesOfPets3.toJS())

console.log((Seq(pets)).filter(p => p.type === 'dragon').toJS())

let sumOfAgeOfDragons3 = Seq(pets)
  .filter(p => p.type === 'dragon')
  .map(p => p.age)
  .reduce((sum, age) => sum + age, 0)

console.log(sumOfAgeOfDragons3)

function factorial(n: number): number {
  return Range(1, n + 1).reduce((a, b) => a * b, 1)
}

function isPrime(n: number): boolean {
  return Range(2, Infinity)
    .takeUntil(i => i * i > n)
    .find(i => n % i === 0) === undefined
}

const first100Primes = Range(2, Infinity)
  .filter(isPrime)
  .take(100)
  .toJS()

console.log(first100Primes)
