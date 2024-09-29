import express, { type Express, type Request, type Response } from 'express'
import { GameData, model, type Game, type Move } from './model'
import bodyParser from 'body-parser'

const games: Game[] = []
const ongoing_games: Record<number, boolean> = {}

const create_game = (gameNumber: number, gameName: string) => {
    games.push(model(gameNumber, gameName))
    return games[games.length - 1]
}

const send_data = (res: Response, data: unknown) => {
    if (data) {
        res.send(data)
    } else {
        res.status(404).send()
    }
}

const send_game_data = (res: Response, gameNumber:number, extractor: (g:Game) => unknown) => {
    const game = games[gameNumber]
    send_data(res, game && extractor(game))
}

const gameserver: Express = express()

/*
A raw body parser. Better to use the body-parser middleware.

gameserver.use ((req, _, next) => {
    req.setEncoding('utf8')
    req.body = new Promise(resolve => {
        let data=''
        req.on('data', (chunk) => { 
            data += chunk
         })
     
         req.on('end', () => {
             resolve(data)
             next();
         })
    })
})

*/

gameserver.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH");
    next();
});

gameserver.use(bodyParser.json())

type ExtendedGameData = GameData & {ongoing: boolean}

interface TypedRequest<BodyType> extends Request {
    body: BodyType
}

gameserver.post('/games', async (req: TypedRequest<{gameName?: string}>, res: Response<ExtendedGameData>) => {
    const gameNumber = games.length
    const gameName = req.body.gameName ?? 'Game number ' + gameNumber
    const game = create_game(gameNumber, gameName)
    res.send({...game.data(), ongoing: false})
})

gameserver.get('/games', (req: TypedRequest<{gameName?: string}>, res: Response<ExtendedGameData[]>) => {
    const allGames = games
    .filter(g => !ongoing_games[g.gameNumber])
    .map(g => ({ ...g.data(), ongoing: false }))
    if (req.query.finished) {
        res.send(allGames.filter(g => g.winState !== undefined))        
    } else {
        res.send(allGames)
    }
})

gameserver.get('/games/:gameNumber', (req: Request, res: Response) => {
    const gameNumber = parseInt(req.params.gameNumber)
    const ongoing = !!ongoing_games[gameNumber]
    send_game_data(res, gameNumber, g => ({...g.data(), ongoing}))
})

gameserver.patch('/games/:gameNumber', (req: TypedRequest<Partial<ExtendedGameData>>, res) => {
    const gameNumber = parseInt(req.params.gameNumber)
    const gameData = req.body
    if (!games[gameNumber])
        res.status(404).send()
    else if (gameData.ongoing !== undefined) {
        // Attempting to start a game
        if (!gameData.ongoing || ongoing_games[gameNumber])
            res.status(403).send()
        else {
            ongoing_games[gameNumber] = true
            res.send({...games[gameNumber], ongoing: true})
        }
    }
})

gameserver.post('/games/:gameNumber/moves', (req: TypedRequest<Move>, res) => {
    const gameNumber = parseInt(req.params.gameNumber)
    if (req.body.conceded) {
        if (!ongoing_games[gameNumber])
            res.status(403).send()
        else {
            games[gameNumber] = games[gameNumber].conceded()
            res.send({...games[gameNumber], ongoing: false})
        }
    } else {
        const { x, y, player } = req.body
        const game = games[gameNumber]
        if (!ongoing_games[gameNumber])
            res.sendStatus(404)
        else if (player === game.inTurn && game.legalMove(x,y)) {
            const afterMove = game.makeMove(x, y)
            games[gameNumber] = afterMove
            const {inTurn, winState, stalemate} = afterMove
            res.send({move: {x, y, player: game.inTurn}, inTurn, winState, stalemate})
        } else {
            res.sendStatus(403)
        }
    }
})

gameserver.get('/games/:gameNumber/moves', (req, res) => {
    const gameNumber = parseInt(req.params.gameNumber)
    send_game_data(res, gameNumber, g => ({ 
        moves: g.moves, 
        inTurn: g.inTurn,
        winState: g.winState,
        stalemate: g.stalemate
    }))
})

gameserver.listen(8080, () => console.log('Gameserver listening on 8080'))
