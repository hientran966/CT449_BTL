<template>
  <div v-if="reader" class="page">
    <h4>Thêm đọc giả</h4>
    <ReaderForm
      :reader="reader"
      @submit:reader="addReader"
    />
    <p>{{ message }}</p>
  </div>
</template>
<script>
import ReaderForm from "@/components/ReaderForm.vue";
import ReaderService from "@/services/reader.service";
import AuthService from "@/services/auth.service";
export default {
  components: {
    ReaderForm,
  },
  data() {
    return {
      reader: {},
      message: "",
    };
  },
  methods: {
    async addReader(data) {
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
          data.TaiKhoan = newAccount._id;
          delete data.TenDangNhap;
          delete data.Password;

          // Đăng ký độc giả
          await ReaderService.create(data);
          alert("Đăng ký độc giả thành công!");
          this.$router.push({ name: "reader" });
      } catch (error) {
          console.error("Lỗi khi thêm độc giả:", error);
          alert(`Có lỗi xảy ra: ${error.message}`);
      }
    }
  },
};
</script>
