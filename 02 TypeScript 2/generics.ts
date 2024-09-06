function nCopiesPlain(n: number, value: unknown): unknown[] {
    const copies = new Array(n)
    for(let i: number = 0; i < n; i++) {
        copies[i] = value
    }
    return copies
}

const unknownHellos = nCopiesPlain(7, "Hello")

function nCopies<T>(n: number, value: T): T[] {
    const copies = new Array<T>(n)
    for(let i: number = 0; i < n; i++) {
        copies[i] = value
    }
    return copies
}

const hellos = nCopies(7, "Hello")

type Person = {
    name: string,
    age: number
}

type Employee = Person & { salary: number }

type Customer = Person & { address: string }

function adultsPlain(persons: Person[]) {
    return persons.filter(p => p.age >= 18)
}

const employees: Employee[] = [
    {name: 'George Washington', age: 292, salary: 1776},
    {name: 'Abraham Lincoln', age: 215, salary: 87},
    {name: "Manager's Kid", age: 16, salary: 12345},
]

const employeesPlain = adultsPlain(employees)
