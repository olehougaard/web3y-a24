export type Person = {
    id: number,
    name: string,
    employeeId?: number
}

export type Employee = {
    employeeId: number,
    salary: number,
    manager: boolean
}

export type Data = Person & {    
    salary?: number,
    manager?: boolean
}

export type DataFilter = (d:Data) => boolean

export type Model = {
    personData(): Data[]
    personById(id: number): Person | undefined
    updatePerson(p: Person): void
    hire(p: Person, salary: number): void
    addEmployee(e: Employee): void
}

class ModelImplementation implements Model {
    private persons: Person[]
    private employees: Employee[]
    private employeeMap: {[eId: number]: Employee}

    constructor(persons: Person[], employees: Employee[]) {
        this.persons = [...persons]
        this.employees = [...employees]
        this.employeeMap = {}
        this.employees.forEach(e => this.employeeMap[e.employeeId] = e)
    }

    personData(): Data[] { 
        return this.persons.map(p => (p.employeeId === undefined? p : { ...p, ...this.employeeMap[p.employeeId]}))
    }

    personById(id: Number): Person | undefined {
        for(let person of this.persons) {
            if (person.id === id) {
                return person
            }
        }
        return undefined       
    }

    updatePerson(p:Person): void {
        this.persons = this.persons.map(pp => p.id == pp.id? p : pp)
    }

     hire(p: Person, salary: number): void {
        const maxId = this.employees.reduce((max, {employeeId}) => employeeId > max? employeeId : max, 0)
        const employeeId = maxId + 1
        const employee: Employee = {
            employeeId: employeeId,
            salary,
            manager: false
        }
        this.updatePerson({...p, employeeId})
        this.addEmployee(employee)
    }

    addEmployee(e: Employee): void {
        this.employees.push(e)
        this.employeeMap[e.employeeId] = e
    }
}

export const createModel = (persons: Person[], employees: Employee[]): Model => new ModelImplementation(persons, employees)

export const persons: Person[] = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe', employeeId: 17 },
    { id: 3, name: 'George Deer', employeeId: 19 },
    { id: 4, name: 'Jill Deer', employeeId: 23 },
]

export const employees: Employee[] = [
    { employeeId: 17, salary: 42000, manager: false },
    { employeeId: 19, salary: 35000, manager: false },
    { employeeId: 23, salary: 74000, manager: true },
]
