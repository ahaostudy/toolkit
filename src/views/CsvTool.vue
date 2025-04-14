<template>
  <div class="space-y-6">
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-base font-semibold leading-6 text-gray-900">CSV工具</h3>
        <div class="mt-2 max-w-xl text-sm text-gray-500">
          <p>支持CSV文件的导入、预览和编辑</p>
        </div>
        <div class="mt-5">
          <!-- 输入区域 -->
          <div class="space-y-4">
            <!-- 切换按钮 -->
            <div class="flex justify-center space-x-4">
              <button
                @click="inputMode = 'file'"
                :class="[
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                  inputMode === 'file'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                ]"
              >
                文件上传
              </button>
              <button
                @click="inputMode = 'text'"
                :class="[
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                  inputMode === 'text'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                ]"
              >
                文本输入
              </button>
            </div>

            <!-- 文件上传区域 -->
            <div v-if="inputMode === 'file'"
              class="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-12 text-center cursor-pointer hover:border-indigo-500 transition-colors"
              @dragover.prevent
              @drop.prevent="handleDrop"
              @click="triggerFileInput"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".csv,.xlsx,.xls"
                class="hidden"
                @change="handleFileUpload"
              />
              <div class="space-y-4">
                <svg class="mx-auto h-8 sm:h-12 w-8 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p v-if="!fileName" class="text-gray-600 text-sm sm:text-base">拖拽文件到此处或点击上传</p>
                <p v-else class="text-gray-600 text-sm sm:text-base">已上传文件: {{ fileName }}</p>
                <p class="text-xs sm:text-sm text-gray-500">支持CSV、Excel文件</p>
              </div>
            </div>

            <!-- 文本输入区域 -->
            <div v-else>
              <div class="mt-1 relative rounded-md shadow-sm">
                <textarea
                  id="csv-input"
                  v-model="csvText"
                  class="block w-full rounded-md border-0 !py-2 !px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:text-base sm:leading-6 bg-white [&:not(:focus)]:bg-white h-[240px] resize-none overflow-y-auto"
                  placeholder="请输入CSV格式的数据，每行一条记录，字段之间用逗号分隔"
                  @input="handleTextInput"
                  style="height: 240px !important;"
                ></textarea>
              </div>
            </div>
          </div>

          <div v-if="isLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            <p class="mt-2 text-gray-600">正在加载数据...</p>
          </div>

          <div v-else-if="csvData.length" class="mt-6">
            <!-- 导出按钮 -->
            <div class="mb-4">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <button
                  @click="downloadCsv"
                  class="w-full inline-flex items-center justify-center rounded-lg bg-blue-50 px-4 py-3 sm:py-4 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-inset ring-blue-200 hover:bg-blue-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="!csvData.length"
                >
                  <svg class="h-5 w-5 sm:h-6 sm:w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 8h.01M12 8h.01M16 8h.01" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16h.01M12 16h.01M16 16h.01" />
                  </svg>
                  导出CSV
                </button>
                <button
                  @click="downloadExcel"
                  class="w-full inline-flex items-center justify-center rounded-lg bg-green-50 px-4 py-3 sm:py-4 text-sm font-semibold text-green-600 shadow-sm ring-1 ring-inset ring-green-200 hover:bg-green-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="!csvData.length"
                >
                  <svg class="h-5 w-5 sm:h-6 sm:w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  导出Excel
                </button>
                <button
                  @click="copyToClipboard"
                  class="w-full inline-flex items-center justify-center rounded-lg bg-indigo-50 px-4 py-3 sm:py-4 text-sm font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-200 hover:bg-indigo-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="!csvData.length"
                >
                  <svg 
                    v-if="!copySuccess"
                    class="h-5 w-5 sm:h-6 sm:w-6 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <svg 
                    v-else 
                    class="h-5 w-5 sm:h-6 sm:w-6 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ copySuccess ? '已复制' : '复制到剪贴板' }}
                </button>
              </div>
            </div>

            <!-- 表格 -->
            <div class="overflow-x-auto border border-gray-200 rounded relative">
              <div class="min-w-full">
                <table class="border-collapse w-full">
                  <colgroup>
                    <col style="width: 40px">
                    <col v-for="(_, index) in headers" :key="index" :style="{ width: getColumnWidth(index) + 'px' }">
                  </colgroup>
                  <thead class="sticky top-0 z-10">
                    <tr class="relative">
                      <th class="py-1 px-2 text-center text-sm font-semibold text-gray-900 bg-gray-100 border-r border-gray-200 select-none relative"
                      >
                      </th>
                      <th
                        v-for="(header, index) in headers"
                        :key="index"
                        class="py-1 px-2 text-center text-sm font-semibold text-gray-900 bg-gray-100 border-r border-gray-200 relative select-none"
                        :class="{
                          'dragging': isDragging && dragSourceIndex === index,
                          'drag-over': isDragging && dragOverIndex === index
                        }"
                        draggable="true"
                        @dragstart="handleHeaderDragStart($event, index)"
                        @dragover.prevent="handleHeaderDragOver($event, index)"
                        @dragenter.prevent="handleHeaderDragEnter($event, index)"
                        @dragleave.prevent="handleHeaderDragLeave($event, index)"
                        @drop="handleHeaderDrop($event, index)"
                        @touchstart="handleTouchStart($event, index)"
                        @touchmove="handleTouchMove($event, index)"
                        @touchend="handleTouchEnd($event, index)"
                      >
                        <div class="flex items-center justify-center h-full">
                          {{ header }}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="(row, rowIndex) in paginatedData" 
                      :key="rowIndex"
                      class="hover:bg-gray-50"
                    >
                      <td class="whitespace-nowrap py-1 px-2 text-sm text-gray-500 text-center bg-gray-50 relative border border-gray-200">
                        {{ getActualRowIndex(rowIndex) }}
                      </td>
                      <td
                        v-for="(_, cellIndex) in row"
                        :key="cellIndex"
                        class="text-sm text-gray-500 bg-white relative border border-gray-200 hover:border-indigo-400"
                      >
                        <div class="p-0.5">
                          <textarea
                            v-model="csvData[getActualRowIndex(rowIndex)][cellIndex]"
                            class="w-full h-full resize-none outline-none bg-transparent text-sm text-gray-900"
                            @change="handleCellChange"
                            @focus="handleCellFocus($event)"
                            @blur="handleCellBlur($event)"
                            @input="autoResize($event)"
                            ref="textareas"
                            rows="1"
                          ></textarea>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- 分页控制 -->
          <div v-if="csvData.length" class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">每页显示:</span>
              <select 
                v-model="pageSize" 
                class="block w-32 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 text-sm"
                @change="handlePageSizeChange"
              >
                <option value="50">50行</option>
                <option value="100">100行</option>
                <option value="200">200行</option>
                <option value="500">500行</option>
              </select>
            </div>
            <div class="flex flex-col sm:flex-row items-center gap-4">
              <div class="flex items-center gap-2">
                <button 
                  @click="prevPage" 
                  :disabled="currentPage === 1"
                  class="inline-flex items-center justify-center rounded-md bg-white p-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div class="flex items-center gap-1">
                  <button
                    v-for="page in displayedPages"
                    :key="page"
                    @click="goToPage(page)"
                    :class="[
                      'inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-md transition-colors duration-200',
                      page === currentPage
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-900 hover:bg-gray-50'
                    ]"
                  >
                    {{ page === -1 ? '...' : page }}
                  </button>
                </div>
                <button 
                  @click="nextPage" 
                  :disabled="currentPage === totalPages"
                  class="inline-flex items-center justify-center rounded-md bg-white p-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <span class="text-sm text-gray-600">
                共 {{ totalPages }} 页
              </span>
            </div>
          </div>

          <div v-else class="text-center text-gray-500 mt-4 text-sm">
            请上传CSV文件或输入CSV数据
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

