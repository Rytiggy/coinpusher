<template>
  <div class="slot-machine">
    <!-- Each reel spins and displays a candy -->
    <div class="reel" v-for="(reelIndex, index) in reels" :key="index">
      <!-- The wrapper animates the spinning effect -->
      <div class="reel-wrapper">
        <img v-for="(candy, idx) in [reelIndex]" :src="candyImages[candy]" :alt="'Candy ' + idx" :key="idx"
          class="candy" />
      </div>
    </div>
    <button @click="spin" :disabled="isSpinning">Spin</button>
    <h4 v-if="didWin">Win</h4>
  </div>
</template>
<script lang="ts">
import { computed, ref } from 'vue';
import candy1 from '@/assets/candy1.png';
import candy2 from '@/assets/candy2.png';
import candy3 from '@/assets/candy3.png';
import candy4 from '@/assets/candy4.png';

export default {
  setup() {
    // Static array of candy images
    const candyImages: string[] = [candy1, candy2, candy3, candy4];

    // Each reel initially shows the first candy (index 0)
    const reels = ref<number[]>([0, 0, 0]);

    // Control the spinning state to disable the button
    const isSpinning = ref<boolean>(false);

    const didWin = computed(() => {
      console.log("reels", reels.value)
      if (isSpinning.value === false)
        return reels.value.every((val, i, arr) => val === arr[0])
      return false
    })
    // Helper function to get a random candy index
    const getRandomCandyIndex = (): number => {
      return Math.floor(Math.random() * candyImages.length);
    };

    // Function to spin the reels
    const spin = (): void => {
      isSpinning.value = true;
      const totalSpinDuration = 3000; // Total spin duration (in milliseconds)

      // Spin each reel with a random interval and stop at a random candy
      reels.value.forEach((_, reelIndex) => {
        spinReel(reelIndex, totalSpinDuration);
      });

      // Re-enable the spin button after all reels stop
      setTimeout(() => {
        isSpinning.value = false;
      }, totalSpinDuration + 500); // Extra time to ensure all reels have stopped
    };


    // Spin a specific reel
    const spinReel = (reelIndex: number, totalDuration: number): void => {
      const reelSpinInterval = setInterval(() => {
        // Randomly set the candy for the reel during spinning
        reels.value[reelIndex] = getRandomCandyIndex();
      }, 100); // Spin fast by updating every 100ms

      // Stop the reel after a random duration
      setTimeout(() => {
        clearInterval(reelSpinInterval); // Stop the interval
        reels.value[reelIndex] = getRandomCandyIndex(); // Set final candy on the reel
      }, Math.random() * totalDuration); // Stop at a random time within the total duration
    };

    return {
      reels,
      isSpinning,
      candyImages,
      spin,
      didWin
    };
  },
};
</script>
<style scoped>
.slot-machine {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  /* Reels side by side */
}

.reel {
  width: 100px;
  height: 400px;
  /* Make reels taller */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  border: 2px solid #000;
  position: relative;
}

.reel-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: transform 1s ease-in-out;
}

.candy {
  width: 80px;
  height: auto;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1.2em;
  cursor: pointer;
}
</style>
