import { Component, lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { LazyMotion, MotionConfig, domAnimation, m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Box,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Expand,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  Glasses,
  Github,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  Menu,
  Palette,
  Wrench,
  X,
} from 'lucide-react'
import { contactLinks } from './data/contact'
import { profile } from './data/profile'
import { categories, publicProjects } from './data/projects'
import type { ImageComparison, Project, ProjectMedia, ProjectModelViewerConfig, TechnicalPbrMap } from './types'
import HeroArtwork from './components/hero/HeroArtwork'
import Reveal from './components/motion/Reveal'

const LazyProjectModelViewer = lazy(() => import('./components/project/ProjectModelViewer'))

type TechnicalBreakdownView = {
  metrics: Array<{ label: string; value: number }>
  metadata: Array<{ label: string; value: string }>
  software: string[]
  pbrMaps: TechnicalPbrMap[]
  technicalImages: Array<{ label: string; media: ProjectMedia }>
  additionalInfo: Array<{ label: string; value: string }>
}

class ModelViewerChunkBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

const navigation = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'mi-marca', label: 'CRONOS' },
  { id: 'contacto', label: 'Contacto' },
]

const projectFromHash = () => {
  const match = window.location.hash.match(/^#proyecto\/(.+)$/)
  return match ? publicProjects.find((project) => project.id === match[1]) ?? null : null
}

type ProjectFilter = (typeof categories)[number]

const resolveSectionId = (id: string) => id === '3d-art' || id === 'xr-experiences' ? 'proyectos' : id

function App() {
  const prefersReducedMotion = useReducedMotion()
  const [activeProject, setActiveProject] = useState<Project | null>(projectFromHash)
  const [activeCategory, setActiveCategory] = useState<ProjectFilter>('Todos')
  const [activeSection, setActiveSection] = useState('inicio')
  const [menuOpen, setMenuOpen] = useState(false)

  const visibleProjects = useMemo(() => {
    if (activeCategory === 'Todos') return publicProjects
    return publicProjects.filter((project) => {
      if (activeCategory === 'Personajes') return project.category === 'Personajes' || project.category === 'Character Art'
      if (activeCategory === 'Props') return project.category === 'Props' || project.category === 'Props & Weapons'
      if (activeCategory === 'Entornos') return project.category === 'Entornos' || project.category === 'Environment Art'
      if (activeCategory === 'Escultura') return project.category === 'Escultura' || project.category === 'Digital Sculpting'
      if (activeCategory === 'VR/AR') return ['VR/AR', 'VR', 'AR', 'Virtual Reality (VR)', 'Augmented Reality (AR)'].includes(project.category)
      return project.category === activeCategory
    })
  }, [activeCategory])

  useEffect(() => {
    const syncLocation = () => {
      const project = projectFromHash()
      setActiveProject(project)
      if (!project && window.location.hash.startsWith('#')) {
        const section = resolveSectionId(window.location.hash.slice(1))
        window.setTimeout(() => document.getElementById(section)?.scrollIntoView({ block: 'start' }), 0)
      }
    }
    window.addEventListener('hashchange', syncLocation)
    window.addEventListener('popstate', syncLocation)
    return () => {
      window.removeEventListener('hashchange', syncLocation)
      window.removeEventListener('popstate', syncLocation)
    }
  }, [])

  useEffect(() => {
    if (activeProject) return
    const targets = navigation
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)
    const observer = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (current) setActiveSection(current.target.id)
    }, { rootMargin: '-24% 0px -58% 0px', threshold: [0, 0.15, 0.35, 0.6] })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [activeProject])

  const openProject = (project: Project) => {
    window.history.pushState(null, '', `#proyecto/${project.id}`)
    setActiveProject(project)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateTo = (id: string) => {
    const sectionId = resolveSectionId(id)
    setMenuOpen(false)
    if (activeProject) {
      window.history.pushState(null, '', `#${sectionId}`)
      setActiveProject(null)
      window.setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }), 30)
      return
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    window.history.replaceState(null, '', `#${sectionId}`)
  }

  const closeProject = () => navigateTo('proyectos')

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
    <LazyMotion features={domAnimation}>
    <div className="site-shell">
      <SiteHeader
        activeSection={activeProject ? '' : activeSection}
        menuOpen={menuOpen}
        onNavigate={navigateTo}
        onToggleMenu={() => setMenuOpen((open) => !open)}
      />
      <m.div
        key={activeProject?.id ?? 'home'}
        className="page-transition-stage"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.28 }}
      >
      {activeProject ? (
        <ProjectDetail project={activeProject} onBack={closeProject} />
      ) : (
        <main>
          <Hero onNavigate={navigateTo} />
          <ProjectsSection
            activeCategory={activeCategory}
            projects={visibleProjects}
            totalProjects={publicProjects.length}
            onCategoryChange={setActiveCategory}
            onOpenProject={openProject}
          />
          <AboutSection />
          <BrandSection />
          <ContactSection />
        </main>
      )}
      </m.div>
      <SiteFooter onNavigate={navigateTo} />
    </div>
    </LazyMotion>
    </MotionConfig>
  )
}

