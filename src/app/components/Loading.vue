<template>
  <div class="ocr-load">
    <span class="icon icon-loading"></span>
    <span>
      {{filesQueuedText}}
      <br />
      {{successfullyProcessedText}}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Translations } from '@a/configuration/Translations'

export default Vue.extend({
  name: 'Loading',
  props: {
    filesQueued: {
      type: Number,
      required: true
    },
    successfullyProcessed: {
      type: Number,
      required: true
    }
  },
  computed: {
    filesQueuedText(): string {
      return Translations.TRANSLATION_FILES_QUEUED(this.filesQueued)
    },
    successfullyProcessedText(): string {
      return Translations.TRANSLATION_FILES_SUCCESSFULLY_PROCESSED(String(this.successfullyProcessed), String(this.filesQueued))
    }
  }
})
</script>

<style scoped>
.ocr-load {
  display: flex;
  flex-direction: column;
  align-self: center;
  align-items: center;
  text-align: center;
}

.ocr-load > .icon.icon-loading {
  margin: 15px;
}
</style>
