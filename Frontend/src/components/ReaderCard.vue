<template>
    <div>
        <div class="p-1">
            <strong>Tên:</strong>
            {{ reader.HOLOT }}{{ reader.TEN }}
        </div>
        <div class="p-1">
            <strong>Ngày sinh:</strong>
            {{ reader.NGAYSINH }}
        </div>
        <div class="p-1">
            <strong>Giới tính:</strong>
            {{ reader.PHAI }} == 1 ? 'Nam' : 'Nữ'
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
    };
</script>