function SiteHeader({
  activeSection,
  menuOpen,
  onNavigate,
  onToggleMenu,
}: {
  activeSection: string
  menuOpen: boolean
  onNavigate: (id: string) => void
  onToggleMenu: () => void
}) {
  return (
    <header className="site-header">
      <a className="wordmark" href="#inicio" onClick={(event) => { event.preventDefault(); onNavigate('inicio') }} aria-label="Christian Ocampo, inicio">
        <span className="wordmark-mark">C<span>.</span></span>
        <span className="wordmark-copy"><strong>CHRISTIAN OCAMPO</strong><small>3D ARTIST PORTFOLIO</small></span>
      </a>
      <button className="menu-toggle" type="button" onClick={onToggleMenu} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen}>
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Navegación principal">
        {navigation.map((item, index) => (
          <a
            key={item.id}
            className={activeSection === item.id ? 'is-active' : ''}
            aria-current={activeSection === item.id ? 'location' : undefined}
            href={`#${item.id}`}
            onClick={(event) => { event.preventDefault(); onNavigate(item.id) }}
          >
            <span className="nav-index">0{index + 1}</span>{item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

function Hero({ onNavigate }: { onNavigate: (id: string) => void }) {
  const heroRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 34])
  const visualOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.48])

  return (
        <section className="hero-section" id="inicio" aria-labelledby="hero-title" ref={heroRef}>
          <div className="hero-art" aria-hidden="true" />
          <div className="hero-shade" aria-hidden="true" />
          <m.div
            className="hero-visual"
            style={{ y: prefersReducedMotion ? 0 : visualY, opacity: prefersReducedMotion ? 1 : visualOpacity }}
          >
            <HeroArtwork />
          </m.div>
          <div className="hero-content page-gutter">
            <m.div
              className="hero-copy"
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
              variants={{ visible: { transition: { delayChildren: 0.18, staggerChildren: 0.16 } } }}
            >
              <m.p className="eyebrow" variants={heroReveal}><span className="eyebrow-line" /> 3D ARTIST <i aria-hidden="true">|</i> MODELING <i aria-hidden="true">|</i> TEXTURING <i aria-hidden="true">|</i> ENVIRONMENT</m.p>
              <m.h1 id="hero-title" aria-label="Christian Ocampo">
                <m.span variants={heroNameReveal} aria-hidden="true">Christian</m.span>
                <m.em variants={heroNameReveal} aria-hidden="true">Ocampo</m.em>
              </m.h1>
              <m.p className="hero-mobile-project-id" variants={heroReveal}>AELION — EL REINO DE THALLOR · REFERENCIA CONCEPTUAL</m.p>
              <m.div className="hero-specialties" aria-label="Especialidades" variants={heroReveal}>
                <span className="specialties-label">ESPECIALIDADES</span>
                <div>{profile.specialties.map((specialty) => <m.span key={specialty} variants={heroChipReveal}>{specialty}</m.span>)}</div>
              </m.div>
              <m.p className="hero-description" variants={heroReveal}>Creo personajes, objetos y espacios digitales que invitan a explorar nuevos mundos.</m.p>
              <m.div className="hero-actions" variants={heroActionsReveal}>
                <m.button type="button" className="button button-primary" variants={heroReveal} whileTap={{ scale: 0.97 }} onClick={() => onNavigate('proyectos')}>Explorar proyectos <ArrowRight size={15} /></m.button>
                <m.button type="button" className="button button-quiet" variants={heroReveal} whileTap={{ scale: 0.97 }} onClick={() => onNavigate('sobre-mi')}>Conocer mi perfil <ArrowDown size={15} /></m.button>
              </m.div>
              <m.div variants={heroReveal}><SocialLinks compact /></m.div>
            </m.div>
          </div>
          <button type="button" className="scroll-cue" onClick={() => onNavigate('proyectos')} aria-label="Desplazarse a proyectos"><span>DESPLAZAR</span><m.span className="scroll-cue-indicator" initial={false} animate={prefersReducedMotion ? undefined : { y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: 1, ease: 'easeInOut' }}><ArrowDown size={14} /></m.span></button>
        </section>
  )
}

const heroReveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.68, ease: [0.22, 1, 0.36, 1] as const } },
}

const heroNameReveal = {
  hidden: { opacity: 0, y: 48, clipPath: 'inset(0 0 100% 0)' },
  visible: { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.94, ease: [0.22, 1, 0.36, 1] as const } },
}

const heroChipReveal = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48 } },
}

const heroActionsReveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.54, staggerChildren: 0.12 } },
}

function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`social-links${compact ? ' is-compact' : ''}`} aria-label="Redes profesionales">
      {contactLinks.filter((item) => item.label !== 'Correo electrónico').map((item) => {
        const icon = item.label === 'Instagram' ? <Instagram size={16} />
          : item.label === 'LinkedIn' ? <Linkedin size={16} />
            : item.label === 'GitHub' ? <Github size={16} />
              : <span className="social-monogram">{item.label === 'ArtStation' ? 'As' : 'Be'}</span>
        return item.href ? (
          <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label} title={item.label}>{icon}</a>
        ) : (
          <span className="social-disabled" key={item.label} aria-label={`${item.label}: pendiente de configurar`} title={`${item.label}: configura el enlace en src/data/contact.ts`}>{icon}</span>
        )
      })}
    </div>
  )
}

function SectionHeading({ index, eyebrow, title, description, titleId }: { index: string; eyebrow: string; title: string; description?: string; titleId: string }) {
  const prefersReducedMotion = useReducedMotion()
  return (
    <m.div className="section-heading" initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}>
      <div className="section-heading-top"><span className="section-index">{index}</span><m.span className="eyebrow-line" initial={prefersReducedMotion ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: prefersReducedMotion ? 0 : 0.48, delay: prefersReducedMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }} /><span className="eyebrow">{eyebrow}</span></div>
      <div className="section-heading-row"><h2 id={titleId}>{title}</h2>{description && <p>{description}</p>}</div>
    </m.div>
  )
}

function ProjectsSection({
  activeCategory,
  projects: visibleProjects,
  totalProjects,
  onCategoryChange,
  onOpenProject,
}: {
  activeCategory: ProjectFilter
  projects: Project[]
  totalProjects: number
  onCategoryChange: (category: ProjectFilter) => void
  onOpenProject: (project: Project) => void
}) {
  return (
    <section className="projects-section page-gutter section-space" id="proyectos" aria-labelledby="projects-title">
      <SectionHeading index="01" eyebrow="SELECCIÓN DE TRABAJOS" title="Proyectos" titleId="projects-title" description="Un archivo vivo de exploraciones en forma, materia y atmósfera." />
      <Reveal className="projects-toolbar" delay={0.08}>
        <p><span className="demo-pin" /> El contenido visual actual combina trabajos y referencias de demostración.</p>
        <span className="project-count">{String(visibleProjects.length).padStart(2, '0')} <span>/ {String(totalProjects).padStart(2, '0')} piezas</span></span>
      </Reveal>
      <Reveal className="filter-list" delay={0.14}>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`filter-chip${activeCategory === category ? ' is-selected' : ''}`}
            aria-pressed={activeCategory === category}
            onClick={() => onCategoryChange(category)}
          >{category}</button>
        ))}
      </Reveal>
      {visibleProjects.length > 0 ? (
        <div className="project-grid">
          {visibleProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onOpen={() => onOpenProject(project)} />)}
        </div>
      ) : (
        <div className="empty-projects is-filter-empty">
          <span className="empty-mark">—</span>
          <h3>{activeCategory === 'Todos' ? 'Este espacio está abierto.' : `Aún no hay proyectos en ${activeCategory}.`}</h3>
          <p>{activeCategory === 'Todos' ? 'Cuando publiques nuevos trabajos, aparecerán aquí junto a sus recursos y fichas técnicas.' : 'Explora otra especialidad para ver los proyectos publicados.'}</p>
        </div>
      )}
    </section>
  )
}

