<script setup lang="ts">
import SlotMachine from '@/components/SlotMachine.vue';
import TokenScore from '@/components/TokenScore.vue';
import WheelOfChance from '@/components/WheelOfChance.vue'
import { useGameStore, type Message } from "@/stores/useGameStore";
import { useApi } from '@/composables/useApi.ts'
import { computed, onMounted, ref } from 'vue';
// const coinDispenser = ref()
const gameStore = useGameStore()
gameStore.fetchGame()
// const { instance, socket } = useApi()

// socket.addEventListener("message", (event: { data: string }) => {
//   const response = JSON.parse(event.data)

//   console.log("here", response)
//   if (response.type === "beam-broke-coin-dispenser") {
//     // coinDispenser.value.play()
//   }



// });

const game = computed(() => {
  return gameStore.game
})

const getUser = computed(() => {
  return gameStore.user
})

// TODO: get count of messages 
type messageWithCount = {
  data: Message;
  count: number;
  type: string;
}
const getUniqueMessages = computed(() => {
  let seen: messageWithCount[] = []

  //   return game.value.messages

  //   // .forEach((obj => {
  //   //   if (!seen.find(value => value.data.message === obj.message)) {
  //   //     seen.push({ data: obj, type: obj.type, count: 1 })
  //   //   } else {
  //   //     seen = seen.map(value => {
  //   //       if (value.data.message === obj.message) {
  //   //         value.count++
  //   //         value.data = obj
  //   //       }
  //   //       return value
  //   //     })
  // }
  //   }))
  return game.value.messages
    .sort(function (a, b) { return a.created_at - b.created_at }).slice(0, 15)
})

</script>

<template>

  <main class="home-container">
    <img src="@/assets/BikiniBottom/bikiniBottom.png" />
    <img src="@/assets/BikiniBottom/rocks.png" class="layer-drop-shadow" />
    <img src="@/assets/BikiniBottom/coral.png" class="layer-drop-shadow" />
    <img src="@/assets/BikiniBottom/bikiniBottomSign.png" class="layer-drop-shadow" />

    <!-- <audio ref="coinDispenser">
      <source src="/home/ryan/Documents/git/coinpusher/gui/src/assets/audio/coinDispenser.mp3" type="audio/mp3">
    </audio> -->
    <!-- <SlotMachine /> -->
    <!-- <WheelOfChance /> -->
    <TokenScore />
    <div class="grid blur">
      <div>
        <h3> Time Left: {{ gameStore.getTimeLeft }}</h3>
        <div>Player: {{ getUser.player }}</div>
        <div>Total Tickets: {{ getUser.tickets }} </div>
        <div>Chips: {{ getUser.chips }}</div>
      </div>
      <div>
        <div v-for="obj in getUniqueMessages" :key="obj.created_at" class="text-grey text-small"
          :class="{ 'text-red': obj.type === 'error', 'text-orange': obj.type === 'warning' }">
          {{ obj.message }}
          <!-- [{{ obj.count }}] - {{ obj.data.message }} -->
        </div>
      </div>

    </div>
  </main>
</template>
<style>
.home-container {
  display: inline-block;
  /* change the default display type to inline-block */
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #25378a;

}

.home-container img {
  transition: all .2s ease;
  vertical-align: middle;
  width: 100%;
  height: 100%;
  /* aspect-ratio: 1.25; */
  overflow: hidden;
  position: absolute;
}

.layer-drop-shadow {
  filter: drop-shadow(-2px 1px 1px #070707);
  animation: layerEffect 3s infinite alternate;
}


@keyframes layerEffect {
  from {
    filter: drop-shadow(-2px 1px 1px #070707);
  }

  to {
    filter: drop-shadow(2px 1px 1px #616161);
  }
}
</style>