<template>
    <div class="body">
      <div class="setting">
        <div class="setting-title">个人资料</div>
        <div class="setting-item personal">
          <Form :model="userInfo" label-position="left" :label-width="50" @submit.native.prevent>
            <FormItem label="昵称">
              <Input v-model="userInfo.nick" style="width: 200px" />
            </FormItem>
            <FormItem label="邮箱">
              <Input v-model="userInfo.email" style="width: 200px" :readonly="true" />
            </FormItem>
            <FormItem label="手机">
              <Input v-model="userInfo.phone" style="width: 200px" :readonly="true" />
            </FormItem>
          </Form>
          <div class="edit-avatar">
            <Avatar :src="'/static/file/'+userInfo.avatar" size="large" shape="square" icon="person" class="avatar"/>
            <Button :disabled="isLoading" @click.stop="handleAvatar">修改头像</Button>
            <input type="file" ref="fileUpload" style="display: none" @change="onAvatarUpload" />
          </div>
        </div>
      </div>
      <div class="setting">
        <div class="setting-title">消息通知</div>
        <div class="setting-item switches">
          <div class="switch">
            <label>邮件通知</label>
            <i-switch v-model="dontNotice"></i-switch>
          </div>
          <div class="switch">
            <label>微信通知</label>
            <i-switch v-model="mute"></i-switch>
          </div>
        </div>
      </div>
      <div class="setting">
        <div class="setting-title">修改密码</div>
        <div class="setting-item">
          <Form :model="password" label-position="left" :label-width="80" :rules="ruleCustom" @submit.native.prevent>
            <FormItem label="原密码">
              <Input type="password" v-model="password.oldPassword" style="width: 170px" />
            </FormItem>
            <FormItem label="新密码">
              <Input type="password" v-model="password.newPassword1" style="max-width: 170px" />
            </FormItem>
            <FormItem label="再次确认" prop="newPassword2">
              <Input type="password" v-model="password.newPassword2" style="max-width: 170px" />
            </FormItem>
          </Form>
        </div>
      </div>
      <div class="setting">
        <div class="setting-title">更多选项</div>
        <div class="setting-item more">
          <Button type="ghost" v-if="clearCacheConfirm" @click.stop="clearCacheConfirm = false">取消</Button>
          <Button :type="clearCacheConfirm ? 'error' : 'ghost'" @click.stop="handleCacheClear(clearCacheConfirm)">{{ clearCacheConfirm ? '确认清除缓存' : '清除缓存' }}</Button>
        </div>
      </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { Button, Form, FormItem, Input, Switch, Avatar } from 'iview'
import fileApi from 'Api/file-api'
import userApi from 'Api/user-api'

export default {
  name: 'settings',
  components: {
    Button, Form, FormItem, Input, 'i-switch': Switch, Avatar,
  },
  props: {
    meta: {
      type: Object,
      required: false,
      default() {
        return {}
      },
    },
  },
  data() {
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.password.newPassword1) {
        callback(new Error('密码不一致'))
      } else if (value.length < 6) {
        callback(new Error('密码位数必须大于6位'))
      } else {
        callback()
      }
    }
    return {
      ruleCustom: {
        newPassword2: [{
          validator: validatePassCheck, trigger: 'blur',
        }],
      },
      isLoading: false,
      dontNotice: false,
      mute: false,
      password: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: '',
      },
      clearCacheConfirm: false,
    }
  },
  computed: {
    ...mapState({
      settings: state => state.settings,
      userInfo: state => state.user,
    })
  },
  mounted(){
      console.log(this.userInfo)
  },
  methods: {
    handleAvatar() {
      this.$refs.fileUpload.click()
    },
    handleSettings() {
    },
    async onAvatarUpload(event) {
      this.isLoading = true
      event.preventDefault()
      event.stopPropagation()
      const result = await fileApi.uploadFile(event.target.files[0])
      if (!result.status) {
        this.$Message.error(result.msg || '头像设置失败')
        this.isLoading = false
        return
      }
      const setResult = await userApi.setAvatar(result.data.key)
      if (setResult.status) {
        this.$Message.success(setResult.msg || '头像设置成功')
        this.isLoading = false
        return
      }
      this.$Message.error(setResult.msg || '头像设置失败')
      this.isLoading = false
    },
    async handleLogout() {
        const result = await userApi.logout()
        if (result.status) {
            this.$Message.success(result.msg || '注销成功')
            return
        }
        this.$Message.error(result.msg || '注销失败')
    },
  },
  created() {
  },
  watch: {
  },
}
</script>

<style lang="scss" scoped>
%flex-horizontal {
  display: flex;
}
%flex-vertical {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.body {
    flex: 1;
    margin: 10px 20px;
    overflow-x: auto;
    overflow-y: auto;
    .setting {
      color: #333333;
      margin: 5px auto;
      border-bottom: 1px solid #DCDCDC;
      .setting-item {
        position: relative;
        width: 90%;
        font-size: 14px;
        @extend %flex-horizontal;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: center;
        margin: 5px auto;
        padding: 0 10px;
        .avatar{
          width:100px;
          height:100px;
          margin-bottom:15px;
        }
        .edit-avatar {
          @extend %flex-vertical;
          justify-content: space-around;
          align-items: center;
        }
        .account-avatar {
          @extend %flex-horizontal;
          align-items: center;
          .name {
            margin-left: 5px;
          }
        }
        .btns {
          @extend %flex-horizontal;
          & > button {
            margin-left: 5px;
          }
        }
        .debug {
          color: #999999;
        }
        & > div {
          margin: 2px 5px;
        }
      }
      .setting-item.switches {
        width: 260px;
        @extend %flex-vertical;
        align-items: center;
        margin: 5px 0;
        .switch {
          font-size: 12px;
          @extend %flex-horizontal;
          align-items: center;
          label {
            width: 60px;
          }
        }
      }
      .setting-item.more {
        display: flex;
        justify-content: flex-end;
        > button {
            margin-left: 5px;
        }
      }
    }
  }
</style>