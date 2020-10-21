<template>
  <div>
    <v-row>
      <v-col>
        <span class="text-h4">Список заявок на аккредитацию</span>
      </v-col>
    </v-row>
    <v-card
      v-for="item of items"
      :key="item.id"
      :disabled="item.status.id !== 'accepted'"
      class="mb-3"
      outlined
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1">
            <nuxt-link class="card-link" :to="'/accreditations/' + item.id">
              Заявка на аккредитацию №{{ item.id }}
            </nuxt-link>
          </v-list-item-title>
          <v-list-item-subtitle>
            от {{ formatDate(item.created_at) }}
          </v-list-item-subtitle>
          <v-list-item-subtitle class="mt-3">
            <v-icon>mdi-paperclip</v-icon>Соглашение с оператором торгов
          </v-list-item-subtitle>
          <v-list-item-subtitle class="mt-1">
            <v-icon>mdi-paperclip</v-icon>Подтверждение отсутствия в РНП
          </v-list-item-subtitle>
        </v-list-item-content>
        <div :class="['v-card-status', 'v-card-status--' + item.status.id]">
          {{ item.status.value }}
        </div>
      </v-list-item>
    </v-card>
    <v-pagination
      v-if="totalPages"
      v-model="currentPage"
      :length="totalPages"
      class="mb-3"
      @input="update"
    ></v-pagination>
    <wereProblems />
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import api from '../../plugins/mixins/api'
  import formatDate from '../../plugins/mixins/formatDate'
  import wereProblems from '~/components/staticBlocks/wereProblems'

  export default {
    name: 'Accreditation',
    components: {
      wereProblems,
    },
    mixins: [api, formatDate],
    data() {
      return {
        currentPage: 1,
        perPage: 14,
        totalPages: 0,
        items: null,
      }
    },
    created() {
      this.startGlobalPreloader()
      this.getAccreditationList(this.currentPage)
        .then((response) => {
          this.items = response.data.items
          this.totalPages = Math.ceil(response.data.total / this.perPage)
          this.stopGlobalPreloader()
        })
        .catch((error) => {
          this.items = []
          this.stopGlobalPreloader()
          if (error.response.status === 404 || error.response.status === 400) {
            return this.$nuxt.error({
              statusCode: 404,
            })
          } else {
            console.log(error.response.status)
          }
        })
    },
    methods: {
      ...mapActions(['startGlobalPreloader', 'stopGlobalPreloader']),
      update(pagination) {
        this.startGlobalPreloader()
        this.currentPage = pagination
        this.getAccreditationList(this.currentPage)
          .then((response) => {
            this.items = response.data.items
            this.totalPages = Math.ceil(response.data.total / this.perPage)
            this.stopGlobalPreloader()
          })
          .catch((error) => {
            this.items = []
            this.stopGlobalPreloader()
            if (
              error.response.status === 404 ||
              error.response.status === 400
            ) {
              return this.$nuxt.error({
                statusCode: 404,
              })
            } else {
              console.log(error.response.status)
            }
          })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .v-card-status {
    align-self: flex-start;
    flex-shrink: 0;
    padding: 12px 0 0 12px;
    font-weight: bold;
    &--accepted {
      color: $colorTurquoiseHover;
    }
    &--inaccurate {
      color: $colorRed;
    }
    &--closed {
      color: $colorGreen;
    }
  }
  .card-link {
    color: #000;
    text-decoration: none;
    &:hover {
      color: #0097a7;
    }
  }
</style>
