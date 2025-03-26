<template>
  <div v-if="borrow" class="page">
    <h4>Đăng Ký Mượn Sách</h4>
    <borrowForm
      :id="id"
      :reader="reader"
      @submit:borrow="addBorrow"
    />
    <p class="text-danger">{{ message }}</p>
  </div>
</template>

<script>
import borrowForm from "@/components/BorrowForm.vue";
import BorrowService from "@/services/borrow.service";
import AuthService from "@/services/auth.service";
import ReaderService from "@/services/reader.service";

export default {
  components: {
    borrowForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      borrow: {},
      message: "",
      reader: this.reader,
    };
  },
  methods: {
    async getLoggedInReader() {
      try {
          const user = await AuthService.getCurrentUser();
          console.log("User:", user);
          if (user) {
              this.reader = await ReaderService.findByAccountId(user._id);
              console.log("Reader:", this.reader);
          }
      } catch (error) {
          console.error("Không thể lấy thông tin độc giả:", error);
      }
    },
    async addBorrow(data) {
      try {
        if (!this.reader) {
          this.message = "Không tìm thấy thông tin độc giả. Vui lòng đăng nhập lại!";
          return;
        }
        data.MADOCGIA = this.reader._id;
        await BorrowService.create(data);
        alert("Đăng ký thành công.");
        this.$router.push({ name: "book" });
      } catch (error) {
        this.message = "Lỗi khi đăng ký mượn sách. Vui lòng thử lại!";
        console.error(error);
      }
    }
  },
  async created() {
    await this.getLoggedInReader();
  },
};
</script>
