<template>
  <Form @submit="submitLogin" :validation-schema="loginFormSchema">
    <div class="form-group">
      <label for="TenDangNhap">Tên đăng nhập:</label>

      <Field
        name="TenDangNhap"
        type="text"
        class="form-control"
        v-model="loginLocal.TenDangNhap"
      />

      <ErrorMessage name="TenDangNhap" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="Password">Mật khẩu:</label>

      <Field
        name="Password"
        type="password"
        class="form-control"
        v-model="loginLocal.Password"
      />

      <ErrorMessage name="Password" class="error-feedback" />
    </div>
    <div class="form-group">
      <button class="btn btn-primary">Đăng nhập</button>
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
  emits: ["submit:login"],
  props: {
    login: { type: Object, required: true },
  },
  data() {
    const loginFormSchema = yup.object().shape({
      TenDangNhap: yup
        .string()
        .required("Vui lòng nhập tên đăng nhập."),
      Password: yup
        .string()
        .required("Vui lòng nhập mật khẩu.")
        .min(8, "Mật khẩu phải ít nhất 8 ký tự.")
        .max(16, "Mật khẩu có nhiều nhất 16 ký tự."),
    });
    return {
      loginLocal: this.login,
      loginFormSchema,
    };
  },
  methods: {
    submitLogin() {
      this.$emit("submit:login", this.loginLocal);
    },
  },
};
</script>
<style scoped>
@import "@/assets/form.css";
</style>
