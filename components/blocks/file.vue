<template>
  <div class="file-container">
    <v-icon>mdi-file</v-icon>
    <a :href="url">{{ name }}</a>
    <v-tooltip right>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" icon v-bind="attrs" v-on="on">
          <v-icon color="grey lighten-1"> mdi-information-outline </v-icon>
        </v-btn>
      </template>
      <span>Всплывающая подсказка</span>
    </v-tooltip>
  </div>
</template>

<script>
  export default {
    name: 'File',
    props: {
      name: {
        default: '',
        type: String,
      },
      url: {
        default: '',
        type: String,
      },
    },
  }
</script>

<style lang="scss" scoped>
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
