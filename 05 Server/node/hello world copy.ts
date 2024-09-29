import * as http from 'http'
import {parse} from 'querystring'

function parseQueryParams(url?: string): ReturnType<typeof parse> {
  if (url === undefined) return {}
  const queryStringMarker = url.indexOf('?')
  if (queryStringMarker === -1) return {}
  const queryString = url.substring(queryStringMarker + 1)
  return parse(queryString)
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`)
  const queryParams = parseQueryParams(req.url)
  const name = queryParams.name ?? 'World'
  res.write(`Hello ${name}`)
  res.end()
})

server.listen(8080)
console.log('Server is listening on port 8080')
