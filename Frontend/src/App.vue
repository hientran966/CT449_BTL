<script>
import AppHeader from "@/components/AppHeader.vue";

export default {
  components: {
    AppHeader,
  },
  computed: {
    isLoginPage() {
      return this.$route.name === "login";
    },
  },
};
</script>

<template>
  <div :class="{'login-background': isLoginPage}" id="app">
    <AppHeader v-if="!isLoginPage" />
    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<style>
.login-background {
  background: url('./assets/background.jpg') no-repeat center center;
  background-size: cover;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page {
  max-width: 400px;
  margin: auto;
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
}
</style>
