export default {
  methods: {
    getAccreditationList(page = undefined) {
      const fData = new FormData()

      fData.append('page', page)
      fData.append('order[by]', 'id')
      fData.append('order[direction]', 'ASC')

      return this.$axios.$post(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/accreditation/list/`,
        fData,
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
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/products`,
        {
          params: {
            page: page === undefined ? 1 : page,
          },
        },
      )
    },
    getCatalogPositionTotal() {
      return this.$axios.$get(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/products/total/`,
      )
    },
    getCatalogPositionItem(id) {
      return this.$axios.$get(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/products/${id}/`,
      )
    },
    setCatalogPositionStatus(id, status = 'uc', text_rejection = null) {
      return this.$axios.$post(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/products/${id}/`,
        {
          status,
          text_rejection,
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
