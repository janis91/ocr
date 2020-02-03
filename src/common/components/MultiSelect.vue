<template>
  <multiselect
    :multiple="true"
    :clear-on-select="false"
    :placeholder="placeholder"
    track-by="key"
    label="label"
    :options="options"
    :value="selectedLanguages"
    @input="updateSelectedLanguages"
    class="fix-select2-pollution color-adjustments clear-button"
    :selectLabel="selectLabel"
    :selectedLabel="selectedLabel"
    :deselectLabel="deselectLabel"
    :disabled="disabled"
    :maxHeight="150"
  >
    <template slot="clear">
      <div
        class="multiselect__clear"
        v-if="selectedLanguages.length"
        @mousedown.prevent.stop="clearAll"
      ></div>
    </template>
    <span slot="noResult">{{noResult}}</span>
  </multiselect>
</template>

<script lang="ts">
import Vue from 'vue'
import { Common } from '@/common/Common'
import { Util, LanguageOption } from '@/common/Util'
import { Multiselect } from 'vue-multiselect'
import { Translations } from '@/common/Translations'

export class MultiSelectEvents {
  public static UPDATE_LANGS = 'update-langs';
  public static CLEAR_ALL = 'clear-all';
}

export default Vue.extend({
  name: 'MultiSelect',
  components: { Multiselect },
  props: {
    selectedLanguages: {
      type: Array as () => LanguageOption[],
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: () => ({
    options: Util.mapToOptions(Common.AVAILABLE_LANGUAGES),
    placeholder: Translations.TRANSLATION_SELECT_LANGUAGE,
    selectLabel: Translations.TRANSLATION_PRESS_ENTER_TO_SELECT,
    selectedLabel: Translations.TRANSLATION_SELECTED,
    deselectLabel: Translations.TRANSLATION_PRESS_ENTER_TO_REMOVE,
    noResult: Translations.TRANSLATION_NO_MATCHES_FOUND
  }),
  methods: {
    updateSelectedLanguages(value: LanguageOption[]) {
      this.$emit(MultiSelectEvents.UPDATE_LANGS, value)
    },
    clearAll() {
      this.$emit(MultiSelectEvents.CLEAR_ALL)
    }
  }
})
</script>

<style scoped>
@import "./../../../node_modules/vue-multiselect/dist/vue-multiselect.min.css";

.fix-select2-pollution
  >>> .multiselect__tags
  > input.multiselect__input:not([type="radio"]):not([type="checkbox"]):not([type="range"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="color"]):not([type="file"]):not([type="image"]) {
  -webkit-appearance: initial;
  -moz-appearance: initial;
  height: auto;
}

.fix-select2-pollution >>> .multiselect__tags > input.multiselect__input {
  margin: initial;
  font-size: inherit;
  background-color: initial;
  color: var(--color-main-text);
  border: initial;
  outline: initial;
  border-radius: initial;
  cursor: initial;
}

.clear-button >>> .multiselect__clear {
  position: absolute;
  right: 41px;
  height: 40px;
  width: 40px;
  display: block;
  cursor: pointer;
  z-index: 2;
}

.clear-button >>> .multiselect__clear::before,
.clear-button >>> .multiselect__clear::after {
  content: "";
  display: block;
  position: absolute;
  width: 3px;
  height: 16px;
  background: #aaa;
  top: 12px;
  right: 4px;
}

.clear-button >>> .multiselect__clear::before {
  transform: rotate(45deg);
}

.clear-button >>> .multiselect__clear::after {
  transform: rotate(-45deg);
}

.color-adjustments.multiselect {
  color: var(--color-main-text);
}

.color-adjustments.multiselect--disabled {
  background: initial;
  opacity: .3;
}

.color-adjustments.multiselect--disabled >>> .multiselect__select {
  background: initial;
}

.color-adjustments >>> .multiselect__tags {
  background-color: var(--color-main-background);
}

.color-adjustments >>> .multiselect__input::placeholder,
.color-adjustments >>> .multiselect__placeholder {
  color: var(--color-main-text);
}

.color-adjustments >>> .multiselect__content-wrapper {
  background-color: var(--color-main-background);
}

.color-adjustments >>> .multiselect__tags .multiselect__tag {
  background-color: var(--color-primary);
  color: var(--color-primary-text);
}

.color-adjustments
  >>> .multiselect__tags
  .multiselect__tag
  > .multiselect__tag-icon:after {
  color: var(--color-primary-text-dark);
}

.color-adjustments
  >>> .multiselect__tags
  .multiselect__tag
  > .multiselect__tag-icon:focus,
.color-adjustments
  >>> .multiselect__tags
  .multiselect__tag
  > .multiselect__tag-icon:hover {
  background-color: var(--color-primary-element-light);
}

.color-adjustments
  >>> .multiselect__tags
  .multiselect__tag
  > .multiselect__tag-icon:focus:after,
.color-adjustments
  >>> .multiselect__tags
  .multiselect__tag
  > .multiselect__tag-icon:hover:after {
  color: var(--color-primary-text);
}

.color-adjustments >>> .multiselect__option--highlight,
.color-adjustments >>> .multiselect__option--highlight:after {
  background-color: var(--color-primary);
  color: var(--color-primary-text);
}

.color-adjustments
  >>> .multiselect__option--selected.multiselect__option--highlight,
.color-adjustments
  >>> .multiselect__option--selected.multiselect__option--highlight:after {
  background-color: #ff6a6a;
  color: var(--color-primary-text);
}

.color-adjustments >>> .multiselect__option--selected,
.color-adjustments >>> .multiselect__option--selected:after {
  background-color: var(--color-background-darker);
  color: var(--color-text-light);
}
</style>
