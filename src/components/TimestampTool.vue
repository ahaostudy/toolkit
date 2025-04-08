<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const currentTimestamp = ref(Date.now())
const selectedDate = ref<Date | null>(null)
const selectedTimezone = ref(dayjs.tz.guess())
const customFormat = ref('YYYY-MM-DD HH:mm:ss')
const timeInput = ref('')
const result = ref('')
const timestampInput = ref('')
const timestampUnit = ref<'ms' | 's'>('ms')
const copySuccess = ref(false)

// 更新当前时间戳
let timer: number
onMounted(() => {
  timer = setInterval(() => {
    currentTimestamp.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

// 时间戳转日期
const timestampToDate = (timestamp: number) => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

// 日期转时间戳
const dateToTimestamp = (date: Date | null) => {
  if (!date) return null
  return dayjs(date).valueOf()
}

// 获取所有可用时区
const timezones = ref(['Asia/Shanghai', 'America/New_York', 'Europe/London', 'Asia/Tokyo'])

// 转换时区
const convertTimezone = (date: Date | null, timezone: string) => {
  if (!date) return '请先选择日期'
  return dayjs(date).tz(timezone).format('YYYY-MM-DD HH:mm:ss')
}

// 格式化时间
const formatTime = (date: Date | null, format: string) => {
  if (!date) return '请先选择日期'
  return dayjs(date).format(format)
}

// 时间计算
const calculateTime = () => {
  try {
    const [value, unit] = timeInput.value.split(' ')
    const num = parseInt(value)
    if (isNaN(num)) {
      result.value = '请输入有效的数字'
      return
    }
    
    let calculatedDate = dayjs()
    switch(unit?.toLowerCase()) {
      case 'days':
      case 'day':
        calculatedDate = calculatedDate.add(num, 'day')
        break
      case 'hours':
      case 'hour':
        calculatedDate = calculatedDate.add(num, 'hour')
        break
      case 'minutes':
      case 'minute':
        calculatedDate = calculatedDate.add(num, 'minute')
        break
      default:
        result.value = '请指定时间单位 (days/hours/minutes)'
        return
    }
    
    result.value = calculatedDate.format('YYYY-MM-DD HH:mm:ss')
  } catch (error) {
    result.value = '计算错误'
  }
}

// 转换时间戳为日期
const convertTimestampToDate = () => {
  try {
    const timestamp = parseInt(timestampInput.value)
    if (isNaN(timestamp)) {
      result.value = '请输入有效的时间戳'
      return
    }
    
    const date = timestampUnit.value === 's' 
      ? dayjs.unix(timestamp).format('YYYY-MM-DD HH:mm:ss')
      : dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
    
    result.value = date
    // 更新选择的时间
    selectedDate.value = timestampUnit.value === 's' 
      ? new Date(timestamp * 1000)
      : new Date(timestamp)
  } catch (error) {
    result.value = '转换错误'
  }
}

// 计算当前时间戳（秒）
const currentTimestampInSeconds = computed(() => {
  return Math.floor(currentTimestamp.value / 1000)
})

// 复制时间戳
const copyTimestamp = (timestamp: number) => {
  navigator.clipboard.writeText(timestamp.toString())
  copySuccess.value = true
  setTimeout(() => {
    copySuccess.value = false
  }, 2000)
}

// 设置当前时间为选择的时间
const setCurrentTime = () => {
  selectedDate.value = new Date()
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-base font-semibold leading-6 text-gray-900">时间戳工具</h3>
        <div class="mt-2 max-w-xl text-sm text-gray-500">
          <p>时间戳转换、时区转换、时间格式化与计算工具</p>
        </div>
        
        <div class="mt-5 space-y-6">
          <!-- 当前时间戳 -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">当前时间戳</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 bg-white">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <div>
                        <span class="text-sm text-gray-500">毫秒:</span>
                        <span class="text-xl font-mono ml-1">{{ currentTimestamp }}</span>
                      </div>
                      <div>
                        <span class="text-sm text-gray-500">秒:</span>
                        <span class="text-xl font-mono ml-1">{{ currentTimestampInSeconds }}</span>
                      </div>
                    </div>
                    <div class="flex space-x-2">
                      <button 
                        @click="copyTimestamp(currentTimestamp)"
                        class="inline-flex items-center rounded-md bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 whitespace-nowrap"
                      >
                        复制毫秒
                      </button>
                      <button 
                        @click="copyTimestamp(currentTimestampInSeconds)"
                        class="inline-flex items-center rounded-md bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 whitespace-nowrap"
                      >
                        复制秒
                      </button>
                    </div>
                  </div>
                  <p class="text-gray-600 mt-2">{{ timestampToDate(currentTimestamp) }}</p>
                  <div v-if="copySuccess" class="absolute top-0 right-0 mt-2 mr-2 text-xs text-green-600">
                    已复制!
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 统一时间选择器 -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">时间</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="flex gap-2">
                  <input 
                    type="datetime-local" 
                    v-model="selectedDate"
                    class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                  >
                  <button 
                    @click="setCurrentTime"
                    class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 whitespace-nowrap"
                  >
                    设为当前时间
                  </button>
                </div>
                <div v-if="selectedDate" class="mt-2 text-sm text-gray-500">
                  <div class="flex items-center space-x-4">
                    <div>
                      <span class="text-xs text-gray-500">毫秒时间戳:</span>
                      <span class="font-mono ml-1">{{ dateToTimestamp(selectedDate) }}</span>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500">秒时间戳:</span>
                      <span class="font-mono ml-1">{{ Math.floor(dateToTimestamp(selectedDate)! / 1000) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 时间戳转日期 -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">时间戳转日期</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="flex gap-2">
                  <input 
                    v-model="timestampInput"
                    class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                    placeholder="输入时间戳"
                  >
                  <select 
                    v-model="timestampUnit"
                    class="block w-24 rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                  >
                    <option value="ms">毫秒</option>
                    <option value="s">秒</option>
                  </select>
                  <button 
                    @click="convertTimestampToDate"
                    class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 whitespace-nowrap"
                  >
                    转换
                  </button>
                </div>
                <div v-if="result" class="mt-2 text-sm text-gray-500">
                  <p>转换结果: {{ result }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 时区转换 -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">时区转换</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <select 
                  v-model="selectedTimezone"
                  class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                >
                  <option v-for="tz in timezones" :key="tz" :value="tz">
                    {{ tz }}
                  </option>
                </select>
                <div v-if="selectedDate" class="mt-2 text-sm text-gray-500">
                  <p>转换结果: {{ convertTimezone(selectedDate, selectedTimezone) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 时间格式化 -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">时间格式化</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input 
                  v-model="customFormat"
                  class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                  placeholder="输入格式 (例如: YYYY-MM-DD HH:mm:ss)"
                >
                <div v-if="selectedDate" class="mt-2 text-sm text-gray-500">
                  <p>格式化结果: {{ formatTime(selectedDate, customFormat) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 时间计算 -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">时间计算</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="flex gap-2">
                  <input 
                    v-model="timeInput"
                    class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                    placeholder="输入计算表达式 (例如: 2 days)"
                  >
                  <button 
                    @click="calculateTime"
                    class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 whitespace-nowrap"
                  >
                    计算
                  </button>
                </div>
                <div v-if="result" class="mt-2 text-sm text-gray-500">
                  <p>计算结果: {{ result }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 