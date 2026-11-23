import { useState, type ReactNode } from 'react'
import { m, useReducedMotion } from 'motion/react'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  amount?: number
  stagger?: boolean
}

/** A one-time, reduced-motion-aware entrance for page content. */
export default function Reveal({ children, className, delay = 0, amount = 0.14, stagger = false }: RevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const [hasEntered, setHasEntered] = useState(false)
  const classes = [className, stagger && 'reveal-stagger', (hasEntered || prefersReducedMotion) && 'is-revealed'].filter(Boolean).join(' ')

  return (
    <m.div
      className={classes}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount, margin: '0px 0px -7% 0px' }}
      onViewportEnter={() => setHasEntered(true)}
      transition={{ duration: prefersReducedMotion ? 0 : 0.52, delay: prefersReducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  )
}
