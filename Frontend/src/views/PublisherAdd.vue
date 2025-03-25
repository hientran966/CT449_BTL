<template>
  <div v-if="publisher" class="page">
    <h4>Thêm mới NXB</h4>
    <PublisherForm
      :publisher="publisher"
      @submit:publisher="addPublisher"
    />
    <p>{{ message }}</p>
  </div>
</template>
<script>
import PublisherForm from "@/components/PublisherForm.vue";
import PublisherService from "@/services/publisher.service";
export default {
  components: {
    PublisherForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      publisher: {},
      message: "",
    };
  },
  methods: {
    async addPublisher(data) {
      try {
        await PublisherService.create(data);
        alert("Nhà xuất bản được tạo thành công.");
        this.$router.push({ name: "publisher" });
      } catch (error) {
        alert(`Có lỗi xảy ra. ${error}`);
        console.log(error);
      }
    },
  },
};
</script>
