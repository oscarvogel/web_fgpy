import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { prefersReducedMotion } from './smooth'

gsap.registerPlugin(ScrollTrigger, SplitText)

/**
 * The page's single motion vocabulary, opt-in via data-anim:
 *   lines   text rises line by line out of a mask
 *   media   a frame unclips upward while its image settles from a slight zoom
 *   fade    small copy lifts in
 *   stagger direct children lift in one after another
 * Same curve and trigger point everywhere. DOM defaults are the final state, so reduced motion just skips this.
 */
export function useReveals() {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const at = (el: Element) => ({ trigger: el, start: 'top 88%', once: true })

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-anim="lines"]').forEach((el) => {
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true, // re-split when fonts load or the width changes
          onSplit: (self) =>
            gsap.from(self.lines, { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.08, scrollTrigger: at(el) }),
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-anim="media"]').forEach((el) => {
        gsap
          .timeline({ scrollTrigger: at(el), defaults: { duration: 1.4, ease: 'expo.out' } })
          .from(el, { clipPath: 'inset(100% 0% 0% 0%)' })
          .from(el.querySelector('img'), { scale: 1.15 }, 0)
      })

      gsap.utils.toArray<HTMLElement>('[data-anim="fade"]').forEach((el) => {
        gsap.from(el, { y: 16, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: at(el) })
      })

      gsap.utils.toArray<HTMLElement>('[data-anim="stagger"]').forEach((el) => {
        gsap.from(el.children, { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, scrollTrigger: at(el) })
      })
    })
    return () => ctx.revert()
  }, [])
}
