<template>
  <div>
    <v-row>
      <v-col>
        <span class="text-h4">Список заявок на пополнение каталога</span>
      </v-col>
    </v-row>
    <v-card
      v-for="item of items"
      :key="item.id"
      :disabled="item.status.id !== 'new'"
      class="mb-3"
      outlined
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1">
            <nuxt-link class="card-link" :to="'/catalog-positions/' + item.id">
              Заявка на пополнение каталога №{{ item.id }}
            </nuxt-link>
          </v-list-item-title>
          <v-list-item-title>
            от {{ formatDate(item.created_at) }}
          </v-list-item-title>
          <v-list-item-content class="mt-3">
            <v-list-item-subtitle>Марка</v-list-item-subtitle>
            <v-list-item-title v-html="item.mark"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-content>
            <v-list-item-subtitle>Маркоразмер</v-list-item-subtitle>
            <v-list-item-title v-html="item.mark_size"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-content>
            <v-list-item-subtitle>
              Номинальное напряжение
            </v-list-item-subtitle>
            <v-list-item-title
              v-html="item.mark_size_voltage"
            ></v-list-item-title>
          </v-list-item-content>
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
    name: 'CatalogPositions',
    components: {
      wereProblems,
    },
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
      this.startGlobalPreloader()
      this.getCatalogPositionList(this.currentPage)
        .then((response) => {
          this.items = response.data
          this.stopGlobalPreloader()
        })
        .catch((error) => {
          this.items = []
          console.log(error)
        })
      this.getCatalogPositionTotal()
        .then((response) => {
          this.totalPages = Math.ceil(response.data.total / this.perPage)
        })
        .catch((error) => {
          this.totalPages = 0
          console.log(error)
        })
    },
    methods: {
      ...mapActions(['startGlobalPreloader', 'stopGlobalPreloader']),
      update(pagination) {
        this.startGlobalPreloader()
        this.currentPage = pagination
        this.getCatalogPositionList(this.currentPage)
          .then((response) => {
            this.items = response.data
            this.stopGlobalPreloader()
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
    align-self: flex-start;
    flex-shrink: 0;
    padding: 12px 0 0 12px;
    font-weight: bold;
    &--new {
      color: $colorTurquoiseHover;
    }
    &--rejected {
      color: $colorRed;
    }
    &--approved {
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
