<script>
    export default {
        props: {
        book: { type: Object, required: true },
        },
    };
</script>

<template>
    <div>
        <div class="p-1">
            <strong>Tên:</strong>
            {{ book.TENSACH }}
        </div>
        <div class="p-1">
            <strong>Đơn giá:</strong>
            {{ book.DONGIA }}
        </div>
        <div class="p-1">
            <strong>Số quyển:</strong>
            {{ book.SOQUYEN }}
        </div>
        <div class="p-1">
            <strong>Năm xuất bản:</strong>
            {{ book.NAMXUATBAN }}
        </div>
        <div class="p-1">
            <strong>Nhà xuất bản:</strong>
            {{ book.MANXB }}
        </div>
        <div class="p-1">
            <strong>Tác giả:</strong>
            {{ book.TACGIA }}
        </div>
    </div>
</template>