<template>
  <div class="ocr">
    <multi-select
      :disabled="loading"
      :selectedLanguages="favoriteLanguages"
      @[clear]="clearAll"
      @[update]="updateSelectedLanguages"
      class="ocr-select"
    />
    <hint :hint="hint" />
    <button @click="save" :disabled="loading">{{saveText}}</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { LOAD_FAVORITE_LANGUAGES, CLEAR_FAVORITE_LANGUAGES, SET_FAVORITE_LANGUAGES, SAVE_FAVORITE_LANGUAGES } from '@s/store/Store'
import MultiSelect from '@/common/components/MultiSelect.vue'
import { MultiSelectEvents } from '@/common/components/MultiSelectEvents'
import { LanguageOption, Util } from '@/common/Util'
import { Translations } from '@s/configuration/Translations'
import Hint from '@/common/components/Hint.vue'

export default Vue.extend({
  name: 'App',
  components: {
    MultiSelect,
    Hint
  },
  data: () => ({
    clear: MultiSelectEvents.CLEAR_ALL,
    update: MultiSelectEvents.UPDATE_LANGS,
    saveText: Translations.TRANSLATION_SAVE,
    hint: Translations.TRANSLATION_PRESELECTION_HINT
  }),
  computed: {
    favoriteLanguages(): LanguageOption[] {
      return this.$store.getters.selectedOptions
    },
    loading(): boolean {
      return this.$store.state.loading
    }
  },
  methods: {
    clearAll() {
      this.$store.commit(CLEAR_FAVORITE_LANGUAGES)
    },
    updateSelectedLanguages(value: Map<string, string>) {
      this.$store.commit(SET_FAVORITE_LANGUAGES, { favoriteLanguages: value })
    },
    save() {
      this.$store.dispatch(SAVE_FAVORITE_LANGUAGES)
    }
  },
  created() {
    this.$store.dispatch(LOAD_FAVORITE_LANGUAGES)
  }
})
</script>

<style scoped>
.ocr-select {
  width: 50vw;
  padding-bottom: 10px;
}
.ocr>div {
  padding-bottom: 10px;
}
</style>
