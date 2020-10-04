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
    getCatalogPositionList(page = undefined) {
      return this.$axios.$get(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/catalog_position`,
        {
          params: {
            page: page === undefined ? 1 : page,
          },
        },
      )
    },
    getCatalogPositionTotal() {
      return this.$axios.$get(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/catalog_position/total/`,
      )
    },
    getCatalogPositionItem(id) {
      return this.$axios.$get(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/catalog_position/${id}/`,
      )
    },
    setCatalogPositionStatus(id, status = 'uc') {
      return this.$axios.$patch(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/catalog_position/${id}/`,
        {
          status,
        },
      )
    },
    getRegisteredCompany(id) {
      id = 2 // todo remove
      return this.$axios.$get(
        `${this.$store.state.env.API_URL_AUTH_SERVICE}/data/companies/${id}`,
      )
    },
  },
}
