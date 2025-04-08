import { createRouter, createWebHistory } from 'vue-router'
import JsonToTable from '../components/JsonToTable.vue'

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
      component: JsonToTable
    },
    {
      path: '/more',
      name: 'More',
      component: () => import('../components/More.vue')
    }
  ]
})

export default router 