function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const prefersReducedMotion = useReducedMotion()
  return (
    <m.button type="button" layout className={`project-card project-card-${index + 1} project-card--${project.id}`} onClick={onOpen} aria-label={`Ver detalle: ${project.title}`} initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} whileHover={prefersReducedMotion ? undefined : { y: -3 }} whileFocus={prefersReducedMotion ? undefined : { y: -3 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: prefersReducedMotion ? 0 : 0.58, delay: prefersReducedMotion ? 0 : Math.min(index * 0.09, 0.36), ease: [0.22, 1, 0.36, 1] }}>
      <div className="project-image-wrap">
        <img src={project.cover} alt={project.coverAlt} loading="lazy" />
        <span className="project-image-index">{String(index + 1).padStart(2, '0')}</span>
        <span className="project-open"><ArrowUpRight size={17} /></span>
        {project.isDemo && <span className="project-demo-label">DEMO</span>}
      </div>
      <div className="project-card-copy">
        <div><span className="project-category">{project.category}</span><h3>{project.title}</h3></div>
        <span className="project-card-arrow"><ArrowUpRight size={18} /></span>
      </div>
      <div className="project-card-meta"><span>{project.type ?? project.tags?.[0] ?? 'Proyecto'}</span><span>{project.type ? project.tags?.join(' · ') ?? (project.isDemo ? 'Imagen de demostración' : 'Ver ficha') : project.tags?.slice(1).join(' · ') || 'Ver ficha'}</span></div>
    </m.button>
  )
}

