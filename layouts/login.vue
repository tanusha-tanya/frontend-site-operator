<template>
  <v-app>
    <v-main>
      <div id="particles"></div>
      <v-scroll-y-transition>
        <v-container v-if="showForm" class="login-form" align="center" fluid>
          <v-scroll-x-reverse-transition mode="out-in">
            <nuxt />
          </v-scroll-x-reverse-transition>
        </v-container>
      </v-scroll-y-transition>
    </v-main>
  </v-app>
</template>

<script>
  import particles from '../plugins/mixins/particles'
  export default {
    mixins: [particles],
    data() {
      return {
        clipped: false,
        drawer: false,
        fixed: false,
        items: [
          {
            icon: 'mdi-apps',
            title: 'Welcome',
            to: '/',
          },
          {
            icon: 'mdi-chart-bubble',
            title: 'Inspire',
            to: '/inspire',
          },
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Vuetify.js',
        showForm: false,
      }
    },
    mounted() {
      setTimeout(() => {
        this.startParticles()
      }, 500)
      setTimeout(() => {
        this.showForm = true
      }, 1000)
    },
  }
</script>

<style lang="scss" scoped>
  .login-form {
    height: 100%;
    display: flex;
    align-items: center;
  }
  #particles {
    position: absolute;
    width: 100%;
    height: 100%;
    user-select: none;
  }
</style>
