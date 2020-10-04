<template>
  <div>
    <v-alert
      :value="alertSuccess"
      type="success"
      transition="scroll-y-transition"
    >
      Новый статус сохранён
    </v-alert>
    <v-alert :value="alertError" type="error" transition="scroll-y-transition">
      Ошибка: новый статус не сохранён
    </v-alert>
    <v-card v-if="!!item && !!company" outlined>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1">
            Заявка на пополнение каталога №{{ item.id }}
          </v-list-item-title>
          <v-list-item-subtitle>
            от {{ formatDate(item.created_at) }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <div :class="['v-card-status', 'v-card-status--' + item.status.id]">
          {{ item.status.name }}
        </div>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="mt-3">
            {{ item.title }}
          </v-list-item-title>
          <v-list-item-subtitle class="mt-3 mb-3">
            {{ item.text_preview }}
          </v-list-item-subtitle>
          <div v-for="(feature, index) of item.features" :key="feature.name">
            <v-divider v-if="index"></v-divider>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title v-html="feature.name"></v-list-item-title>
                <v-list-item-subtitle
                  v-html="feature.value"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content>
          <div>Юридическое лицо</div>
          <v-list-item-subtitle
            v-if="!!company"
            v-html="company.name"
          ></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content>
          <div>Документы</div>
          <div
            v-for="file of item.images"
            :key="file.url"
            class="file-container"
          >
            <v-icon>mdi-file</v-icon>
            <a :href="file.url" v-html="file.name"></a>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" icon v-bind="attrs" v-on="on">
                  <v-icon color="grey lighten-1">
                    mdi-information-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>Всплывающая подсказка</span>
            </v-tooltip>
          </div>
        </v-list-item-content>
      </v-list-item>
      <template v-if="item.status.id === 'uc'">
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-card-actions>
              <v-btn color="primary" @click="setApprove">Подтвердить</v-btn>
              <v-btn color="error" @click="setError">Отклонить</v-btn>
            </v-card-actions>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-card>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  import formatDate from '../../plugins/mixins/formatDate'

  import api from '../../plugins/mixins/api'

  export default {
    name: 'CatalogPositionItem',
    mixins: [api, formatDate],
    data() {
      return {
        item: null,
        company: null,
        alertSuccess: false,
        alertError: false,
      }
    },
    validate({ params }) {
      return /^\d+$/.test(params.id)
    },
    created() {
      this.startGlobalPreloader()
      this.getCatalogPositionItem(this.$route.params.id)
        .then((response) => {
          this.item = response.data
          this.getRegisteredCompany(this.item.company_id)
            .then((response) => {
              this.company = response.data
              this.stopGlobalPreloader()
            })
            .catch((error) => {
              this.company = null
              console.log(error.response.status)
              this.stopGlobalPreloader()
            })
        })
        .catch((error) => {
          this.item = null
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
      setApprove() {
        this.startGlobalPreloader()
        this.setCatalogPositionStatus(this.$route.params.id, 'c')
          .then((response) => {
            if (response.success === true) {
              this.item = response.data
              this.alertSuccess = true
              this.alertError = false
            } else {
              this.alertSuccess = false
              this.alertError = true
            }
            this.stopGlobalPreloader()
          })
          .catch((error) => {
            this.alertSuccess = false
            this.alertError = true
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
      setError() {
        this.startGlobalPreloader()
        this.setCatalogPositionStatus(this.$route.params.id, 'e')
          .then((response) => {
            if (response.success === true) {
              this.item = response.data
              this.alertSuccess = true
              this.alertError = false
            } else {
              this.alertSuccess = false
              this.alertError = true
            }
            this.stopGlobalPreloader()
          })
          .catch((error) => {
            this.alertSuccess = false
            this.alertError = true
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
    &--uc {
      color: #0097a7;
    }
    &--e {
      color: #d50000;
    }
  }
  .file-container {
    display: flex;
    margin: 15px 0;
    + .file-container {
      margin-top: 0;
    }
    .v-icon.mdi-file {
      margin: 4px 9px 4px 0;
    }
    a {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    &__file-min {
      flex: none;
    }
    &__name {
      display: flex;
      align-items: center;
      margin-left: 15px;
    }
    &__label {
      color: #a7a7a7;
      &--active {
        color: #000;
      }
    }
    .error--text ~ .file-container__label {
      color: #d50000;
    }
  }
</style>
