<script setup lang="ts">
import Navigation from './components/Navigation.vue'
import JsonToTable from './components/JsonToTable.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Navigation />
    <div class="lg:pl-64">
      <main class="py-6">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <JsonToTable />
        </div>
      </main>
    </div>
  </div>
</template>
