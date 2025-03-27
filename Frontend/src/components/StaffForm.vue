<template>
  <Form @submit="submitStaff" :validation-schema="staffFormSchema">
    <div class="form-group">
      <label for="HoTenNV">Tên</label>

      <Field
        name="HoTenNV"
        type="text"
        class="form-control"
        v-model="staffLocal.HoTenNV"
      />

      <ErrorMessage name="HoTenNV" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="ChucVu">Địa chỉ</label>

      <Field
        name="ChucVu"
        type="text"
        class="form-control"
        v-model="staffLocal.ChucVu" disabled
      />

      <ErrorMessage name="DIACHI" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="DiaChi">Địa chỉ</label>

      <Field
        name="DiaChi"
        type="text"
        class="form-control"
        v-model="staffLocal.DiaChi"
      />

      <ErrorMessage name="DiaChi" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="SoDienThoai">Điện thoại</label>

      <Field
        name="SoDienThoai"
        type="text"
        class="form-control"
        v-model="staffLocal.SoDienThoai"
      />

      <ErrorMessage name="SoDienThoai" class="error-feedback" />
    </div>
    <div class="form-group">
      <button class="btn btn-primary">Lưu</button>
      <button
        v-if="staffLocal._id"
        type="button"
        class="ml-2 btn btn-danger"
        @click="deletestaff"
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
  emits: ["submit:staff"],
  props: {
    staff: { type: Object, required: true },
  },
  data() {
    const staffFormSchema = yup.object().shape({
      HoTenNV: yup
        .string()
        .required("Tên phải có giá trị.")
        .min(2, "Tên phải ít nhất 2 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),
      DiaChi: yup
        .string()
        .required("Địa chỉ phải có giá trị.")
        .min(2, "Địa chỉ phải ít nhất 2 ký tự.")
        .max(50, "Địa chỉ có nhiều nhất 50 ký tự."),
      SoDienThoai: yup
        .string()
        .required("Vui lòng nhập số điện thoại.")
        .matches(/^\d{10}$/, "Số điện thoại phải có đúng 10 chữ số."),
    });
    return {
      staffLocal: this.staff,
      staffFormSchema,
    };
  },
  methods: {
    submitStaff() {
      this.$emit("submit:staff", this.staffLocal);
    },
    deletestaff() {
      this.$emit("delete:staff", this.staffLocal.id);
    },
    Cancel() {
      const reply = window.confirm(
        "You have unsaved changes! Do you want to leave?"
      );

      if (!reply) {
        return false;
      } else this.$router.push({ name: "staff" });
    },
  },
};
</script>
<style scoped>
@import "../assets/form.css";
</style>
