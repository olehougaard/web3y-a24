import { Collection, MongoClient } from "mongodb"
import { createModel, Game, GameConfig, model } from "./model"

type StoredGame = GameConfig & { ongoing: boolean }
export type ExtendedGame = Game & { ongoing: boolean }

const connectionString = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000'

const data = (eg: ExtendedGame): StoredGame => {
  return { ...eg.data(), ongoing: eg.ongoing }
}

const enrich = (sgd: StoredGame): ExtendedGame => {
  return { ...createModel(sgd), ongoing: sgd.ongoing }
}

const gamesDb = async (): Promise<[Collection<StoredGame>, () => void]> => {
  const client = new MongoClient(connectionString)
  await client.connect()
  const db = client.db('test')
  const games = db.collection<StoredGame>('games')
  return [games, () => client.close()]
}

export const createGame = async (gameName: string): Promise<ExtendedGame> => {
  const [games, close] = await gamesDb()
  try {
    const gameNumbers = await games.find().sort({gameNumber: -1}).limit(1).toArray()
    const gameNumber = (gameNumbers[0]?.gameNumber ?? -1) + 1
    const eg = { ...model(gameNumber, gameName), ongoing: false }
    await games.insertOne(data(eg))
    return eg
  } finally {
    close()
  }
}

export const getGames = async (): Promise<ExtendedGame[]> => {
  const [games, close] = await gamesDb()
  try {
    const gs = await games.find().toArray()
    return gs.map(enrich)
  } finally {
    close()
  }
}

export const getGame = async (gameNumber: number): Promise<ExtendedGame | null> => {
  const [games, close] = await gamesDb()
  try {
    const gs = await games.findOne({gameNumber})
    return gs && enrich(gs)
  } finally {
    close()
  }
}

export const startGame = async (game: GameConfig): Promise<ExtendedGame | null> => {
  return updateGame(game.gameNumber, { ongoing: true })
}

export const updateGame = async (gameNumber: number, update: Partial<StoredGame>): Promise<ExtendedGame | null> => {
  const [games, close] = await gamesDb()
  try {
    await games.updateOne({ gameNumber }, { $set: update })
    return getGame(gameNumber)
  } finally {
    close()
  }
}