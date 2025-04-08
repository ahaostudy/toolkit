<template>
  <div class="space-y-6">
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-base font-semibold leading-6 text-gray-900">调色板</h3>
        <div class="mt-2 max-w-xl text-sm text-gray-500">
          <p>使用调色板选择颜色，支持十六进制、RGB和HSL格式的转换</p>
        </div>
        <div class="mt-5">
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <!-- 左侧：颜色选择器 -->
            <div class="lg:col-span-2 flex items-center justify-center">
              <div class="w-full max-w-[320px]">
                <ColorPicker v-model="selectedColor" />
              </div>
            </div>

            <!-- 右侧：颜色值和预览 -->
            <div class="lg:col-span-3 space-y-6">
              <!-- 颜色值显示 -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">十六进制</label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      v-model="hexColor"
                      class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                      @input="handleHexInput"
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button 
                        @click="copyColor(hexColor)"
                        class="text-indigo-600 hover:text-indigo-500"
                      >
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">RGB</label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      v-model="rgbColor"
                      class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                      @input="handleRgbInput"
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button 
                        @click="copyColor(rgbColor)"
                        class="text-indigo-600 hover:text-indigo-500"
                      >
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">HSL</label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      v-model="hslColor"
                      class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                      @input="handleHslInput"
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button 
                        @click="copyColor(hslColor)"
                        class="text-indigo-600 hover:text-indigo-500"
                      >
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 颜色预览 -->
              <div class="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg">
                <div 
                  class="w-full h-48 rounded-lg mb-4 transition-colors duration-200"
                  :style="{ backgroundColor: hexColor }"
                ></div>
                <div class="text-center">
                  <p class="text-sm text-gray-500">当前颜色</p>
                  <p class="text-lg font-mono mt-1">{{ hexColor }}</p>
                  <button 
                    @click="copyColor(hexColor)"
                    class="mt-2 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    复制颜色
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 渐变色生成工具 -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-base font-semibold leading-6 text-gray-900">渐变色生成工具</h3>
        <div class="mt-2 max-w-xl text-sm text-gray-500">
          <p>添加多个颜色点，设置位置和角度，生成CSS渐变色代码</p>
        </div>
        <div class="mt-5">
          <div class="space-y-6">
            <!-- 颜色列表 -->
            <div class="space-y-4">
              <div v-for="(color, index) in gradientColors" :key="index" class="flex items-center space-x-4">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-1">颜色选择</label>
                  <input
                    type="color"
                    :value="getOpaqueColor(color.value)"
                    @input="updateColorValue(index, $event)"
                    class="w-12 h-12 rounded cursor-pointer"
                  />
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-1">颜色值</label>
                  <input
                    type="text"
                    v-model="color.value"
                    class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                    placeholder="#RRGGBBAA 或 rgba(r,g,b,a)"
                  />
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-1">位置 (%)</label>
                  <input
                    type="number"
                    v-model="color.stop"
                    min="0"
                    max="100"
                    class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                  />
                </div>
                <div class="flex items-end">
                  <button
                    @click="removeColor(index)"
                    class="text-red-600 hover:text-red-500"
                    title="删除此颜色点"
                  >
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- 添加颜色按钮 -->
            <button
              @click="addColor"
              class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              添加颜色
            </button>

            <!-- 角度选择 -->
            <div>
              <label class="block text-sm font-medium text-gray-700">旋转角度</label>
              <div class="mt-1">
                <input
                  type="range"
                  v-model="gradientAngle"
                  min="0"
                  max="360"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0°</span>
                  <span>{{ gradientAngle }}°</span>
                  <span>360°</span>
                </div>
              </div>
            </div>

            <!-- 预览和代码 -->
            <div class="space-y-4">
              <div class="h-32 rounded-lg" :style="gradientStyle"></div>
              <div class="relative">
                <textarea
                  v-model="gradientCode"
                  class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white font-mono"
                  rows="3"
                  readonly
                ></textarea>
                <button
                  @click="copyGradientCode"
                  class="absolute top-2 right-2 text-indigo-600 hover:text-indigo-500"
                >
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { parseToRgba, parseToHsla } from 'color2k'
import ColorPicker from '../components/ColorPicker.vue'

// 颜色选择器相关
const selectedColor = ref('#4F46E5ff')
const copySuccess = ref(false)

// 渐变色相关
const gradientColors = ref([
  { value: '#ff0000', stop: 0 },
  { value: '#0000ff', stop: 100 }
])
const gradientAngle = ref(45)

// 添加颜色
const addColor = () => {
  gradientColors.value.push({ value: '#ffffff', stop: 50 })
}

// 移除颜色
const removeColor = (index: number) => {
  gradientColors.value.splice(index, 1)
}