const fileInput = ref<HTMLInputElement | null>(null)
const csvText = ref('')
const csvData = ref<string[][]>([])
const headers = ref<string[]>([])
const isLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(50)
const isDragging = ref(false)
const dragSourceIndex = ref(-1)
const dragOverIndex = ref(-1)
const dragPreview = ref<HTMLElement | null>(null)
const dragStartX = ref(0)
const dragStartY = ref(0)
const dragOffsetX = ref(0)
const dragOffsetY = ref(0)
const copySuccess = ref(false)
const inputMode = ref<'file' | 'text'>('file')
const fileName = ref('')

// 触摸相关状态
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchStartTime = ref(0)
const touchMoveThreshold = 10 // 触摸移动阈值
const longPressThreshold = 500 // 长按阈值

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil((csvData.value.length - 1) / Number(pageSize.value))
})

// 计算要显示的页码
const displayedPages = computed(() => {
  const delta = 2
  const range: number[] = []
  const rangeWithDots: number[] = []
  let l: number

  for (let i = 1; i <= totalPages.value; i++) {
    if (
      i === 1 ||
      i === totalPages.value ||
      (i >= currentPage.value - delta && i <= currentPage.value + delta)
    ) {
      range.push(i)
    }
  }

  range.forEach(i => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push(-1)
      }
    }
    rangeWithDots.push(i)
    l = i
  })

  return rangeWithDots
})

