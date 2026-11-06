/**
 * Registro central de proyectos.
 * Para publicar uno real, duplica un registro y añade sus archivos en
 * public/projects/<slug>/ (por ejemplo: public/projects/aelion/cover.webp).
 */
export type ProjectCategory = 'Personajes' | 'Props' | 'Entornos' | 'Escultura' | 'VR/AR'
export type ProjectType = 'Personal' | 'Académico' | 'Curso' | 'Freelance' | 'Demostración'

export interface ProjectMedia {
  src: string
  alt: string
  caption?: string
  kind?: 'image' | 'video'
}

export interface WorkflowStep {
  name: string
  description?: string
  image?: string
}

export interface Project {
  id: string
  title: string
  category: ProjectCategory
  type: ProjectType
  cover: string
  coverAlt: string
  description: string
  objective?: string
  date?: string
  role?: string[]
  software?: string[]
  tags?: string[]
  isDemo?: boolean
  conceptArt?: ProjectMedia[]
  gallery?: ProjectMedia[]
  comparison?: { concept: ProjectMedia; result: ProjectMedia }
  workflow?: WorkflowStep[]
  textures?: ProjectMedia[]
  modelViewerUrl?: string
  credits?: string[]
}

export const categories: Array<'Todos' | ProjectCategory> = [
  'Todos',
  'Personajes',
  'Props',
  'Entornos',
  'Escultura',
  'VR/AR',
]

export const projects: Project[] = [
  {
    id: 'demo-personaje',
    title: 'Personaje de demostración',
    category: 'Personajes',
    type: 'Demostración',
    cover: '/projects/demo-personaje/cover.webp',
    coverAlt: 'Personaje fantástico renderizado frente a un observatorio antiguo',
    description: 'Imagen conceptual de demostración para mostrar la presentación de un proyecto de personaje.',
    isDemo: true,
  },
  {
    id: 'demo-entorno',
    title: 'Entorno de demostración',
    category: 'Entornos',
    type: 'Demostración',
    cover: '/projects/demo-entorno/cover.webp',
    coverAlt: 'Patio de observatorio de piedra sobre un valle tropical',
    description: 'Imagen conceptual de demostración para mostrar la presentación de un proyecto de entorno.',
    isDemo: true,
  },
  {
    id: 'demo-prop',
    title: 'Prop de demostración',
    category: 'Props',
    type: 'Demostración',
    cover: '/projects/demo-prop/cover.webp',
    coverAlt: 'Artefacto astronómico de latón sobre una base de exhibición',
    description: 'Imagen conceptual de demostración para mostrar la presentación de un proyecto de prop.',
    isDemo: true,
  },
  {
    id: 'demo-escultura',
    title: 'Escultura de demostración',
    category: 'Escultura',
    type: 'Demostración',
    cover: '/projects/demo-escultura/cover.webp',
    coverAlt: 'Busto esculpido de una criatura fantástica con astas',
    description: 'Imagen conceptual de demostración para mostrar la presentación de una escultura digital.',
    isDemo: true,
  },
]
