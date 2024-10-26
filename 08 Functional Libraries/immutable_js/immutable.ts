import { List } from 'immutable'

class Person {
    readonly name: string
    readonly age: number

    constructor(name: string, age: number) {
        this.name = name
        this.age = age
    }
}

class Company {
    readonly name: string
    readonly address: string
    readonly employees: List<Person>

    constructor(name: string, address: string, employees: List<Person> = List()) {
        this.name = name
        this.address = address
        this.employees = employees
    }

    addEmployee(employee: Person): Company {
        return new Company(this.name, this.address, this.employees.push(employee))
     }

    removeEmployee(employee: Person) {
        const employeeIndex = this.employees.findIndex(e => e.name !== employee.name)
        if (employeeIndex === -1) return this
        return new Company(this.name, 
            this.address, 
            this.employees.delete(employeeIndex))
    }
}

let c = new Company("Acme", "Acme Way 1")
c = c
    .addEmployee(new Person("", 8))
    .addEmployee(new Person("asdlkfj", 88))
