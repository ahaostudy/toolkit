<template>
  <div class="space-y-6">
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-base font-semibold leading-6 text-gray-900">文档分割与合并工具</h3>
        <div class="mt-2 max-w-xl text-sm text-gray-500">
          <p>支持多种分隔符的文本分割与合并工具</p>
        </div>
        
        <div class="mt-5 space-y-6">
          <!-- 输入文本 -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">输入文本</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <textarea
                  v-model="inputText"
                  rows="6"
                  class="block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                  placeholder="请输入要分割的文本"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- 分隔符选择 -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">选择分隔符</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="flex flex-col sm:flex-row gap-2">
                  <select 
                    v-model="selectedDelimiter" 
                    class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                  >
                    <option value="\n">换行符</option>
                    <option value=",">逗号</option>
                    <option value=";">分号</option>
                    <option value=" ">空格</option>
                    <option value="\t">制表符</option>
                    <option value="custom">自定义</option>
                  </select>
                  <input 
                    v-if="selectedDelimiter === 'custom'"
                    v-model="customDelimiter" 
                    type="text" 
                    class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                    placeholder="输入自定义分隔符"
                  >
                  <textarea
                    v-if="selectedDelimiter === 'custom'"
                    v-model="customDelimiter"
                    rows="2"
                    class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                    placeholder="输入自定义分隔符"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- 分割结果 -->
          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between">
                <label class="block text-sm font-medium text-gray-700">分割结果</label>
                <button 
                  v-if="splitResult.length > 10"
                  @click="showAllResults = !showAllResults"
                  class="inline-flex items-center rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {{ showAllResults ? '收起' : '展开全部' }}
                </button>
              </div>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="overflow-hidden rounded-lg border border-gray-200 bg-white">
                  <div v-if="splitResult.length === 0" class="flex flex-col items-center justify-center py-8 px-4">
                    <svg class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">暂无数据</h3>
                    <p class="mt-1 text-sm text-gray-500">请输入文本</p>
                  </div>
                  <div v-else>
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                          <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">内容</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(item, index) in displayedResults" :key="index" class="hover:bg-gray-50">
                          <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{{ index + 1 }}</td>
                          <td class="px-3 py-2 text-xs text-gray-900">{{ item }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div v-if="splitResult.length > 10 && !showAllResults" class="text-center py-2 bg-gray-50 text-xs text-gray-500">
                      共 {{ splitResult.length }} 条数据，点击"展开全部"查看更多
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 合并操作（仅在分割后有结果时显示） -->
          <div v-if="splitResult.length > 0" class="space-y-4">
            <div class="border-t border-gray-200 pt-6">
              <h4 class="text-base font-semibold leading-6 text-gray-900">合并操作</h4>
              <p class="mt-1 text-sm text-gray-500">设置合并参数</p>
              
              <!-- 合并设置 -->
              <div class="mt-4 space-y-4">
                <!-- 常用模板 -->
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="(template, name) in mergeTemplates"
                    :key="name"
                    @click="applyTemplate(template)"
                    class="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    {{ name }}
                  </button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm text-gray-500 mb-1">前缀</label>
                    <input 
                      v-model="prefix" 
                      type="text" 
                      class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                      placeholder="输入前缀"
                    >
                  </div>
                  <div>
                    <label class="block text-sm text-gray-500 mb-1">后缀</label>
                    <input 
                      v-model="suffix" 
                      type="text" 
                      class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                      placeholder="输入后缀"
                    >
                  </div>
                  <div class="relative">
                    <label class="block text-sm text-gray-500 mb-1">间隔符</label>
                    <div class="flex flex-col">
                      <textarea
                        v-model="separator"
                        rows="1"
                        class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                        placeholder="输入间隔符（支持多行）"
                      ></textarea>
                    </div>
                    <div class="absolute right-0 top-0 flex flex-row gap-1">
                      <button
                        @click="toggleQuotes('double')"
                        :class="[
                          'inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold shadow-sm ring-1 ring-inset ring-gray-300',
                          hasDoubleQuotes ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-white text-gray-900 hover:bg-gray-50'
                        ]"
                      >
                        "
                      </button>
                      <button
                        @click="toggleQuotes('single')"
                        :class="[
                          'inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold shadow-sm ring-1 ring-inset ring-gray-300',
                          hasSingleQuotes ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-white text-gray-900 hover:bg-gray-50'
                        ]"
                      >
                        '
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 合并结果 -->
              <div class="mt-4">
                <div class="flex items-center justify-between">
                  <label class="block text-sm font-medium text-gray-700">合并结果</label>
                  <button 
                    v-if="mergedText"
                    @click="copyMergedText"
                    class="inline-flex items-center rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {{ copySuccess ? '已复制' : '复制' }}
                  </button>
                </div>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <textarea
                    v-model="mergedText"
                    rows="6"
                    class="block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                    readonly
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const selectedDelimiter = ref('\\n')
const customDelimiter = ref('')
const inputText = ref('')
const prefix = ref('')
const suffix = ref('')
const separator = ref('')
const splitResult = ref<string[]>([])
const mergedText = ref('')
const showAllResults = ref(false)
const copySuccess = ref(false)
const hasDoubleQuotes = ref(false)
const hasSingleQuotes = ref(false)

