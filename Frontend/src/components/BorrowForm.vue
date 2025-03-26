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

    <div class="form-group">
      <label for="NGAYMUON">Ngày Mượn</label>
      <Field name="NGAYMUON" type="date" class="form-control" v-model="borrowLocal.NGAYMUON" />
      <ErrorMessage name="NGAYMUON" class="error-feedback" />
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
import ReaderService from "@/services/reader.service";
import BookService from "@/services/book.service";
import AuthService from "@/services/auth.service";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  props: ["id"],
  data() {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);

    const borrowFormSchema = yup.object().shape({
      NGAYMUON: yup
        .date()
        .required("Vui lòng chọn ngày mượn.")
        .min(today, "Không được chọn ngày trong quá khứ.")
        .max(maxDate, "Ngày mượn không được vượt quá 30 ngày kể từ hôm nay."),
    });
    return {
      borrowLocal: {
        MASACH: this.id,
        MADOCGIA: "",
        NGAYMUON: "",
      },
      bookTitle: "",
      reader: null,
      borrowFormSchema,
    };
  },
  methods: {
    submitBorrow() {
      this.borrowLocal.MADOCGIA = this.reader._id;
      this.$emit("submit:borrow", this.borrowLocal);
    },
    async Cancel() {
      if (confirm("Bạn có chắc muốn thoát?")) {
        this.$router.push({ name: "borrow" });
      }
    },
  },
  async created() {
    const book = await BookService.get(this.id);
    this.bookTitle = book ? book.TENSACH : "Không xác định";

    const user = await AuthService.getCurrentUser();
    if (user) {
        this.reader = await ReaderService.findByAccountId(user._id);
    }
  }
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>
