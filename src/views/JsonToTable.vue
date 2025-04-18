<script setup lang="ts">
import { ref, watch } from 'vue'

const jsonInput = ref('')
const jsonData = ref<any[]>([])
const headers = ref<string[]>([])
const error = ref('')
const jsonHistory = ref<string[]>([])

const handleCellDoubleClick = (content: any) => {
  try {
    let newContent = ''
    
    // 如果内容是对象或数组，转换为 JSON 字符串
    if (typeof content === 'object' && content !== null) {
      newContent = JSON.stringify(content, null, 2)
    } else {
      // 尝试解析内容是否为 JSON 字符串
      const parsed = JSON.parse(content)
      // 只有当解析后的内容是对象或数组时才更新
      if (typeof parsed === 'object' && parsed !== null) {
        newContent = JSON.stringify(parsed, null, 2)
      }
    }
    
    // 只有当成功获取到新内容时才更新
    if (newContent) {
      // 保存当前内容到历史记录
      jsonHistory.value.push(jsonInput.value)
      jsonInput.value = newContent
    }
  } catch (e) {
    // 如果不是 JSON 或不是对象/数组，不做任何处理
  }
}

const goBack = () => {
  if (jsonHistory.value.length > 0) {
    jsonInput.value = jsonHistory.value.pop() || ''
  }
}

watch(jsonInput, (newValue) => {
  try {
    if (!newValue) {
      jsonData.value = []
      headers.value = []
      error.value = ''
      return
    }
    
    const parsed = JSON.parse(newValue)
    if (Array.isArray(parsed)) {
      jsonData.value = parsed
      if (parsed.length > 0) {
        headers.value = Object.keys(parsed[0])
      }
    } else if (typeof parsed === 'object' && parsed !== null) {
      // 如果是单个对象，转换为数组形式
      jsonData.value = [parsed]
      headers.value = Object.keys(parsed)
    } else {
      throw new Error('请输入有效的 JSON 数组或对象')
    }
    error.value = ''
  } catch (e) {
    error.value = '请输入有效的 JSON 格式'
    jsonData.value = []
    headers.value = []
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-base font-semibold leading-6 text-gray-900">JSON 表格</h3>
        <div class="mt-2 max-w-xl text-sm text-gray-500">
          <p>将 JSON 数组转换为表格格式</p>
        </div>
        <div class="mt-5 space-y-6">
          <div class="space-y-4">
            <div>
              <label for="json-input" class="block text-sm font-medium text-gray-700">JSON 数据</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <textarea
                  id="json-input"
                  v-model="jsonInput"
                  rows="10"
                  class="block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white [&:not(:focus)]:bg-white"
                  placeholder='[{"name": "张三", "age": 25}, {"name": "李四", "age": 30}]'
                ></textarea>
              </div>
              <div v-if="error" class="mt-4 rounded-md bg-red-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">输入错误</h3>
                    <div class="mt-2 text-sm text-red-700">
                      <p>{{ error }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
            <div v-if="jsonData.length === 0" class="flex flex-col items-center justify-center py-12 px-4">
              <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">暂无数据</h3>
              <p class="mt-1 text-sm text-gray-500">请输入有效的 JSON 数组来生成表格</p>
            </div>
            <div v-else>
              <div class="bg-indigo-50 border-b border-indigo-100 px-6 py-3 text-sm text-indigo-700 flex items-center justify-between">
                <div class="flex items-center">
                  <svg class="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>提示：双击表格中的单元格可以继续解析其中的 JSON 内容</p>
                </div>
                <button
                  @click="goBack"
                  :disabled="jsonHistory.length === 0"
                  class="inline-flex items-center rounded-md bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  返回上级
                </button>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        v-for="header in headers"
                        :key="header"
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {{ header }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(row, index) in jsonData" :key="index" class="hover:bg-gray-50">
                      <td
                        v-for="header in headers"
                        :key="header"
                        class="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500 cursor-pointer hover:bg-gray-100"
                        @dblclick="handleCellDoubleClick(row[header])"
                      >
                        {{ row[header] }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 