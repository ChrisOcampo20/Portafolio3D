import type { Project, ProjectArea, ProjectCategory } from '../../types'
import demoCharacter from './demo-personaje'
import demoEnvironment from './demo-entorno'
import demoProp from './demo-prop'
import demoSculpture from './demo-escultura'
import sword from './sword'

export const categories: Array<'Todos' | ProjectCategory> = [
  'Todos',
  'Personajes',
  'Props',
  'Entornos',
  'Escultura',
  'VR/AR',
]

export const projects: Project[] = [sword, demoCharacter, demoEnvironment, demoProp, demoSculpture]

export const publicProjects = projects.filter((project) => project.publicationStatus === 'published')

export const projectCategories3D: Array<'Todos' | ProjectCategory> = [
  'Todos', 'Character Art', 'Props & Weapons', 'Environment Art', 'Digital Sculpting', '3D Modeling', 'Texturing & Materials',
]

export const projectCategoriesXR: Array<'Todos' | ProjectCategory> = [
  'Todos', 'Virtual Reality (VR)', 'Augmented Reality (AR)', 'Interactive Experiences', 'Digital Twins', 'Virtual Tours & 360°',
]

export const getPublishedProjects = (area: ProjectArea) => publicProjects.filter((project) => project.area === area)
