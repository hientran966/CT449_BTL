import { createWebHistory, createRouter } from "vue-router";
import Login from "@/views/Login.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/books",
    name: "book",
    component: () => import("@/views/Book.vue"),
  },
  {
    path: "/books/:id",
    name: "book.edit",
    component: () => import("@/views/BookEdit.vue"),
    props: true,
  },
  {
    path: "/books/add",
    name: "book.add",
    component: () => import("@/views/BookAdd.vue"),
  },
  {
    path: "/publisher",
    name: "publisher",
    component: () => import("@/views/Publisher.vue"),
  },
  {
    path: "/publisher/:id",
    name: "publisher.edit",
    component: () => import("@/views/PublisherEdit.vue"),
    props: true,
  },
  {
    path: "/publisher/add",
    name: "publisher.add",
    component: () => import("@/views/PublisherAdd.vue"),
  },
  {
    path: "/reader",
    name: "reader",
    component: () => import("@/views/Reader.vue"),
  },
  {
    path: "/reader/:id",
    name: "reader.edit",
    component: () => import("@/views/ReaderEdit.vue"),
    props: true,
  },
  {
    path: "/reader/add",
    name: "reader.add",
    component: () => import("@/views/ReaderAdd.vue"),
  },
  {
    path: "/staff",
    name: "staff",
    component: () => import("@/views/Staff.vue"),
  },
  {
    path: "/staff/:id",
    name: "staff.edit",
    component: () => import("@/views/StaffEdit.vue"),
    props: true,
  },
  {
    path: "/borrow",
    name: "borrow",
    component: () => import("@/views/Borrow.vue"),
    props: true,
  },
  {
    path: "/borrow/:id",
    name: "borrow.add",
    component: () => import("@/views/BorrowAdd.vue"),
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("user");

  if (to.name === "login" && isAuthenticated) {
    next({ name: "book" });
  } else {
    next();
  }
});

export default router;
