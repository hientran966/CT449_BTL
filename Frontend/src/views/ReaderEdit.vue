<template>
  <div v-if="reader" class="page">
    <h4>Hiệu chỉnh đọc giả</h4>
    <ReaderForm
      :reader="reader"
      @submit:reader="updateReader"
      @delete:reader="deleteReader"
    />
    <p>{{ message }}</p>
  </div>
</template>
<script>
import ReaderForm from "@/components/ReaderForm.vue";
import ReaderService from "@/services/reader.service";
export default {
  components: {
    ReaderForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      reader: null,
      message: "",
    };
  },
  methods: {
    async getReader(id) {
      try {
        this.reader = await ReaderService.get(id);
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
    async updateReader(data) {
      try {
        await ReaderService.update(this.reader._id, data);
        alert("Đọc giả được cập nhật thành công.");
        this.$router.push({ name: "reader" });
      } catch (error) {
        alert(`Có lỗi xảy ra. ${error}`);
        console.log(error);
      }
    },
    async deleteReader() {
      if (confirm("Bạn muốn xóa đọc giả này?")) {
        try {
          await ReaderService.delete(this.reader._id);
          this.$router.push({ name: "reader" });
        } catch (error) {
          alert(`Có lỗi xảy ra. ${error}`);
          console.log(error);
        }
      }
    },
  },
  created() {
    this.getReader(this.id);
    this.message = "";
  },
};
</script>
