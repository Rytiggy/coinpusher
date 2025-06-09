import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserDetails from '../views/UserDetails.vue'
import NewPlayer from '../views/NewPlayer.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/user/:uid',
      name: 'UserDetails',
      component: UserDetails,
    },
    {
      path: '/new',
      name: 'NewPlayer',
      component: NewPlayer,
    },
  ],
})

export default router
