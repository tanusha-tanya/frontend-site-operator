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
          {{ item.status.value }}
        </div>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <div>Документы</div>
          <file
            v-for="file of item.documents"
            :key="file.file.type"
            :name="file.file.name"
            :url="file.file.url"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <a v-if="!isLoadedArchive && !loadingArchive" @click="downloadArchive">
          Скачать документы
        </a>
        <a v-show="isLoadedArchive" ref="buttonLoadArchive">
          Скачать документы
        </a>
        <v-progress-circular
          v-if="loadingArchive"
          indeterminate
          :size="12"
          :width="2"
          color="primary"
        ></v-progress-circular>
      </v-list-item>
      <template v-if="item.status.id === 'accepted'">
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
  import file from '../../components/blocks/file'

  export default {
    name: 'AccreditationItem',
    components: {
      file,
    },
    mixins: [api, formatDate],
    data() {
      return {
        item: null,
        alertSuccess: false,
        alertError: false,
        isLoadedArchive: false,
        loadingArchive: false,
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
      downloadArchive() {
        this.loadingArchive = true
        this.getAccreditationFilesZipArchive(this.$route.params.id)
          .then((response) => {
            const objectUrl = window.URL.createObjectURL(response)

            this.loadingArchive = false
            this.isLoadedArchive = true

            console.log(this.$refs.buttonLoadArchive)

            this.$refs.buttonLoadArchive.setAttribute('href', objectUrl)
            this.$refs.buttonLoadArchive.setAttribute(
              'download',
              `Заявка на аккредитацию №${this.$route.params.id}`,
            )
            this.$refs.buttonLoadArchive.click()
          })
          .catch((e) => {
            this.loadingArchive = false
            console.log(e)
          })
      },
      setApprove() {
        this.startGlobalPreloader()
        this.setAccreditationStatus(this.$route.params.id, 'closed')
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
        this.setAccreditationStatus(this.$route.params.id, 'inaccurate')
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
    &--accepted {
      color: $colorTurquoiseHover;
    }
    &--closed {
      color: $colorGreen;
    }
    &--inaccurate {
      color: $colorRed;
    }
  }
</style>
