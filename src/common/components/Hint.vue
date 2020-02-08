<template>
  <div class="ocr-hint">
    <span class="icon icon-details"></span>
    <span>{{hint}}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Hint',
  props: {
    hint: {
      type: String,
      required: true
    }
  }
})
</script>

<style scoped>
.ocr-hint {
  padding: 0px 4px;
  color: var(--color-text-light);
}

.ocr-hint >>> span.icon {
  background-size: 16px 16px;
  display: inline-block;
  vertical-align: text-top;
  margin-right: 0.3rem;
}
</style>
