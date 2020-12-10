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
          <template v-if="item.text_rejection">
            <v-list-item-title class="mt-3">
              Причина отклонения
            </v-list-item-title>
            <v-list-item-subtitle class="mt-3 mb-3">
              {{ item.text_rejection }}
            </v-list-item-subtitle>
          </template>
          <div>
            <v-divider></v-divider>
            <v-row class="flex-wrap">
              <v-col cols="12" xs="12" md="6">
                <v-list-item>
                  <v-list-item-subtitle class="block-dotted"
                    ><span>Марка</span></v-list-item-subtitle
                  >
                  <v-list-item-title v-html="item.mark"></v-list-item-title>
                </v-list-item>
              </v-col>
              <v-col cols="12" xs="12" md="6">
                <v-list-item>
                  <v-list-item-subtitle class="block-dotted"
                    ><span>Маркоразмер</span></v-list-item-subtitle
                  >
                  <v-list-item-title
                    v-html="item.mark_size"
                  ></v-list-item-title>
                </v-list-item>
              </v-col>
              <v-col v-if="item.mark_size_voltage" cols="12" xs="12" md="6">
                <v-list-item>
                  <v-list-item-subtitle class="block-dotted"
                    ><span> Номинальное напряжение</span>
                  </v-list-item-subtitle>
                  <v-list-item-title
                    v-html="item.mark_size_voltage"
                  ></v-list-item-title>
                </v-list-item>
              </v-col>
              <v-col v-if="item.property_cable_type" cols="12" xs="12" md="6">
                <v-list-item>
                  <v-list-item-subtitle class="block-dotted"
                    ><span>Тип кабеля</span></v-list-item-subtitle
                  >
                  <v-list-item-title
                    v-html="item.property_cable_type"
                  ></v-list-item-title>
                </v-list-item>
              </v-col>
              <v-col v-if="item.property_veins_type" cols="12" xs="12" md="6">
                <v-list-item>
                  <v-list-item-subtitle class="block-dotted"
                    ><span>Тип жил</span></v-list-item-subtitle
                  >
                  <v-list-item-title
                    v-html="item.property_veins_type"
                  ></v-list-item-title>
                </v-list-item>
              </v-col>
              <v-col v-if="item.property_veins_count" cols="12" xs="12" md="6">
                <v-list-item>
                  <v-list-item-subtitle class="block-dotted"
                    ><span>Количество жил</span></v-list-item-subtitle
                  >
                  <v-list-item-title
                    v-html="item.property_veins_count"
                  ></v-list-item-title>
                </v-list-item>
              </v-col>
              <v-col v-if="item.property_section" cols="12" xs="12" md="6">
                <v-list-item>
                  <v-list-item-subtitle class="block-dotted"
                    ><span>Сечение</span></v-list-item-subtitle
                  >
                  <v-list-item-title
                    v-html="item.property_section"
                  ></v-list-item-title>
                </v-list-item>
              </v-col>
              <v-col v-if="item.property_use" cols="12" xs="12" md="6">
                <v-list-item>
                  <v-list-item-subtitle class="block-dotted"
                    ><span>Применение</span></v-list-item-subtitle
                  >
                  <v-list-item-title
                    v-html="item.property_use"
                  ></v-list-item-title>
                </v-list-item>
              </v-col>
              <v-col
                v-if="item.property_voltage_allowable"
                cols="12"
                xs="12"
                md="6"
              >
                <v-list-item>
                  <v-list-item-subtitle class="block-dotted"
                    ><span>Допустимое напряжение</span></v-list-item-subtitle
                  >
                  <v-list-item-title
                    v-html="item.property_voltage_allowable"
                  ></v-list-item-title>
                </v-list-item>
              </v-col>
              <v-col v-if="item.property_power" cols="12" xs="12" md="6">
                <v-list-item>
                  <v-list-item-subtitle class="block-dotted"
                    ><span>Мощность</span></v-list-item-subtitle
                  >
                  <v-list-item-title
                    v-html="item.property_power"
                  ></v-list-item-title>
                </v-list-item>
              </v-col>
              <v-col v-if="item.property_execution" cols="12" xs="12" md="6">
                <v-list-item>
                  <v-list-item-subtitle class="block-dotted"
                    ><span>Исполнение</span></v-list-item-subtitle
                  >
                  <v-list-item-title
                    v-html="item.property_execution"
                  ></v-list-item-title>
                </v-list-item>
              </v-col>
              <v-col v-if="item.property_caliber" cols="12" xs="12" md="6">
                <v-list-item>
                  <v-list-item-subtitle class="block-dotted"
                    ><span>Калибр</span></v-list-item-subtitle
                  >
                  <v-list-item-title
                    v-html="item.property_caliber"
                  ></v-list-item-title>
                </v-list-item>
              </v-col>
              <v-col v-if="item.property_fiber_count" cols="12" xs="12" md="6">
                <v-list-item>
                  <v-list-item-subtitle class="block-dotted"
                    ><span>Количеств волокон</span></v-list-item-subtitle
                  >
                  <v-list-item-title
                    v-html="item.property_fiber_count"
                  ></v-list-item-title>
                </v-list-item>
              </v-col>
              <v-col
                v-if="item.property_material_shell"
                cols="12"
                xs="12"
                md="6"
              >
                <v-list-item>
                  <v-list-item-subtitle class="block-dotted"
                    ><span>Материал оболочки</span></v-list-item-subtitle
                  >
                  <v-list-item-title
                    v-html="item.property_material_shell"
                  ></v-list-item-title>
                </v-list-item>
              </v-col>
              <v-col
                v-if="item.property_laying_conditions"
                cols="12"
                xs="12"
                md="6"
              >
                <v-list-item>
                  <v-list-item-subtitle class="block-dotted"
                    ><span>Условия прокладки</span></v-list-item-subtitle
                  >
                  <v-list-item-title
                    v-html="item.property_laying_conditions"
                  ></v-list-item-title>
                </v-list-item>
              </v-col>
              <v-col v-if="item.property_isolation" cols="12" xs="12" md="6">
                <v-list-item>
                  <v-list-item-subtitle class="block-dotted"
                    ><span>Изоляция</span></v-list-item-subtitle
                  >
                  <v-list-item-title
                    v-html="item.property_isolation"
                  ></v-list-item-title>
                </v-list-item>
              </v-col>
            </v-row>
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
          <file
            v-for="file of item.documents.certificates"
            :key="file.url"
            label="Сертификат"
            :name="file.name"
            :url="file.url"
          />
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
                Согласовать
              </v-btn>
              <div style="max-width: 400px; width: 100%">
                <v-form ref="form" v-model="valid">
                  <v-btn color="error" :disabled="!valid" @click="setError">
                    Отклонить
                  </v-btn>
                  <v-textarea
                    v-model="textRejection"
                    class="mt-2"
                    outlined
                    label="Причина отклонения"
                    required
                    :counter="1000"
                    :rules="textAreaRules"
                  ></v-textarea>
                </v-form>
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
    name: 'CatalogPositionItem',
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
        textRejection: '',
        valid: false,
        textAreaRules: [
          (v) =>
            v.length <= 1000 || 'Комментарий должен быть менее 1000 символов',
          (v) => !!v || 'Комментарий обязателен',
        ],
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
  .block-dotted {
    border-bottom: 1px dotted;
    overflow: unset;
    span {
      position: relative;
      bottom: -2px;
      padding-bottom: 1px;
      background: #fff;
    }
  }
</style>
