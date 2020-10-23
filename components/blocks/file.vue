<template>
  <div class="file-container">
    <v-icon>mdi-file</v-icon>
    <span class="file-container__label">{{ label }}</span>
    <v-tooltip right>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" icon v-bind="attrs" v-on="on">
          <v-icon color="grey lighten-1"> mdi-information-outline </v-icon>
        </v-btn>
      </template>
      <span>Всплывающая подсказка</span>
    </v-tooltip>
    <div class="file-container__link-container">
      <a class="file-container__link" :href="url" target="_blank" download>
        {{ name }}
      </a>
    </div>
    <v-btn color="primary" icon :href="url" target="_blank">
      <v-icon color="grey lighten-1"> mdi-eye </v-icon>
    </v-btn>
    <div
      v-if="accreditationFile !== null"
      class="file-container__indicator"
      :class="{
        'file-container__indicator--done': accreditationFile,
      }"
      @click="!readonly ? $emit('clickAccreditation') : null"
    >
      <v-icon v-if="accreditationFile" medium dark> mdi-check </v-icon>
    </div>
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
      label: {
        default: '',
        type: String,
      },
      accreditationFile: {
        default: null,
        type: [Boolean, Object],
      },
      readonly: {
        default: false,
        type: Boolean,
      },
    },
  }
</script>

<style lang="scss" scoped>
  .file-container {
    display: flex;
    margin: 15px 0;
    align-items: center;
    &:hover {
      background-color: #f5ffff;
    }
    + .file-container {
      margin-top: 0;
    }
    .v-icon.mdi-file {
      margin: 4px 9px 4px 0;
    }
    &__link-container {
      flex: auto;
    }
    &__link {
      display: inline-flex;
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
    &__indicator {
      transition: 0.3s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      margin-left: 15px;
      cursor: pointer;
      border: 1px solid #a7a7a7;
      box-shadow: 0 0 0 0 #a7a7a7;
      flex: none;
      &:hover {
        box-shadow: 0 0 2px 1px $colorTurquoiseHover;
        border-color: $colorTurquoiseHover;
      }
      &--done {
        border-color: $colorTurquoise;
        background-color: $colorTurquoise;
      }
    }
  }
</style>
