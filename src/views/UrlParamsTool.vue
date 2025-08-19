<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { parseUrl, stringifyQuery } from '../utils/url'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const input = ref('')
const autoEncode = ref(true)

const parsed = computed(() => parseUrl(input.value))
const queryPairs = computed(() => Object.entries(parsed.value.query))
const queryString = computed(() => stringifyQuery(parsed.value.query, { encode: autoEncode.value, addPrefix: true }))

function toBase64Url(text: string): string {
  try {
    const b64 = btoa(unescape(encodeURIComponent(text)))
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  } catch {
    return ''
  }
}

function fromBase64Url(text: string): string {
  try {
    const pad = text.length % 4 === 2 ? '==' : text.length % 4 === 3 ? '=' : ''
    const b64 = text.replace(/-/g, '+').replace(/_/g, '/') + pad
    return decodeURIComponent(escape(atob(b64)))
  } catch {
    return ''
  }
}

// 初始化从路由解码
onMounted(() => {
  const data = route.params.data as string | undefined
  if (data) {
    const decoded = fromBase64Url(data)
    if (decoded) input.value = decoded
  }
})

// 输入变化 -> 更新路由
watch(input, (val) => {
  const payload = val ? toBase64Url(val) : undefined
  router.replace({ name: 'url-params', params: { data: payload } })
})

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch (e) {
    // ignore
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 输入卡片 -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-base font-semibold leading-6 text-gray-900">URL 参数解析</h3>
        <div class="mt-2 max-w-xl text-sm text-gray-500">
          <p>支持输入完整 URL 或仅查询串（例如：?a=1&b=2）。</p>
        </div>

        <div class="mt-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">输入 URL 或查询串</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <textarea
                v-model="input"
                rows="6"
                class="block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                placeholder="https://example.com/path?foo=bar&foo=baz&empty=&q=hello+world#section"
              ></textarea>
            </div>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label class="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" v-model="autoEncode" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
              输出时进行 URL 编码
            </label>
            <div class="flex gap-2">
              <button type="button" class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-200" @click="input = ''">清空</button>
              <button type="button" class="inline-flex items-center rounded-md bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" @click="copy(input)">复制输入</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 结果卡片 -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900">解析结果</h3>
          <div class="flex gap-2">
            <button type="button" class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-200" @click="copy(queryString)">复制查询串</button>
            <button type="button" class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-200" @click="copy(JSON.stringify(parsed, null, 2))">复制 JSON</button>
          </div>
        </div>

        <div class="mt-5 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">参数列表</label>
            <div class="mt-1 rounded-md border border-gray-200">
              <div class="grid grid-cols-3 gap-2 border-b border-gray-200 bg-gray-50 p-2 text-xs font-medium text-gray-600">
                <div>Key</div>
                <div class="col-span-2">Value</div>
              </div>
              <div class="divide-y divide-gray-100">
                <div v-if="queryPairs.length === 0" class="p-3 text-sm text-gray-500">暂无参数</div>
                <div v-for="([k, v], idx) in queryPairs" :key="k + '_' + idx" class="grid grid-cols-3 gap-2 p-2 text-sm">
                  <div class="truncate font-mono text-gray-800" :title="k">{{ k }}</div>
                  <div class="col-span-2 font-mono text-gray-700 break-all" :title="Array.isArray(v) ? v.join(', ') : (v as string)">
                    <template v-if="Array.isArray(v)">
                      [<span>{{ (v as string[]).join(', ') }}</span>]
                    </template>
                    <template v-else>
                      {{ v as string }}
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">路径</label>
            <div class="mt-1 rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 bg-white font-mono text-sm break-all">
              {{ parsed.path || '/' }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">查询串</label>
            <div class="mt-1 rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 bg-white font-mono text-sm break-all min-h-field">
              {{ queryString }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">哈希</label>
            <div class="mt-1 rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 bg-white font-mono text-sm break-all min-h-field">
              {{ parsed.hash || '' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 