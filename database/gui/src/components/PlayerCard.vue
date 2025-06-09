<script setup lang="ts">
import { PlayCard } from '../stores/playCard';
import { useRouter } from 'vue-router'

const card = defineModel<PlayCard>('card')
const router = useRouter()


function viewPlayer() {
  router.push({ name: 'UserDetails', params: { uid: card?.value?.uid } });
}
</script>
<template>
  <div v-if="card" class="card text-center grid gutter-y-sm" @click="viewPlayer">
    <h2>{{ card.player }}</h2>
    <p>Tickets: {{ card?.tickets }}</p>
    <p>Chips: {{ card?.chips }}</p>
    <div class="text-small">UID: {{ card.uid }}</div>
    <div class="text-small">ID: {{ card.id }}</div>
    <slot>

    </slot>
  </div>
</template>
