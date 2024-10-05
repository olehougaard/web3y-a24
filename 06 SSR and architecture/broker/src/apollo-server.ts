import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import {promises as fs} from "fs"

async function startServer(driver) {
    try {
        await driver.verifyConnectivity() // neo4j
        console.log('Verified')
        const content = await fs.readFile('./friends.sdl', 'utf8')
        const typeDefs = `#graphql
          ${content}`
        const graphQL = new Neo4jGraphQL({typeDefs, driver}) // neo4j
        const schema = await graphQL.getSchema()
        const server = new ApolloServer({schema})
        //startStandaloneServer starts a server with good defaults for test/development
        const {url} = await startStandaloneServer(server, {listen: { port: 4000}})
        console.log(`GraphQL server ready on ${url}`)
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}

startServer(driver)
