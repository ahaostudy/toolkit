<script setup lang="ts">
import { ref } from 'vue'
import { developingTools } from '../config/tools'
import { 
  WrenchIcon,
  BeakerIcon,
  DocumentTextIcon,
  ChartBarIcon,
  PhotoIcon,
  MusicalNoteIcon,
  GlobeAltIcon,
  CalculatorIcon,
  DocumentDuplicateIcon
} from '@heroicons/vue/24/outline'

const tools = ref(developingTools)
</script>

<template>
  <div class="bg-white">
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          更多工具
        </h1>
        <p class="mt-4 text-lg leading-8 text-gray-600">
          我们正在开发更多实用的工具，敬请期待
        </p>
      </div>

      <div class="mt-16">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="tool in tools" 
            :key="tool.name"
            class="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 p-6"
          >
            <div class="flex items-center">
              <component 
                :is="tool.icon" 
                class="h-8 w-8 text-gray-400"
              />
              <h3 class="ml-3 text-lg font-semibold text-gray-900">
                {{ tool.name }}
              </h3>
            </div>
            <p class="mt-4 text-sm text-gray-500">
              {{ tool.description }}
            </p>
            <div class="mt-4">
              <span class="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800">
                {{ tool.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 