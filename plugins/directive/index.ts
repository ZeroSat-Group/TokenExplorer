import stickyBottom from './sticky-bottom'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('StickyBottom', stickyBottom)
})
