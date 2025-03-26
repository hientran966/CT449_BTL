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
          this.$router.push({ name: "book" });
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
