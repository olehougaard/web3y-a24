import * as R from 'ramda'

type Pet = {
  type: string,
  name: string,
  age: number
}

const pets: Pet[] = [
    {type: 'dog', name:'Fido', age: 7}, 
    {type: 'cat', name: 'Hannibal', age: 2}, 
    {type: 'dog', name: 'Rover', age: 3},
    {type: 'dragon', name: 'Fluffykins', age: 673}]

const agesOfPets = R.map(p => p.age, pets)
console.log(agesOfPets)

console.log(R.filter(p => p.type === 'dragon', pets))

const dragons = R.filter(p => p.type === 'dragon', pets)
const AgesOfDragons = R.map((p: Pet) => p.age, dragons)
const sumOfAgeOfDragons = R.reduce((sum: number, a: number) => sum + a, 0, AgesOfDragons) // Or: R.sum(agesOfDragons)
console.log(sumOfAgeOfDragons)
