<template>
  <div class="page row">
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
    </div>
    <div class="mt-3 col-md-6">
      <h4>
        Quản lý mượn sách
        <i class="fas fa-borrow"></i>
      </h4>
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

export default {
  components: {
    BorrowTable,
    InputSearch,
  },
  data() {
    return {
      borrows: [],
      searchText: "",
    };
  },
  computed: {
    borrowStrings() {
      return this.borrows.map((borrow) => {
        const { MASACH, MADOCGIA, NGAYMUON, NGAYTRA } = borrow;
        return [MASACH, MADOCGIA, NGAYMUON, NGAYTRA].join("");
      });
    },
    filtered() {
      if (!this.searchText) return this.borrows;
      return this.borrows.filter((_borrow, index) =>
        this.borrowStrings[index].includes(this.searchText)
      );
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
    refreshList() {
      this.retrieveBorrows();
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
