<template>
  <v-app light>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-tooltip right :disabled="!miniVariant">
          <template v-slot:activator="{ on }">
            <v-list-item v-on="on" @click.stop="miniVariant = !miniVariant">
              <v-list-item-action class="icon-menu-item">
                <v-icon>
                  mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}
                </v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="'Свернуть меню'" />
              </v-list-item-content>
            </v-list-item>
          </template>
          <span>Развернуть меню</span>
        </v-tooltip>
        <v-tooltip
          v-for="(item, i) in items"
          :key="i"
          right
          :disabled="!miniVariant"
        >
          <template v-slot:activator="{ on }">
            <v-list-item
              :to="item.to"
              router
              exact
              :class="
                isRouteActive(item.to) ? 'highlighted v-list-item--active' : ''
              "
              v-on="on"
            >
              <v-list-item-action class="icon-menu-item">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
          </template>
          <span>{{ item.title }}</span>
        </v-tooltip>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!--      <v-btn icon @click.stop="clipped = !clipped">-->
      <!--        <v-icon>mdi-application</v-icon>-->
      <!--      </v-btn>-->
      <!--      <v-btn icon @click.stop="fixed = !fixed">-->
      <!--        <v-icon>mdi-minus</v-icon>-->
      <!--      </v-btn>-->
      <div>
        <v-select
          v-if="roles.length > 1"
          v-model="role"
          :items="roles"
          item-text="label"
          item-value="value"
          hide-details
        >
        </v-select>
        <v-toolbar-title v-else v-text="roles[0].label" />
      </div>
      <v-spacer />
      <!--      <v-btn icon @click.stop="rightDrawer = !rightDrawer">-->
      <!--        <v-icon>mdi-menu</v-icon>-->
      <!--      </v-btn>-->
      <v-btn text @click="logout">
        <v-icon>mdi-exit-to-app</v-icon>
        Выход
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <preloader />
  </v-app>
</template>

<script>
  import preloader from '../components/preloader/preloader'

  export default {
    name: 'LayoutsDefault',
    components: {
      preloader,
    },
    data() {
      return {
        role: {
          label: 'Панель заказчика',
          value: 'customer',
        },
        roles: [
          {
            label: 'Панель оператора',
            value: 'operator',
          },
        ],
        clipped: false,
        drawer: true,
        fixed: false,
        items: [
          {
            icon: 'mdi-home',
            title: 'Главная',
            to: '/',
          },
          {
            icon: 'mdi-account-multiple-check',
            title: 'Заявки на аккредитацию',
            to: '/accreditations',
          },
          {
            icon: 'mdi-table-large-plus ',
            title: 'Заявки на пополнение каталога',
            to: '/catalog-positions',
          },
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Панель заказчика',
      }
    },
    methods: {
      logout() {
        this.$auth.logout()
      },
      isRouteActive(path) {
        return (
          (path === '/' && path === this.$route.path) ||
          (path !== '/' && this.$route.path.includes(path))
        )
      },
    },
  }
</script>

<style lang="scss" scoped>
  .icon-menu-item {
    margin-right: 13px;
  }
</style>
