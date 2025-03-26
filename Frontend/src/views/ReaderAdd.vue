<template>
  <div class="page">
    <h4>Thêm độc giả</h4>
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
      this.message = ""; // Xóa thông báo cũ
      try {
        // Đăng ký tài khoản trước
        const newAccount = await AuthService.createAccount({
          TenDangNhap: data.TenDangNhap,
          Password: data.Password,
        });

        if (!newAccount || !newAccount._id) {
          throw new Error("Không thể tạo tài khoản.");
        }

        // Gán ID tài khoản vào độc giả
        const readerData = { ...data, TaiKhoan: newAccount._id };
        delete readerData.TenDangNhap;
        delete readerData.Password;

        // Đăng ký độc giả
        await ReaderService.create(readerData);

        this.message = "Đăng ký độc giả thành công!";
        setTimeout(() => this.$router.push({ name: "reader" }), 1500);
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
</style>
