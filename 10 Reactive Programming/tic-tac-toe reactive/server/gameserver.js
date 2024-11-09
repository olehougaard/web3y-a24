const express = require('express')
const WebSocket = require('ws')
const model = require('./model.js')

const games = []
const ongoing_games = {}
const game_sockets = {}

const create_game = () => {
    games.push(model(games.length))
    return games[games.length - 1]
}

const available_games = () => games
    .filter(g => !ongoing_games[g.gameNumber])
    .map(g => g.json({ongoing: false}))

const wss = new WebSocket.Server({port: 9090, path: '/tic-tac-toe'})
wss.on('connection', ws => {
    ws.send(JSON.stringify({ games: available_games() }))
    ws.on('message', message => {
        const { type, ...params } = JSON.parse(message)
        switch(type) {
            case 'new': {
                const game = create_game()
                game_sockets[game.gameNumber] = [ws]
                ws.send(JSON.stringify(game.json({ongoing: false})));
                [...wss.clients]
                .filter(client => client.readyState === WebSocket.OPEN)
                .forEach(client =>  client.send(JSON.stringify({ games: available_games() })))
            break;
            }
            case 'join': {
                const { gameNumber } = params
                if (!ongoing_games[gameNumber]) {
                    ongoing_games[gameNumber] = true
                    const game = games[gameNumber]
                    game_sockets[gameNumber].push(ws)
                    game_sockets[gameNumber].forEach(ws => ws.send(JSON.stringify(game.json({ongoing: true}))));
                    [...wss.clients]
                    .filter(client => client.readyState === WebSocket.OPEN)
                    .forEach(client =>  client.send(JSON.stringify({ games: available_games() })))
                } else {
                    ws.send(JSON.stringify({ games: available_games() }))
                }
                break;
            }
            case 'move': {
                const { x, y, player: inTurn, gameNumber } = params
                const game = games[gameNumber]
                if (!ongoing_games[gameNumber])
                    ws.send(JSON.stringify({ games: available_games() }))
                else if (inTurn === game.playerInTurn && game.legalMove(x,y)) {
                    const afterMove = game.makeMove(x, y)
                    games[gameNumber] = afterMove
                    const response = JSON.stringify({ 
                        moves: [{x, y, player: game.playerInTurn}], 
                        inTurn: afterMove.playerInTurn, 
                        winner: afterMove.winner, 
                        stalemate: afterMove.stalemate  
                    })
                    game_sockets[gameNumber].forEach(ws => ws.send(response))
                }
                break;
            }
            case 'concede': {
                const { winner, gameNumber } = params
                games[gameNumber] = games[gameNumber].conceded(winner)
                game_sockets[gameNumber].forEach(ws => ws.send(JSON.stringify(games[gameNumber].json({ongoing: true}))))
                break;
            }
            default:
                console.log(`Unknown action: ${type}`)
        }
    })
})
