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
    };
  },
  methods: {
    async getBook(id) {
      try {
        this.book = await BookService.get(id);
      } catch (error) {
        console.log(error);
        this.$router.push({
          name: "notfound",
          params: {
            pathMatch: this.$route.path.split("/").slice(1),
          },
          query: this.$route.query,
          hash: this.$route.hash,
        });
      }
    },
    async addBorrow(data) {
      try {
        await BorrowService.create(data);
        alert("Đăng ký thành công.");
        this.$router.push({ name: "book" });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
