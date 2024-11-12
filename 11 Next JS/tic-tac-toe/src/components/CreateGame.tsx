"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export const CreateGame = () => {
    const [ name, setName ] = useState('Name')
    const router = useRouter()
    const createGame = async () => {
        router.push(`/waiting/${name}`)
    }

    return (<div>
        <input type='text' onChange={e => setName(e.target.value)}/>
        <button id='new' onClick={createGame}>Create Game</button>
    </div>)
}
