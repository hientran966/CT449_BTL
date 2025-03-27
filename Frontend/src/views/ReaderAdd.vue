<template>
  <div class="page">
    <h4>Thông tin đọc giả</h4>
    <ReaderForm :reader="reader" @submit:reader="addReader" />
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script>
import ReaderForm from "@/components/ReaderForm.vue";
import ReaderService from "@/services/reader.service";
import AuthService from "@/services/auth.service";

export default {
  components: { ReaderForm },
  data() {
    return {
      reader: {},
      message: "",
    };
  },
  methods: {
    async addReader(data) {
      this.message = "";
      try {
        await ReaderService.create(data);

        this.message = "Đăng ký độc giả thành công!";
        
        setTimeout(() => {
          const isAuthenticated = !!localStorage.getItem("user");
          this.$router.push({ name: isAuthenticated ? "reader" : "login" });
        }, 1500);
      } catch (error) {
        console.error("Lỗi khi thêm độc giả:", error);
        this.message = `Có lỗi xảy ra: ${error.message}`;
      }
    },
  },
};
</script>

<style scoped>
.message {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}
.page {
  min-width: 900px;
}
</style>
