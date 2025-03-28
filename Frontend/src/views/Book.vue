<template>
  <div class="page row">
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
      <br>
      <h4>
        Sách
        <i class="fas fa-book"></i>
      </h4>
    </div>
    <div class="mt-3 col-md-6">
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
        <button  v-if="isStaff" class="btn btn-sm btn-success" @click="goToAddBook">
          <i class="fas fa-plus"></i> Thêm mới
        </button>
        <button  v-if="isStaff" class="btn btn-sm btn-danger" @click="removeAllBooks">
          <i class="fas fa-trash"></i> Xóa tất cả
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
          v-if="isStaff"
          :to="{
            name: 'book.edit',
            params: { id: activeBook._id },
          }"
        >
          <span class="mt-2 badge badge-warning">
            <i class="fas fa-edit"></i> Hiệu chỉnh</span
          >
        </router-link>
        <button 
          v-else 
          class="mt-2 badge badge-info btn btn-sm btn-primary"
          @click="borrowBook"
        >
          <i class="fas fa-edit"></i> Mượn
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import BookCard from "@/components/BookCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import BookList from "@/components/BookList.vue";
import BookService from "@/services/book.service";
import AuthService from "@/services/auth.service";

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
      isLogin: false,
      isStaff: false,
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
    borrowBook() {
      if (this.activeBook?.SOQUYEN === 0) {
        alert("Sách đã hết, không thể mượn.");
      } else {
        this.$router.push({
          name: "borrow.add",
          params: { id: this.activeBook._id },
        });
      }
    },
  },
  async mounted() {
    this.refreshList();
    try {
      const user = await AuthService.getCurrentUser();
      this.isStaff = user?.isStaff || false;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
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
