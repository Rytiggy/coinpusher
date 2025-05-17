<script setup lang="ts">
import { useGameStore } from '@/stores/useGameStore';
import BonusTokens from "@/components/BonusTokens.vue"

import { computed } from 'vue';


const gameStore = useGameStore()
const game = computed(() => {
  return gameStore.getGame
})

const getLatestMessage = computed(() => {
  return game.value.messages
})
</script>
<template>
  <!-- <div> -->
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
    <div v-if="game.bonusTokens > 0" class="item grow-1 text-center">
      <h1>Bonus Tokens:</h1>
      <h2> {{ game.bonusTokens }}</h2>
    </div>
    <div v-if="game.cardDrop > 0" class="item grow-1 text-center">
      <h1>Card Drop:</h1>
      <h2> {{ game.cardDrop }}</h2>
    </div>


  </div>


  <div class="absolute-bottom">
    <BonusTokens />
  </div>

</template>