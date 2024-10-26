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

let agesOfPets = R.map(p => p.age, pets)
console.log(agesOfPets)

console.log(R.filter(p => p.type === 'dragon', pets))

let sumOfAgeOfDragons = R.reduce((sum: number, a: number) => sum + a, 0, R.map((p: Pet) => p.age, R.filter(p => p.type === 'dragon', pets)))
console.log(sumOfAgeOfDragons)
