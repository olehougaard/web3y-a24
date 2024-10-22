type Person = {
  readonly name: string
  readonly age: number
}

/* Or: 
type PersonData = {
  name: string
  age: number
}
type Person = Readonly<PersonData>
*/

const createPerson = (name: string, age: number) => ({name, age})

type Company = {
  readonly name: string
  readonly address: string
  readonly employees: Readonly<Person[]>
}

const createCompany = (name: string, address: string, employees: Person[] = []): Company => 
  ({name, address, employees})

const addEmployee = (e: Person, c: Company) => createCompany(c.name, c.address, [...c.employees, e])

const removeEmployee = (e: Person, c: Company) => 
  createCompany(c.name, c.address, c.employees.filter(ee => e.name !== ee.name))

const c = createCompany("Acme", "Acme Way 1")
let c1 = addEmployee(createPerson("", 8), c)
c1 = addEmployee(createPerson("asdlkfj", 88), c1)

const c2a = addEmployee(createPerson("", 8), c)
const c2b = addEmployee(createPerson("asdlkfj", 88), c1)

let hires = [createPerson("", 8), createPerson("asdlkfj", 88)]

const c3 = hires.reduce((c, e) => addEmployee(e, c), c)
