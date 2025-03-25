<template>
  <Form @submit="submitBorrow" :validation-schema="borrowFormSchema">
    <div class="form-group">
      <label for="MASACH">Tên Sách</label>

      <Field
        name="MASACH"
        type="text"
        class="form-control"
        v-model="bookTitle"
        disabled
      />
    </div>
    <div  class="form-group">
      <label for="MADOCGIA">Thông tin đọc giả:</label>
      <select v-model="borrowLocal.MADOCGIA" class="form-control">
        <option v-for="reader in readers" :key="reader._id" :value="reader._id">
          {{ reader.TEN }}
        </option>
      </select>
    </div>
    <div class="form-group">
      <label for="NGAYMUON">Ngày Mượn</label>

      <Field
        name="NGAYMUON"
        type="date"
        class="form-control"
        v-model="borrowLocal.NGAYMUON"
      />

      <ErrorMessage name="NGAYMUON" class="error-feedback" />
    </div>
    <div  class="form-group">
      <button class="btn btn-primary">Lưu</button>
      <button type="button" class="ml-2 btn btn-danger" @click="Cancel">
        Thoát
      </button>
    </div>
  </Form>
</template>
<script>
import ReaderService from "@/services/reader.service";
import BookService from "@/services/book.service";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["submit:borrow"],
  props: 
    ['id']
  ,
  data() {
    return {
      borrowLocal: {
        MASACH: this.id,
        MADOCGIA: "",
        NGAYMUON: "",
      },
      readers: [],
      bookTitle: "",
    };
  },
  methods: {
    submitBorrow() {
      this.$emit("submit:borrow", this.borrowLocal);
    },
    Cancel() {
      const reply = window.confirm(
        "You have unsaved changes! Do you want to leave?"
      );

      if (!reply) {
        return false;
      } else this.$router.push({ name: "borrow" });
    },
  },
  async created() {
    console.log("ID nhận được:", this.id);
    const book = await BookService.get(this.id);
    this.bookTitle = book ? book.TENSACH : "Không xác định";
    this.readers = await ReaderService.getAll();
  }
};
</script>
<style scoped>
@import "@/assets/form.css";
</style>
