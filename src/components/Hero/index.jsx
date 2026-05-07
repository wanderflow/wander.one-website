"use client";
import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { RotatingWordPill } from '@/components/RotatingWordPill'
import { getAppStoreUrl } from '@/utils/getAppStoreUrl'
import styles from './style.module.scss'

function clampHeroPct(n) {
  return Math.max(6, Math.min(94, n))
}

function derivedBlob2(t) {
  return {
    x: clampHeroPct(100 - t.x * 0.62 + 6),
    y: clampHeroPct(20 + t.y * 0.42),
  }
}

function derivedBlob3(t) {
  return {
    x: clampHeroPct(14 + t.y * 0.48),
    y: clampHeroPct(86 - t.x * 0.45),
  }
}

function idleTarget(nowMs) {
  const s = nowMs * 0.000095
  const x = clampHeroPct(
    50 + Math.sin(s * 0.62) * 24 + Math.sin(s * 0.21 + 1.1) * 9,
  )
  const y = clampHeroPct(
    36 + Math.cos(s * 0.48 + 0.4) * 20 + Math.sin(s * 0.29) * 11,
  )
  return { x, y }
}

export default function Hero() {
  const heroRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const node = heroRef.current
    if (!node) return

    const target = { x: 48, y: 30 }
    const smooth = {
      x: 48,
      y: 30,
      xLag: 48,
      yLag: 30,
      x2: 72,
      y2: 36,
      x3: 22,
      y3: 58,
    }

    const pointerRef = { current: null }

    const lerp = (a, b, t) => a + (b - a) * t

    const rafRef = { id: 0 }

    const tick = () => {
      rafRef.id = 0
      const idle = idleTarget(performance.now())
      const aim = pointerRef.current ?? idle
      target.x = aim.x
      target.y = aim.y

      smooth.x = lerp(smooth.x, target.x, 0.09)
      smooth.y = lerp(smooth.y, target.y, 0.09)
      smooth.xLag = lerp(smooth.xLag, target.x, 0.045)
      smooth.yLag = lerp(smooth.yLag, target.y, 0.045)

      const b2 = derivedBlob2(target)
      smooth.x2 = lerp(smooth.x2, b2.x, 0.055)
      smooth.y2 = lerp(smooth.y2, b2.y, 0.055)

      const b3 = derivedBlob3(target)
      smooth.x3 = lerp(smooth.x3, b3.x, 0.04)
      smooth.y3 = lerp(smooth.y3, b3.y, 0.04)

      node.style.setProperty('--hero-mx', `${smooth.x.toFixed(2)}%`)
      node.style.setProperty('--hero-my', `${smooth.y.toFixed(2)}%`)
      node.style.setProperty('--hero-mx-lag', `${smooth.xLag.toFixed(2)}%`)
      node.style.setProperty('--hero-my-lag', `${smooth.yLag.toFixed(2)}%`)
      node.style.setProperty('--hero-mx2', `${smooth.x2.toFixed(2)}%`)
      node.style.setProperty('--hero-my2', `${smooth.y2.toFixed(2)}%`)
      node.style.setProperty('--hero-mx3', `${smooth.x3.toFixed(2)}%`)
      node.style.setProperty('--hero-my3', `${smooth.y3.toFixed(2)}%`)

      rafRef.id = requestAnimationFrame(tick)
    }

    rafRef.id = requestAnimationFrame(tick)

    const setPointer = (clientX, clientY) => {
      const r = node.getBoundingClientRect()
      if (r.width <= 0 || r.height <= 0) return
      const x = ((clientX - r.left) / r.width) * 100
      const y = ((clientY - r.top) / r.height) * 100
      pointerRef.current = {
        x: clampHeroPct(x),
        y: clampHeroPct(y),
      }
    }

    const onMove = (e) => setPointer(e.clientX, e.clientY)
    const onTouch = (e) => {
      const t = e.touches[0]
      if (t) setPointer(t.clientX, t.clientY)
    }
    const clearPointer = () => {
      pointerRef.current = null
    }

    node.addEventListener('mousemove', onMove)
    node.addEventListener('touchstart', onTouch, { passive: true })
    node.addEventListener('touchmove', onTouch, { passive: true })
    node.addEventListener('touchend', clearPointer)
    node.addEventListener('touchcancel', clearPointer)
    node.addEventListener('mouseleave', clearPointer)
    return () => {
      if (rafRef.id !== 0) cancelAnimationFrame(rafRef.id)
      node.removeEventListener('mousemove', onMove)
      node.removeEventListener('touchstart', onTouch)
      node.removeEventListener('touchmove', onTouch)
      node.removeEventListener('touchend', clearPointer)
      node.removeEventListener('touchcancel', clearPointer)
      node.removeEventListener('mouseleave', clearPointer)
    }
  }, [reducedMotion])

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      aria-labelledby="hero-heading"
    >
      <div className={styles.heroGradient} aria-hidden="true" />
      <div className={styles.content}>
        <h1 id="hero-heading" className={styles.headline}>
          <span className={styles.headlineLine}>
            Wander finds the right people to plan your next
          </span>
          <RotatingWordPill />
        </h1>
        <div className={styles.actions}>
          <a
            href="#"
            className={styles.secondaryCta}
            onClick={(e) => {
              e.preventDefault()
              window.open(getAppStoreUrl(), '_blank')
            }}
          >
            Make your next plan
          </a>
        </div>
      </div>
    </section>
  )
}