function AboutSection() {
  return (
    <section className="about-section page-gutter section-space" id="sobre-mi" aria-labelledby="about-title">
      <SectionHeading index="02" eyebrow="SOBRE EL ARTISTA" title="Forma, intención y detalle." titleId="about-title" description="Un perfil que reúne mirada artística, oficio y curiosidad por los mundos interactivos." />
      <Reveal className="about-layout">
        <div className="about-intro">
          <div className="about-intro-copy"><span className="eyebrow">PERFIL PROFESIONAL</span><h3>Christian<br /><em>Ocampo</em></h3><p>{profile.introduction}</p></div>
          <div className="about-specialties"><div className="skill-label"><Wrench size={16} /><span>ÁREAS DE PRÁCTICA</span></div><div className="skill-chips">{profile.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>
        </div>
      </Reveal>
      <section className="about-education" aria-labelledby="education-title">
        <div className="about-subheading"><span className="eyebrow"><GraduationCap size={15} /> 01 / FORMACIÓN</span><h3 id="education-title">Trayectoria académica</h3></div>
        <Reveal className="education-grid" stagger>
          {profile.education.map((item) => (
            <article className="education-card" key={item.id}>
              <div className="education-card-top"><span>{item.institution}</span><span className={`status-badge${item.status === 'Finalizado' ? ' is-complete' : ''}`}>{item.status}</span></div>
              <h4>{item.title}</h4>
              {item.period && <p className="education-period">{item.period}</p>}
              {item.level && <p className="education-level">{item.level}</p>}
              {item.detail && <p className="education-detail">{item.detail}</p>}
            </article>
          ))}
        </Reveal>
      </section>
      <section className="about-certifications" aria-labelledby="certifications-title">
        <div className="about-subheading"><span className="eyebrow"><BadgeCheck size={15} /> 02 / ESTUDIOS COMPLEMENTARIOS</span><h3 id="certifications-title">Certificaciones y formación adicional</h3></div>
        <Reveal className="certification-grid" stagger>
          {profile.additionalStudies.map((study, index) => (
            <article className="certification-card" key={study.id}>
              <span className="certification-index">{String(index + 1).padStart(2, '0')}</span>
              <div><h4>{study.title}</h4>{study.institution && <p>{study.institution}</p>}</div>
            </article>
          ))}
        </Reveal>
      </section>
      <section className="about-experience" aria-labelledby="experience-title">
        <div className="about-subheading"><span className="eyebrow"><Briefcase size={15} /> 03 / EXPERIENCIA</span><h3 id="experience-title">Experiencia profesional</h3></div>
        <Reveal className="experience-timeline" stagger>
          {profile.experience.map((item) => (
            <li key={item.id}>
              <article className="experience-entry">
                <div className="experience-period">{item.period}</div>
                <div className="experience-copy"><h4>{item.role}</h4><p className="experience-organization">{item.organization}</p>
                  {item.responsibilities && <ul>{item.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}</ul>}
                </div>
              </article>
            </li>
          ))}
        </Reveal>
      </section>
      <section className="about-software" aria-labelledby="software-title">
        <div className="about-subheading"><span className="eyebrow"><Wrench size={15} /> 04 / SOFTWARE Y HERRAMIENTAS</span><h3 id="software-title">Recursos de trabajo</h3></div>
        <Reveal className="software-category-grid" stagger>
          {profile.software.map((group) => {
            const CategoryIcon = group.id === '3d-videojuegos' ? Box : group.id === 'diseno-multimedia' ? Palette : Glasses
            return (
              <article className="software-category" key={group.id}>
                <h4><CategoryIcon size={17} />{group.category}</h4>
                <ul>{group.tools.map((tool) => <li key={tool}><SoftwareLogo tool={tool} />{tool}</li>)}</ul>
              </article>
            )
          })}
        </Reveal>
      </section>
    </section>
  )
}

const softwareLogoMarks: Record<string, { className: string; mark: string; src?: string }> = {
  Blender: { className: 'is-image', mark: 'BL', src: '/software/blender.png' },
  Unity: { className: 'is-image is-unity-icon', mark: 'UN', src: '/software/unity.png' },
  'Substance Painter': { className: 'is-image', mark: 'Pt', src: '/software/substance-painter.png' },
  '3ds Max': { className: 'is-image', mark: '3ds', src: '/software/3ds-max.png' },
  ZBrush: { className: 'is-image', mark: 'ZB', src: '/software/zbrush.png' },
  'Marvelous Designer': { className: 'is-image', mark: 'M', src: '/software/marvelous-designer.png' },
  'Adobe Photoshop': { className: 'is-adobe-icon', mark: 'Ps', src: '/software/adobe-photoshop.svg' },
  'Adobe Illustrator': { className: 'is-adobe-icon', mark: 'Ai', src: '/software/adobe-illustrator.svg' },
  'Adobe Premiere Pro': { className: 'is-adobe-icon', mark: 'Pr', src: '/software/adobe-premiere-pro.svg' },
  '3DVista': { className: 'is-image is-3dvista-icon', mark: '3D', src: '/software/3dvista.png' },
  'Optimización Realtime': { className: 'is-initials is-realtime', mark: 'OR' },
  'UI interactiva básica': { className: 'is-initials is-ui', mark: 'UI' },
}

function SoftwareLogo({ tool }: { tool: string }) {
  const logo = softwareLogoMarks[tool]
  if (!logo) return <span className="tool-monogram" aria-hidden="true">{toolMonogram(tool)}</span>

  return (
    <span className={`tool-logo ${logo.className}`} aria-hidden="true">
      {logo.src ? <img src={logo.src} alt="" loading="lazy" decoding="async" /> : logo.mark}
    </span>
  )
}

function toolMonogram(tool: string) {
  return tool
    .split(/\s+/)
    .filter((word) => !['y', '&', 'using'].includes(word.toLowerCase()))
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function BrandSection() {
  return (
    <section className="brand-section page-gutter section-space" id="mi-marca" aria-labelledby="brand-title">
      <SectionHeading index="03" eyebrow="UN ESPACIO APARTE" title="Mi marca" titleId="brand-title" description="Una identidad independiente, presentada con sus propios códigos visuales." />
      <Reveal className="brand-card">
        <div className="brand-visual" aria-label="Espacio reservado para recursos originales de CRONOS">
          <span className="brand-visual-number">01 / IDENTIDAD</span>
          <div className="brand-logo-placeholder"><span>LOGOTIPO ORIGINAL</span><strong>Por integrar</strong></div>
          <span className="brand-visual-caption">Espacio para recursos gráficos originales</span>
        </div>
        <div className="brand-copy">
          <span className="eyebrow"><span className="eyebrow-line" /> MARCA PERSONAL INDEPENDIENTE</span>
          <h3>CRONOS</h3>
          <p>CRONOS es una marca personal independiente de este portafolio. Este espacio queda preparado para presentar su historia, filosofía y recursos visuales originales cuando estén disponibles.</p>
          <span className="pending-note"><span className="demo-pin" /> Identidad original pendiente de integrar</span>
        </div>
        <div className="brand-card-index">C / 03</div>
      </Reveal>
    </section>
  )
}

function ContactSection() {
  return (
    <section className="contact-section page-gutter section-space" id="contacto" aria-labelledby="contact-title">
      <SectionHeading index="04" eyebrow="HABLEMOS" title="¿Tienes una idea en mente?" titleId="contact-title" description="Abierto a proyectos, colaboraciones y nuevas conversaciones." />
      <Reveal className="contact-layout">
        <div className="contact-note"><span className="contact-icon"><Mail size={21} /></span><p>Los datos de contacto se publicarán aquí cuando estén listos.</p><span className="pending-note"><span className="demo-pin" /> Enlaces por configurar</span></div>
        <div className="contact-list">
          {contactLinks.map((item, index) => (
            <a
              className={`contact-row${item.href ? '' : ' is-pending'}`}
              href={item.href || undefined}
              key={item.label}
              target={item.href && item.label !== 'Correo electrónico' ? '_blank' : undefined}
              rel={item.href && item.label !== 'Correo electrónico' ? 'noreferrer' : undefined}
              aria-disabled={!item.href}
              onClick={(event) => { if (!item.href) event.preventDefault() }}
            >
              <span className="contact-number">0{index + 1}</span><span>{item.label}</span><span className="contact-value">{item.href ? 'Visitar' : 'Pendiente'}</span><ArrowUpRight size={16} />
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

function getProjectWorkflow(project: Project): Array<{ title: string; description?: string; media?: ProjectMedia }> {
  if (project.workflow?.length) {
    return project.workflow.map((step) => ({
      title: step.name,
      description: step.description,
      media: step.image ? { src: step.image, alt: `Etapa ${step.name}` } : undefined,
    }))
  }

  const galleryOrder = ['Model Render', 'Wireframe', 'Textured Model', 'Normal Map', 'Final Render']
  const gallery = [...(project.gallery ?? [])].sort((a, b) => {
    const aIndex = galleryOrder.indexOf(a.caption ?? '')
    const bIndex = galleryOrder.indexOf(b.caption ?? '')
    return (aIndex < 0 ? galleryOrder.length : aIndex) - (bIndex < 0 ? galleryOrder.length : bIndex)
  })
  const media = [
    ...(project.conceptArt ?? []),
    ...(project.references ?? []),
    ...gallery,
    ...(project.processImages ?? []),
    ...(project.topology ?? []),
    ...(project.uvMaps ?? []),
  ]
  const uniqueMedia = [...new Map(media.map((item) => [item.src, item])).values()]

  return uniqueMedia.map((item) => ({ title: item.caption ?? 'Recurso del proyecto', media: item }))
}

function getTechnicalBreakdown(project: Project): TechnicalBreakdownView | null {
  const sheet = project.technicalSheet
  if (!sheet) return null

  const metrics = [
    { label: 'Polígonos', value: sheet.polygons },
    { label: 'Vértices', value: sheet.vertices },
    { label: 'Triángulos', value: sheet.triangles },
    { label: 'Objetos de malla', value: sheet.objectCount },
    { label: 'Materiales', value: sheet.materialCount },
  ].filter((metric): metric is { label: string; value: number } => metric.value !== undefined && metric.value !== null)

  const metadata = [
    { label: 'Topología', value: sheet.topology },
    { label: 'Resolución de texturas', value: sheet.textureResolution },
    { label: 'Formato del modelo', value: sheet.modelFormats?.filter(Boolean).join(' · ') },
    { label: 'Motor de render', value: sheet.renderEngine },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value?.trim()))

  const projectSoftware = new Set((project.software ?? []).map((name) => name.trim().toLowerCase()))
  const software = [...new Set((sheet.software ?? []).map((name) => name.trim()).filter((name) => name && !projectSoftware.has(name.toLowerCase())))]
  const existingMedia = [
    ...(project.gallery ?? []),
    ...(project.processImages ?? []),
    ...(project.topology ?? []),
    ...(project.uvMaps ?? []),
    ...(project.textures ?? []),
    ...(project.textureGroups ?? []).flatMap((group) => group.maps),
  ]
  const existingSources = new Set(existingMedia.map((media) => media.src))
  const pbrMaps = (sheet.pbrMaps ?? []).filter((map) => {
    const hasDuplicateImage = map.image && existingSources.has(map.image.src)
    return !hasDuplicateImage
  })
  const technicalImages = [
    ...(sheet.wireframe ? [{ label: 'Wireframe', media: sheet.wireframe }] : []),
    ...(sheet.uvLayout ? [{ label: 'Distribución UV', media: sheet.uvLayout }] : []),
    ...(sheet.retopology ?? []).map((media) => ({ label: media.caption ?? 'Retopología', media })),
  ].filter((item) => !existingSources.has(item.media.src))
  const additionalInfo = (sheet.additionalInfo ?? []).filter((item) => item.label.trim() && item.value.trim())

  if (!metrics.length && !metadata.length && !software.length && !pbrMaps.length && !technicalImages.length && !additionalInfo.length) return null
  return { metrics, metadata, software, pbrMaps, technicalImages, additionalInfo }
}

function isValidSketchfabUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:'
      && ['sketchfab.com', 'www.sketchfab.com'].includes(url.hostname)
      && /\/(?:models|3d-models)\/[^/]+\/embed\/?$/i.test(url.pathname)
      && !/replace|reemplazar/i.test(url.pathname)
  } catch {
    return false
  }
}

function isValidLocalModelSource(value: string): boolean {
  try {
    const url = new URL(value, window.location.origin)
    return url.origin === window.location.origin && /\.(?:glb|gltf)$/i.test(url.pathname)
  } catch {
    return false
  }
}

function getProjectModelViewer(project: Project): ProjectModelViewerConfig | null {
  const configured = project.modelViewer
  if (configured?.type === 'local' && isValidLocalModelSource(configured.src)) return configured
  if (configured?.type === 'sketchfab' && isValidSketchfabUrl(configured.url)) return configured

  if (project.modelViewerUrl && isValidSketchfabUrl(project.modelViewerUrl)) {
    return { type: 'sketchfab', url: project.modelViewerUrl, poster: project.cover }
  }
  return null
}

function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const prefersReducedMotion = useReducedMotion()
  const workflowSteps = getProjectWorkflow(project)
  const technicalBreakdown = getTechnicalBreakdown(project)
  const modelViewer = getProjectModelViewer(project)
  const xrDetails = [
    { label: 'TECNOLOGÍAS', values: project.xrDetails?.technologies },
    { label: 'DISPOSITIVOS', values: project.xrDetails?.devices },
    { label: 'FUNCIONALIDADES', values: project.xrDetails?.functionalities },
  ].filter((item) => item.values?.length)
  const [activeWorkflowStage, setActiveWorkflowStage] = useState<number | null>(null)
  const workflowRailRef = useRef<HTMLDivElement>(null)
  const [workflowRailState, setWorkflowRailState] = useState({ canPrevious: false, canNext: false, progress: 1 })
  const sections = [
    { id: 'resumen', label: 'Resumen', available: true },
    { id: 'concept-art', label: 'Concept art', available: Boolean(project.conceptArt?.length) },
    { id: 'referencias', label: 'Referencias', available: Boolean(project.references?.length) },
    { id: 'concept-result', label: 'Concepto / resultado', available: Boolean(project.comparison) },
    { id: 'renders', label: 'Renders', available: Boolean(project.gallery?.length) },
    { id: 'proceso-tecnico', label: 'Proceso técnico', available: Boolean(project.processImages?.length) },
    { id: 'workflow', label: 'Del concepto al render', available: Boolean(workflowSteps.length) },
    { id: 'analisis-modelo', label: 'Análisis del modelo', available: Boolean(project.modelComparisons?.length) },
    { id: 'ficha-tecnica', label: 'Ficha técnica', available: Boolean(technicalBreakdown) },
    { id: 'topologia', label: 'Wireframes y topología', available: Boolean(project.topology?.length) },
    { id: 'uv', label: 'UV', available: Boolean(project.uvMaps?.length) },
    { id: 'texturas', label: 'Texturas', available: Boolean(project.textures?.length) },
    { id: 'materiales', label: 'Mapas por material', available: Boolean(project.textureGroups?.length) },
    { id: 'videos', label: 'Videos', available: Boolean(project.videos?.length) },
    { id: 'modelo-3d', label: 'Modelo 3D', available: Boolean(modelViewer) },
    { id: 'creditos', label: 'Créditos', available: Boolean(project.credits?.length || project.collaborators?.length) },
  ].filter((section) => section.available)

  useEffect(() => {
    const rail = workflowRailRef.current
    if (!rail) return

    const updateRailState = () => {
      const maxScroll = Math.max(rail.scrollWidth - rail.clientWidth, 0)
      const progress = maxScroll === 0 ? 1 : rail.scrollLeft / maxScroll
      setWorkflowRailState({
        canPrevious: rail.scrollLeft > 2,
        canNext: maxScroll - rail.scrollLeft > 2,
        progress,
      })
    }

    updateRailState()
    rail.addEventListener('scroll', updateRailState, { passive: true })
    const resizeObserver = new ResizeObserver(updateRailState)
    resizeObserver.observe(rail)
    window.addEventListener('resize', updateRailState)
    return () => {
      rail.removeEventListener('scroll', updateRailState)
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateRailState)
    }
  }, [workflowSteps.length])

  const scrollWorkflowRail = (direction: -1 | 1) => {
    const rail = workflowRailRef.current
    if (!rail) return
    rail.scrollBy({ left: direction * Math.max(rail.clientWidth * 0.82, 220), behavior: 'smooth' })
  }

  return (
    <main className="project-detail page-gutter">
      <div className="detail-topline"><button type="button" className="back-link" onClick={onBack}><ArrowLeft size={15} /> Volver a proyectos</button><span>{project.category} <span className="meta-dot">·</span> {project.type ?? project.tags?.join(' · ')}</span></div>
      <div className="detail-hero">
        <div className="detail-title"><span className="eyebrow"><span className="eyebrow-line" /> FICHA DE PROYECTO {project.isDemo && <span className="detail-demo">/ DEMOSTRACIÓN</span>}</span><h1>{project.title}</h1><p>{project.description}</p><div className="detail-meta">{project.date && <span>{project.date}</span>}</div></div>
        <figure className="detail-cover"><a href={project.cover} target="_blank" rel="noreferrer" aria-label="Ampliar render principal"><img src={project.cover} alt={project.coverAlt} fetchPriority="high" /></a><figcaption><span>01</span>{project.isDemo ? 'Imagen de demostración' : 'Final Render'}</figcaption></figure>
      </div>
      {workflowSteps.length ? (
        <section className="detail-section detail-workflow-overview" id="detalle-workflow" aria-labelledby="project-workflow-title">
          <span className="eyebrow">PROCESO DEL PROYECTO</span><h2 id="project-workflow-title">Del concepto al render.</h2>
          <div className="workflow-gallery-toolbar">
            <span>ETAPAS DEL PROCESO <i>·</i> {String(workflowSteps.length).padStart(2, '0')}</span>
            <div className="workflow-gallery-controls" aria-label="Navegación de etapas">
              <button type="button" onClick={() => scrollWorkflowRail(-1)} disabled={!workflowRailState.canPrevious} aria-label="Ver etapas anteriores"><ChevronLeft size={17} /></button>
              <button type="button" onClick={() => scrollWorkflowRail(1)} disabled={!workflowRailState.canNext} aria-label="Ver etapas siguientes"><ChevronRight size={17} /></button>
            </div>
          </div>
          <div className="workflow-overview" ref={workflowRailRef} aria-label="Etapas del proyecto">
            {workflowSteps.map((step, index) => (
              <m.button className="workflow-overview-step" type="button" key={`${step.title}-${index}`} onClick={() => setActiveWorkflowStage(index)} aria-label={`Ampliar etapa ${index + 1}: ${step.title}`} initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} whileHover={prefersReducedMotion ? undefined : { y: -3 }} whileFocus={prefersReducedMotion ? undefined : { y: -3 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: prefersReducedMotion ? 0 : 0.58, delay: prefersReducedMotion ? 0 : Math.min(index * 0.09, 0.36), ease: [0.22, 1, 0.36, 1] }}>
                {step.media && <figure><img src={step.media.src} alt={step.media.alt} loading="lazy" decoding="async" /></figure>}
                <span className="workflow-step-index">{String(index + 1).padStart(2, '0')}</span><strong>{step.title}</strong><span className="workflow-open-hint"><Expand size={13} /><span>Ampliar</span></span>
                {step.description && <p>{step.description}</p>}
              </m.button>
            ))}
          </div>
          <div className="workflow-gallery-progress" role="progressbar" aria-label="Progreso de la galería de etapas" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(workflowRailState.progress * 100)}>
            <span style={{ transform: `scaleX(${workflowRailState.progress})` }} />
          </div>
        </section>
      ) : null}
      {project.modelComparisons?.length ? (
        <section className="detail-section model-analysis-section" id="detalle-analisis-modelo" aria-labelledby="model-analysis-title">
          <span className="eyebrow">ANÁLISIS VISUAL</span>
          <h2 id="model-analysis-title">Análisis del modelo.</h2>
          <div className="model-comparisons">
            {project.modelComparisons.map((comparison, index) => <ModelImageComparison comparison={comparison} key={`${comparison.title}-${index}`} />)}
          </div>
        </section>
      ) : null}
      {technicalBreakdown ? <TechnicalSheetSection breakdown={technicalBreakdown} /> : null}
      <div className="detail-body">
        <aside className="detail-sidebar"><span className="eyebrow">EN ESTA FICHA</span><nav aria-label="Apartados del proyecto">{sections.map((section, index) => <a key={section.id} href={`#detalle-${section.id}`}><span>0{index + 1}</span>{section.label}<ArrowUpRight size={13} /></a>)}</nav></aside>
        <div className="detail-content">
          <section className="detail-section" id="detalle-resumen"><span className="eyebrow">01 / RESUMEN</span><h2>Una mirada al proyecto.</h2><p>{project.description}</p>{project.objective && <p>{project.objective}</p>}{project.isDemo && <div className="demo-disclaimer"><span className="demo-pin" /><div><strong>{project.id === 'demo-personaje' ? 'Referencia conceptual' : 'Contenido de demostración'}</strong><p>{project.id === 'demo-personaje' ? 'La imagen representa el universo de Aelion; no es un personaje 3D creado por Christian ni el diseño definitivo del protagonista.' : 'Esta imagen y ficha son marcadores visuales para probar la interfaz. No representan un trabajo real de Christian Ocampo.'}</p></div></div>}{(project.role?.length || project.software?.length) ? <div className="detail-data-grid">{project.role?.length && <div><span>ROL Y RESPONSABILIDADES</span><p>{project.role.join(', ')}</p></div>}{project.software?.length && <div><span>SOFTWARE</span><p>{project.software.join(', ')}</p></div>}</div> : null}{xrDetails.length > 0 && <div className="detail-data-grid detail-xr-data">{xrDetails.map(({ label, values }) => <div key={label}><span>{label}</span><p>{values?.join(' · ')}</p></div>)}</div>}</section>
          {project.conceptArt?.length ? <MediaSection id="concept-art" number="02" title="Concept art" media={project.conceptArt} /> : null}
          {project.references?.length ? <MediaSection id="referencias" number="03" title="Referencias" media={project.references} /> : null}
          {project.comparison ? <section className="detail-section" id="detalle-concept-result"><span className="eyebrow">CONCEPTO / RESULTADO</span><div className="comparison-grid"><MediaCard media={project.comparison.concept} label="Concepto" /><MediaCard media={project.comparison.result} label="Resultado" /></div></section> : null}
          {project.gallery?.length ? <MediaSection id="renders" number="04" title="Galería de renders" media={project.gallery} /> : null}
          {project.processImages?.length ? <MediaSection id="proceso-tecnico" number="05" title="Proceso técnico" media={project.processImages} /> : null}
          {project.topology?.length ? <MediaSection id="topologia" number="05" title="Wireframes y topología" media={project.topology} /> : null}
          {project.uvMaps?.length ? <MediaSection id="uv" number="06" title="UV" media={project.uvMaps} /> : null}
          {project.textures?.length ? <MediaSection id="texturas" number="07" title="Mapas de texturas PBR" media={project.textures} /> : null}
          {project.textureGroups?.length ? <TextureGroupsSection groups={project.textureGroups} /> : null}
          {project.videos?.length ? <MediaSection id="videos" number="08" title="Videos" media={project.videos} /> : null}
          {modelViewer ? <section className="detail-section" id="detalle-modelo-3d" aria-labelledby="project-model-viewer-title">
            <span className="eyebrow">MODELO 3D</span><h2 id="project-model-viewer-title">Visor interactivo.</h2>
            {modelViewer.description && <p>{modelViewer.description}</p>}
            <ProjectModelViewerGate config={modelViewer} title={project.title} poster={modelViewer.poster ?? project.cover} />
          </section> : null}
          {project.collaborators?.length || project.credits?.length ? <section className="detail-section" id="detalle-creditos"><span className="eyebrow">CRÉDITOS</span><h2>Personas y colaboraciones.</h2><ul className="credits-list">{project.collaborators?.length ? project.collaborators.map((person) => <li key={`${person.role}-${person.name}`}>{person.role}: {person.name}{person.handle ? ` (${person.handle})` : ''}{person.url && <> · <a href={person.url} target="_blank" rel="noreferrer">Publicación original</a></>}</li>) : project.credits?.map((credit) => <li key={credit}>{credit}</li>)}</ul></section> : null}
          {project.isDemo && <p className="detail-future-note">Las secciones opcionales aparecen cuando el proyecto tiene recursos en sus datos.</p>}
        </div>
      </div>
      {workflowSteps.length > 0 && <WorkflowLightbox stages={workflowSteps} activeIndex={activeWorkflowStage} onClose={() => setActiveWorkflowStage(null)} onChange={setActiveWorkflowStage} />}
    </main>
  )
}

