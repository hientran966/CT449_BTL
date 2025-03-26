<script>
    import BookService from "@/services/book.service";
    import ReaderService from "@/services/reader.service";

    export default {
        props: {
            borrows: { type: Array, default: [] },
        },
        data() {
            return {
                books: {},
                readers: {},
            };
        },
        emits: ["update:activeIndex"],
        methods: {
            async loadData() {
                try {
                    // Lấy danh sách sách
                    const bookList = await BookService.getAll();
                    this.books = bookList.reduce((acc, book) => {
                    acc[book._id] = book.TENSACH;
                    return acc;
                    }, {});

                    // Lấy danh sách độc giả
                    const readerList = await ReaderService.getAll();
                    this.readers = readerList.reduce((acc, reader) => {
                    acc[reader._id] = reader.TEN;
                    return acc;
                    }, {});
                } catch (error) {
                    console.error("Lỗi khi tải dữ liệu:", error);
                }
            },

            getBookName(id) {
                return this.books[id] || "Không xác định";
            },
            getReaderName(id) {
                return this.readers[id] || "Không xác định";
            }
        },
        async created() {
            await this.loadData();
        },
    };
</script>

<template>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th scope="col">Tên sách</th>
                <th scope="col">Người mượn</th>
                <th scope="col">Ngày mượn</th>
                <th scope="col">Ngày trả</th>
                <th scope="col">Trạng thái</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="borrow in borrows" :key="borrow._id">
                <td>{{ getBookName(borrow.MASACH) }}</td>
                <td>{{ getReaderName(borrow.MADOCGIA) }}</td>
                <td>{{ borrow.NGAYMUON }}</td>
                <td>{{ borrow.NGAYTRA }}</td>
                <td class="text-center justify-content-around align-items-center">
                    <a href="#" class="btn btn-warning">Sửa</a>
                    <form action="#" style="display: inline-block;" class="delete-form" method="post">
                        <input type="hidden" value="borrow._id" name="id">
                        <button type="button" class="btn btn-primary"> Duyệt</button>
                    </form>
                </td>
            </tr>
        </tbody>
    </table>
</template>