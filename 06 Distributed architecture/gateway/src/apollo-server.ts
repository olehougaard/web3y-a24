import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import bodyParser from 'body-parser'
import http from 'http';
import { startStandaloneServer } from '@apollo/server/standalone'
import {promises as fs} from "fs"

const journalEndpoint = 'http://localhost:8888/patients'
const medicineEndpoint = 'http://localhost:8889'

function translateId<T extends {_id: any}>({_id, ...data}: T): Omit<T, "_id"> & { id: any } {
  return { ...data, id: _id }
}

function translatePrescription(pre: any) {
  return { 
    id: pre._id,
    cpr: pre.cpr, 
    drugId: pre.drug_id, 
    period: pre.dosage && pre.dosage.period && parseInt(pre.dosage.period), 
    administrations: pre.dosage && pre.dosage.administrations && parseInt(pre.dosage.administrations), 
    units: pre.dosage && pre.dosage.units && parseInt(pre.dosage.units) 
  }
}

async function patientResolver() {
  const res = await fetch(journalEndpoint)
  return await res.json()
}  

async function diagnosesResolver(_, args) {
  const url = `${journalEndpoint}/${args.cpr}/diagnoses`
  const res = await fetch(url)
  const diagnoses = await res.json()
  return diagnoses.map(translateId)
}

async function prescriptionsResolver(parent) {
  const url = `${medicineEndpoint}/prescriptions?cpr=${parent.cpr}`
  const res = await fetch(url)
  const prescriptions = await res.json()
  return prescriptions.map(translatePrescription)
}

async function diagnoseResolver(_, args) {
  const { cpr, diagnosis } = args
  const url = `${journalEndpoint}/${cpr}/diagnoses`
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' }
  const res = await fetch(url, {method: 'POST', body: JSON.stringify(diagnosis), headers})
  return translateId(await res.json())
}

async function prescribeResolver(_, args) {
  const { cpr, prescription: { drugId, ...prescription} } = args
  const url = `${medicineEndpoint}/prescriptions`
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' }
  const res = await fetch(url, {method: 'POST', body: JSON.stringify({ cpr, drug_id: parseInt(drugId), ...prescription }), headers})
  return translatePrescription(await res.json())
}

async function startServer() {
    try {
        const content = await fs.readFile('./medical.sdl', 'utf8')
        const typeDefs = `#graphql
          ${content}`
        const resolvers = {
          Query: {
            patients: patientResolver,
            diagnoses: diagnosesResolver
          },
          Patient: {
            prescriptions: prescriptionsResolver
          },
          Mutation: {
            diagnose: diagnoseResolver,
            prescribe: prescribeResolver
          }
        }

        const app = express()
        app.use('/graphql', bodyParser.json())
        app.use('/graphql', (_, res, next) => {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
          res.header("Access-Control-Allow-Methods", "GET, POST, PATCH");
          next();
        })
        
        const httpServer = http.createServer(app)

        const server = new ApolloServer({
          typeDefs,
          resolvers,
          plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        })
        await server.start()
        app.use('/graphql', expressMiddleware(server))
        app.use('/frontend', express.static('../static'))

        //const server = new ApolloServer({typeDefs, resolvers})
        
        //startStandaloneServer starts a server with good defaults for test/development
        httpServer.listen({ port: 4000 }, () => console.log(`GraphQL server ready on http://localhost:4000/`))
        //const {url} = await startStandaloneServer(server, {listen: { port: 4000}})
        //console.log(`GraphQL server ready on ${url}`)
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}

startServer()
