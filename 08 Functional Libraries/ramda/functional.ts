import * as R from 'ramda'

type Person = {
  readonly name: string
  readonly age: number
}

const createPerson = (name: string, age: number) => ({name, age})

type Company = {
  readonly name: string
  readonly address: string
  readonly employees: Readonly<Person[]>
}

const createCompany = (name: string, address: string, employees: Person[] = []): Company => 
  ({name, address, employees})

const hireEmployee = R.curry((e: Person, c: Company) => createCompany(c.name, c.address, [...c.employees, e]))

const layOffEmployee = R.curry((e: Person, c: Company) => 
  createCompany(c.name, c.address, c.employees.filter(ee => e.name !== ee.name)))

const c = createCompany("Acme", "Acme Way 1")

const c3 = R.flow(c, [
  hireEmployee(createPerson("", 8)),
  hireEmployee(createPerson("asdlkfj", 88))
])

console.log(c3)
