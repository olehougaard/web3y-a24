type Species = 'Dog' | 'Cat'

type Dog = 'Boxer' | 'Husky' | 'German Shepard'
type Cat = 'Siamese' | 'Persian' | 'Manx'

type AnnotatedDog = `Dog: ${Dog}`
type AnnotatedCat = `Cat: ${Cat}`

type Animal = AnnotatedDog | AnnotatedCat

