import { nextTick } from 'vue'
import { describe, it, expect } from '@jest/globals'
import { mount } from '@vue/test-utils'

import Lobby from '../src/components/Lobby.vue'

describe("lobby", () => {
    const router = {
        push(path: string) {}
    }

    function useRouter() {
        return router
    }

    function create_api() {
        let joined = -1
        const game = { gameNumber: 7, gameName:'test game', board: [[]], ongoing: false, inTurn: 'X'}
    
        return {
            game() {
                return game
            },
            joined() {
                return joined
            },
            readGamesList() {
                return [game]
            },
            joinGame(gameNumber: number) { 
                joined = gameNumber 
                return game
            },
        }
    }

    it("displays the games from the server", async () => {
        const api = create_api()
        const wrapper = mount(Lobby, {
            global: {
                provide: {api, useRouter}
            }
        })

        await nextTick()

        expect(wrapper.text()).toContain('test game')
    })

    it("calls the server with a click on join", async () => {
        const api = create_api()
        
        const wrapper = mount(Lobby, {
            global: {
                provide: {api, useRouter}
            }
        })

        await nextTick()

        wrapper.find(`#join${api.game().gameNumber}`).trigger('click')

        await nextTick()

        expect(api.joined()).toBe(api.game().gameNumber)
    })
})
