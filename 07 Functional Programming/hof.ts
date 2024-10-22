// Higher-order functions

type Pet = { type: string, name: string, age: number }

const pets: Pet[] = [
    {type: 'dog', name:'Fido', age: 7}, 
    {type: 'cat', name: 'Hannibal', age: 2}, 
    {type: 'dog', name: 'Rover', age: 3},
    {type: 'dragon', name: 'Fluffykins', age: 673}]

function namesOf(pets: Pet[]): string[] {
    let names: string[] = []
    for(let pet of pets) {
        names.push(pet.name)
    }
    return names
}

function agesOf(pets: Pet[]): number[] {
    let names: number[] = []
    for(let pet of pets) {
        names.push(pet.age)
    }
    return names
}

function map<T, U>(xs: T[], f:(p:T) => U): U[] {
    let result: U[] = []
    for(let x of xs) {
        result.push(f(x))
    }
    return result
}

let agesOfPets = map(pets, p => p.age)
agesOfPets = pets.map(p => p.age)

function ofType(pets: Pet[], type: string): Pet[] {
    let names: Pet[] = []
    for(let pet of pets) {
        if (pet.type === type)
            names.push(pet)
    }
    return names
}

function filter<T>(xs: T[], p: (_:T) => boolean): T[] {
    let result: T[] = []
    for(let x of xs) {
        if (p(x))
            result.push(x)
    }
    return result
}

let dragons = filter(pets, p => p.type === 'dragon')
dragons = pets.filter(p => p.type === 'dragon')

function sumOfAges(ps: Pet[]): number {
    let sum = 0;
    for(let p of ps) {
        sum = sum + p.age
    }
    return sum
}

function reduce<T, U>(array: T[], 
                f: (acc: U, element: T) => U, 
                initialValue: U): U {
    let acc = initialValue;
    for(let element of array) {
        acc = f(acc, element)
    }
    return acc
}

let sumOfAgesHof = reduce(pets, (acc, pet) => acc + pet.age, 0)
sumOfAgesHof = pets.reduce((acc, pet) => acc + pet.age, 0)
sumOfAgesHof = pets.map(p => p.age).reduce((acc, age) => acc + age, 0)

const sumOfAgeOfDragons = pets
    .filter(p => p.type === 'dragon')
    .map(p => p.age)
    .reduce((acc, age) => acc + age, 0)

// Not really the TypeScript way
// Currying
function add(n:number) {
    return function(m: number) {
        return n + m
    }
}

// Or:
// const add = (n: number) => (m: number) => n + m

add(2)(2)

const a = [1, 2, 3, 4]
const a_plus_1 = a.map(add(1))
const a_plus_1_alt = a.map(x => x + 1)
