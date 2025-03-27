<template>
    <div>
        <div class="p-1">
            <strong>Tên:</strong>
            {{ fullName }}
        </div>
        <div class="p-1">
            <strong>Ngày sinh:</strong>
            {{ reader.NGAYSINH }}
        </div>
        <div class="p-1">
            <strong>Giới tính:</strong>
            {{ gender }}
        </div>
        <div class="p-1">
            <strong>Địa chỉ:</strong>
            {{ reader.DIACHI }}
        </div>
        <div class="p-1">
            <strong>Số điện thoại:</strong>
            {{ reader.DIENTHOAI }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        reader: { type: Object, required: true },
    },
    computed: {
        gender() {
            return this.reader.PHAI === 1 ? "Nam" : "Nữ";
        },
        fullName() {
            return `${this.reader.HOLOT} ${this.reader.TEN}`;
        }
    }
};
</script>
