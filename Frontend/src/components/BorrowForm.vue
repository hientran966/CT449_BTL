<template>
  <Form @submit="submitBorrow" :validation-schema="borrowFormSchema">
    <div class="form-group">
      <label for="MASACH">Tên Sách</label>
      <Field name="MASACH" type="text" class="form-control" v-model="bookTitle" disabled />
    </div>

    <div v-if="reader" class="form-group">
      <h5>Thông tin độc giả</h5>
      <div class="p-1"><strong>Tên:</strong> {{ reader.HOLOT }} {{ reader.TEN }}</div>
      <div class="p-1"><strong>Ngày sinh:</strong> {{ reader.NGAYSINH }}</div>
      <div class="p-1"><strong>Giới tính:</strong> {{ reader.PHAI === 1 ? "Nam" : "Nữ" }}</div>
      <div class="p-1"><strong>Địa chỉ:</strong> {{ reader.DIACHI }}</div>
      <div class="p-1"><strong>Số điện thoại:</strong> {{ reader.DIENTHOAI }}</div>
    </div>
    <div v-else>
      <p class="text-danger">Không thể lấy thông tin độc giả. Vui lòng đăng nhập lại.</p>
    </div>

    <div class="form-group">
      <label for="NGAYTRA">Ngày Trả</label>
      <Field name="NGAYTRA" type="date" class="form-control" v-model="borrowLocal.NGAYTRA" />
      <ErrorMessage name="NGAYTRA" class="error-feedback" />
    </div>

    <div class="form-group">
      <button class="btn btn-primary">Lưu</button>
      <button type="button" class="ml-2 btn btn-danger" @click="Cancel">Thoát</button>
    </div>
  </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import BookService from "@/services/book.service";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  props: [
    "id",
    "reader"
  ],
  data() {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);

    return {
      borrowLocal: {
        MASACH: this.id,
        MADOCGIA: "",
        NGAYTRA: "",
      },
      bookTitle: "",
      borrowFormSchema: yup.object().shape({
        NGAYTRA: yup
          .date()
          .required("Vui lòng chọn ngày trả.")
          .min(today, "Không được chọn ngày trong quá khứ.")
          .max(maxDate, "Ngày trả không được vượt quá 30 ngày kể từ hôm nay."),
      }),
    };
  },
  methods: {
    async submitBorrow() {
      if (!this.reader) {
        alert("Không tìm thấy thông tin độc giả.");
        return;
      }
      this.borrowLocal.MADOCGIA = this.reader._id;
      this.$emit("submit:borrow", this.borrowLocal);
    },
    async Cancel() {
      if (confirm("Bạn có chắc muốn thoát?")) {
        this.$router.push({ name: "book" });
      }
    },
  },
  async created() {
    const book = await BookService.get(this.id);
    this.bookTitle = book ? book.TENSACH : "Không xác định";
  }
};
</script>

<style scoped>
@import "../assets/form.css";
</style>
