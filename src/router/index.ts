import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/json-to-table'
    },
    {
      path: '/json-to-table',
      name: 'JsonToTable',
      component: () => import('../components/JsonToTable.vue')
    },
    {
      path: '/timestamp',
      name: 'TimestampTool',
      component: () => import('../components/TimestampTool.vue')
    },
    {
      path: '/more',
      name: 'More',
      component: () => import('../components/More.vue')
    }
  ]
})

export default router 