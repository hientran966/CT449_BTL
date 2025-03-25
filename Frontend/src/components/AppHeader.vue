<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <a href="/" class="navbar-brand">Ứng dụng Quản lý mượn sách</a>
    <div class="mr-auto navbar-nav">
      <div class="nav-item">
        <router-link :to="{ name: 'book' }" class="nav-link">
          Sách
          <i class="fas fa-book"></i>
        </router-link>
      </div>
      <div class="nav-item">
        <router-link :to="{ name: 'adminbook' }" class="nav-link">
          Sách
          <i class="fas fa-list"></i>
        </router-link>
      </div>
      <div class="nav-item">
        <router-link :to="{ name: 'borrow' }" class="nav-link">
          Quản Lý
          <i class="fas fa-list"></i>
        </router-link>
      </div>
      <div class="nav-item">
        <router-link :to="{ name: 'publisher' }" class="nav-link">
          Nhà Xuất Bản
          <i class="fas fa-address-book"></i>
        </router-link>
      </div>
      <div class="nav-item">
        <router-link :to="{ name: 'reader' }" class="nav-link">
          Đọc Giả
          <i class="fas fa-user"></i>
        </router-link>
      </div>
      <div class="nav-item">
        <router-link :to="{ name: 'staff' }" class="nav-link">
          Nhân Viên
          <i class="fas fa-users"></i>
        </router-link>
      </div>
    </div>
  </nav>
</template>
