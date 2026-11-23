import { useMotionValue, useReducedMotion, useSpring, m } from 'motion/react'
import type { PointerEvent } from 'react'

const image = '/projects/demo-personaje/cover.webp'

export default function HeroArtwork() {
  const prefersReducedMotion = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const x = useSpring(pointerX, { stiffness: 55, damping: 22, mass: 1.2 })
  const y = useSpring(pointerY, { stiffness: 55, damping: 22, mass: 1.2 })

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion || (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * -9)
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * -6)
  }

  const resetPointer = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <figure className="hero-artwork" onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
      <m.img
        className="hero-artwork-image"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 1, delay: prefersReducedMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
        src={image}
        alt="Referencia conceptual del universo fantástico de Aelion; no representa un modelo 3D ni el diseño definitivo del protagonista."
        loading="eager"
        fetchPriority="high"
        decoding="async"
        style={{ x: prefersReducedMotion ? 0 : x, y: prefersReducedMotion ? 0 : y }}
      />
      <span className="hero-artwork-frame" aria-hidden="true" />
      <figcaption className="hero-artwork-caption">
        <span className="hero-artwork-index">RPG · FANTASÍA MEDIEVAL</span>
        <strong>AELION — EL REINO DE THALLOR</strong>
        <span>Referencia conceptual del universo</span>
      </figcaption>
    </figure>
  )
}
