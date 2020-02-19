<template>
  <div class="ocr-content">
    <file-list :files="selectedFiles" />
    <div class="ocr-options">
      <multi-select
        :disabled="processing"
        :selectedLanguages="selectedLanguages"
        @[update]="updateSelectedLanguages"
        @[clear]="clearAll"
      />
      <check :disabled="processing" :filesCount="selectedFiles.length" v-model="replace" />
      <hint :hint="hint" />
    </div>
    <loading
      v-if="processing"
      :successfullyProcessed="successfullyProcessed"
      :filesQueued="selectedFiles.length"
    />
    <button v-if="!processing" @click="process">{{processText}}</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MultiSelect from '@/common/components/MultiSelect.vue'
import { MultiSelectEvents } from '@/common/components/MultiSelectEvents'
import { LanguageOption } from '@/common/Util'
import { UPDATE_SELECTED_LANGUAGES, CLEAR_SELECTED_LANGUAGES, SET_PROCESSING, STOP_PROCESS_AND_RESET_MODAL_STATE } from '@a/store/Store'
import { Translations } from '@a/configuration/Translations'
import Loading from '@a/components/Loading.vue'
import FileList from '@a/components/FileList.vue'
import Hint from '@/common/components/Hint.vue'
import Check from '@a/components/Check.vue'
import { NextcloudGuiApiService } from '@a/services/NextcloudGuiApiService'

export default Vue.extend({
  name: 'ModalContent',
  components: { MultiSelect, Loading, FileList, Hint, Check },
  data: () => ({
    update: MultiSelectEvents.UPDATE_LANGS,
    clear: MultiSelectEvents.CLEAR_ALL,
    processText: Translations.TRANSLATION_PROCESS,
    successfullyProcessed: 0 as number,
    replace: false as boolean,
    hint: Translations.TRANSLATION_LARGE_NUMBER_TAKES_VERY_LONG_TIME
  }),
  computed: {
    selectedFiles(): OCAFile[] {
      return this.$store.state.selectedFiles
    },
    processing(): boolean {
      return this.$store.state.processing
    },
    selectedLanguages(): LanguageOption[] {
      return this.$store.getters.selectedOptions
    }
  },
  methods: {
    updateSelectedLanguages(value: Map<string, string>) {
      this.$store.commit(UPDATE_SELECTED_LANGUAGES, { selectedLanguages: value })
    },
    clearAll() {
      this.$store.commit(CLEAR_SELECTED_LANGUAGES)
    },
    async process() {
      try {
        this.$store.commit(SET_PROCESSING)
        for (let i = 0; i < this.selectedFiles.length; i += 4) {
          const part = this.selectedFiles.slice(i, i + 4)
          await Promise.all(part.map((file) => OCA.Ocr.app.process(file, this.selectedLanguages.map(opt => opt.key), this.replace)))
          this.successfullyProcessed += part.length
        }
      } catch (e) {
        NextcloudGuiApiService.displayError(`${Translations.TRANSLATION_OCR_PROCESSING_FAILED} ${e.message}`)
        // eslint-disable-next-line no-console
        console.error('An error occured in OCR.', e, e.original)
      } finally {
        this.$store.dispatch(STOP_PROCESS_AND_RESET_MODAL_STATE)
        this.replace = false
        this.successfullyProcessed = 0
      }
    }
  }
})
</script>

<style scoped>
.ocr-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}

.ocr-options {
  width: 100%;
}

.ocr-options > div {
  padding-bottom: 10px;
}
</style>
