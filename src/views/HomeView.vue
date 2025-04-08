<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  TableCellsIcon,
  ClockIcon,
  CodeBracketIcon,
  GlobeAltIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

const tools = ref([
  {
    name: 'JSON转表格',
    description: '将JSON数据转换为表格形式展示',
    path: '/json-to-table',
    icon: TableCellsIcon
  },
  {
    name: '时间戳工具',
    description: '时间戳转换、时区转换等功能',
    path: '/timestamp',
    icon: ClockIcon
  },
  {
    name: '编码转换',
    description: '支持多种编码格式的转换工具',
    path: '/encoding',
    icon: CodeBracketIcon
  },
  {
    name: 'IP地址查询',
    description: '查询当前IP地址的详细信息',
    path: '/ip-lookup',
    icon: GlobeAltIcon
  }
])
</script>

<template>
  <div class="bg-white">
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Welcome to ToolKit
        </h1>
        <p class="mt-4 text-lg leading-8 text-gray-600">
          这里提供了一系列实用的在线工具，帮助您更高效地完成工作
        </p>
      </div>

      <div class="mt-16">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="tool in tools" 
            :key="tool.name"
            class="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 p-6 hover:border-indigo-500 hover:shadow-lg transition-all duration-200 cursor-pointer"
            @click="router.push(tool.path)"
          >
            <div class="flex items-center">
              <component 
                :is="tool.icon" 
                class="h-8 w-8 text-indigo-600"
              />
              <h3 class="ml-3 text-lg font-semibold text-gray-900">
                {{ tool.name }}
              </h3>
            </div>
            <p class="mt-4 text-sm text-gray-500">
              {{ tool.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 