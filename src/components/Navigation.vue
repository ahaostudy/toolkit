<script setup lang="ts">
import { ref } from 'vue'
import { 
  Bars3Icon, 
  XMarkIcon,
  TableCellsIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

const navigation = ref([
  { name: 'JSON转表格', href: '/json-to-table', icon: TableCellsIcon, current: true },
  { name: '更多工具', href: '/more', icon: PlusIcon, current: false },
])

const sidebarOpen = ref(false)
</script>

<template>
  <div>
    <!-- 移动端侧边栏 -->
    <div class="relative z-50 lg:hidden" role="dialog" aria-modal="true">
      <div v-if="sidebarOpen" class="fixed inset-0 bg-gray-900/80"></div>

      <div class="fixed inset-0 flex">
        <div
          v-if="sidebarOpen"
          class="relative mr-16 flex w-full max-w-xs flex-1"
        >
          <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
            <button
              type="button"
              class="-m-2.5 p-2.5"
              @click="sidebarOpen = false"
            >
              <span class="sr-only">关闭侧边栏</span>
              <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>

          <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
            <div class="flex h-16 shrink-0 items-center">
              <div class="flex flex-shrink-0 items-center px-4">
                <h1 class="text-xl font-semibold text-gray-900">ToolKit</h1>
              </div>
            </div>
            <nav class="flex flex-1 flex-col">
              <ul role="list" class="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" class="-mx-2 space-y-1">
                    <li v-for="item in navigation" :key="item.name">
                      <a
                        :href="item.href"
                        :class="[
                          item.current
                            ? 'bg-gray-50 text-indigo-600'
                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                        ]"
                      >
                        <component
                          :is="item.icon"
                          :class="[
                            item.current
                              ? 'text-indigo-600'
                              : 'text-gray-400 group-hover:text-indigo-600',
                            'h-6 w-6 shrink-0',
                          ]"
                          aria-hidden="true"
                        />
                        {{ item.name }}
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- 桌面端侧边栏 -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div class="flex h-16 shrink-0 items-center">
          <div class="flex flex-shrink-0 items-center px-4">
            <h1 class="text-xl font-semibold text-gray-900">ToolKit</h1>
          </div>
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <a
                    :href="item.href"
                    :class="[
                      item.current
                        ? 'bg-gray-50 text-indigo-600'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    ]"
                  >
                    <component
                      :is="item.icon"
                      :class="[
                        item.current
                          ? 'text-indigo-600'
                          : 'text-gray-400 group-hover:text-indigo-600',
                        'h-6 w-6 shrink-0',
                      ]"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- 移动端顶部栏 -->
    <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
      <button
        type="button"
        class="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        @click="sidebarOpen = true"
      >
        <span class="sr-only">打开侧边栏</span>
        <Bars3Icon class="h-6 w-6" aria-hidden="true" />
      </button>
      <div class="flex-1 text-sm font-semibold leading-6 text-gray-900">ToolKit</div>
    </div>
  </div>
</template> 