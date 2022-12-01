import {  createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/activityTable",
    name: "activityTable",
    component: () =>
      import(/* webpackChunkName: "activityTable" */ "../views/activityTable.vue"),
  },
  {
    path: "/addRealm",
    name: "addRealm",
    component: () =>
      import(/* webpackChunkName: "addRealm" */ "../views/addRealm.vue"),
  },
  {
    path: "/userTable",
    name: "userTable",
    component: () =>
      import(/* webpackChunkName: "userTable" */ "../views/userTable/index.vue"),
  },
  {
    path: "/operationHistory",
    name: "operationHistory",
    component: () =>
      import(/* webpackChunkName: "operationHistory" */ "../views/operationHistory.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