// 获取当前页的数据
const paginatedData = computed(() => {
  const dataWithoutHeaders = csvData.value.slice(1)
  const start = (currentPage.value - 1) * Number(pageSize.value)
  const end = start + Number(pageSize.value)
  return dataWithoutHeaders.slice(start, end)
})

// 获取实际的行索引
const getActualRowIndex = (index: number) => {
  return (currentPage.value - 1) * Number(pageSize.value) + index + 1
}

// 获取列宽度
const getColumnWidth = (_: number) => {
  return 100
}

// 自动调整文本域高度
const autoResize = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  if (textarea.id === 'csv-input') return
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

// 初始化所有文本域高度
const initTextareaHeights = () => {
  const textareas = document.querySelectorAll('textarea')
  textareas.forEach(textarea => {
    if (textarea.id === 'csv-input') return
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
  })
}

// 监听数据变化，重新计算高度
watch(csvData, () => {
  nextTick(() => {
    initTextareaHeights()
  })
})

// 跳转到指定页
const goToPage = (page: number) => {
  if (page !== -1 && page !== currentPage.value) {
    currentPage.value = page
  }
}

// 处理表头拖拽开始
const handleHeaderDragStart = (event: DragEvent, index: number) => {
  if (!event.dataTransfer) return
  
  // 设置拖拽数据
  event.dataTransfer.setData('text/plain', index.toString())
  event.dataTransfer.effectAllowed = 'move'
  
  // 创建拖拽预览元素
  const header = headers.value[index]
  dragPreview.value = document.createElement('div')
  dragPreview.value.className = 'fixed bg-indigo-100 text-indigo-900 px-4 py-2 rounded shadow-lg pointer-events-none z-50'
  dragPreview.value.textContent = header
  document.body.appendChild(dragPreview.value)
  
  // 记录拖拽起始位置
  dragStartX.value = event.clientX
  dragStartY.value = event.clientY
  dragOffsetX.value = event.clientX - (dragPreview.value.getBoundingClientRect().left || 0)
  dragOffsetY.value = event.clientY - (dragPreview.value.getBoundingClientRect().top || 0)
  
  // 更新拖拽状态
  isDragging.value = true
  dragSourceIndex.value = index
  
  // 添加拖拽移动事件监听
  document.addEventListener('dragover', handleDragMove)
  document.addEventListener('drop', handleDragEnd)
  document.addEventListener('dragend', handleDragEnd)
}

// 处理拖拽移动
const handleDragMove = (event: DragEvent) => {
  if (!dragPreview.value) return
  
  // 更新预览元素位置
  dragPreview.value.style.left = `${event.clientX - dragOffsetX.value}px`
  dragPreview.value.style.top = `${event.clientY - dragOffsetY.value}px`
}

// 处理拖拽结束
const handleDragEnd = () => {
  // 移除拖拽预览元素
  if (dragPreview.value) {
    document.body.removeChild(dragPreview.value)
    dragPreview.value = null
  }
  
  // 移除事件监听
  document.removeEventListener('dragover', handleDragMove)
  document.removeEventListener('drop', handleDragEnd)
  document.removeEventListener('dragend', handleDragEnd)
  
  // 重置拖拽状态
  isDragging.value = false
  dragSourceIndex.value = -1
  dragOverIndex.value = -1
}

// 处理表头拖拽经过
const handleHeaderDragOver = (event: DragEvent, index: number) => {
  event.preventDefault()
  if (index !== dragSourceIndex.value) {
    dragOverIndex.value = index
  }
}

// 处理表头拖拽进入
const handleHeaderDragEnter = (event: DragEvent, index: number) => {
  event.preventDefault()
  if (index !== dragSourceIndex.value) {
    dragOverIndex.value = index
  }
}

// 处理表头拖拽离开
const handleHeaderDragLeave = (event: DragEvent, index: number) => {
  event.preventDefault()
  if (dragOverIndex.value === index) {
    dragOverIndex.value = -1
  }
}

