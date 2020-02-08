<template>
  <div>
    <ul class="ocr-list">
      <li v-for="file in files.slice(0,5)" :key="file.id">{{file.name}}</li>
      <li v-if="files.length >= 6">...</li>
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
  list-style-type: square;
  list-style-position: inside;
}
</style>
