<template>
  <div class="timeline">
    <div class="items">
      <span
        v-for="(state, key) in states"
        v-show="!(state.hideIfNotActive === true && activeKey !== key)"
        :key="key"
        class="step"
      >
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span class="circle" v-on="on"
              ><v-icon>{{
                state.icon
                  ? state.icon
                  : activeKey >= key
                  ? 'mdi-checkbox-marked-circle'
                  : 'mdi-checkbox-blank-circle-outline'
              }}</v-icon>
            </span>
          </template>
          <span>{{ state.title }}</span>
        </v-tooltip>
      </span>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'TimeLine',
    props: {
      status: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        states: [
          { title: 'Принята', id: 'accepted' },
          {
            title: 'Возвращена на доработку',
            id: 'revision',
            icon: 'mdi-close-circle',
            hideIfNotActive: true,
          },
          { title: 'Прошла модерацию', id: 'moderated' },
          { title: 'Одобрена', id: 'closed' },
        ],
        activeKey: 0,
      }
    },
    mounted() {
      if (this.status) {
        this.states.forEach((state, key) => {
          if (this.states[key].id === this.status) {
            this.activeKey = parseInt(key)
            return false
          }
        })
      }
    },
  }
</script>
<style lang="scss" scoped>
  .timeline {
    margin-top: 20px;
  }
  .timeline:before {
    content: ' ';
    border-top: 1px solid $colorGray;
    width: 100%;
    display: block;
  }
  .timeline .items {
    display: flex;
    justify-content: space-between;
  }
  .timeline .step {
    width: 20px;
    height: 20px;
    position: relative;
  }
  .timeline .step .circle {
    content: ' ';
    display: block;
    position: absolute;
    bottom: 10px;
  }
  .timeline .step .circle i {
    color: $colorGreen;
    font-size: 20px;
    background: #fff;
  }
  .timeline .step .circle i.mdi-close-circle {
    color: $colorRed;
  }
</style>