// 处理表头拖拽放置
const handleHeaderDrop = (event: DragEvent, targetIndex: number) => {
  event.preventDefault()
  const sourceIndex = parseInt(event.dataTransfer?.getData('text/plain') || '-1')
  if (sourceIndex === -1 || sourceIndex === targetIndex) return

  // 交换表头
  const tempHeader = headers.value[sourceIndex]
  headers.value[sourceIndex] = headers.value[targetIndex]
  headers.value[targetIndex] = tempHeader

  // 交换数据列
  csvData.value.forEach(row => {
    const temp = row[sourceIndex]
    row[sourceIndex] = row[targetIndex]
    row[targetIndex] = temp
  })
}

// 处理文本输入
const handleTextInput = () => {
  if (!csvText.value) {
    csvData.value = []
    headers.value = []
    return
  }

  try {
    const results = Papa.parse(csvText.value)
    if (results.data.length > 0) {
      const filteredData = results.data.filter((row: unknown) => 
        Array.isArray(row) && row.some(cell => cell !== null && cell !== '')
      ) as string[][]
      
      headers.value = filteredData[0]
      csvData.value = filteredData
    }
  } catch (error) {
    console.error('Error parsing CSV:', error)
  }
}

const handleCellChange = () => {
  // 可以在这里添加数据验证或其他处理
}

// 复制到剪贴板
const copyToClipboard = async () => {
  if (!csvData.value.length) return

  const csvContent = Papa.unparse(csvData.value)
  try {
    await navigator.clipboard.writeText(csvContent)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 1500)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

const downloadCsv = () => {
  if (!csvData.value.length) return

  // 生成时间戳
  const now = new Date()
  const timestamp = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`
  
  // 生成文件名
  let outputFileName = 'data'
  if (fileName.value) {
    // 提取不带扩展名的文件名
    const nameWithoutExt = fileName.value.replace(/\.[^/.]+$/, "")
    outputFileName = nameWithoutExt
  }
  
  const finalFileName = `${outputFileName}-${timestamp}.csv`

  const csvContent = Papa.unparse(csvData.value)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = finalFileName
  link.click()
}

// 分页相关方法
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const handlePageSizeChange = () => {
  currentPage.value = 1
  // 确保pageSize是数字类型
  pageSize.value = Number(pageSize.value)
}

const handleCellFocus = (event: FocusEvent) => {
  const cell = (event.target as HTMLElement).closest('td')
  if (cell) {
    cell.style.borderColor = '#6366f1'
    cell.style.zIndex = '10'
  }
}

const handleCellBlur = (event: FocusEvent) => {
  const cell = (event.target as HTMLElement).closest('td')
  if (cell) {
    cell.style.borderColor = ''
    cell.style.zIndex = ''
  }
}

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 处理文件拖放
const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file && file.type === 'text/csv') {
    handleFileUpload({ target: { files: [file] } } as any)
  }
}

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  fileName.value = file.name
  isLoading.value = true
  currentPage.value = 1

  if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
        
        if (jsonData.length > 0) {
          const filteredData = jsonData.filter((row: unknown) => 
            Array.isArray(row) && row.some(cell => cell !== null && cell !== '')
          ) as string[][]
          
          headers.value = filteredData[0]
          csvData.value = filteredData
        }
        isLoading.value = false
      } catch (error) {
        console.error('Error parsing Excel:', error)
        alert('Excel解析错误，请检查文件格式')
        isLoading.value = false
      }
    }
    reader.readAsArrayBuffer(file)
  } else {
    Papa.parse(file, {
      complete: (results) => {
        if (results.data.length > 0) {
          const filteredData = results.data.filter((row: unknown) => 
            Array.isArray(row) && row.some(cell => cell !== null && cell !== '')
          ) as string[][]
          
          headers.value = filteredData[0]
          csvData.value = filteredData
        }
        isLoading.value = false
      },
      error: (error) => {
        console.error('Error parsing CSV:', error)
        alert('CSV解析错误，请检查文件格式')
        isLoading.value = false
      }
    })
  }
}

// 导出为Excel
const downloadExcel = () => {
  if (!csvData.value.length) return

  // 生成时间戳
  const now = new Date()
  const timestamp = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`
  
  // 生成文件名
  let outputFileName = 'data'
  if (fileName.value) {
    // 提取不带扩展名的文件名
    const nameWithoutExt = fileName.value.replace(/\.[^/.]+$/, "")
    outputFileName = nameWithoutExt
  }
  
  const finalFileName = `${outputFileName}-${timestamp}.xlsx`
  
  // 创建工作簿
  const wb = XLSX.utils.book_new()
  
  // 将CSV数据转换为工作表
  const ws = XLSX.utils.aoa_to_sheet(csvData.value)
  
  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  
  // 导出文件
  XLSX.writeFile(wb, finalFileName)
}

// 处理触摸开始
const handleTouchStart = (event: TouchEvent, index: number) => {
  touchStartX.value = event.touches[0].clientX
  touchStartY.value = event.touches[0].clientY
  touchStartTime.value = Date.now()
  
  // 模拟长按事件
  setTimeout(() => {
    if (Date.now() - touchStartTime.value >= longPressThreshold) {
      handleHeaderDragStart(event as any, index)
    }
  }, longPressThreshold)
}

// 处理触摸移动
const handleTouchMove = (event: TouchEvent, index: number) => {
  const touch = event.touches[0]
  const deltaX = touch.clientX - touchStartX.value
  const deltaY = touch.clientY - touchStartY.value
  
  if (Math.abs(deltaX) > touchMoveThreshold || Math.abs(deltaY) > touchMoveThreshold) {
    handleHeaderDragOver(event as any, index)
  }
}

// 处理触摸结束
const handleTouchEnd = (event: TouchEvent, index: number) => {
  handleDragEnd()
}
</script>

<style scoped>
.overflow-x-auto {
  max-height: calc(100vh - 200px);
  overflow: auto;
  width: 100%;
}

table {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  width: 100%;
}

thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

th {
  border: 1px solid #e5e7eb !important;
  position: relative;
  box-sizing: border-box;
  padding: 0 !important;
  vertical-align: middle;
  overflow: visible;
  transition: background-color 0.2s, transform 0.2s;
  background-color: #f3f4f6;
}

th.dragging {
  background-color: #e0e7ff !important;
  transform: scale(1.02);
  z-index: 10;
}

th.drag-over {
  background-color: #c7d2fe !important;
  transform: scale(1.02);
  z-index: 10;
}

th > div {
  padding: 4px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  transition: opacity 0.2s;
}

th.dragging > div {
  opacity: 0.5;
}

td {
  border-top: 1px solid #e5e7eb !important;
  border-right: 1px solid #e5e7eb !important;
  border-bottom: 1px solid #e5e7eb !important;
  border-left: 1px solid #e5e7eb !important;
  position: relative;
  box-sizing: border-box;
  padding: 0 !important;
  transition: border-color 0.2s;
  min-height: 24px;
}

td:focus-within {
  border-top: 2px solid #6366f1 !important;
  border-right: 2px solid #6366f1 !important;
  border-bottom: 2px solid #6366f1 !important;
  border-left: 2px solid #6366f1 !important;
  box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.2);
  z-index: 2;
  outline: 2px solid #6366f1;
  outline-offset: -2px;
}

