<script setup lang="ts">
import { ref } from 'vue';
import { PlayCard } from '../stores/playCard';
import { usePlayCard } from '../stores/playCard'

const card = ref<PlayCard>({ player: "", uid: "", tickets: 0, chips: 0 });
const didScanNewCard = ref(false);

const playCard = usePlayCard()
function playSuccessSound() {
  const sound = new Audio('/sounds/succes.wav')
  sound.play()
}

async function createCard() {
  if (card.value.player) {
    try {
      await playCard.createPlayCard({ player: card.value.player });
      playSuccessSound();

    } catch (error) {
      console.error('Error creating play card:', error);
      alert(error);

    }
    didScanNewCard.value = false;
  } else {
    alert('Please enter a valid player name.');
  }
}

async function validateUid() {
  const uid = await playCard.fetchNewUid();
  if (uid.length === 0) {
    alert('No UID found. Please scan an empty play card at any machine.');
    return;
  }
  didScanNewCard.value = true;
  card.value.uid = uid
}
</script>
<template>
  <div class="card">
    <h2>New Card</h2>

    <div class="gap-1  text-left">
      <div v-if="!didScanNewCard" class="gap-1 grid">
        <div>Enter Player Name</div>
        <input v-model="card.player" />
        <div>Uid</div>
        <div class="text-xs text-gray-500">Scan an empty play card at any machine then click validate</div>
        <button @click="validateUid">Validate UID</button>
      </div>
      <div class="gap-1 grid" v-if="didScanNewCard">
        <div>Review</div>
        <div>Player: {{ card.player }}</div>
        <div>UID: {{ card.uid }}</div>
        <button @click="createCard">Create</button>

      </div>

    </div>
  </div>
</template>
