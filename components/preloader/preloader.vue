<template>
  <v-scroll-y-transition>
    <div v-if="$store.state.showloader" class="preloader">
      <div class="preloader__body">
        <img src="/logo/Logo.svg" alt="" />
        <v-progress-circular
          indeterminate
          class="preloader__spinner"
          size="80"
          width="8"
          color="#27b6c4"
        ></v-progress-circular>
        <div><b>Пожалуйста подождите</b></div>
      </div>
    </div>
  </v-scroll-y-transition>
</template>

<script>
  export default {
    name: 'Preloader',
  }
</script>

<style lang="scss" scoped>
  .preloader {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.83);
    z-index: 999;
    &__spinner {
      opacity: 0.2;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -69%);
    }
    &__body {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      img {
        position: relative;
        z-index: 2;
      }
    }
  }
</style>
