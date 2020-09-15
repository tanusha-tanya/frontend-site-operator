<template>
  <div>
    <v-card outlined>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1">
            Заявка на аккредитацию
          </v-list-item-title>
          <v-list-item-subtitle>
            от {{ item.created_at }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <div :class="['v-card-status', 'v-card-status--' + item.status.id]">
          {{ item.status.name }}
        </div>
      </v-list-item>
      <v-list-item>
        <v-btn :href="item.charter.url" text>{{ item.charter.name }}</v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn :href="item.decision.url" text>{{ item.decision.name }}</v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn :href="item.order.url" text>{{ item.order.name }}</v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn :href="item.reg_cert.url" text>{{ item.reg_cert.name }}</v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn :href="item.accounting_cert.url" text>
          {{ item.accounting_cert.name }}
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn :href="item.egru.url" text>{{ item.egru.name }}</v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn :href="item.smp.url" text>{{ item.smp.name }}</v-btn>
      </v-list-item>
      <v-card-actions>
        <v-btn text>Button</v-btn>
        <v-btn text>Button</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  import api from '../../plugins/mixins/api'

  export default {
    name: 'AccreditationItem',
    mixins: [api],
    data() {
      return {
        item: [],
      }
    },
    validate({ params }) {
      return /^\d+$/.test(params.id)
    },
    created() {
      this.getAccreditationItem(this.$route.params.id)
        .then((response) => {
          this.item = response.data
          console.log(this.item)
        })
        .catch((error) => {
          this.item = []
          console.log(error)
        })
    },
  }
</script>

<style lang="scss" scoped>
  .v-card-status {
    flex-shrink: 0;
    padding-left: 12px;
    &--e {
      color: var(--v-error-base);
    }
  }
</style>
