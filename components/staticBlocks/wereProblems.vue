<template>
  <div
    class="wereProblems"
    :class="{ 'wereProblems--authorization': authorization }"
  >
    <v-row>
      <v-col>
        <div class="wereProblems__title"><b>Техническая поддержка</b></div>
        <div class="mt-2">Свяжитесь с нами по телефону:</div>
        <div>
          +7 999 333 - 22 - 11 (круглосуточно)<br />
          <b>или</b><br />
          <a class="wereProblems__link" href="#">Заполни заявку</a> - менеджер
          ответит в течение 30 минут
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'WereProblems',
    props: {
      authorization: {
        default: false,
        type: Boolean,
      },
    },
  }
</script>

<style lang="scss" scoped>
  .wereProblems {
    background-color: #f5f5f5;
    margin: 10px -12px;
    margin-bottom: -5px;
    padding: 0 12px;
    &--authorization {
      color: #fff;
      line-height: 1.4;
      font-size: 14px;
      background-color: #00b8d4;
      margin: 10px -30px;
      margin-bottom: -30px;
      padding: 5px 30px;
      .wereProblems__title {
        font-size: 16px;
      }
      .wereProblems__link {
        color: #fff;
      }
    }
    b {
      font-weight: 500;
    }
  }
</style>
