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
    <v-card v-if="!!item" outlined>
      <v-list-item>
        <v-list-item-content>
          <v-row>
            <v-col>
              <v-btn
                color="success"
                text
                class="mr-4"
                nuxt
                to="/accreditations"
              >
                <v-icon left>mdi-arrow-left</v-icon>Вернуться к заявкам
              </v-btn>
            </v-col>
          </v-row>
          <v-list-item-title class="headline mb-1">
            Заявка на аккредитацию №{{ item.id }}
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
          <div>Документы</div>
          <v-list-item-subtitle>
            <ul>
              <li>
                <a :href="item.charter.url">{{ item.charter.name }}</a>
              </li>
              <li>
                <a :href="item.decision.url">{{ item.decision.name }}</a>
              </li>
              <li>
                <a :href="item.order.url">{{ item.order.name }}</a>
              </li>
              <li>
                <a :href="item.reg_cert.url">{{ item.reg_cert.name }}</a>
              </li>
              <li>
                <a :href="item.accounting_cert.url">
                  {{ item.accounting_cert.name }}
                </a>
              </li>
              <li>
                <a :href="item.egru.url">{{ item.egru.name }}</a>
              </li>
              <li>
                <a :href="item.smp.url">{{ item.smp.name }}</a>
              </li>
            </ul>
          </v-list-item-subtitle>
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
    name: 'AccreditationItem',
    mixins: [api, formatDate],
    data() {
      return {
        item: null,
        alertSuccess: false,
        alertError: false,
      }
    },
    validate({ params }) {
      return /^\d+$/.test(params.id)
    },
    created() {
      this.startGlobalPreloader()
      this.getAccreditationItem(this.$route.params.id)
        .then((response) => {
          this.item = response.data
          this.stopGlobalPreloader()
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
        this.setAccreditationStatus(this.$route.params.id, 'c')
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
        this.setAccreditationStatus(this.$route.params.id, 'e')
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
    flex-shrink: 0;
    padding-left: 12px;
    font-weight: bold;
    &--uc {
      color: #0097a7;
    }
    &--e {
      color: #d50000;
    }
  }
</style>
