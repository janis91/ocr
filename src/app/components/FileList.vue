<template>
  <div>
    <ul class="ocr-list">
      <li v-for="file in files.slice(0,5)" :key="file.id" class="ocr-list-item">{{file.name}}</li>
      <li v-if="files.length >= 6" class="ocr-list-item">...</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'FileList',
  props: {
    files: {
      type: Array as () => OCAFile[],
      required: true
    }
  }
})
</script>

<style scoped>
.ocr-list {
  display: flex;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
  padding-bottom: 10px;
}
.ocr-list-item:last-child {
  border-bottom: 0;
}
.ocr-list-item {
  position: relative;
  display: block;
  padding: .75rem 1.25rem;
  margin-bottom: -1px;
  border-bottom: 1px solid var(--color-border-dark);
}
</style>
