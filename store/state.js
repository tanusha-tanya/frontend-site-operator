const state = () => ({
  env: {
    API_URL_AUTH_SERVICE: process.env.API_URL_AUTH_SERVICE,
    API_URL_OPERATOR_SERVICE: process.env.API_URL_OPERATOR_SERVICE,
  },
  showloader: false,
})

export default state
