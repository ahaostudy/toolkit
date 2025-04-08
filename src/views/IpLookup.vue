<template>
  <div class="space-y-6">
    <!-- IP地址查询 -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-base font-semibold leading-6 text-gray-900">IP地址查询</h3>
        <div class="mt-2 max-w-xl text-sm text-gray-500">
          <p>当前IP地址的详细信息</p>
        </div>
        <div class="mt-5">
          <div v-if="ipInfo" class="space-y-2">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt class="truncate text-sm font-medium text-gray-500">IP地址</dt>
                <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{{ ipInfo.ipAddress }}</dd>
              </div>
              <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt class="truncate text-sm font-medium text-gray-500">国家/地区</dt>
                <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{{ ipInfo.countryName }}</dd>
              </div>
              <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt class="truncate text-sm font-medium text-gray-500">城市</dt>
                <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{{ ipInfo.city }}</dd>
              </div>
              <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt class="truncate text-sm font-medium text-gray-500">州/省</dt>
                <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{{ ipInfo.stateProv }}</dd>
              </div>
            </div>
          </div>
          <div v-else-if="error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">获取IP信息失败</h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>请检查网络连接后刷新页面重试</p>
                </div>
                <div class="mt-4">
                  <button
                    @click="getIpInfo"
                    class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                  >
                    重试
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-4">
            <div class="text-sm text-gray-500">正在获取IP信息...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const ipInfo = ref<any>(null)
const error = ref(false)

// IP地址查询
const getIpInfo = async () => {
  error.value = false
  ipInfo.value = null
  
  try {
    const response = await fetch('https://api.db-ip.com/v2/free/self', {
      cache: 'no-store'
    })
    if (!response.ok) {
      throw new Error('请求失败')
    }
    ipInfo.value = await response.json()
  } catch (err) {
    console.error('获取IP信息失败:', err)
    error.value = true
  }
}

// 页面加载时自动获取IP信息
onMounted(() => {
  getIpInfo()
})
</script> 