<template>
  <div>
    <router-view></router-view>
    <FooterGuide v-show="$route.meta.isShow"></FooterGuide>
  </div>
</template>

<script>
import FooterGuide from './components/FooterGuide/FooterGuide'
import {mapActions} from 'vuex'
export default {
  mounted () {
    // this.$store.dispatch('getAddress')等同于有mapActions的写法
    // this.$store.dispatch('getUserInfo')
    this.getAddress()
    this.getUserInfo()
  },
  methods: {
    ...mapActions(['getAddress', 'getUserInfo'])
  },
  components: {
    FooterGuide
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
