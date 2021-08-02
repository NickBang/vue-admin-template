<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened"
               class="hamburger-container"
               @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <div style="margin-right: 20px;">{{username}}</div>
      <el-dropdown class="avatar-container"
                   trigger="click">
        <div class="avatar-wrapper">
          <img v-if="avatar"
               :src="avatar"
               class="user-avatar">
          <img class="el-icon-caret-bottom"
               src="@/assets/down-icon.png"
               alt="">
        </div>
        <el-dropdown-menu slot="dropdown"
                          class="user-dropdown">
          <router-link to="/account-info/account-info">
            <el-dropdown-item>
              账户信息
            </el-dropdown-item>
          </router-link>
          <router-link to="/account-info/account-info">
            <el-dropdown-item>
              修改密码
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided
                            @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { removeCookie, getCookie } from '@/utils/auth'
import { logout } from '@/api/user'
export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      username: '',
      avatar: '',
    }
  },
  mounted() {
    this.username = getCookie('username') || ''
    this.avatar = getCookie('avatar') || ''
  },
  computed: {
    ...mapGetters(['sidebar']),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      try {
        let token = {
          token: getCookie('token')
        }
        await logout(token)
        removeCookie('uid')
        removeCookie('role_code')
        removeCookie('token')
        removeCookie('username')
        removeCookie('avatar')
        this.$router.push(`/login`)
      } catch (e) {
        removeCookie('uid')
        removeCookie('role_code')
        removeCookie('token')
        removeCookie('username')
        removeCookie('avatar')
        this.$router.push(`/login`)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background-color: rgb(48, 65, 86);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    min-width: 200px;
    float: right;
    display: flex;
    justify-content: space-around;
    height: 100%;
    line-height: 50px;
    color: #fff;
    font-size: 20px;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          width: 20px;
          cursor: pointer;
          // position: absolute;
          // right: -20px;
          // top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
