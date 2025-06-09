import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import axios from 'axios'
const baseUrl = "192.168.3.21:3001"
export interface Game {
  type: string
  id?: number
  playerId: string
  score: number
  attributes: number
  createdAt?: string
}


export const useGameStore = defineStore('gameStore', () => {
  const loading = ref(false)
  const games = ref<Game[]>([])

  const getGames = computed(() => {
    return games.value
  })

  async function fetchUsersGames(userId: number) {
    loading.value = true
    try {
      const response = await axios.get(`http://${baseUrl}/games/users/${userId}`)
      console.log('Fetched cards:', response.data)
      games.value = response.data
    } catch (err) {
      console.error('Failed to load games:', err)
    } finally {
      loading.value = false
    }
  }
  return { fetchUsersGames, getGames }
})
