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

let sumOfAgeOfDragons = R.flow(pets, [
  R.filter((p: Pet) => p.type === 'dragon'),
  R.map((p: Pet) => p.age),
  R.sum
])

sumOfAgeOfDragons = R.flow(pets, [
  R.filter(R.propEq('type', 'dragon')),
  R.map(R.prop('age')<Pet>),
  R.sum
])

/*
  MongoDB:
  db.pets.aggregate([
    {$match:{type:'dragon'}}, 
    {$project:{age:1}}, 
    {$project:{sumAge: {$sum:'$age'}}}
  ])
*/
