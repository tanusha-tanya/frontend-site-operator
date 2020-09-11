<template>
  <v-row align="center" justify="center">
    <div class="authorization">
      <div class="authorization__logo">
        <div class="text-h4 text-center pb-1 pt-1">Авторизация</div>
        <img src="/logo/Logo.svg" alt="" />
      </div>
      <ValidationObserver ref="observer">
        <form ref="form" class="authorization__form">
          <ValidationProvider
            v-slot="{ errors }"
            name="Логин"
            rules="required|email"
          >
            <v-text-field
              ref="email"
              v-model="login"
              :error-messages="errors"
              type="text"
              label="Логин"
              required
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
              <v-btn color="success" class="mr-4" @click="submit">Войти</v-btn>
            </v-col>
          </v-row>
        </form>
      </ValidationObserver>
    </div>
  </v-row>
</template>

<script>
  import {
    setInteractionMode,
    ValidationObserver,
    ValidationProvider,
    extend,
  } from 'vee-validate'
  import { required, email } from 'vee-validate/dist/rules'

  setInteractionMode('eager')

  extend('required', required)
  extend('email', email)

  export default {
    components: {
      ValidationObserver,
      ValidationProvider,
    },
    layout: 'login',
    data() {
      return {
        login: '',
        password: '',
      }
    },
    validations: {
      login: { required },
      password: { required },
    },
    methods: {
      submit() {
        this.$refs.observer.validate()
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
