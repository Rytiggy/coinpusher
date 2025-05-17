<script setup>
import { useGameStore } from '@/stores/useGameStore';
import { ref, computed } from 'vue';

const gameStore = useGameStore()



const items = computed(() => {
  const data = [
    {
      size: "",
      value: 5,
      active: false
    },
    {
      size: "medium",
      value: 10,
      active: false
    },
    {
      size: "small",
      value: 5,
      active: false
    },
    {
      size: "large",
      value: 20,
      active: false
    },
    {
      size: "small",
      value: 5,
      active: false
    },
    {
      size: "medium",
      value: 10,
      active: true
    },
    {
      size: "",
      value: 5,
      active: false

    }
  ]
  return data.map(item => {
    item.active = false
    const index = data.indexOf(item)
    console.log(item, index, gameStore.activeBonusToken)

    if (index === gameStore.activeBonusToken) {
      item.active = true
    }
    return item
  })
})


</script>

<template>
  <div class="flex justify-content-center">
    <h1 class="text-fun"> Bonus Tokens</h1>
  </div>
  <div class="flex justify-content-center align-bottom gap-3">

    <div v-for="item in items" :key="item.value + item.size">
      <div :class="`bonusCircle ${item.size} ${item.active ? 'active' : ''}`">
        <h1 class="text-center">{{ item.value }}</h1>

      </div>
    </div>
    <div>
    </div>


  </div>
  <!-- <div class="arc"></div> -->

</template>
<style scoped>
.bonusCircle {
  border-radius: 50%;
  height: 75px;
  width: 75px;
  backdrop-filter: blur(0px);
  border: 5px solid rgb(85, 187, 255);
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(81, 81, 81);
  font-size: 25px;
  background: rgba(255, 255, 255, 0.392);

}

.large {
  height: 100px;
  width: 100px;
  margin-bottom: 5em
}

.medium {
  margin-bottom: 2.5em
}

.small {
  margin-bottom: 4em
}

.active {
  background: rgb(93, 255, 85);
  border: 5px solid white;
  color: rgb(255, 255, 255);

}

.arc {
  --b: 41px;
  /* the boder thickness */
  --a: 120deg;
  /* control the progression */
  width: 100%;
  rotate: 300deg;
  aspect-ratio: 1;
  padding: var(--b);
  border-radius: 50%;
  background: #c0d860;
  --_g: /var(--b) var(--b) no-repeat radial-gradient(50% 50%, #000 97%, #0000);
  mask: top var(--_g),
    calc(50% + 50%*sin(var(--a))) calc(50% - 50%*cos(var(--a))) var(--_g),
    linear-gradient(#0000 0 0) content-box intersect,
    conic-gradient(#000 var(--a), #0000 0);
}
</style>