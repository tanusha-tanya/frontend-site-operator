import moment from 'moment'
export default {
  methods: {
    formatDate(string) {
      return moment(string).format('DD.MM.YYYY, H:mm')
    },
  },
}
