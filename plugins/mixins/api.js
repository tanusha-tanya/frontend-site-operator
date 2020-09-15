export default {
  methods: {
    getAccreditationList($page = undefined) {
      return this.$axios.$get(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/accreditation`,
        {
          params: {
            page: $page === undefined ? 1 : $page,
          },
        },
      )
    },
    getAccreditationTotal() {
      return this.$axios.$get(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/accreditation/total/`,
      )
    },
    getAccreditation($id) {
      return this.$axios.$get(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/accreditation/items/{$id}`,
      )
    },
  },
}
