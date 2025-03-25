import { createWebHistory, createRouter } from "vue-router";
import Book from "@/views/Book.vue";

const routes = [
  {
    path: "/",
    name: "book",
    component: Book,
  },
  {
    path: "/books",
    name: "adminbook",
    component: () => import("@/views/NotFound.vue"),
  },
  {
    path: "/publisher",
    name: "publisher",
    component: () => import("@/views/NotFound.vue"),
  },
  {
    path: "/reader",
    name: "reader",
    component: () => import("@/views/NotFound.vue"),
  },
  {
    path: "/staff",
    name: "staff",
    component: () => import("@/views/NotFound.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
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
    path: "/borrow/:id",
    name: "borrow",
    component: () => import("@/views/Book.vue"),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
