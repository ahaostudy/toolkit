import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/json-to-table',
      name: 'json-to-table',
      component: () => import('../views/JsonToTable.vue')
    },
    {
      path: '/timestamp',
      name: 'timestamp',
      component: () => import('../views/TimestampTool.vue')
    },
    {
      path: '/encoding',
      name: 'encoding',
      component: () => import('../views/EncodingTool.vue')
    },
    {
      path: '/ip-lookup',
      name: 'ip-lookup',
      component: () => import('../views/IpLookup.vue')
    },
    {
      path: '/color-tools',
      name: 'color-tools',
      component: () => import('../views/ColorTools.vue')
    },
    {
      path: '/document-splitter',
      name: 'document-splitter',
      component: () => import('../views/DocumentSplitter.vue')
    },
    {
      path: '/html-preview',
      name: 'html-preview',
      component: () => import('../views/HtmlPreview.vue')
    },
    {
      path: '/csv-tool',
      name: 'csv-tool',
      component: () => import('../views/CsvTool.vue')
    },
    {
      path: '/more',
      name: 'more',
      component: () => import('../views/MoreView.vue')
    }
  ]
})

export default router 