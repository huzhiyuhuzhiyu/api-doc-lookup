export default {
  data(){
    return {
      loadingTotal: 0,
      loading: false,
    }
  },
  methods:{
    addLoading() {
      this.loadingTotal ++
      this.loading = true
    },
    subLoading() {
      this.loadingTotal --
      if (this.loadingTotal === 0) return this.loading = false
    }
  },
}
