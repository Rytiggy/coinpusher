<script setup lang="ts">
/*
JavaScript only required for spin interaction, not for rendering the component.
*/

function wheelOfFortune(selector: string) {
  const node = document.querySelector(selector);
  if (!node) return;

  const spin = node.querySelector('button');
  const wheel = node.querySelector('ul');
  let animation: Animation;
  let previousEndDegree = 0;
  if (!wheel || !spin)
    return
  spin.addEventListener('click', () => {
    if (animation) {
      animation.cancel(); // Reset the animation if it already exists
    }

    const randomAdditionalDegrees = Math.random() * 360 + 1800;
    const newEndDegree = previousEndDegree + randomAdditionalDegrees;

    animation = wheel.animate([
      { transform: `rotate(${previousEndDegree}deg)` },
      { transform: `rotate(${newEndDegree}deg)` }
    ], {
      duration: 4000,
      direction: 'normal',
      easing: 'cubic-bezier(0.440, -0.205, 0.000, 1.130)',
      fill: 'forwards',
      iterations: 1
    });

    previousEndDegree = newEndDegree;
  });
}

// Usage


</script>
<template>

  <fieldset class="ui-wheel-of-fortune">
    <ul>
      <li>$1000</li>
      <li>$2000</li>
      <li>$3000</li>
      <li>$4000</li>
      <li>$5000</li>
      <li>$6000</li>
      <li>$7000</li>
      <li>$8000</li>
      <li>$9000</li>
      <li>$10000</li>
      <li>$11000</li>
      <li>$12000</li>
    </ul>
    <button type="button" @click="wheelOfFortune('.ui-wheel-of-fortune');">SPIN</button>
  </fieldset>

</template>

<style scoped>
:where(.ui-wheel-of-fortune) {
  --_items: 12;
  all: unset;
  aspect-ratio: 1 / 1;
  container-type: inline-size;
  direction: ltr;
  display: grid;
  position: relative;
  width: 100%;

  &::after {
    aspect-ratio: 1/cos(30deg);
    background-color: crimson;
    clip-path: polygon(50% 100%, 100% 0, 0 0);
    content: "";
    height: 4cqi;
    position: absolute;
    place-self: start center;
    scale: 1.4;
  }

  &>* {
    position: absolute;
  }

  button {
    aspect-ratio: 1 / 1;
    background: hsla(0, 0%, 100%, .8);
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    font-size: 5cqi;
    place-self: center;
    width: 20cqi;
  }

  ul {
    all: unset;
    clip-path: inset(0 0 0 0 round 50%);
    display: grid;
    inset: 0;
    place-content: center start;

    li {
      align-content: center;
      aspect-ratio: 1 / calc(2 * tan(180deg / var(--_items)));
      background: hsl(calc(360deg / var(--_items) * calc(var(--_idx))), 100%, 75%);
      clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
      display: grid;
      font-size: 5cqi;
      grid-area: 1 / -1;
      padding-left: 1ch;
      rotate: calc(360deg / var(--_items) * calc(var(--_idx) - 1));
      transform-origin: center right;
      user-select: none;
      width: 50cqi;

      &:nth-of-type(1) {
        --_idx: 1;
      }

      &:nth-of-type(2) {
        --_idx: 2;
      }

      &:nth-of-type(3) {
        --_idx: 3;
      }

      &:nth-of-type(4) {
        --_idx: 4;
      }

      &:nth-of-type(5) {
        --_idx: 5;
      }

      &:nth-of-type(6) {
        --_idx: 6;
      }

      &:nth-of-type(7) {
        --_idx: 7;
      }

      &:nth-of-type(8) {
        --_idx: 8;
      }

      &:nth-of-type(9) {
        --_idx: 9;
      }

      &:nth-of-type(10) {
        --_idx: 10;
      }

      &:nth-of-type(11) {
        --_idx: 11;
      }

      &:nth-of-type(12) {
        --_idx: 12;
      }
    }
  }
}

/* for demo */
* {
  box-sizing: border-box;
}

body {
  font-family: system-ui, sans-serif;
  padding: 5cqi;
}
</style>
