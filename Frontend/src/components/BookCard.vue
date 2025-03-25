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
            {{ publisherName }}
        </div>
        <div class="p-1">
            <strong>Tác giả:</strong>
            {{ book.TACGIA }}
        </div>
    </div>
</template>

<script>
import PublisherService from "@/services/publisher.service";

    export default {
        props: {
            book: { type: Object, required: true },
        },
        data() {
        return {
            publisherName: ""
        };
    },
    async created() {
        if (this.book.MANXB) {
            const publisher = await PublisherService.get(this.book.MANXB);
            this.publisherName = publisher ? publisher.TENNXB : "Không xác định";
        }
    }
};
</script>