textarea, input[type="text"] {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  overflow: hidden;
  box-sizing: border-box;
  font-size: 0.875rem;
  background-color: transparent !important;
  padding: 0;
  margin: 0;
  white-space: pre;
  word-wrap: normal;
  word-break: normal;
  font-family: inherit;
}

textarea:focus, input[type="text"]:focus {
  background-color: transparent !important;
}

.cell-textarea {
  display: block;
  width: 100%;
  height: 100%;
}

/* 移动端优化 */
@media (max-width: 640px) {
  .overflow-x-auto {
    max-height: calc(100vh - 300px);
  }

  table {
    font-size: 0.75rem;
  }

  th, td {
    padding: 0.25rem !important;
  }

  textarea {
    font-size: 0.75rem;
    padding: 0.25rem !important;
  }

  .grid-cols-1 {
    grid-template-columns: 1fr;
  }

  .flex-col {
    flex-direction: column;
  }

  .gap-2 {
    gap: 0.5rem;
  }

  .p-4 {
    padding: 1rem;
  }

  .py-3 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .text-sm {
    font-size: 0.75rem;
  }

  .h-5 {
    height: 1.25rem;
  }

  .w-5 {
    width: 1.25rem;
  }

  .mr-2 {
    margin-right: 0.5rem;
  }
}

/* 触摸优化 */
th {
  -webkit-tap-highlight-color: transparent;
  touch-action: none;
}

td {
  -webkit-tap-highlight-color: transparent;
}

textarea {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* 防止移动端双击缩放 */
* {
  touch-action: manipulation;
}
</style> 