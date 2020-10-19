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
          <v-row>
            <v-col>
              <v-btn
                color="success"
                text
                class="mr-4"
                nuxt
                to="/catalog-positions"
              >
                <v-icon left>mdi-arrow-left</v-icon>Вернуться к заявкам
              </v-btn>
            </v-col>
          </v-row>
          <v-list-item-title class="headline mb-1">
            Заявка на добавление позиции в каталог №{{ item.id }}
          </v-list-item-title>
          <v-list-item-subtitle>
            от {{ formatDate(item.created_at) }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <div :class="['v-card-status', 'v-card-status--' + item.status.id]">
          {{ item.status.value }}
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
          <div>
            <v-divider></v-divider>
            <v-list-item-content>
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
            v-for="file of item.documents.certificate"
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
      <template v-if="item.status.id === 'new'">
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-card-actions style="align-items: flex-start">
              <v-btn
                color="primary"
                style="margin-right: 15px"
                @click="setApprove"
              >
                Одобрить
              </v-btn>
              <div style="max-width: 400px; width: 100%">
                <v-btn
                  color="error"
                  :disabled="!textRejection"
                  @click="setError"
                >
                  Отклонить
                </v-btn>
                <v-textarea
                  v-model="textRejection"
                  class="mt-2"
                  outlined
                  label="Причина отклонения"
                  required
                ></v-textarea>
              </div>
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
        textRejection: '',
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
        this.setCatalogPositionStatus(this.$route.params.id, 'approved')
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
        this.setCatalogPositionStatus(
          this.$route.params.id,
          'rejected',
          this.textRejection,
        )
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
