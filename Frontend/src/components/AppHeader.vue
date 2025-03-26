<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <a href="/" class="navbar-brand">Ứng dụng Quản lý mượn sách</a>
    <div class="mr-auto navbar-nav" v-if="isLogin">
      <div class="nav-item">
        <router-link :to="{ name: 'book' }" class="nav-link">
          Sách <i class="fas fa-book"></i>
        </router-link>
      </div>
      <template v-if="isStaff">
        <div class="nav-item">
          <router-link :to="{ name: 'borrow' }" class="nav-link">
            Quản Lý <i class="fas fa-list"></i>
          </router-link>
        </div>
        <div class="nav-item">
          <router-link :to="{ name: 'publisher' }" class="nav-link">
            Nhà Xuất Bản <i class="fas fa-address-book"></i>
          </router-link>
        </div>
        <div class="nav-item">
          <router-link :to="{ name: 'reader' }" class="nav-link">
            Đọc Giả <i class="fas fa-user"></i>
          </router-link>
        </div>
        <div class="nav-item">
          <router-link :to="{ name: 'staff' }" class="nav-link">
            Nhân Viên <i class="fas fa-users"></i>
          </router-link>
        </div>
      </template>
    </div>
    <div class="ml-auto navbar-nav">
      <div class="nav-item" v-if="isLogin">
        <button @click="logout" class="btn btn-danger">Đăng xuất</button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isLogin: false,
      isStaff: false,
    };
  },
  created() {
    this.checkLogin();
  },
  methods: {
    checkLogin() {
      const user = JSON.parse(localStorage.getItem("user"));
      this.isLogin = !!user;
      this.isStaff = user?.isStaff || false;
    },
    logout() {
      localStorage.removeItem("user");
      this.isLogin = false;
      this.isStaff = false;
      this.$router.push({ name: "login" });
    },
  },
};
</script>
