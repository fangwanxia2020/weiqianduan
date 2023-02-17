<template>
  <!-- <div :class="isAdmin ? 'login-container admin-login' : 'login-container apli-login'" v-show="showPage"> -->
  <div
    v-show="showPage"
    class="login-container"
  >
    <!-- admin -->
    <img
      v-if="isAdmin"
      src="@/assets/images/login_img/ope.png"
      class="bg-img"
      alt="qiyetupian"
      v-temp-img="bgImg"
    />
    <!-- platform -->
    <img
      v-if="!isAdmin"
      src="@/assets/images/login_img/apli.png"
      class="bg-img"
      alt="qiyetupian"
      v-temp-img="bgImg"
    />
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <div class="title-tip">欢迎登录~</div>
        <div class="title">XXX管理平台</div>
      </div>
      <el-form-item
        v-if="!isAdmin"
        prop="orgId"
      >
        <div style="width: 86%; border-bottom: solid 1px #a0a3aa !important">
          <ty-icon
            slot="prefix"
            type="structure"
            class="login-org"
          ></ty-icon>
          <el-select
            v-model="loginForm.orgId"
            placeholder="请选择组织"
            filterable
            style="width: 82%"
          >
            <el-option
              v-for="item in orgOptions"
              :key="item.id"
              :value="item.id"
              :label="item.orgName"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item
        prop="username"
        class="form-input"
      >
        <!-- <span class="svg-container">
          <ty-icon type="username" />
        </span> -->
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
          placeholder-style="color: #C3C3C3"
        >
          <ty-icon
            slot="prefix"
            type="username"
            class="login-user"
          ></ty-icon>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="password"
        class="form-input"
      >
        <!-- <span class="svg-container">
          <ty-icon type="password" />
        </span> -->
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          placeholder-style="color: #C3C3C3"
          @keyup.enter.native="handleLogin"
        >
          <ty-icon
            slot="prefix"
            type="password"
            class="login-password"
          ></ty-icon>
        </el-input>
        <span
          class="show-pwd"
          @click="showPwd"
        >
          <i :class="[
              'anticon',
              passwordType === 'password' ? 'closeEye' : 'openEye',
            ]"></i>
        </span>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="
          width: 100%;
          margin-top: 10%;
          padding: 10px 20px;
          font-size: 18px;
        "
        @click.native.prevent="handleLogin"
      >登录</el-button>
    </el-form>
  </div>
</template>
<script>
import {
  title
}
from "@/settings";
import {
  getOrgList
}
from "@/api/system/org.js";
import {
  getInfoByTenantcode,
  login
}
from "@/api/user";
export default {
  name: "Login",
  data() {
    return {
      title,
      showPage: false,
      loginForm: {
        username: "",
        password: "",
        orgId: "",
      },
      loginRules: {
        orgId: [this.rule.required("请选择登录组织")],
        username: [this.rule.required("请输入用户名")],
        password: [this.rule.required("请输入密码")],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      isAdmin: false,
      orgOptions: [],
      bgImg: null, //自定义bg
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.path.includes("admin")) {
          this.isAdmin = true;
        }
        const roleKey = route.params.roleKey;
        console.log("444", route.params.roleKey);
        sessionStorage.setItem("roleKey", roleKey);
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    // const roleKey = this.$route.params.roleKey;
    // if (roleKey != "admin") {
    //   this.getImg(roleKey);
    //   this.getOrg();
    // }
    if (this.$route.query.token != undefined && this.$route.query.token != null) {
      const RsaLoginForm = {
        ...this.loginForm,
        token: this.$route.query.token,
        // password: this.$md5(this.loginForm.password)
      };
      this.$store.dispatch("user/login", RsaLoginForm).then(() => {
        this.$router.push({
          path: "/",
        });
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    }
    else {
      this.showPage = true;
    }
  },
  methods: {
    // 获取背景图
    getImg(roleKey) {
      getInfoByTenantcode(roleKey).then((res) => {
        const loginBgFileInfo = res.data.loginBgFileInfo || {}
        if (loginBgFileInfo.url) {
          this.bgImg = loginBgFileInfo.url;
          // this.bgImg = null
          let logo = res.data.logoFileInfo.url;
          localStorage.setItem("navLogo", logo);
        }
      });
    },
    // 获取组织列表
    getOrg() {
      const sendData = {
        tenantCode: this.$route.params.roleKey,
      };
      getOrgList(sendData).then((res) => {
        this.orgOptions = res.data || [];
        this.orgOptions.map((item) => {
          if (this.$route.params.roleKey == item.orgCode) {
            this.loginForm.orgId = item.id;
          }
        });
      });
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      }
      else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.clearExamInfo();
      this.$refs.loginForm.validate(async(valid) => {
        if (valid) {
          this.loading = true;
          if (this.isAdmin) {
            delete this.loginForm.orgId;
          }
          const RsaLoginForm = {
            ...this.loginForm,
            grant_type: "password",
            client_id: "testclient",
            client_secret: "testclient",
            password: this.$md5(this.loginForm.password),
          };
          this.RsaLoginForm = RsaLoginForm;
          const res = await login(RsaLoginForm);
          if (res.access_token && res.user_id) {
            this.$store.dispatch("user/login", res).then(async () => {
              this.$router.push({
                path: "/",
              });
            }).catch(() => {});
          }
        }
      });
    },
  },
};

</script>
<style lang="scss">
$bg: #fff;
$light_gray: #000;
$cursor: #000;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  position: relative;
  background-repeat: no-repeat;
  background-color: $primaryColor;
  overflow: hidden;
  box-sizing: border-box;

  .bg-img {
    position: absolute;
    margin: auto;
    top: -9999px;
    right: -9999px;
    bottom: -9999px;
    left: -9999px;
    width: 100%;
    // object-fit: contain;
  }
  
  .el-input {
    display: inline-block;
    height: 37px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      color: $light_gray;
      height: 37px;
      line-height: 37px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  
  .el-form-item {
    // border: 1px solid rgba(0, 0, 0, 0.3);
    //background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

.admin-login {
  background-image: url("../assets/images/login_img/ope.png");
  background-color: $primaryColor-ie;
  background-color: $primaryColor;
}

.apli-login {
  background-image: url("../assets/images/login_img/apli.png");
  background-color: $primaryColor-ie;
  background-color: $primaryColor;
}

</style>
<style
  lang="scss"
  scoped
>
$bg: #01367a;
$dark_gray: #889aa4;
$light_gray: #000;

.login-container {
  /* min-height: 500px;
  min-width: 920px; */
  position: relative;

  .login-form {
    position: fixed;
    right: 18%;
    top: 16%;
    width: 20%;
    min-width: 280px;
    /* min-height: 400px; */
    height: 60%;
    padding: 4% 3%;
    overflow: hidden;
    background: #fff;
    border-radius: 10px;

    .form-input {
      ::v-deep.el-input input {
        border-bottom: solid 1px #a0a3aa;
        font-size: 14px;
        text-indent: 32px;
      }
    }
    
    .login-user,
    .login-password,
    .login-org {
      color: $primaryColor-ie !important;
      color: $primaryColor !important;
    }
  }
  
  .tips {
    font-size: 14px;
    color: #000;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  
  .title-container {
    position: relative;

    .title-tip {
      color: #666;
      font-size: 14px;
      line-height: 32px;
    }
    
    .title {
      font-size: 15px;
      color: $primaryColor-ie;
      color: $primaryColor;
      margin: 0 auto 10% auto;
      font-weight: bold;
      letter-spacing: 3px;
    }
  }
  
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}

</style>
