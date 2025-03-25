<template>
  <Form @submit="submitBook" :validation-schema="bookFormSchema">
    <div class="form-group">
      <label for="TENSACH">Tên</label>

      <Field
        name="TENSACH"
        type="text"
        class="form-control"
        v-model="bookLocal.TENSACH"
      />

      <ErrorMessage name="TENSACH" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="DONGIA">Đơn Giá</label>

      <Field
        name="DONGIA"
        type="number"
        class="form-control"
        v-model="bookLocal.DONGIA"
      />

      <ErrorMessage name="DONGIA" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="SOQUYEN">Số Quyển</label>

      <Field
        name="SOQUYEN"
        type="number"
        class="form-control"
        v-model="bookLocal.SOQUYEN"
      />

      <ErrorMessage name="SOQUYEN" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="NAMXUATBAN">Năm Xuất Bản</label>

      <Field
        name="NAMXUATBAN"
        type="number"
        class="form-control"
        v-model="bookLocal.NAMXUATBAN"
      />

      <ErrorMessage name="NAMXUATBAN" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="TACGIA">Năm Xuất Bản</label>

      <Field
        name="TACGIA"
        type="text"
        class="form-control"
        v-model="bookLocal.TACGIA"
      />

      <ErrorMessage name="TACGIA" class="error-feedback" />
    </div>
    <div class="form-group">
      <button class="btn btn-primary">Lưu</button>
      <button
        v-if="bookLocal._id"
        type="button"
        class="ml-2 btn btn-danger"
        @click="deleteBook"
      >
        Xóa
      </button>
      <button type="button" class="ml-2 btn btn-danger" @click="Cancel">
        Thoát
      </button>
    </div>
  </Form>
</template>
<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["submit:book", "delete:book"],
  props: {
    book: { type: Object, required: true },
  },
  data() {
    const bookFormSchema = yup.object().shape({
      TENSACH: yup
        .string()
        .required("Tên phải có giá trị.")
        .min(2, "Tên phải ít nhất 2 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),
      DONGIA: yup
        .number().typeError('Đơn giá phải là số')
        .positive('Đơn giá phải lớn hơn 0')
        .required('Đơn giá không được để trống'),
      SOQUYEN: yup
        .number().typeError('Số quyển phải là số')
        .integer('Số quyển phải là số nguyên')
        .positive('Số quyển phải lớn hơn 0')
        .required('Số quyển không được để trống'),
      NAMXUATBAN: yup
        .number().typeError('Năm xuất bản phải là số')
        .integer('Năm phải là số nguyên')
        .positive('Năm phải lớn hơn 0')
        .required('Năm không được để trống'),
    });
    return {
      bookLocal: this.book,
      bookFormSchema,
    };
  },
  methods: {
    submitBook() {
      this.$emit("submit:book", this.bookLocal);
    },
    deleteBook() {
      this.$emit("delete:book", this.bookLocal.id);
    },
    Cancel() {
      const reply = window.confirm(
        "You have unsaved changes! Do you want to leave?"
      );

      if (!reply) {
        return false;
      } else this.$router.push({ name: "book" });
    },
  },
};
</script>
<style scoped>
@import "@/assets/form.css";
</style>
