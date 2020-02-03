<template>
  <div id="ocr-view">
    <modal v-if="show" @close="closeModal" :can-close="canClose" :title="title">
      <modal-content class="modal__content"></modal-content>
    </modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Modal } from '@nextcloud/vue/dist/Components/Modal'
import { Translations as CommonTranslations } from '@/common/Translations'
import { HIDE_MODAL } from '@a/store/Store'
import { Translations } from '@a/configuration/Translations'
import ModalContent from '@a/components/ModalContent.vue'

export default Vue.extend({
  name: 'App',
  components: { Modal, ModalContent },
  computed: {
    favoriteLanguages(): string[] {
      return this.$store.state.favoriteLanguages
    },
    show(): boolean {
      return this.$store.state.showModal
    },
    selectedFiles(): OCAFile[] {
      return this.$store.state.selectedFiles
    },
    title(): string {
      return `${CommonTranslations.TRANSLATION_OCR}: ${Translations.TRANSLATION_FILE_FILES(this.selectedFiles.length)}`
    },
    canClose(): boolean {
      return !this.$store.state.processing
    }
  },
  methods: {
    closeModal(): void {
      this.$store.commit(HIDE_MODAL)
    }
  }
})
</script>

<style>
.icon-ocr {
    background-image: url('../img/icon/ocr.svg');
}
.dark .icon-ocr {
    filter: invert(100%);
}
</style>

<style scoped>
.modal__content {
  width: 50vw;
  margin: 10vw 15px;
}
</style>
