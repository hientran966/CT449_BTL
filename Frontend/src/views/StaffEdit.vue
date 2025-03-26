<template>
  <div v-if="staff" class="page">
    <h4>Hiệu chỉnh NXB</h4>
    <StaffForm
      :staff="staff"
      @submit:staff="updateStaff"
    />
    <p>{{ message }}</p>
  </div>
</template>
<script>
import StaffForm from "@/components/StaffForm.vue";
import StaffService from "@/services/staff.service";
export default {
  components: {
    StaffForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      staff: null,
      message: "",
    };
  },
  methods: {
    async getStaff(id) {
      try {
        this.staff = await StaffService.get(id);
      } catch (error) {
        console.log(error);
        this.$router.push({
          name: "notfound",
          params: {
            pathMatch: this.$route.path.split("/").slice(1),
          },
          query: this.$route.query,
          hash: this.$route.hash,
        });
      }
    },
    async updateStaff(data) {
      try {
        await StaffService.update(this.staff._id, data);
        alert("Thông tin được cập nhật thành công.");
        this.$router.push({ name: "staff" });
      } catch (error) {
        alert(`Có lỗi xảy ra. ${error}`);
        console.log(error);
      }
    },
  },
  created() {
    this.getStaff(this.id);
    this.message = "";
  },
};
</script>
