<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { usePlayCard } from '../stores/playCard'
import PlayerCard from '../components/PlayerCard.vue'
import CreateNewPlayCard from '../components/ CreateNewPlayCard.vue'


const store = usePlayCard()
const getCards = computed(() => {
  console.log('Fetching cards:', store?.cards)
  return store.cards
})
onMounted(() => {
  store.fetchCards()
})
</script>
<template>
  <div class="home text-center">
    <h1>Play Cards</h1>
    <div class="card-grid">
      <PlayerCard v-for="card in getCards" :key="card.id" :card="card" />
      <CreateNewPlayCard />
    </div>
  </div>
</template>

<style scoped>
.card-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
</style>
