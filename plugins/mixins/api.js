export default {
  methods: {
    getAccreditationList(page = undefined) {
      return this.$axios.$get(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/accreditation`,
        {
          params: {
            page: page === undefined ? 1 : page,
          },
        },
      )
    },
    getAccreditationTotal() {
      return this.$axios.$get(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/accreditation/total/`,
      )
    },
    getAccreditationItem(id) {
      return this.$axios.$get(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/accreditation/${id}/`,
      )
    },
    setAccreditationStatus(id, status = 'uc') {
      return this.$axios.$patch(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/accreditation/${id}/`,
        {
          status,
        },
      )
    },
  },
}
