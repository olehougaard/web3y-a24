const ws = new WebSocket('ws://localhost:9090/publish')

export const websocket = (): Promise<WebSocket> => {
  if (ws.readyState === WebSocket.OPEN)
    return Promise.resolve(ws)
  else if (ws.readyState === WebSocket.CONNECTING)
    return new Promise(resolve => ws.onopen = () => resolve(ws))
  else
    return Promise.reject("Websocket closed")
}


export const sendMessage = (ws: WebSocket, topic: string, message: any) => {
  ws.send(JSON.stringify({type: 'send', topic, message}))
}