<template>
  <div>
    <v-row>
      <v-col>
        <span class="text-h4">Список заявок на аккредитацию</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col></v-col>
      <v-col sm="2">
        <v-select
          v-model="orderDir"
          :items="orderDirectionList"
          item-text="name"
          item-value="id"
          label="Сортировать"
          @input="setQueryValue"
        ></v-select>
      </v-col>
      <v-col sm="3">
        <div class="search">
          <v-text-field
            v-model="searchString"
            v-mask="`############`"
            label="Введите номер заявки"
            @input="setQueryValue"
          >
          </v-text-field>
        </div>
      </v-col>
    </v-row>
    <template>
      <div v-show="!loading" v-if="items.length">
        <v-card v-for="item of items" :key="item.id" class="mb-3" outlined>
          <v-list-item>
            <v-list-item-content>
              <time-line :status="item.status.id"></time-line>
              <v-list-item-title
                class="mb-1 d-inline-flex justify-space-between"
              >
                <div>
                  <nuxt-link
                    class="card-link font-weight-bold"
                    :to="'/accreditations/' + item.id"
                  >
                    Заявка на аккредитацию № {{ item.id }}
                  </nuxt-link>
                  <div
                    :class="[
                      'v-card-status',
                      'v-card-status--' + item.status.id,
                    ]"
                  >
                    {{ item.status.value }}
                  </div>
                </div>
                <span> от {{ formatDate(item.created_at) }} </span>
              </v-list-item-title>
              <div class="d-inline-flex justify-space-between">
                <div>
                  <v-list-item-subtitle class="mt-3">
                    <v-icon>mdi-paperclip</v-icon>Соглашение с оператором торгов
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="mt-1">
                    <v-icon>mdi-paperclip</v-icon>Подтверждение отсутствия в РНП
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-if="item.comment" class="mt-3">
                    <span class="font-weight-bold">Комментарий оператора:</span
                    ><br />
                    {{ item.comment }}
                  </v-list-item-subtitle>
                </div>
                <div>
                  <v-list-item-subtitle
                    v-if="item.company || companiesLoading"
                    class="mt-3"
                  >
                    <span class="font-weight-bold">Название компании:</span
                    ><br />
                    <span v-if="item.company">{{ item.company.name }}</span>
                    <v-progress-circular
                      v-else
                      indeterminate
                      :size="12"
                      :width="2"
                      color="primary"
                    ></v-progress-circular>
                  </v-list-item-subtitle>
                </div>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-card>
        <v-pagination
          v-if="totalPages"
          v-model="currentPage"
          class="mb-3"
          :length="totalPages"
          @input="loadItems()"
        ></v-pagination>
      </div>
      <div v-if="!items.length && !loading">Заявки не найдены</div>
      <localPreloader v-if="loading" />
    </template>
    <wereProblems />
  </div>
</template>

<script>
  import _ from 'lodash'
  import api from '../../plugins/mixins/api'
  import formatDate from '../../plugins/mixins/formatDate'
  import wereProblems from '~/components/staticBlocks/wereProblems'
  import localPreloader from '~/components/preloader/preloader'
  import timeLine from '~/components/common/timeLine'

  export default {
    name: 'Accreditation',
    components: {
      timeLine,
      wereProblems,
      localPreloader,
    },
    mixins: [api, formatDate],
    data() {
      return {
        loading: false,
        companiesLoading: false,
        currentPage: 1,
        perPage: 20,
        totalPages: 0,
        items: [],
        companies: [],
        searchString: '',
        orderDir: 'DESC',
        orderDirectionList: [
          {
            id: 'DESC',
            name: 'По убыванию',
          },
          {
            id: 'ASC',
            name: 'По возрастанию',
          },
        ],
      }
    },
    created() {
      this.loadItems()
    },
    methods: {
      loadItems(resetCurrentPage = false) {
        this.loading = true

        if (resetCurrentPage) {
          console.log('reset current page')
          console.log(resetCurrentPage)
          this.currentPage = 1
        }

        const requestProps = {
          orderDir: this.orderDir,
          page: this.currentPage,
          filterString: this.searchString,
        }
        this.getAccreditationList(requestProps)
          .then((response) => {
            const items = []
            response.data.items.forEach((item) => {
              item.company = null
              items.push(item)
            })
            this.items = items

            this.loadCompanies().then(() => {
              this.items.forEach((item, key) => {
                if (typeof this.companies[item.entity_id] !== 'undefined') {
                  this.items[key].company = this.companies[item.entity_id]
                }
              })
            })

            this.totalPages = Math.ceil(response.data.total / this.perPage)
            this.loading = false
          })
          .catch((error) => {
            this.items = []
            console.log(error)
            this.loading = false
          })
      },
      async loadCompanies() {
        const updateIds = []
        this.items.forEach((item) => {
          if (
            typeof this.companies[item.entity_id] === 'undefined' &&
            !updateIds.includes(item.entity_id)
          ) {
            this.companies[item.entity_id] = null
            updateIds.push(item.entity_id)
          }
        })

        if (updateIds.length > 0) {
          this.companiesLoading = true
          await this.fetchCompanysByIds(updateIds).then((response) => {
            this.companiesLoading = false
            response.data.forEach((item) => {
              this.companies[item.id] = item
            })
          })
        }
      },
      setQueryValue: _.debounce(function () {
        this.loadItems(true)
      }, 500),
    },
  }
</script>

<style lang="scss" scoped>
  .v-card-status {
    flex-shrink: 0;
    padding-left: 12px;
    &--moderation {
      color: $colorTurquoiseHover;
    }
    &--closed {
      color: $colorGreen;
    }
    //&--inaccurate {
    // color: $colorRed;
    //}
    &--revision {
      color: $colorRed;
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
