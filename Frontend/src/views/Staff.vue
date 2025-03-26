<template>
  <div class="page row">
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
    </div>
    <div class="mt-3 col-md-6">
      <h4>
        Nhân Viên
        <i class="fas fa-users"></i>
      </h4>
      <StaffList
        v-if="filteredStaffsCount > 0"
        :staffs="filteredstaffs"
        v-model:activeIndex="activeIndex"
      />
      <p v-else>Không có dữ liệu.</p>
      <div class="mt-3 row justify-content-around align-items-center">
        <button class="btn btn-sm btn-primary" @click="refreshList()">
          <i class="fas fa-redo"></i> Làm mới
        </button>
      </div>
    </div>
    <div class="mt-3 col-md-6">
      <div v-if="activeStaff">
        <h4>Chi tiết</h4>
        <StaffCard :staff="activeStaff" />
        <router-link
          :to="{
            name: 'staff.edit',
            params: { id: activeStaff._id },
          }"
        >
          <span class="mt-2 badge badge-warning">
            <i class="fas fa-edit"></i> Hiệu chỉnh</span
          >
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import StaffCard from "@/components/StaffCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import StaffList from "@/components/StaffList.vue";
import StaffService from "@/services/staff.service";

export default {
  components: {
    StaffCard,
    InputSearch,
    StaffList,
  },
  data() {
    return {
      staffs: [],
      activeIndex: -1,
      searchText: "",
    };
  },
  watch: {
    searchText() {
      this.activeIndex = -1;
    },
  },
  computed: {
    staffStrings() {
      return this.staffs.map((staff) => {
        const { HoTenNV, ChucVu, DiaChi, SoDienThoai } =
          staff;
        return [HoTenNV, ChucVu, DiaChi, SoDienThoai].join("");
      });
    },
    filteredstaffs() {
      if (!this.searchText) return this.staffs;
      return this.staffs.filter((_staff, index) =>
        this.staffStrings[index].includes(this.searchText)
      );
    },
    activeStaff() {
      if (this.activeIndex < 0) return null;
      return this.filteredstaffs[this.activeIndex];
    },
    filteredStaffsCount() {
      return this.filteredstaffs.length;
    },
  },
  methods: {
    async retrievestaffs() {
      try {
        this.staffs = await StaffService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    refreshList() {
      this.retrievestaffs();
      this.activeIndex = -1;
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
.page {
  text-align: left;
  max-width: 750px;
}
</style>
