<script setup lang="ts">
import { useGameStore } from '@/stores/useGameStore';
import { computed } from 'vue';


const gameStore = useGameStore()
const game = computed(() => {
  return gameStore.getGame
})

</script>
<template>
  <div class="flex gap-1 pa-md">


    <div class="item grow-1 text-center">
      <h1>Plays:</h1>
      <h2> {{ game.plays }}</h2>
    </div>
    <div class="item grow-1 text-center">
      <h1>Tokens:</h1>
      <h2> {{ game.tokens }}</h2>
    </div>
    <div class="item grow-1 text-center">
      <h1>Tickets:</h1>
      <h2> {{ game.tickets }}</h2>
    </div>
  </div>


</template>