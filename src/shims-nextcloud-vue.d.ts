declare module '@nextcloud/vue/dist/Components/Modal' {
    import { VueConstructor } from 'vue'
    export const Modal: ModalConstructor

    interface ModalProps {
        /**
         * Declare if the modal can be closed
         * Default: true
         */
        canClose: boolean
        /**
         * Default: 5000
         */
        clearViewDelay: number
        /**
         * Makes the modal backdrop black if true
         * Default: false
         */
        dark: boolean
        /**
         * Declare if the slideshow functionality should be enabled
         * Default: false
         */
        enableSlideshow: boolean
        /**
         * Enable swipe between slides
         * Default: true
         */
        enableSwipe: boolean
        /**
         * Declare if a next slide is available
         * Default: false
         */
        hasNext: boolean
        /**
         * Declare if a previous slide is available
         * Default: false
         */
        hasPrevious: boolean
        /**
         * Declare if hiding the modal should be animated
         * Default: false
         */
        outTransition: boolean
        /**
         * Default: 'normal'
         */
        size: 'normal' | 'large' | 'full'
        /**
         * Declare the slide interval
         * Default: 3000
         */
        slideshowDelay: number
        /**
         * Allow to pause an ongoing slideshow
         * Default: false
         */
        slideshowPaused: boolean
        /**
         * Default: false
         */
        spreadNavigation: boolean
        /**
         * Title to be shown with the modal
         * Default: ''
         */
        title: string
    }

    interface ModalMethods {
        previous: () => void
        next: () => void
        close: () => void
    }

    interface ModalConstructor extends VueConstructor {
        props: ModalProps
        methods: ModalMethods
    }
}
