import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi.ts'

export type Game = {
  isActive: boolean,
  tickets: number
  tokens: number
  plays: number
  bonusTokens: number
  cardDrop: number
  messages: []
}



export const useGameStore = defineStore('game', () => {
  const { instance, socket } = useApi()

  const game = ref({
    isActive: false,
    tickets: 0,
    tokens: 0,
    plays: 0,
    bonusTokens: 0,
    cardDrop: 0,
    messages: []
  })

  const activeBonusToken = ref(0);

  const getGame = computed(() => {
    return game.value
  })


  async function fetchGame() {
    const response = await instance.get('/get-game')
    console.log("fetchGame", response)
    game.value = response.data.game
  }
  function setGame(g: Game) {
    // console.log("setgame", g)
    game.value = g
  }

  socket.addEventListener("message", (event: { data: any, type: string }) => {
    const response = JSON.parse(event.data)
    console.log("response", response)
    if (response.type === 'bonus-tokens') {
      activeBonusToken.value = response.data.bonusIndex
      console.log("reso", response.data.bonusIndex)

    } else {
      const { game } = response.data;
      setGame(game)
    }
  });


  async function fixJam() {
    const response = await instance.get('/fix-jam')
  }




  // const topScore = ref({
  //   today: 0,
  //   ever: 0
  // })

  // const lastFiveGames = ref([])




  // async function startGame(player = "Player") {
  //   await instance.post('/start-game', { data: { player } })
  // }



  // async function resetGame() {
  //   await instance.post('/reset-game', { data: {} })
  // }



  // async function getHighScore() {
  //   const response = await instance.get('/high-score')
  //   // console.log(response)
  //   topScore.value = response.data
  // }



  // async function getLastFiveGames() {
  //   const response = await instance.get('/last-5-games')
  //   // console.log(response)
  //   lastFiveGames.value = response.data.lastFiveGames
  // }

  // Listen for messages
  // socket.addEventListener("message", (event: { data: string }) => {
  //   const response = JSON.parse(event.data)
  //   const game = response.data;
  //   console.log("game ws event", game, response)
  //   // if (response.type === "beam-broke-wheel") {
  //   game.value = game
  //   // } else if (response.type === "beam-broke-coin-dispenser") {
  //   //   game.value = game

  //   //   //  
  //   // }
  //   // if (response.type === 'start') {
  //   //   game.value = data.game
  //   //   getLastFiveGames()
  //   //   getHighScore()

  //   // } else if (response.type === 'end') {
  //   //   isPending.value = false;
  //   //   game.value = data.game
  //   //   getLastFiveGames()
  //   //   getHighScore()
  //   // }
  //   // else if (response.type === 'end-pending') {
  //   //   isPending.value = true;
  //   //   game.value = data.game
  //   //   game.value.isActive = false
  //   //   getLastFiveGames()
  //   //   getHighScore()
  //   // }
  //   // else if (response.type === 'score') {
  //   //   game.value = data.game
  //   // }

  // });



  return { fetchGame, getGame, game, activeBonusToken }
})