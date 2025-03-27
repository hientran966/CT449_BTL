<template>
  <div v-if="book" class="page">
    <h4>Thêm Sách</h4>
    <bookForm
      :book="book"
      @submit:book="addBook"
    />
    <p>{{ message }}</p>
  </div>
</template>
<script>
import bookForm from "@/components/BookForm.vue";
import bookService from "@/services/book.service";
export default {
  components: {
    bookForm,
  },
  data() {
    return {
      book: {},
      message: "",
    };
  },
  methods: {
    async addBook(data) {
      try {
        await bookService.create(data);
        alert("Sách được thêm mới thành công.");
        this.$router.push({ name: "book" });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
