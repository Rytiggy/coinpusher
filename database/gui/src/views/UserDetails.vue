<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { usePlayCard, PlayCard } from '../stores/playCard'
import PlayerCard from '../components/PlayerCard.vue'
import ListGames from "../components/ListGames.vue"
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'

const store = usePlayCard()
const gameStore = useGameStore()
const router = useRouter()
const card = ref<PlayCard | null>(null)


const games = computed(() => {
  const games = gameStore.getGames;
  if (games)
    return gameStore.getGames.sort((gameA, gameB) => {
      return new Date(gameB.createdAt as string).getTime() - new Date(gameA.createdAt as string).getTime()
    })
  return []
})


onMounted(async () => {
  card.value = await store.fetchPlayCard(router.currentRoute.value.params.uid)
  if (card?.value?.id)
    gameStore.fetchUsersGames(card.value.id)
})



function playSuccessSound() {
  const sound = new Audio('/sounds/succes.wav')
  sound.play()
}

async function addChips() {
  if (!card.value)
    return
  const chips = prompt('How many chips do you want to add?');
  if (chips !== null && !isNaN(Number(chips))) {
    const currentCardState = await store.fetchPlayCard(card.value.uid);
    card.value.chips = currentCardState.chips + Number(chips);
    await store.updatePlayCard(card.value.uid, { chips: card.value.chips });
    playSuccessSound();

  } else {
    alert('Please enter a valid number of chips.');
  }


}
</script>
<template>
  <div class="grid pa-md">
    <!-- <div class=" text-center p-1"> -->
    <!-- <h1>{{ card?.player }}'s Card</h1> -->

    <PlayerCard v-if="card" :key="card.id" :card="card">
      <button @click="addChips">Add Chips</button>
    </PlayerCard>


    <ListGames v-model:games="games" />
  </div>
  <!-- </div> -->
</template>

<style scoped>
.max-item-width {
  max-width: 1000px
}
</style>
