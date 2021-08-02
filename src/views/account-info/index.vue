<template>
  <div class="cont">
    <!-- 抖音信息 -->
    <div class="box">
      <h3 class="header">
        <div>抖音信息</div>
        <el-button type="text"
                   style="margin-left:20px;font-size:18px;"
                   @click.native.prevent="binddy">
          绑定抖音
        </el-button>
      </h3>
      <div class="box-content">
        <div class="box-item">
          <div class="item-l">抖音头像：</div>
          <img style="height: 50px;"
               v-if="form.avatar"
               :src="form.avatar"
               alt="">
          <img style="height: 50px;"
               v-else
               src="@/assets/logo.png"
               alt="">
        </div>
        <div class="box-item">
          <div class="item-l">抖音昵称：</div>
          <div v-if="form.dy_nickname">{{form.dy_nickname}}</div>
          <div v-else>暂未绑定</div>
        </div>
      </div>
    </div>
    <!-- 用户信息 -->
    <div class="box">
      <h3 class="header">
        <div>用户信息</div>
      </h3>
      <div class="box-content">
        <el-form ref="form"
                 :model="form"
                 :rules="rules"
                 label-position="left"
                 label-width="250px">
          <el-form-item label="用户名："
                        class="form-item">
            <div>{{form.username}}</div>
          </el-form-item>
          <el-form-item label="手机号："
                        prop="phone_number">
            <el-input v-model="form.phone_number"
                      class="input-w"></el-input>
          </el-form-item>
          <el-form-item label="账户类型：">
            <div>{{form.role_name}}</div>
          </el-form-item>
          <el-form-item label="关键词数：">
            <div>{{form.keyword_count}}</div>
          </el-form-item>
          <el-form-item label="有效期：">
            <div>{{form.invalid_time}}</div>
          </el-form-item>
          <el-form-item label="地址：">
            <el-input v-model="form.address"
                      class="input-w"></el-input>
          </el-form-item>

        </el-form>
        <div style="width: 100%;text-align:center;">
          <el-button type="primary"
                     @click="onSubmit">修改信息</el-button>
        </div>

      </div>
    </div>

    <div class="box">
      <h3 class="header">
        <div>修改密码</div>
      </h3>
      <div class="box-content">
        <el-form ref="form"
                 :model="passForm"
                 :rules="rules"
                 label-position="left"
                 label-width="250px">
          <el-form-item label="旧密码："
                        prop="password">
            <el-input type="password"
                      class="input-w"
                      v-model="passForm.password"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码："
                        prop="password">
            <el-input type="password"
                      class="input-w"
                      v-model="passForm.new_password"
                      autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div style="width: 100%;text-align:center;">
          <el-button type="primary"
                     @click="onChangePass">修改密码</el-button>
        </div>

      </div>
    </div>

    <!-- 
    <div class="qrcode">
      <div class="item">
        <div class="title">微信收款码</div>
        <img :src="qrcode.wechat_qr"
             alt="">
        <el-input v-model="qrcode.wechat_qr"
                  v-if="role_code === '1'"
                  placeholder="请输入二维码链接"></el-input>
      </div>
      <div class="item">
        <div class="title">支付宝收款码</div>
        <img :src="qrcode.alipay_qr"
             alt="">
        <el-input v-model="qrcode.alipay_qr"
                  v-if="role_code === '1'"
                  placeholder="请输入二维码链接"></el-input>
      </div>
    </div>
    <div style="width: 100%;text-align:center;margin-top: 30px"
         v-if="role_code === '1'">
      <el-button type="primary"
                 class="qrcode-btn"
                 @click="onSaveQrcode">保存收款码</el-button>
    </div> -->

  </div>
</template>

