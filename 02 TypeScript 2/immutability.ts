const statusCodes = {
    ok: 200,
    "Not found": 404,
    "Internal Server Error": 500
}

statusCodes.ok = 201 // That wasn't supposed to be legal.

type StatusCodeType = {
    ok: number,
    "Not found": number,
    "Internal Server Error": number
}

type ImmutableStatusCodeType = {
    readonly ok: number,
    readonly "Not found": number,
    readonly "Internal Server Error": number
}

const statusCodes2: ImmutableStatusCodeType = {
    ok: 200,
    "Not found": 404,
    "Internal Server Error": 500
}

// Error: statusCodes2.ok = 201

type ImmutableStatusCodeType2 = Readonly<StatusCodeType>

const constStatusCodes = {
    ok: 200,
    "Not found": 404,
    "Internal Server Error": 500
} as const

type ImmutableStatusCodes3 = typeof constStatusCodes

const Suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'] as const

type SuitsType = typeof Suits

type ClubType = SuitsType[0]

type Suit = SuitsType[number]
