<template>
  <Form @submit="submitBorrow" :validation-schema="borrowFormSchema">
    <div class="form-group">
      <label for="MADOCGIA">Đọc Giả</label>

      <Field
        name="MADOCGIA"
        type="text"
        class="form-control"
        v-model="borrowLocal.MADOCGIA"
      />

      <ErrorMessage name="MADOCGIA" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="MASACH">Tên Sách</label>

      <Field
        name="MASACH"
        type="text"
        class="form-control"
        v-model="borrowLocal.MASACH"
      />

      <ErrorMessage name="MASACH" class="error-feedback" />
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
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["submit:borrow"],
  props: {
    borrow: { type: Object, required: true },
  },
  data() {
    const borrowFormSchema = yup.object().shape({
    });
    return {
      borrowLocal: this.borrow,
      borrowFormSchema,
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
};
</script>
<style scoped>
@import "@/assets/form.css";
</style>
