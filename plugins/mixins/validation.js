export default {
  methods: {
    textValidation(value) {
      return !!value
    },
    emailValidation(value) {
      const pattern = /^[0-9a-zA-z]([.-]?\w+)*@[0-9a-z]([.-]?[0-9a-zA-z])*(\.[0-9a-zA-z]{2,4})+$/
      if (value) {
        if (value.search(pattern) === 0) {
          return true
        }
      }
      return false
    },
    phoneValidation(value) {
      return !!value
    },
  },
}
