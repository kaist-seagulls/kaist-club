import { createRouter, createWebHistory } from "vue-router"

import DefaultLayout from "@/components/DefaultLayout.vue"
import NonfilteredLayout from "@/components/NonfilteredLayout.vue"
import NoLayout from "@/components/NoLayout.vue"

import AdminView from "@/views/AdminView.vue"
import CalendarView from "@/views/CalendarView.vue"
import ChangePasswordView from "@/views/ChangePasswordView.vue"
import ClubProfileView from "@/views/ClubProfileView.vue"
import CreateClubView from "@/views/CreateClubView.vue"
import CreatePostView from "@/views/CreatePostView.vue"
import EditClubProfileView from "@/views/EditClubProfileView.vue"
import ForgotPasswordView from "@/views/ForgotPasswordView.vue"
import MainView from "@/views/MainView.vue"
import ManageClubView from "@/views/ManageClubView.vue"
import SignInView from "@/views/SignInView.vue"
import SignUpView from "@/views/SignUpView.vue"
import UserProfileView from "@/views/UserProfileView.vue"
import NotFoundView from "@/views/NotFoundView.vue"
// import axios from "axios"
import store from "@/store"

const routes = [
  {
    path: "/admin",
    name: "admin",
    meta: { layout: NoLayout },
    component: AdminView,
  },
  {
    path: "/calendar/:month(\\d+)/:year(\\d+)",
    name: "calendar",
    meta: { layout: DefaultLayout },
    component: CalendarView,
    props: true,
  },
  {
    path: "/changepassword",
    name: "changepassword",
    meta: { layout: NonfilteredLayout },
    component: ChangePasswordView,
  },
  {
    path: "/club/:clubName",
    name: "club",
    meta: { layout: DefaultLayout },
    component: ClubProfileView,
    props: true,
  },
  {
    path: "/newclub",
    name: "newclub",
    meta: { layout: NoLayout },
    component: CreateClubView,
  },
  {
    path: "/newpost",
    name: "newpost",
    meta: { layout: DefaultLayout },
    component: CreatePostView,
  },
  {
    path: "/editclub",
    name: "editclub",
    meta: { layout: DefaultLayout },
    component: EditClubProfileView,
  },
  {
    path: "/forgotpassword",
    name: "forgotpassword",
    meta: { layout: NoLayout },
    component: ForgotPasswordView,
  },
  {
    path: "/",
    name: "main",
    meta: { layout: DefaultLayout },
    component: MainView,
  },
  {
    path: "/manageclub",
    name: "manageclub",
    meta: { layout: NoLayout },
    component: ManageClubView,
  },
  {
    path: "/signin",
    name: "signin",
    meta: { layout: NoLayout },
    component: SignInView,
  },
  {
    path: "/signup",
    name: "signup",
    meta: { layout: NoLayout },
    component: SignUpView,
  },
  {
    path: "/mypage",
    name: "mypage",
    meta: { layout: NonfilteredLayout },
    component: UserProfileView,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    meta: { layout: NoLayout },
    component: NotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  // console.log("beforeEach", to, from)
  if (to.name === "main") {
    if (to.query.q) {
      store.dispatch("updateSearchQ", to.query.q)
    }
    if (to.query.page) {
      store.dispatch("updateSearchPage", Number(to.query.page))
    }
  }
  const cont = async () => {
    try {
      // const userInfo = (await axios.get("/api/v1/get-user-info")).data
      // const userId = userInfo.userId
      // const isAdminString = userInfo.isAdmin ? "an ADMIN" : "NOT an ADMIN"
      // const phone = userInfo.phone
      // const representingClubString = userInfo.representingClub ? userInfo.representingClub : "NO CLUB"
      // console.log(`SIGNED IN AS ${userId}, ${isAdminString}, ${phone}, representing ${representingClubString}`)
      await store.dispatch("fetchData", { to })
      next()
    } catch (e) {
      alert(e)
      if (e === 404) {
        next("/notfound")
      } else if (e.response.status === 401 || e.response.status === 503) {
        next("/signin")
      } else {
        next("/")
      }
    }
  }
  cont()
})

export default router
