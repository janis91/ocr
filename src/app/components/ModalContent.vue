<template>
  <multi-select
    :disabled="disabled"
    :selectedLanguages="selectedLanguages"
    @[update]="updateSelectedLanguages"
    @[clear]="clearAll"
  ></multi-select>
</template>

<script lang="ts">
import Vue from 'vue'
import MultiSelect, { MultiSelectEvents } from '@/common/components/MultiSelect.vue'
import { LanguageOption } from '@/common/Util'
import { UPDATE_SELECTED_LANGUAGES, CLEAR_SELECTED_LANGUAGES } from '@a/store/Store'

export default Vue.extend({
  name: 'ModalContent',
  components: { MultiSelect },
  data: () => ({
    update: MultiSelectEvents.UPDATE_LANGS,
    clear: MultiSelectEvents.CLEAR_ALL
  }),
  computed: {
    selectedFiles(): OCAFile[] {
      return this.$store.state.selectedFiles
    },
    disabled(): boolean {
      return this.$store.state.processing
    },
    selectedLanguages(): LanguageOption[] {
      return this.$store.getters.selectedOptions
    }
  },
  methods: {
    updateSelectedLanguages(value: LanguageOption[]) {
      this.$store.commit(UPDATE_SELECTED_LANGUAGES, { selectedLanguages: value })
    },
    clearAll() {
      this.$store.commit(CLEAR_SELECTED_LANGUAGES)
    }
  }
})
</script>

<style scoped>
</style>
