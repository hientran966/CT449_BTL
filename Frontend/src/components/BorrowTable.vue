<template>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th scope="col">Tên sách</th>
                <th scope="col">Người mượn</th>
                <th scope="col">Ngày mượn</th>
                <th scope="col">Ngày trả</th>
                <th scope="col">Trạng thái</th>
                <th v-if="isStaff" scope="col">Hành động</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="borrow in filteredBorrows" :key="borrow._id">
                <td>{{ getBookName(borrow.MASACH) }}</td>
                <td>{{ getReaderName(borrow.MADOCGIA) }}</td>
                <td>{{ borrow.NGAYMUON }}</td>
                <td>{{ borrow.NGAYTRA }}</td>
                <td>{{ borrow.TRANGTHAI }}</td>
                <td v-if="isStaff" class="text-center">
                    <button 
                        v-if="borrow.TRANGTHAI === 'Chưa Duyệt'" 
                        @click="updateStatus(borrow, 'Đã Duyệt')" 
                        class="btn btn-primary">
                        Duyệt
                    </button>
                    <button 
                        v-if="borrow.TRANGTHAI === 'Đã Duyệt'" 
                        @click="updateStatus(borrow, 'Đã Trả')" 
                        class="btn btn-success">
                        Đã Trả
                    </button>
                    <i v-if="borrow.TRANGTHAI === 'Đã Trả'" class="fas fa-check"></i>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import BookService from "@/services/book.service";
import ReaderService from "@/services/reader.service";
import BorrowService from "@/services/borrow.service";
import AuthService from "@/services/auth.service";

export default {
    props: {
        borrows: { type: Array, default: [] },
        searchText: { type: String, default: '' },
    },
    data() {
        return {
            books: {},
            readers: {},
            isStaff: false,
        };
    },
    computed: {
        filteredBorrows() {
            if (!this.searchText) return this.borrows;
            const search = this.searchText.toLowerCase();
            return this.borrows.filter(borrow => 
                this.getBookName(borrow.MASACH).toLowerCase().includes(search) ||
                this.getReaderName(borrow.MADOCGIA).toLowerCase().includes(search) ||
                borrow.NGAYMUON.includes(search) ||
                borrow.NGAYTRA.includes(search) ||
                borrow.TRANGTHAI.toLowerCase().includes(search)
            );
        }
    },
    methods: {
        async loadData() {
            try {
                const bookList = await BookService.getAll();
                this.books = bookList.reduce((acc, book) => {
                    acc[book._id] = book.TENSACH;
                    return acc;
                }, {});

                const readerList = await ReaderService.getAll();
                this.readers = readerList.reduce((acc, reader) => {
                    acc[reader._id] = reader.TEN;
                    return acc;
                }, {});
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            }
        },

        async getCurrentUser() {
            const user = await AuthService.getCurrentUser();
            this.isStaff = user?.isStaff || false;
        },

        getBookName(id) {
            return this.books[id] || "Không xác định";
        },
        getReaderName(id) {
            return this.readers[id] || "Không xác định";
        },

        async updateStatus(borrow, newStatus) {
            if (newStatus === "Đã Trả") {
                const confirmReturn = confirm(`Bạn có chắc chắn muốn đánh dấu sách "${this.getBookName(borrow.MASACH)}" là "Đã Trả" không?`);
                if (!confirmReturn) {
                    return;
                }
            }
            try {
                await BorrowService.update(borrow._id, { TRANGTHAI: newStatus });
                borrow.TRANGTHAI = newStatus;
            } catch (error) {
                console.error("Lỗi khi cập nhật trạng thái:", error);
            }
        }
    },

    async created() {
        await this.getCurrentUser();
        await this.loadData();
    },
};
</script>