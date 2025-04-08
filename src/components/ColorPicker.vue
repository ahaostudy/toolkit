<template>
  <div class="color-picker">
    <div class="relative w-80 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <!-- 色相选择条 -->
      <div 
        class="relative h-6 mb-4 rounded cursor-pointer" 
        ref="hueSlider"
        @mousedown="startHueDrag"
      >
        <div
          class="absolute inset-0 rounded"
          :style="{
            background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
          }"
        ></div>
        <div
          class="absolute w-3 h-6 border-2 border-white rounded-full shadow"
          :style="{ left: `${hue * 100}%`, transform: 'translateX(-50%)' }"
        ></div>
      </div>

      <!-- 饱和度和亮度选择面板 -->
      <div 
        class="relative h-64 mb-4 rounded cursor-pointer" 
        ref="saturationPanel"
        @mousedown="startSaturationDrag"
      >
        <div
          class="absolute inset-0 rounded"
          :style="{
            background: `linear-gradient(to right, #fff 0%, ${hueColorComputed} 100%)`
          }"
        ></div>
        <div
          class="absolute inset-0 rounded"
          :style="{
            background: 'linear-gradient(to top, #000 0%, transparent 100%)'
          }"
        ></div>
        <div
          class="absolute w-4 h-4 border-2 border-white rounded-full shadow transform -translate-x-1/2 -translate-y-1/2"
          :style="{
            left: `${saturation * 100}%`,
            top: `${(1 - lightness) * 100}%`
          }"
        ></div>
      </div>

      <!-- 透明度选择条 -->
      <div 
        class="relative h-6 rounded cursor-pointer" 
        ref="alphaSlider"
        @mousedown="startAlphaDrag"
      >
        <div class="absolute inset-0 rounded bg-checkerboard"></div>
        <div
          class="absolute inset-0 rounded"
          :style="{
            background: `linear-gradient(to right, transparent 0%, ${colorWithoutAlpha} 100%)`
          }"
        ></div>
        <div
          class="absolute w-3 h-6 border-2 border-white rounded-full shadow"
          :style="{ left: `${alpha * 100}%`, transform: 'translateX(-50%)' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { parseToRgba, parseToHsla } from 'color2k'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 颜色值状态
const hue = ref(0)
const saturation = ref(1)
const lightness = ref(0.5)
const alpha = ref(1)
const isInternalUpdate = ref(false)

// DOM引用
const hueSlider = ref<HTMLElement | null>(null)
const saturationPanel = ref<HTMLElement | null>(null)
const alphaSlider = ref<HTMLElement | null>(null)

// 计算属性：当前颜色
const currentColor = computed({
  get: () => {
    // 直接返回父组件的值，确保显示的是外部传入的准确值
    return props.modelValue;
  },
  set: (newColor) => {
    emit('update:modelValue', newColor);
  }
})

// 计算属性：色相颜色 - 基于当前hue值
const hueColorComputed = computed(() => {
  return `hsl(${hue.value * 360}, 100%, 50%)`
})

// 计算属性：不带透明度的颜色 - 基于当前hsla值
const colorWithoutAlpha = computed(() => {
  return `hsl(${hue.value * 360}, ${saturation.value * 100}%, ${lightness.value * 100}%)`
})

// 初始化颜色值
function initColorValues(color: string) {
  try {
    // 标记为内部更新，防止触发 watch
    isInternalUpdate.value = true
    
    // 解析颜色值
    const [h, s, l, a] = hexToHsla(color)
    
    // 更新内部状态
    hue.value = h / 360
    saturation.value = s / 100
    lightness.value = l / 100
    alpha.value = a
  } catch (e) {
    // 发生错误时使用默认红色
    hue.value = 0
    saturation.value = 1
    lightness.value = 0.5
    alpha.value = 1
  } finally {
    // 恢复标记
    nextTick(() => {
      isInternalUpdate.value = false
    })
  }
}

// HSLA 转 RGBA
function hslaToRgba(h: number, s: number, l: number, a: number) {
  try {
    const color = `hsla(${h}, ${s}%, ${l}%, ${a})`
    return parseToRgba(color)
  } catch (e) {
    return [0, 0, 0, 1]
  }
}