// 计算渐变色样式
const gradientStyle = computed(() => {
  const stops = gradientColors.value
    .map(color => {
      try {
        const [r, g, b, a] = parseToRgba(color.value)
        return `rgba(${r}, ${g}, ${b}, ${a}) ${color.stop}%`
      } catch (e) {
        return `${color.value} ${color.stop}%`
      }
    })
    .join(', ')
  return {
    background: `linear-gradient(${gradientAngle.value}deg, ${stops})`
  }
})

// 计算渐变色代码
const gradientCode = computed(() => {
  const stops = gradientColors.value
    .map(color => {
      try {
        const [r, g, b, a] = parseToRgba(color.value)
        return `rgba(${r}, ${g}, ${b}, ${a}) ${color.stop}%`
      } catch (e) {
        return `${color.value} ${color.stop}%`
      }
    })
    .join(', ')
  return `background: linear-gradient(${gradientAngle.value}deg, ${stops});`
})

// 复制渐变色代码
const copyGradientCode = () => {
  navigator.clipboard.writeText(gradientCode.value)
}

// 复制颜色值
const copyColor = (color: string) => {
  navigator.clipboard.writeText(color)
  copySuccess.value = true
  setTimeout(() => {
    copySuccess.value = false
  }, 2000)
}

// 辅助函数：验证颜色值
const isValidColor = (color: string): boolean => {
  try {
    parseToRgba(color)
    return true
  } catch (e) {
    return false
  }
}

// 辅助函数：将颜色转换为十六进制格式
const toHexString = (r: number, g: number, b: number, a: number): string => {
  const rHex = Math.round(r).toString(16).padStart(2, '0')
  const gHex = Math.round(g).toString(16).padStart(2, '0')
  const bHex = Math.round(b).toString(16).padStart(2, '0')
  const aHex = Math.round(a * 255).toString(16).padStart(2, '0')
  return `#${rHex}${gHex}${bHex}${aHex}`
}

// 计算十六进制颜色值
const hexColor = computed(() => {
  try {
    const [r, g, b, a] = parseToRgba(selectedColor.value)
    return toHexString(r, g, b, a)
  } catch (e) {
    return '#ff0000ff'
  }
})

// 计算 RGB 颜色值
const rgbColor = computed(() => {
  try {
    const [r, g, b, a] = parseToRgba(selectedColor.value)
    return `rgba(${r}, ${g}, ${b}, ${a})`
  } catch (e) {
    return 'rgba(79, 70, 229, 1)'
  }
})

// 计算 HSL 颜色值
const hslColor = computed(() => {
  try {
    const [h, s, l, a] = parseToHsla(selectedColor.value)
    return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${a})`
  } catch (e) {
    return 'hsl(0, 100%, 50%, 1)'
  }
})

// 处理十六进制输入
const handleHexInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value.trim()
  
  // 检查是否是有效的十六进制颜色
  if (/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)) {
    let hex = value
    if (!hex.startsWith('#')) {
      hex = '#' + hex
    }
    if (hex.length === 7) {
      hex = hex + 'ff'
    }
    
    if (isValidColor(hex)) {
      selectedColor.value = hex
    }
  }
}

// 处理 RGB 输入
const handleRgbInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const match = input.value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/)
  if (match) {
    const [_, r, g, b, a = '1'] = match
    try {
      const color = `rgba(${r}, ${g}, ${b}, ${a})`
      if (isValidColor(color)) {
        const [rVal, gVal, bVal, aVal] = parseToRgba(color)
        selectedColor.value = toHexString(rVal, gVal, bVal, aVal)
      }
    } catch (e) {
      // 输入无效，不执行操作
    }
  }
}

// 处理 HSL 输入
const handleHslInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const match = input.value.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([\d.]+))?\)$/)
  if (match) {
    const [_, h, s, l, a = '1'] = match
    try {
      const color = `hsla(${h}, ${s}%, ${l}%, ${a})`
      if (isValidColor(color)) {
        const [r, g, b, a] = parseToRgba(color)
        selectedColor.value = toHexString(r, g, b, a)
      }
    } catch (e) {
      // 输入无效，不执行操作
    }
  }
}

const getOpaqueColor = (color: string): string => {
  try {
    const [r, g, b] = parseToRgba(color)
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  } catch (e) {
    return color
  }
}

const updateColorValue = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  const newColor = input.value
  const currentColor = gradientColors.value[index].value
  
  try {
    const [, , , a] = parseToRgba(currentColor)
    gradientColors.value[index].value = `rgba(${parseInt(newColor.slice(1, 3), 16)}, ${parseInt(newColor.slice(3, 5), 16)}, ${parseInt(newColor.slice(5, 7), 16)}, ${a})`
  } catch (e) {
    gradientColors.value[index].value = newColor
  }
}
</script> 