import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Box,
  Briefcase,
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
import { categories, projects, type Project, type ProjectMedia } from './data/projects'

const navigation = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'mi-marca', label: 'Mi marca' },
  { id: 'contacto', label: 'Contacto' },
]

const projectFromHash = () => {
  const match = window.location.hash.match(/^#proyecto\/(.+)$/)
  return match ? projects.find((project) => project.id === match[1]) ?? null : null
}

function App() {
  const [activeProject, setActiveProject] = useState<Project | null>(projectFromHash)
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('Todos')
  const [activeSection, setActiveSection] = useState('inicio')
  const [menuOpen, setMenuOpen] = useState(false)

  const visibleProjects = useMemo(
    () => activeCategory === 'Todos'
      ? projects
      : projects.filter((project) => project.category === activeCategory),
    [activeCategory],
  )

  useEffect(() => {
    const syncLocation = () => {
      const project = projectFromHash()
      setActiveProject(project)
      if (!project && window.location.hash.startsWith('#')) {
        const section = window.location.hash.slice(1)
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
    setMenuOpen(false)
    if (activeProject) {
      window.history.pushState(null, '', `#${id}`)
      setActiveProject(null)
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 30)
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    window.history.replaceState(null, '', `#${id}`)
  }

  const closeProject = () => navigateTo('proyectos')

  return (
    <div className="site-shell">
      <SiteHeader
        activeSection={activeProject ? '' : activeSection}
        menuOpen={menuOpen}
        onNavigate={navigateTo}
        onToggleMenu={() => setMenuOpen((open) => !open)}
      />
      {activeProject ? (
        <ProjectDetail project={activeProject} onBack={closeProject} />
      ) : (
        <main>
          <Hero onNavigate={navigateTo} />
          <ProjectsSection
            activeCategory={activeCategory}
            projects={visibleProjects}
            onCategoryChange={setActiveCategory}
            onOpenProject={openProject}
          />
          <AboutSection />
          <BrandSection />
          <ContactSection />
        </main>
      )}
      <SiteFooter onNavigate={navigateTo} />
    </div>
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
  return (
    <section className="hero-section" id="inicio" aria-labelledby="hero-title">
      <div className="hero-art" role="img" aria-label="Render conceptual de personaje de fantasía, imagen de demostración" />
      <div className="hero-shade" />
      <div className="hero-content page-gutter">
        <p className="eyebrow"><span className="eyebrow-line" /> 3D ARTIST PORTFOLIO</p>
        <h1 id="hero-title">Christian<br /><em>Ocampo</em></h1>
        <div className="hero-specialties" aria-label="Especialidades">
          <span className="specialties-label">ESPECIALIDADES</span>
          <div>{profile.specialties.map((specialty) => <span key={specialty}>{specialty}</span>)}</div>
        </div>
        <p className="hero-description">Creo personajes, objetos y espacios digitales que invitan a explorar nuevos mundos.</p>
        <div className="hero-actions">
          <button type="button" className="button button-primary" onClick={() => onNavigate('proyectos')}>Explorar proyectos <ArrowRight size={15} /></button>
          <button type="button" className="button button-quiet" onClick={() => onNavigate('sobre-mi')}>Conocer mi proceso <ArrowDown size={15} /></button>
        </div>
        <SocialLinks compact />
      </div>
      <div className="hero-caption"><span className="demo-pin" /> Visual conceptual de demostración</div>
      <button type="button" className="scroll-cue" onClick={() => onNavigate('proyectos')} aria-label="Desplazarse a proyectos"><span>DESPLAZAR</span><ArrowDown size={14} /></button>
    </section>
  )
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

function SectionHeading({ index, eyebrow, title, description }: { index: string; eyebrow: string; title: string; description?: string }) {
  return (
    <div className="section-heading">
      <div className="section-heading-top"><span className="section-index">{index}</span><span className="eyebrow-line" /><span className="eyebrow">{eyebrow}</span></div>
      <div className="section-heading-row"><h2>{title}</h2>{description && <p>{description}</p>}</div>
    </div>
  )
}

function ProjectsSection({
  activeCategory,
  projects: visibleProjects,
  onCategoryChange,
  onOpenProject,
}: {
  activeCategory: (typeof categories)[number]
  projects: Project[]
  onCategoryChange: (category: (typeof categories)[number]) => void
  onOpenProject: (project: Project) => void
}) {
  return (
    <section className="projects-section page-gutter section-space" id="proyectos" aria-labelledby="projects-title">
      <SectionHeading index="01" eyebrow="SELECCIÓN DE TRABAJOS" title="Proyectos" description="Un archivo vivo de exploraciones en forma, materia y atmósfera." />
      <div className="projects-toolbar">
        <p><span className="demo-pin" /> El contenido visual actual es de demostración.</p>
        <span className="project-count">{String(visibleProjects.length).padStart(2, '0')} <span>/ {String(projects.length).padStart(2, '0')} piezas</span></span>
      </div>
      <div className="filter-list" role="group" aria-label="Filtrar proyectos por categoría">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`filter-chip${activeCategory === category ? ' is-selected' : ''}`}
            aria-pressed={activeCategory === category}
            onClick={() => onCategoryChange(category)}
          >{category}</button>
        ))}
      </div>
      {visibleProjects.length > 0 ? (
        <div className="project-grid">
          {visibleProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onOpen={() => onOpenProject(project)} />)}
        </div>
      ) : (
        <div className="empty-projects"><span className="empty-mark">+</span><h3>Este espacio está abierto.</h3><p>Aún no hay proyectos publicados en {activeCategory}. Cuando tengas uno, añádelo en <code>src/data/projects.ts</code>.</p></div>
      )}
    </section>
  )
}

function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  return (
    <button type="button" className={`project-card project-card-${index + 1}`} onClick={onOpen} aria-label={`Ver detalle: ${project.title}`}>
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
      <div className="project-card-meta"><span>{project.type}</span><span>{project.tags?.join(' · ') ?? (project.isDemo ? 'Imagen de demostración' : 'Ver ficha')}</span></div>
    </button>
  )
}

