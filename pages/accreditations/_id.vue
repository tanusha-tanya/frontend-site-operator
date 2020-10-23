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
    <v-card v-if="!!item && item.status.id !== 'accepted'" outlined>
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
          <v-list-item-title class="headline mt-2 mb-1">
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
      <v-list-item class="mt-4">
        <div style="width: 100%">
          <div
            v-ripple="!showAgreement"
            class="accreditation-card elevation-3"
            :class="{ 'accreditation-card--pointer': !showAgreement }"
            @click="showAgreement = true"
          >
            <div class="accreditation-card__title text-h5">
              Соглашение с оператором торгов
            </div>
            <slide-up-down :active="showAgreement" :duration="500">
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas bibendum mattis nisi, vel convallis turpis maximus sit
                amet. Proin vitae ipsum ante. Ut efficitur tortor vel mi
                pharetra, sed elementum nibh congue. Nulla et tincidunt turpis,
                a vulputate erat. Sed a viverra urna, non cursus purus.
                Suspendisse consectetur id felis sit amet eleifend. Donec
                accumsan ac neque et interdum. Curabitur lobortis tristique
                ultricies. Nam id rhoncus enim.
              </div>
            </slide-up-down>
            <div class="accreditation-card__info mt-8">
              <div class="accreditation-card__status">Подписано</div>
              <v-slide-y-transition>
                <div
                  v-if="showAgreement"
                  class="accreditation-card__close"
                  @click.stop="showAgreement = false"
                >
                  Скрыть полный текст
                </div>
              </v-slide-y-transition>
              <!--              <v-btn color="success">Подписать Электронной подписью</v-btn>-->
            </div>
          </div>
          <div
            v-ripple="!showRpn"
            class="accreditation-card elevation-3 mt-8"
            :class="{ 'accreditation-card--pointer': !showRpn }"
            @click="showRpn = true"
          >
            <div class="accreditation-card__title text-h5">
              Подтверждение отсутствия в РПН
            </div>
            <slide-up-down :active="showRpn" :duration="500">
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas bibendum mattis nisi, vel convallis turpis maximus sit
                amet. Proin vitae ipsum ante. Ut efficitur tortor vel mi
                pharetra, sed elementum nibh congue. Nulla et tincidunt turpis,
                a vulputate erat. Sed a viverra urna, non cursus purus.
                Suspendisse consectetur id felis sit amet eleifend. Donec
                accumsan ac neque et interdum. Curabitur lobortis tristique
                ultricies. Nam id rhoncus enim.
              </div>
            </slide-up-down>
            <div class="accreditation-card__info mt-8">
              <div class="accreditation-card__status">Подписано</div>
              <v-slide-y-transition>
                <div
                  v-if="showRpn"
                  class="accreditation-card__close"
                  @click.stop="showRpn = false"
                >
                  Скрыть полный текст
                </div>
              </v-slide-y-transition>
              <!--              <v-btn color="success">Подписать Электронной подписью</v-btn>-->
            </div>
          </div>
        </div>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="mt-4">
          <div>Аккредитовать как:</div>
          <div class="checkbox-container mt-2">
            <v-checkbox
              v-model="item.provider_accreditation"
              class="mt-0"
              label="Поставщик"
              hide-details
              :disabled="true"
            ></v-checkbox>
          </div>
          <div class="checkbox-container mt-2">
            <v-checkbox
              v-model="item.customer_accreditation"
              class="mt-0"
              label="Поставщик"
              hide-details
              :disabled="true"
            ></v-checkbox>
          </div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="mt-4">
          <div>Юридическое лицо</div>
          <div v-if="company" class="company-name mt-2">{{ company.name }}</div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content style="margin-right: 10px">
          <div>Документы</div>
          <file
            v-for="file of item.documents"
            :key="file.file.type"
            :label="getFilesLabel(file.file.type)"
            :name="file.file.name"
            :url="file.file.url"
            :readonly="item.status.id !== 'moderated'"
            :accreditation-file="file.file.accepted"
            @clickAccreditation="accreditationFile(file.file)"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="mb-8">
        <v-btn
          v-if="!isLoadedArchive"
          ref="buttonLoadArchive"
          color="primary"
          :href="archiveLink"
          :disabled="loadingArchive"
          :download="`Заявка на аккредитацию №${this.$route.params.id}`"
          @click="downloadArchive"
        >
          <v-icon left dark>mdi-download</v-icon>
          Скачать документы
        </v-btn>
        <v-btn
          v-show="isLoadedArchive"
          ref="buttonLoadArchive"
          color="primary"
          :href="archiveLink"
          :download="`Заявка на аккредитацию №${this.$route.params.id}`"
        >
          <v-icon left dark>mdi-download</v-icon>
          Скачать документы
        </v-btn>
        <v-progress-circular
          v-if="loadingArchive"
          class="ml-2"
          indeterminate
          :size="30"
          :width="2"
          color="primary"
        ></v-progress-circular>
      </v-list-item>
      <v-list-item v-if="item.status.id === 'revision'" class="mb-8">
        <div>
          <div>Коментарий:</div>
          <div>
            {{ item.comment }}
          </div>
        </div>
      </v-list-item>
      <template v-if="item.status.id === 'moderated'">
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-card-actions style="align-items: flex-start">
              <v-btn
                color="primary"
                :disabled="isDisabledAcceptButton"
                @click="setApprove"
                >Подтвердить</v-btn
              >
              <div class="ml-4" style="max-width: 400px; width: 100%">
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
        company: null,
        alertSuccess: false,
        alertError: false,
        isLoadedArchive: false,
        loadingArchive: false,
        filesSampleRequired: null,
        archiveLink: '',
        showAgreement: false,
        showRpn: false,
        textRejection: '',
      }
    },
    computed: {
      isDisabledAcceptButton() {
        if (this.item && this.item.documents) {
          return this.item.documents
            .map((doc) => doc.file.accepted)
            .includes(false)
        }
        return false
      },
    },
    validate({ params }) {
      return /^\d+$/.test(params.id)
    },
    created() {
      this.startGlobalPreloader()
      this.getAccreditationSampleRequiredFiles()
        .then((response) => {
          this.filesSampleRequired = response.data
          this.getAccreditationItem(this.$route.params.id)
            .then((response) => {
              this.item = response.data
              this.getRegisteredCompany(this.item.entity_id)
                .then((response) => {
                  this.company = response.data
                })
                .catch((e) => {
                  console.log(e)
                })
              if (this.item.status.id === 'accepted') {
                this.setAccreditationStatus(this.$route.params.id, 'moderated')
                  .then((response) => {
                    this.item.status = response.data.status
                    this.stopGlobalPreloader()
                  })
                  .catch((e) => {
                    console.log(e)
                    this.stopGlobalPreloader()
                  })
              } else {
                this.stopGlobalPreloader()
              }
            })
            .catch((error) => {
              this.item = null
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
        })
        .catch((e) => {
          console.log(e)
        })
    },
    methods: {
      ...mapActions(['startGlobalPreloader', 'stopGlobalPreloader']),
      accreditationFile(file) {
        this.startGlobalPreloader()
        if (file.accepted) {
          this.declineAccreditationsFile(this.$route.params.id, file.type)
            .then(() => {
              file.accepted = false
              this.stopGlobalPreloader()
            })
            .catch((e) => {
              console.log(e)
              this.stopGlobalPreloader()
            })
        } else {
          this.acceptAccreditationsFile(this.$route.params.id, file.type)
            .then(() => {
              file.accepted = true
              this.stopGlobalPreloader()
            })
            .catch((e) => {
              console.log(e)
              this.stopGlobalPreloader()
            })
        }
      },
      getFilesLabel(type) {
        for (const key in this.filesSampleRequired) {
          if (this.filesSampleRequired[key].id === type) {
            return this.filesSampleRequired[key].value
          }
        }
        return type
      },
      downloadArchive() {
        this.loadingArchive = true
        this.getAccreditationFilesZipArchive(this.$route.params.id)
          .then((response) => {
            const objectUrl = window.URL.createObjectURL(response)

            this.loadingArchive = false
            this.isLoadedArchive = true

            console.log(this.$refs.buttonLoadArchive)

            this.archiveLink = objectUrl

            setTimeout(() => {
              this.$refs.buttonLoadArchive.$el.click()
              this.loadingArchive = false
              this.isLoadedArchive = true
            }, 1000)
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
        this.setAccreditationStatus(
          this.$route.params.id,
          'revision',
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
    flex-shrink: 0;
    padding-left: 12px;
    font-weight: bold;
    &--moderated {
      color: $colorTurquoiseHover;
    }
    &--closed {
      color: $colorGreen;
    }
    &--inaccurate {
      color: $colorRed;
    }
  }
  .accreditation-card {
    transition: 0.3s background-color;
    padding: 20px;
    max-width: 800px;
    width: 100%;
    background-color: #fff;
    &--pointer {
      cursor: pointer;
      &:hover {
        background-color: #f8fbff;
      }
    }
    &__info {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &__close {
      transition: 0.3s;
      cursor: pointer;
      text-decoration: underline;
      &:hover {
        color: #00b8d4;
      }
    }
  }
  .checkbox-container {
    .v-input--checkbox {
      display: inline-flex;
    }
  }
  .company-name {
    color: #a7a7a7;
  }
</style>