const actualDelimiter = computed(() => {
  if (selectedDelimiter.value === 'custom') {
    return customDelimiter.value
  }
  // 处理特殊字符
  if (selectedDelimiter.value === '\\n') return '\n'
  if (selectedDelimiter.value === '\\t') return '\t'
  return selectedDelimiter.value
})

const actualSeparator = computed(() => {
  return separator.value
})

const displayedResults = computed(() => {
  if (showAllResults.value) return splitResult.value
  return splitResult.value.slice(0, 10)
})

// 监听输入变化，实时更新分割结果
watch([inputText, selectedDelimiter, customDelimiter], () => {
  if (!inputText.value) {
    splitResult.value = []
    mergedText.value = ''
    return
  }
  splitResult.value = inputText.value.split(actualDelimiter.value).filter(item => item.trim() !== '')
  updateMergedText()
})

// 监听合并参数变化，实时更新合并结果
watch([splitResult, prefix, suffix, actualSeparator], () => {
  updateMergedText()
})

const updateMergedText = () => {
  if (splitResult.value.length === 0) {
    mergedText.value = ''
    return
  }
  mergedText.value = prefix.value + splitResult.value.join(actualSeparator.value) + suffix.value
}

const copyMergedText = async () => {
  try {
    await navigator.clipboard.writeText(mergedText.value)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 添加合并参数模板
const mergeTemplates = {
  'Golang Slice': { prefix: '[]string{', suffix: '}', separator: ', ' },
  'Python List': { prefix: '[', suffix: ']', separator: ', ' },
  'JavaScript Array': { prefix: '[', suffix: ']', separator: ', ' },
  'Java Array': { prefix: '{', suffix: '}', separator: ', ' },
  'C# Array': { prefix: '{', suffix: '}', separator: ', ' },
  'PHP Array': { prefix: '[', suffix: ']', separator: ', ' },
  'Ruby Array': { prefix: '[', suffix: ']', separator: ', ' },
  'Rust Vec': { prefix: 'vec![', suffix: ']', separator: ', ' },
  'SQL IN': { prefix: '(', suffix: ')', separator: ', ' },
  'CSV': { prefix: '', suffix: '', separator: ',' }
}

// 切换引号
const toggleQuotes = (type: 'single' | 'double') => {
  const quote = type === 'single' ? "'" : '"'
  const hasQuotes = type === 'single' ? hasSingleQuotes : hasDoubleQuotes
  const otherHasQuotes = type === 'single' ? hasDoubleQuotes : hasSingleQuotes
  
  // 如果当前类型的引号已存在，则移除
  if (hasQuotes.value) {
    // 检查前缀和后缀是否以当前引号开始和结束
    if (prefix.value.endsWith(quote) && suffix.value.startsWith(quote)) {
      // 删除引号
      prefix.value = prefix.value.slice(0, -1)
      suffix.value = suffix.value.slice(1)
      
      // 检查间隔符是否被当前引号包围
      if (separator.value.startsWith(quote) && separator.value.endsWith(quote)) {
        separator.value = separator.value.slice(1, -1)
      }
      
      hasQuotes.value = false
    }
  } else {
    // 如果另一种类型的引号存在，先检查并移除它
    if (otherHasQuotes.value) {
      const otherQuote = type === 'single' ? '"' : "'"
      
      // 检查前缀和后缀是否以另一种引号开始和结束
      if (prefix.value.endsWith(otherQuote) && suffix.value.startsWith(otherQuote)) {
        prefix.value = prefix.value.slice(0, -1)
        suffix.value = suffix.value.slice(1)
        
        // 检查间隔符是否被另一种引号包围
        if (separator.value.startsWith(otherQuote) && separator.value.endsWith(otherQuote)) {
          separator.value = separator.value.slice(1, -1)
        }
        
        if (type === 'single') {
          hasDoubleQuotes.value = false
        } else {
          hasSingleQuotes.value = false
        }
      }
    }
    
    // 添加当前类型的引号
    prefix.value = prefix.value + quote
    suffix.value = quote + suffix.value
    separator.value = quote + separator.value + quote
    hasQuotes.value = true
  }
}

// 修改应用模板函数，重置引号状态
const applyTemplate = (template: { prefix: string, suffix: string, separator: string }) => {
  prefix.value = template.prefix
  suffix.value = template.suffix
  separator.value = template.separator
  hasDoubleQuotes.value = false
  hasSingleQuotes.value = false
}
</script> 