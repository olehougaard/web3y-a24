import * as R from 'ramda'

const pets = [
    {type: 'dog', name:'Fido', age: 7}, 
    {type: 'cat', name: 'Hannibal', age: 2}, 
    {type: 'dog', name: 'Rover', age: 3},
    {type: 'dragon', name: 'Fluffykins', age: 673}]

const ageOfDragonsTransducer = R.compose(
  R.filter(R.propEq('dragon', 'type')), 
  R.map(R.prop('age')),
  R.scan(R.add, 0))

const dragonAges = R.transduce(ageOfDragonsTransducer, R.flip(R.append), [], pets)
console.log(R.last(dragonAges))
