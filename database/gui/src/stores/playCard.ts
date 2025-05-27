import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export interface PlayCard {
  id?: number
  uid: string
  tickets: number
  chips: number
  player: string
}

export const usePlayCard = defineStore('playCard', () => {
  const cards = ref<PlayCard[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCards() {
    loading.value = true
    try {
      const response = await axios.get('http://localhost:3001/play-cards')
      console.log('Fetched cards:', response.data.data)
      cards.value = response.data.data
    } catch (err) {
      error.value = 'Failed to load cards.'
    } finally {
      loading.value = false
    }
  }

  async function updatePlayCard(uid, data) {
    try {
      const response = await axios.patch(`http://localhost:3001/play-cards/${uid}`, data);
      cards.value = cards.value.map(card => {
        if (card.id === uid) {
          return { ...card, ...response.data }
        }
        return card
      })
      return response.data
    } catch (e) {
      console.log("updatePlayCard error", e)
    }
  }

  async function createPlayCard(data) {
    try {
      const response = await axios.post(`http://localhost:3001/play-cards`, data);
      cards.value.push(response.data)
      return response.data
    } catch (e) {
      alert(e.response.data.message || "Failed to create play card")
      console.log("updatePlayCard error", e)
    }
  }

  async function fetchNewUid() {
    try {
      const response = await axios.get('http://localhost:3001/play-cards/new-uid');
      return response.data.uid;
    }
    catch (e) {
      console.log("getNewUid error", e)
      return null
    }
  }

  async function fetchPlayCard(uid) {
    try {
      const response = await axios.get(
        `http://localhost:3001/play-cards/${uid}`,
      );
      cards.value = cards.value.map(card => {
        if (card.id === uid) {
          return { ...card, ...response.data }
        }
        return card
      })
      return response.data
    } catch (e) {
      console.log("getPlayCard error", e)
    }
  }




  return { cards, loading, error, fetchCards, fetchPlayCard, updatePlayCard, createPlayCard, fetchNewUid }
})
