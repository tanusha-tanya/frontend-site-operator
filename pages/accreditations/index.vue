<template>
  <div>
    <v-card
      v-for="item of items"
      :key="item.id"
      :disabled="item.status.id === 'c'"
      class="mb-3"
      :href="'/accreditations/' + item.id"
      outlined
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1">
            Заявка на аккредитацию
          </v-list-item-title>
          <v-list-item-subtitle>
            от {{ item.created_at }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <div :class="['v-card-status', 'v-card-status--' + item.status.id]">
          {{ item.status.name }}
        </div>
      </v-list-item>
    </v-card>
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      @input="update"
    ></v-pagination>
  </div>
</template>

<script>
  import api from '../../plugins/mixins/api'

  export default {
    name: 'Accreditation',
    mixins: [api],
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
      color: var(--v-error-base);
    }
  }
</style>