<script>
import {
  getInfo,
  updateUser,
  updatePassword,
  queryQrCode,
  saveQrCode,
} from '@/api/user'
import { getCookie, removeCookie } from '@/utils/auth'
export default {
  name: 'KeyWord',
  data() {
    return {
      form: {
        role_code: null,
        username: '',
        phone_number: '',
        invalid_datetime: '',
        keyword_count: 0,
        address: '',
      },
      passForm: {
        password: '',
        new_password: '',
      },
      qrcode: {
        wechat_qr: '',
        alipay_qr: '',
      },
      role_code: '',
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 5,
            max: 20,
            message: '长度在 5 到 20 个字符',
            trigger: 'blur',
          },
        ],
        phone_number: [
          {
            required: true,
            message: '请输入正确的手机号',
            pattern: /^[1]([3-9])[0-9]{9}$/,
          },
        ],
      },
      dyErrCodeEnum: {
        5: '身份失效，请退出重新登陆',
        14: '抖音授权失败,请重新点击绑定授权',
      },
    }
  },
  created() {
    this.role_code = getCookie('role_code') || ''
    if (this.$route.query.dyErrCode) {
      this.$message.error({
        message: this.dyErrCodeEnum[this.$route.query.dyErrCode],
        duration: 6000,
      })
      let newQuery = JSON.parse(JSON.stringify(this.$route.query))
      delete newQuery.dyErrCode
      this.$router.replace({ query: newQuery })
    }
  },
  mounted() {
    this.queryUser()
  },
  computed: {},
  methods: {
    async onSubmit() {
      console.log(this.form)
      const res = await updateUser(this.form)
      if (res.code === 0) {
        this.$message.success('修改成功')
        this.queryUser()
      } else {
        this.$message.error(res.message)
      }
    },
    async onChangePass() {
      const res = await updatePassword(this.passForm)
      if (res.code === 0) {
        this.$message.success('修改成功')
        this.passForm = {
          password: '',
          new_password: '',
        }
      } else {
        this.$message.error(res.message)
      }
    },
    async onSaveQrcode() {
      const res = await saveQrCode(this.qrcode)
      if (res.code === 0) {
        this.$message.success('修改二维码成功')
      } else {
        this.$message.error(res.message)
      }
    },
    async queryUser() {
      const info = await this.$store.dispatch('user/getInfo')
      Object.assign(this.form, info)
      // const qrcode = await queryQrCode()
      // if (qrcode.code === 0 && Object.keys(qrcode.data).length > 0) {
      //   this.qrcode = qrcode.data
      // }
    },
    async add() {
      let data = {
        keyword: this.input,
      }
      const res = await addVideoWord(data)
      if (res.code === 0) {
        this.$message.success('添加成功')
        this.queryList()
      } else {
        this.$message.error(res.message)
      }
    },
    async deleteRow(index) {
      let data = {
        keyword_id: this.tableData[index].keyword_id,
      }
      const res = await deleteVideoWord(data)
      if (res.code === 0) {
        this.$message.success('删除成功')
        this.queryList()
      } else {
        this.$message.error(res.message)
      }
    },
    binddy() {
      if (!getCookie('token')) {
        removeCookie('uid')
        removeCookie('role_code')
        removeCookie('token')
        this.$router.push(`/login`)
      } else {
        let url = `https://open.douyin.com/platform/oauth/connect?client_key=aw6n92edue5y5cm5&response_type=code&scope=user_info&redirect_uri=http://api.56byte.com/claw/douyin/login_success&state=${getCookie(
          'token'
        )}_${window.location.host}`
        window.open(url, '_self')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.cont {
  width: 80%;
  margin: 60px auto;
  .top {
    width: 50%;
    margin: 30px auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .add-btn {
      margin-left: 20px;
    }
  }

  .page {
    background: #fff;
    padding: 32px 16px;
    text-align: right;
  }
  .btn {
    text-align: center;
  }

  .qrcode {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    font-size: 24px;
    .item {
      width: 300px;
      img {
        width: 200px;
        margin: 20px 0;
      }
    }
  }

  .input-w {
    width: 300px;
  }

  .box {
    width: 800px;
    min-height: 200px;
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 6%);
    border-radius: 10px;
    margin: 30px auto;
    .header {
      width: 100%;
      height: 60px;
      line-height: 60px;
      background: #f8f8f8;
      padding: 0 30px;
      border-left: 4px solid red;
      display: flex;
      justify-content: flex-start;
      align-items: baseline;
    }
    .box-content {
      width: 100%;
      height: 100%;
      color: #877f7f !important;
      padding: 30px 0;
      .box-item {
        width: 100%;
        height: 70px;
        display: flex;
        align-items: center;
        .item-l {
          width: 250px;
          margin-left: 70px;
        }
      }
    }
  }
  .box-title {
    background: #ccc;
  }
  h3 {
    margin: 0;
  }
}
::v-deep .el-form-item__label {
  color: #877f7f;
  font-size: 16px;
  font-weight: normal;
  margin-left: 70px;
}
::v-deep .el-form-item__content {
  color: #877f7f;
  font-size: 16px;
  font-weight: normal;
}
</style>
