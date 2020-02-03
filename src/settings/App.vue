<template>
  <div>
    <multi-select
      :disabled="loading"
      :selectedLanguages="favoriteLanguages"
      @[clear]="clearAll"
      @[update]="updateSelectedLanguages"
      class="select"
    ></multi-select>
    <div class="hint">
      <span class="icon icon-details"></span>
      <span>{{hint}}</span>
    </div>
    <button @click="save" :disabled="loading">{{saveText}}</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { LOAD_FAVORITE_LANGUAGES, CLEAR_FAVORITE_LANGUAGES, SET_FAVORITE_LANGUAGES, SAVE_FAVORITE_LANGUAGES } from '@s/store/Store'
import MultiSelect, { MultiSelectEvents } from '@/common/components/MultiSelect.vue'
import { LanguageOption, Util } from '@/common/Util'
import { Translations } from '@s/configuration/Translations'

export default Vue.extend({
  name: 'app',
  components: {
    MultiSelect
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
    updateSelectedLanguages(value: LanguageOption[]) {
      this.$store.commit(SET_FAVORITE_LANGUAGES, { favoriteLanguages: Util.mapOptionsToLanguages(value) })
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
.select {
  width: 50vw;
  padding-bottom: 10px;
}
.hint {
  padding: 0.5rem 4px;
  color: var(--color-text-lighter);
}

.hint >>> span.icon {
  background-size: 16px 16px;
  display: inline-block;
  vertical-align: text-top;
  margin-right: .3rem;
}
</style>