function TechnicalSheetSection({ breakdown }: { breakdown: TechnicalBreakdownView }) {
  return (
    <section className="detail-section technical-sheet-section" id="detalle-ficha-tecnica" aria-labelledby="technical-sheet-title">
      <span className="eyebrow"><Box size={13} /> FICHA TÉCNICA / TECHNICAL BREAKDOWN</span>
      <h2 id="technical-sheet-title">Características del modelo.</h2>
      {breakdown.metrics.length > 0 && (
        <div className="technical-metrics">
          {breakdown.metrics.map((metric) => <article className="technical-metric" key={metric.label}><span>{metric.label}</span><strong>{metric.value.toLocaleString('es-CO')}</strong></article>)}
        </div>
      )}
      {breakdown.metadata.length > 0 && (
        <div className="technical-metadata">
          {breakdown.metadata.map((item) => <div className="technical-meta-item" key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}
        </div>
      )}
      {breakdown.software.length > 0 && (
        <div className="technical-block">
          <span className="eyebrow">SOFTWARE UTILIZADO</span>
          <div className="technical-software-grid">
            {breakdown.software.map((name) => <div className="technical-software-card" key={name}><SoftwareLogo tool={name} /><span>{name}</span></div>)}
          </div>
        </div>
      )}
      {breakdown.pbrMaps.length > 0 && (
        <div className="technical-block">
          <span className="eyebrow">MAPAS PBR DISPONIBLES</span>
          <div className="technical-map-grid">
            {breakdown.pbrMaps.map((map) => <article className="technical-map-card" key={map.name}>
              {map.image && <img src={map.image.src} alt={map.image.alt} loading="lazy" decoding="async" />}
              <div><strong>{map.name}</strong>{map.resolution && <span>{map.resolution}</span>}</div>
            </article>)}
          </div>
        </div>
      )}
      {breakdown.technicalImages.length > 0 && (
        <div className="technical-block">
          <span className="eyebrow">TOPOLOGÍA Y UV MAPPING</span>
          <div className="technical-image-grid">
            {breakdown.technicalImages.map(({ label, media }, index) => <a className="technical-image-card" href={media.src} target="_blank" rel="noreferrer" key={`${media.src}-${index}`}>
              <figure><img src={media.src} alt={media.alt} loading="lazy" decoding="async" /></figure><span>{label}</span>
            </a>)}
          </div>
        </div>
      )}
      {breakdown.additionalInfo.length > 0 && (
        <div className="technical-notes">
          {breakdown.additionalInfo.map((item) => <p key={`${item.label}-${item.value}`}><span>{item.label}</span>{item.value}</p>)}
        </div>
      )}
    </section>
  )
}

function ViewerPoster({
  title,
  poster,
  backgroundColor,
  loading = false,
  onActivate,
}: {
  title: string
  poster: string
  backgroundColor?: string
  loading?: boolean
  onActivate?: () => void
}) {
  return (
    <div className="project-model-poster" style={{ backgroundColor: backgroundColor ?? '#101419' }} aria-busy={loading}>
      <img src={poster} alt={`Portada del visor 3D de ${title}`} loading="lazy" decoding="async" />
      <div className="project-model-poster-overlay">
        <span className="eyebrow">{loading ? 'PREPARANDO VISOR' : 'EXPLORACIÓN INTERACTIVA'}</span>
        {onActivate && <button type="button" className="button button-primary" onClick={onActivate} disabled={loading}>{loading ? 'Preparando…' : 'Cargar visor 3D'} <Box size={15} /></button>}
        {!onActivate && <span className="viewer-load-status" role="status">Cargando visor…</span>}
      </div>
    </div>
  )
}

function ProjectModelViewerGate({ config, title, poster }: { config: ProjectModelViewerConfig; title: string; poster: string }) {
  const [active, setActive] = useState(false)
  const boundaryFallback = <div className="project-model-error" role="alert"><strong>No se pudo preparar el visor.</strong><p>Recarga la ficha e inténtalo de nuevo.</p><button type="button" className="button button-quiet" onClick={() => setActive(false)}>Cerrar</button></div>

  if (!active) return <ViewerPoster title={title} poster={poster} backgroundColor={config.backgroundColor} onActivate={() => setActive(true)} />

  return (
    <ModelViewerChunkBoundary key={`${title}-${active}`} fallback={boundaryFallback}>
      <Suspense fallback={<ViewerPoster title={title} poster={poster} backgroundColor={config.backgroundColor} loading />}>
        <LazyProjectModelViewer config={config} title={title} poster={poster} onClose={() => setActive(false)} />
      </Suspense>
    </ModelViewerChunkBoundary>
  )
}

function ModelImageComparison({ comparison }: { comparison: ImageComparison }) {
  const [position, setPosition] = useState(() => {
    const initialPosition = comparison.initialPosition ?? 50
    return Number.isFinite(initialPosition) ? Math.round(Math.min(100, Math.max(0, initialPosition))) : 50
  })
  const aspectRatio = comparison.before.width && comparison.before.height
    ? `${comparison.before.width} / ${comparison.before.height}`
    : '16 / 10'

  return (
    <article className="model-comparison-card">
      <header className="model-comparison-heading">
        <div><span className="eyebrow">COMPARACIÓN {String(position).padStart(2, '0')}%</span><h3>{comparison.title}</h3></div>
      </header>
      {comparison.description && <p className="model-comparison-description">{comparison.description}</p>}
      <div className="model-comparison-frame" style={{ aspectRatio, '--compare-position': `${position}%` } as React.CSSProperties}>
        <img className="model-comparison-image model-comparison-base" src={comparison.before.src} alt={comparison.before.alt} loading="lazy" decoding="async" />
        <div className="model-comparison-overlay" aria-hidden="true">
          <img className="model-comparison-image" src={comparison.after.src} alt="" loading="lazy" decoding="async" />
        </div>
        <span className="model-comparison-label is-before">{comparison.beforeLabel}</span>
        <span className="model-comparison-label is-after">{comparison.afterLabel}</span>
        <span className="model-comparison-divider" aria-hidden="true"><i /></span>
        <input
          className="model-comparison-range"
          type="range"
          min="0"
          max="100"
          step="1"
          value={position}
          onChange={(event) => setPosition(Number(event.currentTarget.value))}
          aria-label={`Comparar ${comparison.beforeLabel} con ${comparison.afterLabel}: ${comparison.title}`}
          aria-valuetext={`${position}% ${comparison.afterLabel} visible`}
        />
      </div>
      <div className="model-comparison-range-legend" aria-hidden="true"><span>{comparison.beforeLabel}</span><span>Arrastra para comparar</span><span>{comparison.afterLabel}</span></div>
    </article>
  )
}

function WorkflowLightbox({
  stages,
  activeIndex,
  onClose,
  onChange,
}: {
  stages: Array<{ title: string; description?: string; media?: ProjectMedia }>
  activeIndex: number | null
  onClose: () => void
  onChange: (index: number) => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const activeStage = activeIndex === null ? null : stages[activeIndex]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (activeIndex !== null && !dialog.open) dialog.showModal()
    if (activeIndex === null && dialog.open) dialog.close()
  }, [activeIndex])

  useEffect(() => {
    setZoom(1)
  }, [activeIndex])

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(document.fullscreenElement === dialogRef.current)
    document.addEventListener('fullscreenchange', syncFullscreen)
    return () => document.removeEventListener('fullscreenchange', syncFullscreen)
  }, [])

  const toggleFullscreen = async () => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (document.fullscreenElement) await document.exitFullscreen()
    else if (dialog.requestFullscreen) await dialog.requestFullscreen()
  }

  useEffect(() => {
    if (activeIndex === null || stages.length < 2) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        onChange(Math.min(activeIndex + 1, stages.length - 1))
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onChange(Math.max(activeIndex - 1, 0))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, onChange, stages.length])

  return (
    <dialog
      ref={dialogRef}
      className="workflow-lightbox"
      aria-label="Galería Del concepto al render"
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClose={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      {activeStage && activeIndex !== null && (
        <div className="workflow-lightbox-content">
          <header className="workflow-lightbox-header">
            <span>ETAPA {String(activeIndex + 1).padStart(2, '0')} <i>/</i> {String(stages.length).padStart(2, '0')}</span>
            <div className="workflow-lightbox-actions">
              <button type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.25))} disabled={zoom <= 1} aria-label="Reducir zoom"><ZoomOut size={17} /></button>
              <span aria-live="polite">{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={() => setZoom((value) => Math.min(3, value + 0.25))} disabled={zoom >= 3} aria-label="Aumentar zoom"><ZoomIn size={17} /></button>
              <button type="button" onClick={toggleFullscreen} aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}>{isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}</button>
              <button type="button" className="workflow-lightbox-close" onClick={onClose} aria-label="Cerrar galería"><X size={18} /></button>
            </div>
          </header>
          <div className="workflow-lightbox-viewer">
            {stages.length > 1 && <button type="button" className="workflow-lightbox-nav is-previous" onClick={() => onChange(Math.max(activeIndex - 1, 0))} disabled={activeIndex === 0} aria-label="Ver etapa anterior"><ChevronLeft size={22} /></button>}
              <div
                className="workflow-lightbox-slide"
                key={`${activeIndex}-${activeStage.media?.src ?? activeStage.title}`}
              >
                {activeStage.media ? <img src={activeStage.media.src} alt={activeStage.media.alt} style={{ transform: `scale(${zoom})` }} /> : <div className="workflow-lightbox-text-stage"><span>{activeStage.title}</span></div>}
              </div>
            {stages.length > 1 && <button type="button" className="workflow-lightbox-nav is-next" onClick={() => onChange(Math.min(activeIndex + 1, stages.length - 1))} disabled={activeIndex === stages.length - 1} aria-label="Ver etapa siguiente"><ChevronRight size={22} /></button>}
          </div>
          <footer className="workflow-lightbox-caption">
            <div><span className="eyebrow">{String(activeIndex + 1).padStart(2, '0')} / {activeStage.media?.caption ?? 'ETAPA'}</span><h3>{activeStage.title}</h3>{activeStage.description && <p>{activeStage.description}</p>}</div>
            <span className="workflow-lightbox-hint">Usa ← → para navegar</span>
          </footer>
        </div>
      )}
    </dialog>
  )
}

