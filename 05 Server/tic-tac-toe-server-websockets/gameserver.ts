import express, { type Express, type Request, type Response } from 'express'
import { GameData, model, type Game, type Move } from './model'
import bodyParser from 'body-parser'
import { WebSocket } from 'ws'

function startServer(ws: WebSocket) {
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

    const send_message = (topic: string, message: any) => {
        ws.send(JSON.stringify({type: 'send', topic, message}))
    }

    const gameserver: Express = express()

    gameserver.use(function(_, res, next) {
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
        const data = { ...game.data(), ongoing: false }
        send_message('new_game', data)
        res.send(data)
    })

    gameserver.get('/games', (_, res) => {
        res.send(games
            .filter(g => !ongoing_games[g.gameNumber])
            .map(g => ({...g.data(), ongoing: false})))
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
                const data = { ...games[gameNumber], ongoing: true }
                res.send(data)
                send_message('game_starting', data)
                send_message('game_' + gameNumber, data)
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
                const data = { ...games[gameNumber], ongoing: false }
                send_message('move_' + gameNumber, {type: 'conceded', ...data})
                res.send(data)
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
                const data = { move: { x, y, player: game.inTurn }, inTurn, winState, stalemate }
                send_message('move_' + gameNumber, {type: 'move', ...data})
                res.send(data)
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
}

const ws = new WebSocket('ws://localhost:9090/publish')
ws.onopen = _ => startServer(ws)
