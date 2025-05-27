<script setup lang="ts">
import { PlayCard } from '../stores/playCard';
import { usePlayCard } from '../stores/playCard'

const card = defineModel<PlayCard>('card')
const playCard = usePlayCard()
function playSuccessSound() {
  const sound = new Audio('/sounds/succes.wav')
  sound.play()
}

async function addChips() {
  if (!card.value)
    return
  const chips = prompt('How many chips do you want to add?');
  if (chips !== null && !isNaN(Number(chips))) {
    const currentCardState = await playCard.fetchPlayCard(card.value.uid);
    card.value.chips = currentCardState.chips + Number(chips);
    await playCard.updatePlayCard(card.value.uid, { chips: card.value.chips });
    playSuccessSound();

  } else {
    alert('Please enter a valid number of chips.');
  }

}
</script>
<template>
  <div v-if="card" class="card">
    <h2>{{ card.player }}</h2>
    <p>Tickets: {{ card?.tickets }}</p>
    <p>Chips: {{ card?.chips }}</p>
    <button @click="addChips">Add Chips</button>
    <div class="text-small mt-md">UID: {{ card.uid }}</div>
    <div class="text-small mt-md">ID: {{ card.id }}</div>

  </div>
</template>
