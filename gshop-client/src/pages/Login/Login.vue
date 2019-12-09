<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on: loginWay}" @click="loginWay = true">短信登录</a>
          <a href="javascript:;" :class="{on: !loginWay}" @click="loginWay = false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form @submit.prevent="login">
          <div :class="{on: loginWay}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <button :disabled="!rightPhone" class="get_verification" :class="{right_phone: rightPhone}" @click.prevent="getCode">
                {{computedTime > 0? `已发送(${computedTime}s)`:'获取验证码'}}</button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on: !loginWay}">
            <section>
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input type="text" maxlength="8" placeholder="密码" v-model="pwd" v-if="showPwd">
                <input type="password" maxlength="8" placeholder="密码" v-model="pwd" v-else>
                <div class="switch_button" :class="showPwd? 'on':'off'" @click="showPwd = !showPwd">
                  <div class="switch_circle" :class="{right: showPwd}"></div>
                  <span class="switch_text">{{showPwd? 'abc':'...'}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img ref="captcha" class="get_verification" src="http://localhost:4000/captcha" alt="captcha" @click="getCaptcha">
              </section>
            </section>
          </div>
          <button class="login_submit">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>
    <AlertTip :alert-text="alertText" v-show="alertShow" @closeTip="closeTip"></AlertTip>
  </section>
</template>

<script>
import AlertTip from '../../components/AlertTip/AlertTip'
import {reqLogin, reqSmsCode, reqCode} from '../../api'

export default {
  data () {
    return {
      loginWay: true, // true代表短信登录,false代表密码登录
      phone: '',
      pwd: '',
      showPwd: false,
      computedTime: 0,
      name: '',
      code: '',
      captcha: '',
      alertText: '',
      alertShow: false
    }
  },

  computed: {
    rightPhone () {
      return /^1\d{10}$/.test(this.phone)
    }
  },

  methods: {
    showAlert (alertText) {
      this.alertShow = true
      this.alertText = alertText
    },
    async getCode () {
      if (this.computedTime <= 0) {
        // 启动倒计时
        this.computedTime = 30
        this.IntervalId = setInterval(() => {
          this.computedTime--
          if (!this.computedTime) {
            clearInterval(this.IntervalId)
          }
        }, 1000)
        // 发送ajax请求
        const result = await reqCode(this.phone)
        if (result.code === 1) {
          // 发送短信失败
          this.showAlert(result.msg)
          // 重置时间
          if (this.computedTime) {
            this.computedTime = 0
            clearInterval(this.IntervalId)
            this.IntervalId = null
          }
        }
      }
    },
    async login () {
      let result
      if (this.loginWay) {
        // 短信登录
        // eslint-disable-next-line
        const {rightPhone, phone, code} = this
        if (!rightPhone) {
          // 必须输入正确的手机号
          this.showAlert('必须输入正确的手机号')
          return
        } else if (!/^\d{6}$/.test(code)) {
          // 验证码必须是6位数字
          this.showAlert('验证码必须是6位数字')
          return
        }
        result = await reqSmsCode(phone, code)
      } else {
        // 密码登录
        const {name, pwd, captcha} = this
        if (!name) {
          // 必须指定用户名
          this.showAlert('必须指定用户名')
          return
        } else if (!pwd) {
          // 必须指定密码
          this.showAlert('必须指定密码')
          return
        } else if (!captcha) {
          // 必须指定验证码
          this.showAlert('必须指定验证码')
          return
        }
        result = await reqLogin({name, pwd, captcha})
      }
      // 根据结果数据来处理,先停止计时
      if (this.computedTime) {
        this.computedTime = 0
        clearInterval(this.IntervalId)
        this.IntervalId = null
      }
      if (result.code === 0) {
        // 登陆成功,获取用户信息
        const user = result.data
        this.$store.dispatch('recordUser', user)
        // 跳转到个人中心界面
        this.$router.replace('/profile')
      } else {
        // 登录失败，弹出失败信息
        const msg = result.msg
        this.showAlert(msg)
        this.name = ''
        this.pwd = ''
        this.getCaptcha()
      }
    },
    closeTip () {
      this.alertShow = false
      this.alertText = ''
    },
    getCaptcha () {
      this.$refs.captcha.src = 'http://localhost:4000/captcha?time=' + Date.now()
    }
  },

  components: {
    AlertTip
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                  //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(27px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>
