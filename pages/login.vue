<template>
  <v-row align="center" justify="center">
    <div class="authorization">
      <div class="authorization__logo">
        <div class="text-h4 text-center pb-1 pt-1">Авторизация</div>
        <img src="/logo/Logo.svg" alt="" />
      </div>
      <ValidationObserver ref="observer">
        <form ref="form" class="authorization__form">
          <ValidationProvider v-slot="{ errors }" name="Логин" rules="required">
            <v-text-field
              ref="emailInput"
              v-model="login"
              :error-messages="errors"
              type="text"
              label="E-mail"
              required
              readonly
              @focus="
                () => {
                  const input = $refs.emailInput.$el.querySelector('input')
                  input.removeAttribute('readonly')
                }
              "
            ></v-text-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            name="Пароль"
            rules="required"
          >
            <v-text-field
              ref="pass"
              v-model="password"
              :error-messages="errors"
              type="password"
              label="Пароль"
              required
            ></v-text-field>
          </ValidationProvider>
          <v-row>
            <v-col>
              <v-checkbox
                v-model="rememberMe"
                class="mt-0 pt-0"
                label="Запомнить меня"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn color="success" class="mr-4" @click="authorization">
                Войти
              </v-btn>
            </v-col>
          </v-row>
        </form>
      </ValidationObserver>
      <wereProblems authorization />
    </div>
  </v-row>
</template>

<script>
  import { mapActions } from 'vuex'

  import {
    setInteractionMode,
    ValidationObserver,
    ValidationProvider,
    extend,
  } from 'vee-validate'
  import { required, email } from 'vee-validate/dist/rules'
  import wereProblems from '~/components/staticBlocks/wereProblems'

  setInteractionMode('eager')

  extend('required', required)
  extend('email', email)

  export default {
    components: {
      ValidationObserver,
      ValidationProvider,
      wereProblems,
    },
    layout: 'login',
    data() {
      return {
        rememberMe: false,
        login: 'test@test.ru',
        password: '1234567',
      }
    },
    validations: {
      login: { required },
      password: { required },
    },
    methods: {
      ...mapActions(['startGlobalPreloader', 'stopGlobalPreloader']),
      authorization() {
        const validPromise = this.$refs.observer.validate()
        validPromise.then((valid) => {
          this.fetchTokenAndUser()
        })
      },
      fetchTokenAndUser() {
        this.startGlobalPreloader()
        this.$auth
          .loginWith('local', {
            data: {
              login: this.login,
              password: this.password,
            },
          })
          .then((data) => {
            this.stopGlobalPreloader()
            const user = data.data.data.user
            const token = data.data.data.token
            this.$auth.setToken('local', `Bearer ${token}`)
            if (!this.rememberMe) {
              localStorage.setItem('auth._token.local', '')
            }
            this.$auth.setUser(user)
          })
          .catch((response) => {
            this.stopGlobalPreloader()
            if (
              response &&
              response.message === 'Request failed with status code 401'
            ) {
              this.$toast.error('Введен неверный логин или пароль', {
                position: 'top-right',
                timeout: 5000,
                closeOnClick: true,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
                draggable: true,
                draggablePercent: 0.6,
                showCloseButtonOnHover: false,
                hideProgressBar: false,
                closeButton: 'button',
                icon: true,
                rtl: false,
              })
            }
          })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .authorization {
    max-width: 500px;
    width: 100%;
    padding: 30px;
    backdrop-filter: blur(3px);
    background-color: rgba(255, 255, 255, 0.36);
    box-shadow: 0 0 22px #0000000a;
    position: relative;
    z-index: 2;
    &__form {
      width: 100%;
    }
    &__logo {
      display: flex;
      align-items: center;
      justify-content: space-between;
      img {
        width: 130px;
      }
    }
  }
</style>
