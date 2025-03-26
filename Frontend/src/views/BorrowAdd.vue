<template>
  <div v-if="borrow" class="page">
    <h4>Đăng Ký Mượn Sách</h4>
    <borrowForm
      :id="id"
      @submit:borrow="addBorrow"
    />
    <p>{{ message }}</p>
  </div>
</template>
<script>
import borrowForm from "@/components/BorrowForm.vue";
import BorrowService from "@/services/borrow.service";
import BookService from "@/services/book.service";
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
      readerId: "",
    };
  },
  methods: {
    async getLoggedInReader() {
      try {
        const user = await AuthService.getCurrentUser();
        if (user) {
          const reader = await ReaderService.findByAccountId(user._id);
          if (reader) {
            this.readerId = reader._id;
          }
        }
      } catch (error) {
        console.error("Không thể lấy thông tin độc giả:", error);
      }
    },
    async addBorrow(data) {
      try {
          data.MADOCGIA = this.readerId;
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
