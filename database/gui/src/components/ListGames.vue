<script setup lang="ts">
import { Game } from '../stores/gameStore'

const games = defineModel<Game[]>('games', { default: [] });

function formatDate(date: string): string {
  const options: Intl.DateTimeFormatOptions = {
    // year: 'numeric',
    // month: '2-digit',
    // day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }
  return new Date(date).toLocaleTimeString('en-US', options)
}
</script>

<template>
  <div class="">
    <h2>Games:</h2>
    <div v-if="games.length === 0">No games found for this player.</div>
    <div v-else>
      <div class="grid gap-1">
        <div class="card flex align-items-center" v-for="game in games" :key="game.id">
          <div class="flex-grow-1 text-left">{{ game.type }}</div>
          <div class="grid text-right">
            <div class="">Tickets {{ game.score }}</div>
            <div v-if="game?.createdAt" class="text-small">{{ formatDate(game.createdAt) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>