function AboutSection() {
  return (
    <section className="about-section page-gutter section-space" id="sobre-mi" aria-labelledby="about-title">
      <SectionHeading index="02" eyebrow="SOBRE EL ARTISTA" title="Forma, intención y detalle." description="Un perfil que reúne mirada artística, oficio y curiosidad por los mundos interactivos." />
      <div className="about-layout">
        <div className="about-intro">
          <div className="about-intro-copy"><span className="eyebrow">PERFIL PROFESIONAL</span><h3>Christian<br /><em>Ocampo</em></h3><p>{profile.introduction}</p></div>
          <div className="about-specialties"><div className="skill-label"><Wrench size={16} /><span>ÁREAS DE PRÁCTICA</span></div><div className="skill-chips">{profile.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>
        </div>
      </div>
      <section className="about-education" aria-labelledby="education-title">
        <div className="about-subheading"><span className="eyebrow"><GraduationCap size={15} /> 01 / FORMACIÓN</span><h3 id="education-title">Trayectoria académica</h3></div>
        <div className="education-grid">
          {profile.education.map((item) => (
            <article className="education-card" key={item.id}>
              <div className="education-card-top"><span>{item.institution}</span><span className={`status-badge${item.status === 'Finalizado' ? ' is-complete' : ''}`}>{item.status}</span></div>
              <h4>{item.title}</h4>
              {item.period && <p className="education-period">{item.period}</p>}
              {item.level && <p className="education-level">{item.level}</p>}
              {item.detail && <p className="education-detail">{item.detail}</p>}
            </article>
          ))}
        </div>
      </section>
      <section className="about-certifications" aria-labelledby="certifications-title">
        <div className="about-subheading"><span className="eyebrow"><BadgeCheck size={15} /> 02 / ESTUDIOS COMPLEMENTARIOS</span><h3 id="certifications-title">Certificaciones y formación adicional</h3></div>
        <div className="certification-grid">
          {profile.additionalStudies.map((study, index) => (
            <article className="certification-card" key={study.id}>
              <span className="certification-index">{String(index + 1).padStart(2, '0')}</span>
              <div><h4>{study.title}</h4>{study.institution && <p>{study.institution}</p>}</div>
            </article>
          ))}
        </div>
      </section>
      <section className="about-experience" aria-labelledby="experience-title">
        <div className="about-subheading"><span className="eyebrow"><Briefcase size={15} /> 03 / EXPERIENCIA</span><h3 id="experience-title">Experiencia profesional</h3></div>
        <ol className="experience-timeline">
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
        </ol>
      </section>
      <section className="about-software" aria-labelledby="software-title">
        <div className="about-subheading"><span className="eyebrow"><Wrench size={15} /> 04 / SOFTWARE Y HERRAMIENTAS</span><h3 id="software-title">Recursos de trabajo</h3></div>
        <div className="software-category-grid">
          {profile.software.map((group) => {
            const CategoryIcon = group.id === '3d-videojuegos' ? Box : group.id === 'diseno-multimedia' ? Palette : Glasses
            return (
              <article className="software-category" key={group.id}>
                <h4><CategoryIcon size={17} />{group.category}</h4>
                <ul>{group.tools.map((tool) => <li key={tool}><SoftwareLogo tool={tool} />{tool}</li>)}</ul>
              </article>
            )
          })}
        </div>
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
  'Adobe Photoshop': { className: 'is-photoshop', mark: 'Ps' },
  'Adobe Illustrator': { className: 'is-illustrator', mark: 'Ai' },
  'Adobe Premiere Pro': { className: 'is-premiere', mark: 'Pr' },
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
      <SectionHeading index="03" eyebrow="UN ESPACIO APARTE" title="Mi marca" description="Una identidad personal que vive junto a mi práctica artística." />
      <div className="brand-card">
        <div className="brand-visual" aria-label="Espacio reservado para recursos originales de CRONOS">
          <span className="brand-visual-number">01 / IDENTIDAD</span>
          <div className="brand-logo-placeholder"><span>LOGOTIPO ORIGINAL</span><strong>Por integrar</strong></div>
          <span className="brand-visual-caption">Espacio para recursos gráficos originales</span>
        </div>
        <div className="brand-copy">
          <span className="eyebrow"><span className="eyebrow-line" /> MARCA PERSONAL INDEPENDIENTE</span>
          <h3 id="brand-title">CRONOS</h3>
          <p>CRONOS es una marca personal independiente de este portafolio. Este espacio queda preparado para presentar su historia, filosofía y recursos visuales originales cuando estén disponibles.</p>
          <span className="pending-note"><span className="demo-pin" /> Identidad original pendiente de integrar</span>
        </div>
        <div className="brand-card-index">C / 03</div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section className="contact-section page-gutter section-space" id="contacto" aria-labelledby="contact-title">
      <SectionHeading index="04" eyebrow="HABLEMOS" title="¿Tienes una idea en mente?" description="Abierto a proyectos, colaboraciones y nuevas conversaciones." />
      <div className="contact-layout">
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
      </div>
    </section>
  )
}

function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const sections = [
    { id: 'resumen', label: 'Resumen', available: true },
    { id: 'concept-art', label: 'Concept art', available: Boolean(project.conceptArt?.length || project.comparison) },
    { id: 'workflow', label: 'Workflow', available: Boolean(project.workflow?.length) },
    { id: 'texturas', label: 'Texturas', available: Boolean(project.textures?.length) },
    { id: 'modelo-3d', label: 'Modelo 3D', available: Boolean(project.gallery?.length || project.modelViewerUrl) },
    { id: 'creditos', label: 'Créditos', available: Boolean(project.credits?.length) },
  ].filter((section) => section.available)

  return (
    <main className="project-detail page-gutter">
      <div className="detail-topline"><button type="button" className="back-link" onClick={onBack}><ArrowLeft size={15} /> Volver a proyectos</button><span>{project.category} <span className="meta-dot">·</span> {project.type}</span></div>
      <div className="detail-hero">
        <div className="detail-title"><span className="eyebrow"><span className="eyebrow-line" /> FICHA DE PROYECTO {project.isDemo && <span className="detail-demo">/ DEMOSTRACIÓN</span>}</span><h1>{project.title}</h1><p>{project.description}</p><div className="detail-meta">{project.date && <span>{project.date}</span>}{project.role?.length ? <span>{project.role.join(' · ')}</span> : null}{project.software?.length ? <span>{project.software.join(' · ')}</span> : null}</div></div>
        <figure className="detail-cover"><img src={project.cover} alt={project.coverAlt} /><figcaption><span>01</span>{project.isDemo ? 'Imagen de demostración' : project.category}</figcaption></figure>
      </div>
      <div className="detail-body">
        <aside className="detail-sidebar"><span className="eyebrow">EN ESTA FICHA</span><nav aria-label="Apartados del proyecto">{sections.map((section, index) => <a key={section.id} href={`#detalle-${section.id}`}><span>0{index + 1}</span>{section.label}<ArrowUpRight size={13} /></a>)}</nav></aside>
        <div className="detail-content">
          <section className="detail-section" id="detalle-resumen"><span className="eyebrow">01 / RESUMEN</span><h2>Una mirada al proyecto.</h2><p>{project.description}</p>{project.objective && <p>{project.objective}</p>}{project.isDemo && <div className="demo-disclaimer"><span className="demo-pin" /><div><strong>Contenido de demostración</strong><p>Esta imagen y ficha son marcadores visuales para probar la interfaz. No representan un trabajo real de Christian Ocampo.</p></div></div>}{(project.role?.length || project.software?.length) ? <div className="detail-data-grid">{project.role?.length && <div><span>ROL Y RESPONSABILIDADES</span><p>{project.role.join(', ')}</p></div>}{project.software?.length && <div><span>SOFTWARE</span><p>{project.software.join(', ')}</p></div>}</div> : null}</section>
          {project.conceptArt?.length ? <MediaSection id="concept-art" number="02" title="Concept art" media={project.conceptArt} /> : null}
          {project.comparison ? <section className="detail-section"><span className="eyebrow">CONCEPTO / RESULTADO</span><div className="comparison-grid"><MediaCard media={project.comparison.concept} label="Concepto" /><MediaCard media={project.comparison.result} label="Resultado" /></div></section> : null}
          {project.workflow?.length ? <section className="detail-section" id="detalle-workflow"><span className="eyebrow">WORKFLOW</span><h2>Proceso de producción.</h2><div className="workflow-list">{project.workflow.map((step, index) => <article className="workflow-step" key={`${step.name}-${index}`}><span>0{index + 1}</span><div><h3>{step.name}</h3>{step.description && <p>{step.description}</p>}</div>{step.image && <img src={step.image} alt={`Etapa ${step.name}`} loading="lazy" />}</article>)}</div></section> : null}
          {project.textures?.length ? <MediaSection id="texturas" number="04" title="Texturas y mapas" media={project.textures} /> : null}
          {project.gallery?.length || project.modelViewerUrl ? <section className="detail-section" id="detalle-modelo-3d"><span className="eyebrow">MODELO 3D</span><h2>Vistas del modelo.</h2>{project.modelViewerUrl && <div className="model-viewer"><iframe src={project.modelViewerUrl} title={`Visor 3D: ${project.title}`} loading="lazy" allow="autoplay; fullscreen; xr-spatial-tracking" allowFullScreen /></div>}{project.gallery?.length ? <div className="detail-gallery">{project.gallery.map((media, index) => <MediaCard key={`${media.src}-${index}`} media={media} label={String(index + 1).padStart(2, '0')} />)}</div> : null}</section> : null}
          {project.credits?.length ? <section className="detail-section" id="detalle-creditos"><span className="eyebrow">CRÉDITOS</span><h2>Personas y colaboraciones.</h2><ul className="credits-list">{project.credits.map((credit) => <li key={credit}>{credit}</li>)}</ul></section> : null}
          {project.isDemo && <p className="detail-future-note">Las secciones opcionales aparecerán al añadir su contenido en <code>src/data/projects.ts</code>.</p>}
        </div>
      </div>
    </main>
  )
}

function MediaSection({ id, number, title, media }: { id: string; number: string; title: string; media: ProjectMedia[] }) {
  return <section className="detail-section" id={`detalle-${id}`}><span className="eyebrow">{number} / {title.toUpperCase()}</span><h2>{title}.</h2><div className="detail-gallery">{media.map((item, index) => <MediaCard media={item} label={String(index + 1).padStart(2, '0')} key={`${item.src}-${index}`} />)}</div></section>
}

function MediaCard({ media, label }: { media: ProjectMedia; label: string }) {
  return <figure className="media-card">{media.kind === 'video' ? <video src={media.src} controls preload="metadata" aria-label={media.alt} /> : <img src={media.src} alt={media.alt} loading="lazy" />}<figcaption><span>{label}</span>{media.caption ?? media.alt}</figcaption></figure>
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
