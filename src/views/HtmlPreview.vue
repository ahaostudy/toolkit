<template>
  <div class="space-y-6">
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-base font-semibold leading-6 text-gray-900">HTML 预览</h3>
        <div class="mt-2 max-w-xl text-sm text-gray-500">
          <p>实时预览 HTML 代码效果</p>
        </div>
        <div class="mt-5">
          <div class="flex flex-col lg:flex-row gap-6">
            <div class="flex-1">
              <label for="html-input" class="block text-sm font-medium text-gray-700">HTML 代码</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <textarea
                  id="html-input"
                  v-model="htmlCode"
                  class="block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white [&:not(:focus)]:bg-white font-mono h-[calc(100vh-12.5rem)]"
                  placeholder="输入HTML代码..."
                  @input="updatePreview"
                ></textarea>
              </div>
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700">预览效果</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="overflow-hidden rounded-md border border-gray-200 bg-white">
                  <iframe
                    ref="previewFrame"
                    class="w-full h-[calc(100vh-12.5rem)] border-0"
                    sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
                    @load="updatePreview"
                  ></iframe>
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
import { ref, watch, onMounted } from 'vue'

const htmlCode = ref('')
const previewFrame = ref<HTMLIFrameElement | null>(null)

const updatePreview = () => {
  if (!previewFrame.value) return

  const doc = previewFrame.value.contentDocument
  if (!doc) return

  // 检查是否是完整的HTML文档
  const hasHtmlTag = htmlCode.value.toLowerCase().includes('<html')
  const hasHeadTag = htmlCode.value.toLowerCase().includes('<head')
  const hasBodyTag = htmlCode.value.toLowerCase().includes('<body')

  if (hasHtmlTag && hasHeadTag && hasBodyTag) {
    // 如果是完整的HTML文档，直接渲染
    doc.open()
    doc.write(htmlCode.value)
    doc.close()
  } else {
    // 如果不是完整的HTML文档，创建一个完整的HTML文档
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
          ${htmlCode.value}
        </body>
      </html>
    `
    doc.open()
    doc.write(fullHtml)
    doc.close()
  }
}

// 监听htmlCode的变化
watch(htmlCode, updatePreview)

// 组件挂载后初始化预览
onMounted(() => {
  updatePreview()
})
</script>

<style scoped>
textarea {
  resize: none;
}
</style> 