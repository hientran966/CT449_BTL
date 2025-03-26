import { createWebHistory, createRouter } from "vue-router";
import Book from "@/views/Book.vue";

const routes = [
  //Sách
  {
    path: "/",
    name: "book",
    component: Book,
  },
  {
    path: "/books",
    name: "adminbook",
    component: () => import("@/views/AdminBook.vue"),
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

  //Nhà xuất bản
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

  //Đọc giả
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

  //Nhân viên
  {
    path: "/staff",
    name: "staff",
    component: () => import("@/views/NotFound.vue"),
  },

  //Mượn sách
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

  //Not Found
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

export default router;
