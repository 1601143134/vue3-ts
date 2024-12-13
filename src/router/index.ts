import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import RouterLayout from '../layout/routerLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: RouterLayout,
    children: [
      {
        path: '/',
        redirect: '/svg'
      },
      {
        path: '/flow',
        meta: { footer: false, menuId: 'login' },
        component: () => import('@/components/Flow/index.vue')
      },
      {
        path: '/Tiptap',
        meta: { menuId: 'case' },
        component: () => import('@/components/Tiptap/index.vue')
      },
      {
        path: '/svg',
        meta: { footer: false, menuId: 'login' },
        component: () => import('@/components/SVGFlow/index.vue')
      },
      {
        path: '/rotate',
        meta: { footer: false, menuId: 'login' },
        component: () => import('@/components/Rotate/index.vue')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  next()
})

export default router