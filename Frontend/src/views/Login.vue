<template>
  <div class="page">
    <h4>Đăng Nhập</h4>
    <LoginForm
      :loginInfo="loginInfo"
      @submit:login="login"
    />
    <p class="register-link">
      Nếu chưa có tài khoản, <router-link :to="{ name: 'reader.add' }">đăng ký ngay</router-link>.
    </p>
    <p>{{ message }}</p>
  </div>
</template>
<script>
import LoginForm from "@/components/LoginForm.vue";
import AuthService from "@/services/auth.service";
export default {
  components: {
    LoginForm,
  },
  data() {
    return {
      loginInfo: {
        TenDangNhap: "",
        Password: "",
      },
      message: "",
    };
  },
  methods: {
    async login(loginData) {
      try {
        const user = await AuthService.login(loginData.TenDangNhap, loginData.Password);
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          window.location.reload()
        } else {
          this.message = "Tên đăng nhập hoặc mật khẩu không đúng!";
        }
      } catch (error) {
        this.message = error.response?.data?.message || "Lỗi khi đăng nhập. Vui lòng thử lại!";
        console.error("Lỗi đăng nhập:", error);
      }
    }
  },
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-size: cover;
  text-align: center;
  padding: 20px;
}

h4 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #000000;
}

.register-link a {
  color: #ff0000;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

.message {
  color: red;
  margin-top: 10px;
}
</style>