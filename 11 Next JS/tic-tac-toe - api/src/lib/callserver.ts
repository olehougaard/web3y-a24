import { NextResponse } from "next/server"

export const endpoint = 'http://localhost:8080/games'

export const callServer = async <Response>(url: string, init: RequestInit = {}): Promise<Response> => {
  return fetch(url, { ...init, headers: {...init.headers, 'Accept': 'application/json', 'Content-Type': 'application/json'}})
    .then(response => response.ok? response : Promise.reject([response.status, response.statusText]))
    .then(response => response.json())
}

export const get = async <Response>(url: string): Promise<NextResponse<Response>> => {
  try {
    const res = await callServer<Response>(url)
    return NextResponse.json(res)
  } catch (e: any) {
    if (e instanceof Array) {
      const [status, text] = e
      return new NextResponse(text, { status })
    } else {
      return new NextResponse(e.toString(), { status: 500 })
    }
  }

}

export const post = async <Body, Response>(url: string, body: Body): Promise<NextResponse<Response>> => {
  try {
    const response = await callServer<Response>(url, {method: 'POST', body: JSON.stringify(body)})
    return NextResponse.json(response)
  } catch (e: any) {
    if (e instanceof Array) {
      const [status, text] = e
      return new NextResponse(text, { status })
    } else {
      return new NextResponse(e.toString(), { status: 500 })
    }
  }
}

export const patch = async <Body, Response>(url: string, body: Partial<Body>): Promise<NextResponse<Response>> => {
  try {
    const response = await callServer<Response>(url, {method: 'PATCH', body: JSON.stringify(body)})
    return NextResponse.json(response)
  } catch (e: any) {
    if (e instanceof Array) {
      const [status, text] = e
      return new NextResponse(text, { status })
    } else {
      return new NextResponse(e.toString(), { status: 500 })
    }
  }
}

