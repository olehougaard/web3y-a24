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
    updatePerson(p: Person): Model
    hire(p: Person, salary: number): Model
    addEmployee(e: Employee): Model
    filtered(filter: DataFilter): Model
    all(): Model
}

export const createModel = (persons: Person[], employees: Employee[], filter: (_:Data) => boolean = () => true): Model => {
    const employeeMap: { [eId: number]: Employee } = {}
    employees.forEach(e => employeeMap[e.employeeId] = e)

    const personData: () => Data[] = () => persons
        .map(p => (p.employeeId === undefined? p : { ...p, ...employeeMap[p.employeeId]}))
        .filter(filter)

    const personById = (id: number) => {
        for(let person of persons) {
            if (person.id === id) {
                return person
            }
        }
        return undefined       
    }

    const updatePerson: (p:Person) => Model = p => createModel(persons.map(pp => p.id == pp.id? p : pp), employees, filter)
    const hire: (p: Person, salary: number) => Model = (p, salary) => {
        const maxId = employees.reduce((max, {employeeId}) => employeeId > max? employeeId : max, 0)
        const employeeId = maxId + 1
        const employee: Employee = {
            employeeId: employeeId,
            salary,
            manager: false
        }
        return updatePerson({...p, employeeId}).addEmployee(employee)
    }
    const addEmployee: (e:Employee) => Model = e => createModel(persons, employees.concat(e), filter)

    const filtered: (f:DataFilter) => Model = filter => createModel(persons, employees, filter )
    const all: () => Model = () => createModel(persons, employees)

    return { personData, updatePerson, personById, hire, addEmployee, filtered, all }
}

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
