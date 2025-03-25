<template>
    <div>
        <div class="p-1">
            <strong>Tên:</strong>
            {{ publisher.TENNXB }}
        </div>
        <div class="p-1">
            <strong>Địa chỉ:</strong>
            {{ publisher.DIACHI }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        publisher: { type: Object, required: true },
    },
};
</script>
