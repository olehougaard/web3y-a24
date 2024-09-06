const constStatusCodes = {
    ok: 200,
    "Not found": 404,
    "Internal Server Error": 500
} as const

type StatusCodes = typeof constStatusCodes
type StatusCodeKeys = keyof StatusCodes

function objectKeys<T extends {}>(obj: T): Array<keyof T> {
    return Object.keys(obj) as Array<keyof T>
}

function statusText(code: StatusCodes[StatusCodeKeys]): StatusCodeKeys | undefined {
    for(let text of objectKeys(constStatusCodes)) {
        if (constStatusCodes[text] === code) {
            return text
        }
    }
    return undefined
}

type Keys = 'ok' | 'Not Found' | 'Internal Server Error'

type StatusCodes1 = {
    [key in Keys]: number 
}

type StatusCodeExplanations = {
    [key in keyof StatusCodes]: string
}

function getter<T extends {}, K extends keyof T>(obj: T, k: K): () => T[K] {
    return () => obj[k]
}

