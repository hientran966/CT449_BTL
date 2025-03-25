<template>
  <div class="page row">
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
    </div>
    <div class="mt-3 col-md-6">
      <h4>
        Sách
        <i class="fas fa-book"></i>
      </h4>
      <BookList
        v-if="filteredBooksCount > 0"
        :books="filteredBooks"
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
      <div v-if="activeBook">
        <h4>
          Chi tiết
        </h4>
        <BookCard :book="activeBook" />
        <router-link
          :to="{
            name: 'borrow.add',
            params: { id: activeBook._id },
          }"
        >
          <span class="mt-2 badge badge-warning">
            <i class="fas fa-add"></i> Mượn</span
          >
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import BookCard from "@/components/BookCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import BookList from "@/components/BookList.vue";
import BookService from "@/services/book.service";

export default {
  components: {
    BookCard,
    InputSearch,
    BookList,
  },
  data() {
    return {
      books: [],
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
    bookStrings() {
      return this.books.map((book) => {
        const { TENSACH, DONGIA, SOQUYEN, NAMXUATBAN, MANXB, TACGIA } = book;
        return [TENSACH, DONGIA, SOQUYEN, NAMXUATBAN, MANXB, TACGIA].join("");
      });
    },
    filteredBooks() {
      if (!this.searchText) return this.books;
      return this.books.filter((_book, index) =>
        this.bookStrings[index].includes(this.searchText)
      );
    },
    activeBook() {
      if (this.activeIndex < 0) return null;
      return this.filteredBooks[this.activeIndex];
    },
    filteredBooksCount() {
      return this.filteredBooks.length;
    },
  },
  methods: {
    async retrieveBooks() {
      try {
        this.books = await BookService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    refreshList() {
      this.retrieveBooks();
      this.activeIndex = -1;
    },
    async removeAllBooks() {
      if (confirm("Bạn muốn xóa tất cả sách?")) {
        try {
          await BookService.deleteAll();
          this.refreshList();
        } catch (error) {
          console.log(error);
        }
      }
    },
    goToAddBook() {
      this.$router.push({ name: "book.add" });
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
