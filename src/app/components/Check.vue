<template>
  <div class="ocr-check-replace">
    <input
      id="check-replace"
      type="checkbox"
      class="checkbox"
      :checked="value"
      @change="$emit('input', $event.target.checked)"
      :disabled="disabled"
    />
    <label for="check-replace">{{checkText}}</label>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Translations } from '@a/configuration/Translations'

export default Vue.extend({
  name: 'Check',
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    filesCount: {
      type: Number,
      required: true
    },
    value: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    checkText(): string {
      return Translations.TRANSLATION_DELETE_ORIGINAL_FILE(this.filesCount)
    }
  }
})
</script>

<style scoped>
.ocr-check-replace >>> input:disabled + label {
  color: var(--color-text-lighter);
}
</style>