function MediaSection({ id, number, title, media }: { id: string; number: string; title: string; media: ProjectMedia[] }) {
  const prefersReducedMotion = useReducedMotion()
  return <m.section className="detail-section" id={`detalle-${id}`} initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}><span className="eyebrow">{number} / {title.toUpperCase()}</span><h2>{title}.</h2><div className={`detail-gallery${id === 'videos' ? ' detail-video-gallery' : ''}`}>{media.map((item, index) => <MediaCard media={item} label={String(index + 1).padStart(2, '0')} key={`${item.src}-${index}`} />)}</div></m.section>
}

function TextureGroupsSection({ groups }: { groups: NonNullable<Project['textureGroups']> }) {
  return (
    <section className="detail-section" id="detalle-materiales">
      <span className="eyebrow">MAPAS PBR</span>
      <h2>Materiales.</h2>
      <div className="texture-groups">
        {groups.map((group) => (
          <article className="material-preview-card" key={group.material}>
            <a className="material-preview-link" href={group.preview} target="_blank" rel="noreferrer" aria-label={`Ampliar previsualización de ${group.material}`}>
              <img className="material-preview" src={group.preview} alt={`Previsualización renderizada del material ${group.material}`} loading="lazy" decoding="async" />
            </a>
            <div className="material-preview-copy">
              <h3>{group.material}</h3>
              <p>{group.maps.map((map) => map.caption ?? map.alt).join(' · ')}</p>
            </div>
            <details className="material-map-details">
              <summary>Ver mapas técnicos<span>{group.maps.length} mapas</span></summary>
              <div className="detail-gallery">
                {group.maps.map((media, index) => <MediaCard media={media} label={String(index + 1).padStart(2, '0')} key={`${media.src}-${index}`} />)}
              </div>
            </details>
          </article>
        ))}
      </div>
    </section>
  )
}

