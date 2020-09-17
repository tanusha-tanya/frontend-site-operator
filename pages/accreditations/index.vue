<template>
  <div>
    <v-row>
      <v-col>
        <span class="text-h4">Список заявок</span>
      </v-col>
    </v-row>
    <v-card
      v-for="item of items"
      :key="item.id"
      :disabled="item.status.id !== 'uc'"
      class="mb-3"
      outlined
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1">
            <nuxt-link class="card-link" :to="'/accreditations/' + item.id">
              Заявка на аккредитацию № {{ item.id }}
            </nuxt-link>
          </v-list-item-title>
          <v-list-item-subtitle>
            от {{ formatDate(item.created_at) }}
          </v-list-item-subtitle>
          <v-list-item-subtitle class="mt-3">
            <v-icon>mdi-paperclip</v-icon>o соглашение с оператором торгов
          </v-list-item-subtitle>
          <v-list-item-subtitle class="mt-1">
            <v-icon>mdi-paperclip</v-icon>o подтверждение отсутствия в РНП
          </v-list-item-subtitle>
        </v-list-item-content>
        <div :class="['v-card-status', 'v-card-status--' + item.status.id]">
          {{ item.status.name }}
        </div>
      </v-list-item>
    </v-card>
    <v-pagination
      v-if="totalPages"
      v-model="currentPage"
      :length="totalPages"
      @input="update"
    ></v-pagination>
  </div>
</template>

<script>
  import api from '../../plugins/mixins/api'
  import formatDate from '../../plugins/mixins/formatDate'

  export default {
    name: 'Accreditation',
    mixins: [api, formatDate],
    data() {
      return {
        currentPage: 1,
        perPage: 20,
        totalPages: 0,
        items: null,
      }
    },
    created() {
      this.getAccreditationList(this.currentPage)
        .then((response) => {
          console.log(response.data)
          this.items = response.data
        })
        .catch((error) => {
          this.items = []
          console.log(error)
        })
      this.getAccreditationTotal()
        .then((response) => {
          this.totalPages = Math.ceil(response.data.total / this.perPage)
        })
        .catch((error) => {
          this.totalPages = 0
          console.log(error)
        })
    },
    methods: {
      update(pagination) {
        this.currentPage = pagination
        this.getAccreditationList(this.currentPage)
          .then((response) => {
            console.log(response.data)
            this.items = response.data
          })
          .catch((error) => {
            this.items = []
            console.log(error)
          })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .v-card-status {
    flex-shrink: 0;
    padding-left: 12px;
    &--e {
      color: #d50000;
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
