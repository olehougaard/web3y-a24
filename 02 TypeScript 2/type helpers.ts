type Species = 'Dog' | 'Cat'

type Dog = 'Boxer' | 'Husky' | 'German Shepard'
type Cat = 'Siamese' | 'Persian' | 'Manx'

type Annotated<S extends Species, R extends string> = `${S}: ${R}`

type Animal = Annotated<'Dog', Dog> | Annotated<'Cat', Cat>

type Annotated2<S, R extends string> = S extends Species ? `${S}: ${R}` : never

type Animal2 = Annotated2<'Dog', Dog> | Annotated2<'Cat', Cat> | Annotated2<'Tree', 'Birch' | 'Pine'>

type PrimitiveArray<T> = T extends number | string | boolean ? T[] : never

type A = PrimitiveArray<string | number | Object>

type B = PrimitiveArray<boolean>

type FieldType<T, K extends string | symbol> = T extends { [key in K]: infer U }? U : never

type LoadingState = { status: 'loading', percentComplete: number }
type FailedState = { status: 'failed', statusCode : number }
type OkState = { status: 'ok', payload: number[] }

type State = LoadingState | FailedState | OkState

type X = FieldType<State, 'status'>
type Y = FieldType<State, 'statusCode'>
