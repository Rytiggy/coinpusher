<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { usePlayCard } from '../stores/playCard'
import CreateNewPlayCard from '../components/ CreateNewPlayCard.vue'


const store = usePlayCard()

onMounted(() => {
  store.fetchCards()
})
</script>
<template>
  <div class="home text-center">
    <h1>New Cards</h1>
    <div class="card-grid">
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
