<template>
  <Form @submit="submitPublisher" :validation-schema="publisherFormSchema">
    <div class="form-group">
      <label for="TENNXB">Tên</label>

      <Field
        name="TENNXB"
        type="text"
        class="form-control"
        v-model="publisherLocal.TENNXB"
      />

      <ErrorMessage name="TENNXB" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="DIACHI">Địa chỉ</label>

      <Field
        name="DIACHI"
        type="text"
        class="form-control"
        v-model="publisherLocal.DIACHI"
      />

      <ErrorMessage name="DIACHI" class="error-feedback" />
    </div>
    <div class="form-group">
      <button class="btn btn-primary">Lưu</button>
      <button
        v-if="publisherLocal._id"
        type="button"
        class="ml-2 btn btn-danger"
        @click="deletePublisher"
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
  emits: ["submit:publisher", "delete:publisher"],
  props: {
    publisher: { type: Object, required: true },
  },
  data() {
    const publisherFormSchema = yup.object().shape({
      TENNXB: yup
        .string()
        .required("Tên phải có giá trị.")
        .min(2, "Tên phải ít nhất 2 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),
      DIACHI: yup
        .string()
        .required("Địa chỉ phải có giá trị.")
        .min(2, "Địa chỉ phải ít nhất 2 ký tự.")
        .max(50, "Địa chỉ có nhiều nhất 50 ký tự."),
    });
    return {
      publisherLocal: this.publisher,
      publisherFormSchema,
    };
  },
  methods: {
    submitPublisher() {
      this.$emit("submit:publisher", this.publisherLocal);
    },
    deletePublisher() {
      this.$emit("delete:publisher", this.publisherLocal.id);
    },
    Cancel() {
      const reply = window.confirm(
        "You have unsaved changes! Do you want to leave?"
      );

      if (!reply) {
        return false;
      } else this.$router.push({ name: "publisher" });
    },
  },
};
</script>
<style scoped>
@import "../assets/form.css";
</style>
