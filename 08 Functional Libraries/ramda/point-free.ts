import * as R from 'ramda'

type Pet = Readonly<{
  type: string,
  name: string,
  age: number
}>

const pets: Pet[] = [
    {type: 'dog', name:'Fido', age: 7}, 
    {type: 'cat', name: 'Hannibal', age: 2}, 
    {type: 'dog', name: 'Rover', age: 3},
    {type: 'dragon', name: 'Fluffykins', age: 673}] as const

const agesOfPets = R.map(R.prop('age')<Pet>)
console.log(agesOfPets(pets))

const findDragons = R.filter(R.propEq('dragon', 'type') as (p: Pet) => boolean)
console.log(findDragons(pets))

const sumOfAgeOfDragons = R.pipe(
  R.filter(R.propEq('dragon', 'type')),
  R.map(R.prop('age')<Pet>),
  R.sum
)

console.log(sumOfAgeOfDragons(pets))
