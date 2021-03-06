export default {
  methods: {
    getAccreditationList(props = {}) {
      const defaultProps = {
        orderBy: 'id',
        orderDir: 'DESC',
        page: 1,
        filterString: '',
      }

      const requestProps = Object.assign(defaultProps, props)

      console.log(props)

      const fData = new FormData()
      fData.append('page', requestProps.page)
      fData.append('order[by]', requestProps.orderBy)
      fData.append('order[direction]', requestProps.orderDir)
      if (requestProps.filterString !== '')
        fData.append('q', requestProps.filterString)

      return this.$axios.$post(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/accreditation/list/`,
        fData,
      )
    },
    fetchCompanysByIds(ids) {
      return this.$axios.$get(
        `${this.$store.state.env.API_URL_AUTH_SERVICE}/companies`,
        {
          params: {
            ids: ids.join(','),
          },
        },
      )
    },
    getAccreditationFilesZipArchive(id) {
      return this.$axios.$get(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/accreditation/${id}/files/`,
        {
          responseType: 'blob',
        },
      )
    },
    getAccreditationItem(id) {
      return this.$axios.$get(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/accreditation/${id}/`,
      )
    },
    getAccreditationSampleRequiredFiles() {
      return this.$axios.$get(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/accreditation/files/`,
      )
    },
    setAccreditationStatus(id, status = null, comment = null) {
      return this.$axios.$patch(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/accreditation/${id}/`,
        {
          status,
          comment,
        },
      )
    },
    acceptAccreditationsFile(id, document) {
      return this.$axios.$post(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/accreditation/${id}/document/accepted/${document}/`,
      )
    },
    declineAccreditationsFile(id, document) {
      return this.$axios.$delete(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/accreditation/${id}/document/accepted/${document}/`,
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
    setCatalogPositionStatus(id, status = null, text_rejection = null) {
      return this.$axios.$post(
        `${this.$store.state.env.API_URL_OPERATOR_SERVICE}/api/products/${id}/`,
        {
          status,
          text_rejection,
        },
      )
    },
    getRegisteredCompany(id) {
      return this.$axios.$get(
        `${this.$store.state.env.API_URL_AUTH_SERVICE}/companies/${id}`,
      )
    },
  },
}
