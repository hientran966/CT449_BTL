<template>
  <Form @submit="submitReader" :validation-schema="readerFormSchema">
    <div v-if="!readerLocal._id" class="form-group">
      <label for="TenDangNhap">Tài khoản</label>
      <Field name="TenDangNhap" id="TenDangNhap" type="text" class="form-control" v-model="readerLocal.TenDangNhap" />
      <ErrorMessage name="TenDangNhap" class="error-feedback" />
    </div>

    <div v-if="!readerLocal._id" class="form-group">
      <label for="Password">Mật khẩu</label>
      <Field name="Password" id="Password" type="password" class="form-control" v-model="readerLocal.Password" />
      <ErrorMessage name="Password" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="HOLOT">Họ</label>
      <Field name="HOLOT" id="HOLOT" type="text" class="form-control" v-model="readerLocal.HOLOT" />
      <ErrorMessage name="HOLOT" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="TEN">Tên</label>
      <Field name="TEN" id="TEN" type="text" class="form-control" v-model="readerLocal.TEN" />
      <ErrorMessage name="TEN" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="NGAYSINH">Ngày sinh</label>
      <Field name="NGAYSINH" id="NGAYSINH" type="date" class="form-control" v-model="readerLocal.NGAYSINH" />
      <ErrorMessage name="NGAYSINH" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="PHAI">Giới tính</label>
      <select id="PHAI" v-model="readerLocal.PHAI" class="form-control mb-2">
        <option :value="1">Nam</option>
        <option :value="0">Nữ</option>
      </select>
      <ErrorMessage name="PHAI" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="DIACHI">Địa chỉ</label>
      <Field name="DIACHI" id="DIACHI" type="text" class="form-control" v-model="readerLocal.DIACHI" />
      <ErrorMessage name="DIACHI" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="DIENTHOAI">Số điện thoại</label>
      <Field name="DIENTHOAI" id="DIENTHOAI" type="text" class="form-control" v-model="readerLocal.DIENTHOAI" />
      <ErrorMessage name="DIENTHOAI" class="error-feedback" />
    </div>

    <div class="form-group">
      <button class="btn btn-primary">Lưu</button>
      <button v-if="readerLocal._id" type="button" class="ml-2 btn btn-danger" @click="deleteReader">Xóa</button>
      <button type="button" class="ml-2 btn btn-secondary" @click="cancel">Thoát</button>
    </div>
  </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  components: { Form, Field, ErrorMessage },
  emits: ["submit:reader", "delete:reader"],
  props: { reader: { type: Object, required: true } },

  data() {
    return {
      readerLocal: { ...this.reader },
      readerFormSchema: yup.object().shape({
        TenDangNhap: yup.string().required("Vui lòng nhập tài khoản.").min(5, "Tài khoản phải ít nhất 5 ký tự."),
        Password: yup.string().required("Vui lòng nhập mật khẩu.").min(8, "Mật khẩu ít nhất 8 ký tự."),
        HOLOT: yup.string().required("Vui lòng nhập họ.").min(2, "Họ phải ít nhất 2 ký tự.").max(50, "Họ tối đa 50 ký tự."),
        TEN: yup.string().required("Vui lòng nhập tên.").min(2, "Tên phải ít nhất 2 ký tự.").max(50, "Tên tối đa 50 ký tự."),
        NGAYSINH: yup
          .date()
          .required("Vui lòng nhập ngày sinh.")
          .max(new Date(new Date().setFullYear(new Date().getFullYear() - 5)), "Độc giả phải ít nhất 5 tuổi."),
        PHAI: yup.number().oneOf([0, 1], "Vui lòng chọn giới tính"),
        DIACHI: yup.string().required("Vui lòng nhập địa chỉ.").min(2, "Địa chỉ phải ít nhất 2 ký tự.").max(50, "Địa chỉ tối đa 50 ký tự."),
        DIENTHOAI: yup
          .string()
          .required("Vui lòng nhập số điện thoại.")
          .matches(/^\d{10}$/, "Số điện thoại phải có đúng 10 chữ số."),
      }),
    };
  },

  methods: {
    submitReader() {
      this.readerLocal.PHAI = parseInt(this.readerLocal.PHAI, 10);
      this.$emit("submit:reader", this.readerLocal);
    },

    deleteReader() {
      this.$emit("delete:reader", this.readerLocal._id);
    },

    cancel() {
      this.$router.back();
    },
  },
};
</script>

<style scoped>
@import "@/assets/form.css";

.error-feedback {
  color: red;
  font-size: 0.9rem;
  margin-top: 4px;
}
</style>
