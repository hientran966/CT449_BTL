<template>
  <Form @submit="submitBorrow" :validation-schema="borrowFormSchema">
    <div class="form-group">
      <label for="MASACH">Tên Sách</label>
      <Field name="MASACH" type="text" class="form-control" v-model="bookTitle" disabled />
    </div>

    <div class="form-group">
      <label for="MADOCGIA">Tìm kiếm độc giả:</label>
      <input
        type="text"
        class="form-control"
        v-model="searchQuery"
        @input="filterReaders"
        placeholder="Nhập tên độc giả..."
      />
      <ul v-if="filteredReaders.length || searchQuery" class="list-group">
        <li class="list-group-item" v-for="reader in filteredReaders" :key="reader._id" @click="selectReader(reader)">
          {{ reader.HOLOT }} {{ reader.TEN }}
        </li>
        <li v-if="!filteredReaders.length && searchQuery" class="list-group-item text-danger" @click="registerNewReader">
          + Đăng ký độc giả mới: "{{ searchQuery }}"
        </li>
      </ul>
    </div>

    <div v-if="selectedReader" class="form-group">
      <div class="p-1"><strong>Tên:</strong> {{ selectedReader.HOLOT }} {{ selectedReader.TEN }}</div>
      <div class="p-1"><strong>Ngày sinh:</strong> {{ selectedReader.NGAYSINH }}</div>
      <div class="p-1"><strong>Giới tính:</strong> {{ selectedReader.PHAI === 1 ? "Nam" : "Nữ" }}</div>
      <div class="p-1"><strong>Địa chỉ:</strong> {{ selectedReader.DIACHI }}</div>
      <div class="p-1"><strong>Số điện thoại:</strong> {{ selectedReader.DIENTHOAI }}</div>
    </div>

    <div class="form-group" v-if="isRegistering">
      <h5>Đăng ký độc giả mới</h5>
      <input type="text" v-model="newReader.HOLOT" placeholder="Họ lót" class="form-control mb-2" />
      <input type="text" v-model="newReader.TEN" placeholder="Tên" class="form-control mb-2" />
      <input type="date" v-model="newReader.NGAYSINH" class="form-control mb-2" />
      <select v-model="newReader.PHAI" class="form-control mb-2">
        <option :value="1">Nam</option>
        <option :value="0">Nữ</option>
      </select>
      <input type="text" v-model="newReader.DIACHI" placeholder="Địa chỉ" class="form-control mb-2" />
      <input type="text" v-model="newReader.DIENTHOAI" placeholder="Số điện thoại" class="form-control mb-2" />
      <button class="btn btn-success" @click.prevent="saveNewReader">Lưu độc giả mới</button>
    </div>

    <div class="form-group">
      <label for="NGAYMUON">Ngày Mượn</label>
      <Field name="NGAYMUON" type="date" class="form-control" v-model="borrowLocal.NGAYMUON" />
      <ErrorMessage name="NGAYMUON" class="error-feedback" />
    </div>

    <div class="form-group">
      <button class="btn btn-primary">Lưu</button>
      <button type="button" class="ml-2 btn btn-danger" @click="Cancel">Thoát</button>
    </div>
  </Form>
</template>

<script>
import ReaderService from "@/services/reader.service";
import BookService from "@/services/book.service";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["submit:borrow"],
  props: ["id"],
  data() {
    return {
      borrowLocal: {
        MASACH: this.id,
        MADOCGIA: "",
        NGAYMUON: "",
      },
      readers: [],
      filteredReaders: [],
      searchQuery: "",
      selectedReader: null,
      bookTitle: "",
      isRegistering: false,
      newReader: {
        HOLOT: "",
        TEN: "",
        NGAYSINH: "",
        PHAI: 1,
        DIACHI: "",
        DIENTHOAI: "",
      },
    };
  },
  methods: {
    submitBorrow() {
      this.$emit("submit:borrow", this.borrowLocal);
    },
    filterReaders() {
      if (this.searchQuery.trim() === "") {
        this.filteredReaders = [];
        return;
      }
      this.filteredReaders = this.readers.filter(reader =>
        (reader.HOLOT + " " + reader.TEN).toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    selectReader(reader) {
      this.borrowLocal.MADOCGIA = reader._id;
      this.selectedReader = reader;
      this.searchQuery = reader.HOLOT + " " + reader.TEN;
      this.filteredReaders = [];
      this.isRegistering = false; // Ẩn form đăng ký nếu đã chọn
    },
    registerNewReader() {
      this.isRegistering = true;
      this.newReader.HOLOT = "";
      this.newReader.TEN = this.searchQuery;
      this.newReader.NGAYSINH = "";
      this.newReader.PHAI = 1;
      this.newReader.DIACHI = "";
      this.newReader.DIENTHOAI = "";
    },
    async saveNewReader() {
      try {
        const newReader = await ReaderService.create(this.newReader);
        this.readers.push(newReader);
        this.selectReader(newReader);
        this.isRegistering = false;
        alert("Đăng ký độc giả thành công!");
      } catch (error) {
        console.error("Lỗi đăng ký độc giả:", error);
        alert("Không thể đăng ký độc giả.");
      }
    },
    Cancel() {
      if (confirm("Bạn có chắc muốn thoát?")) {
        this.$router.push({ name: "borrow" });
      }
    },
  },
  async created() {
    console.log("ID nhận được:", this.id);
    const book = await BookService.get(this.id);
    this.bookTitle = book ? book.TENSACH : "Không xác định";
    this.readers = await ReaderService.getAll();
  },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>
