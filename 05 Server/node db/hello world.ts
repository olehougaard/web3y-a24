import * as http from 'http'
import {MongoClient} from 'mongodb'

const connectionString = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000'

const server = http.createServer(async (req, res) => {
  console.log(`${req.method} ${req.url}`)
  const client = new MongoClient(connectionString)
  await client.connect()
  const db = client.db('test')
  const greetings = db.collection('greetings').find()
  const first = await greetings.next()
  const {greeting, name} = first ?? {greeting: 'Hello', name: 'World'}

  res.write(`${greeting} ${name}`)
  res.end()
})

server.listen(8080)
console.log('Server is listening on port 8080')
