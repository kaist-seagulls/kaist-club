import { createRouter, createWebHistory } from 'vue-router'

// import DefaultLayout from '@/components/DefaultLayout.vue'
import NonfilteredLayout from '@/components/NonfilteredLayout.vue'
import NoLayout from '@/components/NoLayout.vue'

import AdminView from '@/views/AdminView.vue'
import CalendarView from '@/views/CalendarView.vue'
import ChangePasswordView from '@/views/ChangePasswordView.vue'
import ClubProfileView from '@/views/ClubProfileView.vue'
import CreateClubView from '@/views/CreateClubView.vue'
import CreatePostView from '@/views/CreatePostView.vue'
import EditClubProfileView from '@/views/EditClubProfileView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import MainView from '@/views/MainView.vue'
import ManageClubView from '@/views/ManageClubView.vue'
import SignInView from '@/views/SignInView.vue'
import SignUpView from '@/views/SignUpView.vue'
import UserProfileView from '@/views/UserProfileView.vue'

const routes = [
  {
    path: '/admin',
    name: 'admin',
    meta: { layout: NoLayout },
    component: AdminView,
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: CalendarView,
  },
  {
    path: '/changepassword',
    name: 'changepassword',
    meta: { layout: NonfilteredLayout },
    component: ChangePasswordView,
  },
  {
    path: '/club/:id?',
    name: 'club',
    component: ClubProfileView,
  },
  {
    path: '/newclub',
    name: 'newclub',
    meta: { layout: NoLayout },
    component: CreateClubView,
  },
  {
    path: '/newpost',
    name: 'newpost',
    component: CreatePostView,
  },
  {
    path: '/editclub',
    name: 'editclub',
    component: EditClubProfileView,
  },
  {
    path: '/forgotpassword',
    name: 'forgotpassword',
    meta: { layout: NoLayout },
    component: ForgotPasswordView,
  },
  {
    path: '/',
    name: 'main',
    component: MainView,
  },
  {
    path: '/manageclub',
    name: 'manageclub',
    meta: { layout: NoLayout },
    component: ManageClubView,
  },
  {
    path: '/signin',
    name: 'signin',
    meta: { layout: NoLayout },
    component: SignInView,
  },
  {
    path: '/signup',
    name: 'signup',
    meta: { layout: NoLayout },
    component: SignUpView,
  },
  {
    path: '/mypage',
    name: 'mypage',
    meta: { layout: NonfilteredLayout },
    component: UserProfileView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