// RGBA 转十六进制
function rgbaToHex(rgba: number[]) {
  try {
    const [r, g, b, a] = rgba
    const rHex = Math.round(r).toString(16).padStart(2, '0')
    const gHex = Math.round(g).toString(16).padStart(2, '0')
    const bHex = Math.round(b).toString(16).padStart(2, '0')
    const aHex = Math.round(a * 255).toString(16).padStart(2, '0')
    return `#${rHex}${gHex}${bHex}${aHex}`
  } catch (e) {
    return '#ff0000ff'
  }
}

// 十六进制转 HSLA
function hexToHsla(hex: string) {
  try {
    // 解析颜色
    const hsla = parseToHsla(hex)
    return hsla
  } catch (e) {
    return [0, 100, 50, 1] // 默认红色
  }
}

// 启动色相拖动
function startHueDrag(event: MouseEvent) {
  if (!hueSlider.value) return
  
  const rect = hueSlider.value.getBoundingClientRect()
  
  function updateHue(e: MouseEvent) {
    isInternalUpdate.value = true
    
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    hue.value = x
    
    // 立即发送更新，不等待nextTick
    const color = rgbaToHex(
      hslaToRgba(
        hue.value * 360,
        saturation.value * 100,
        lightness.value * 100,
        alpha.value
      )
    )
    emit('update:modelValue', color)
    
    // 延迟重置标记
    setTimeout(() => {
      isInternalUpdate.value = false
    }, 0)
  }
  
  function stopDrag() {
    window.removeEventListener('mousemove', updateHue)
    window.removeEventListener('mouseup', stopDrag)
  }
  
  window.addEventListener('mousemove', updateHue)
  window.addEventListener('mouseup', stopDrag)
  
  updateHue(event)
}

// 启动饱和度和亮度拖动
function startSaturationDrag(event: MouseEvent) {
  if (!saturationPanel.value) return
  
  const rect = saturationPanel.value.getBoundingClientRect()
  
  function updateSaturation(e: MouseEvent) {
    isInternalUpdate.value = true
    
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    
    saturation.value = x
    lightness.value = 1 - y
    
    // 立即发送更新，不等待nextTick
    const color = rgbaToHex(
      hslaToRgba(
        hue.value * 360,
        saturation.value * 100,
        lightness.value * 100,
        alpha.value
      )
    )
    emit('update:modelValue', color)
    
    // 延迟重置标记
    setTimeout(() => {
      isInternalUpdate.value = false
    }, 0)
  }
  
  function stopDrag() {
    window.removeEventListener('mousemove', updateSaturation)
    window.removeEventListener('mouseup', stopDrag)
  }
  
  window.addEventListener('mousemove', updateSaturation)
  window.addEventListener('mouseup', stopDrag)
  
  updateSaturation(event)
}

// 启动透明度拖动
function startAlphaDrag(event: MouseEvent) {
  if (!alphaSlider.value) return
  
  const rect = alphaSlider.value.getBoundingClientRect()
  
  function updateAlpha(e: MouseEvent) {
    isInternalUpdate.value = true
    
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    alpha.value = x
    
    // 立即发送更新，不等待nextTick
    const color = rgbaToHex(
      hslaToRgba(
        hue.value * 360,
        saturation.value * 100,
        lightness.value * 100,
        alpha.value
      )
    )
    emit('update:modelValue', color)
    
    // 延迟重置标记
    setTimeout(() => {
      isInternalUpdate.value = false
    }, 0)
  }
  
  function stopDrag() {
    window.removeEventListener('mousemove', updateAlpha)
    window.removeEventListener('mouseup', stopDrag)
  }
  
  window.addEventListener('mousemove', updateAlpha)
  window.addEventListener('mouseup', stopDrag)
  
  updateAlpha(event)
}

// 监听输入的颜色值变化
watch(() => props.modelValue, (newColor) => {
  if (isInternalUpdate.value) return
  
  try {
    // 验证颜色格式
    parseToRgba(newColor)
    
    // 初始化颜色值
    initColorValues(newColor)
  } catch (e) {
    // 无效颜色时不更新
  }
}, { immediate: true, flush: 'sync' })

// 组件挂载时初始化
onMounted(() => {
  try {
    // 验证颜色格式
    parseToRgba(props.modelValue)
    
    // 初始化颜色值
    initColorValues(props.modelValue)
  } catch (e) {
    console.error('初始颜色格式无效:', props.modelValue)
    
    // 使用默认红色
    initColorValues('#ff0000ff')
  }
})
</script>

<style scoped>
.color-picker {
  position: relative;
  z-index: 50;
}

.bg-checkerboard {
  background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 10px 10px;
  background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
}
</style> 