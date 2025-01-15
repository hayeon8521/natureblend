import MainPage from "../views/MainPage.vue";

const mainRoutes = [
  {
    path: "/",
    name: "/",
    redirect: "/mainpage",
  },
  {
    path: "/mainpage",
    name: "MainPage",
    component: MainPage,
  },
];

export default mainRoutes;