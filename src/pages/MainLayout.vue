
<template>
    <Layout class="layout">
        <Header>
            <Menu mode="horizontal" theme="dark" active-name="home" @on-select="select">
                <img class="layout-logo" v-icon="'logo'"/>
                <div class="layout-nav">
                    <MenuItem name="home">
                        <Icon type="home"></Icon>
                        主页
                    </MenuItem>
                    <MenuItem name="task">
                        <Icon type="social-wordpress-outline"></Icon>
                        任务大厅
                    </MenuItem>
                    <MenuItem name="apps">
                        <Icon type="social-twitch-outline"></Icon>
                        案例
                    </MenuItem>
                    <MenuItem name="person">
                        <Icon type="person"></Icon>
                        个人中心
                    </MenuItem>
                </div>
            </Menu>
        </Header>
        <Modal title="图片预览" v-model="visible">
            <img :src="imgUrl" style="width: 100%">
        </Modal>
        <Modal :mask-closable="false" width="340" height="250" v-model="verification">
            <component v-bind:is="modal" @changeModal="changeModal"></component>
            <div slot="footer">
                <Row>
                    <a v-if="modalName==='login'" @click="changeModal('register')">注册帐号</a>
                    <a v-else @click="changeModal('login')">帐号登录</a>
                </Row>
            </div>
        </Modal>
        <Layout class="container">
            <!--content-->
            <router-view class="router-view" @openImg="openImg"></router-view>
        </Layout>
    </Layout>
</template>
<script>
import Login from '@/components/functional/Login'
import Register from '@/components/functional/Register'
import routerHook from '@/router/router-guard'
import { mapState } from 'vuex'
import { Layout, Header, MenuItem, Menu } from 'iview'

export default {
  data() {
    return {
      visible: false,
      modal: Login,
      modalName: 'login',
      imgUrl: '',
    }
  },
  computed: {
    ...mapState({
      openAuthModal: 'openAuthModal',
    }),
    verification: {
      get() {
        return this.openAuthModal
      },
      set(newVal) {
        this.$store.commit('setAuthModal', newVal)
      },
    },
  },
  created() {
    routerHook(this.$router, this.$store)
  },
  components: {
    Login, Register, Layout, Header, MenuItem, Menu,
  },
  methods: {
    changeModal(name) {
      this.modalName = name
      if (name === 'login') {
        this.modal = Login
      } else {
        this.modal = Register
      }
    },
    openImg(url) {
      this.imgUrl = url
      this.visible = true
    },
    select(value) {
      if (value === 'home') {
        this.$router.push('/home')
      } else if (value === 'task') {
        this.$router.push('/taskHall')
      } else if (value === 'apps') {
        this.$router.push('/apps')
      } else if (value === 'person') {
        this.$router.push('/person')
      }
    },
  },
}
</script>
<style scoped lang="less">
.layout{
    border: 1px solid #d7dde4;
    background: #495060;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    height:100vh;
}
.container{
    background: #fff;
    .router-view{
        background: #fff;
    }
}
.layout-logo{
    width: 100px;
    height: 30px;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-nav{
  width: 450px;
  margin: 0 20px 0 auto;
}
</style>
