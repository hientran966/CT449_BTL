<template>
  <div class="page row">
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
      <br>
      <h4>
        Quản lý mượn sách
        <i class="fas fa-list"></i>
      </h4>
    </div>
    <div class="mt-3 col-md-12">
      <BorrowTable
        v-if="filteredCount > 0"
        :borrows="filtered"
      />
      <p v-else>Không có dữ liệu.</p>
    </div>
  </div>
</template>

<script>
import InputSearch from "@/components/InputSearch.vue";
import BorrowService from "@/services/borrow.service";
import BorrowTable from "@/components/BorrowTable.vue";
import AuthService from "@/services/auth.service";
import ReaderService from "@/services/reader.service";

export default {
  components: {
    BorrowTable,
    InputSearch,
  },
  data() {
    return {
      borrows: [],
      searchText: "",
      currentUser: null,
      readerId: null,
    };
  },
  computed: {
    filtered() {
      if (!this.currentUser) return [];
      if (this.currentUser.isStaff) return this.borrows;
      return this.borrows.filter(borrow => borrow.MADOCGIA === this.readerId);
    },
    filteredCount() {
      return this.filtered.length;
    },
  },
  methods: {
    async retrieveBorrows() {
      try {
        this.borrows = await BorrowService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    async getCurrentUser() {
      this.currentUser = await AuthService.getCurrentUser();
      if (this.currentUser && !this.currentUser.isStaff) {
        try {
          const reader = await ReaderService.findByAccountId(this.currentUser._id);
          this.readerId = reader ? reader._id : null;
        } catch (error) {
          console.log("Không tìm thấy thông tin độc giả:", error);
        }
      }
    },
  },
  async mounted() {
    await this.getCurrentUser();
    this.retrieveBorrows();
  },
};
</script>

<style scoped>
.page {
  text-align: left;
  max-width: 100%;
  min-height: 450px;
}
</style>