function MediaCard({ media, label }: { media: ProjectMedia; label: string }) {
  return <figure className={`media-card${media.kind === 'video' ? ' is-video' : ''}`}>{media.kind === 'video' ? <video src={media.src} poster={media.poster} width={media.width} height={media.height} style={media.width && media.height ? { aspectRatio: `${media.width} / ${media.height}` } : undefined} controls preload="none" aria-label={media.alt} /> : <a className="media-image-link" href={media.src} target="_blank" rel="noreferrer" aria-label={`Ampliar ${media.alt}`}><img src={media.src} alt={media.alt} loading="lazy" decoding="async" /></a>}<figcaption><span>{label}</span>{media.caption ?? media.alt}{media.credit && <> · <a href={media.credit.url} target="_blank" rel="noreferrer">{media.credit.label}</a></>}</figcaption></figure>
}

function SiteFooter({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <footer className="site-footer page-gutter">
      <a className="footer-brand" href="#inicio" onClick={(event) => { event.preventDefault(); onNavigate('inicio') }}><span className="wordmark-mark">C<span>.</span></span><span><strong>CHRISTIAN OCAMPO</strong><small>3D ARTIST PORTFOLIO</small></span></a>
      <span className="footer-copyright">© {new Date().getFullYear()} · Portafolio personal</span>
      <div className="footer-links"><button type="button" onClick={() => onNavigate('inicio')}>Inicio <ArrowUpRight size={13} /></button><button type="button" onClick={() => onNavigate('contacto')}>Contacto <ArrowUpRight size={13} /></button></div>
    </footer>
  )
}

export default App
