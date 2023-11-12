import { useBreakpoints } from '@vueuse/core'

export function useDevice() {
  const breakpoints = useBreakpoints({
    tablet: 800,
    laptop: 1024,
    desktop: 1280
  })
  const isMobile = breakpoints.isSmallerOrEqual('tablet')
  return {
    isMobile
  }
}
