import type { Project } from '../../types'

/** Ejemplo ficticio para copiar. No se incluye en el catálogo ni carga estos recursos. */
const templateDemo: Project = {
  id: 'demo-nuevo-proyecto',
  title: 'Proyecto de demostración (reemplazar)',
  area: '3d-art',
  publicationStatus: 'draft',
  category: 'Personajes',
  type: 'Demostración',
  date: 'AAAA',
  description: 'Descripción ficticia. Sustituir por información confirmada del proyecto.',
  objective: 'Objetivo ficticio de demostración.',
  role: ['Rol ficticio'],
  cover: '/projects/demo-nuevo-proyecto/cover.webp',
  coverAlt: 'Descripción de la portada de demostración',
  isDemo: true,
  gallery: [{ src: '/projects/demo-nuevo-proyecto/renders/render-01.webp', alt: 'Render ficticio' }],
  conceptArt: [{ src: '/projects/demo-nuevo-proyecto/concept/concept-01.webp', alt: 'Concept art ficticio' }],
  references: [{ src: '/projects/demo-nuevo-proyecto/references/reference-01.webp', alt: 'Referencia ficticia' }],
  workflow: [{ name: 'Modelado', description: 'Descripción del paso de ejemplo.', image: '/projects/demo-nuevo-proyecto/workflow/modelado.webp' }],
  topology: [{ src: '/projects/demo-nuevo-proyecto/topology/wireframe.webp', alt: 'Wireframe ficticio' }],
  uvMaps: [{ src: '/projects/demo-nuevo-proyecto/uv/uv-layout.webp', alt: 'Distribución UV ficticia' }],
  textures: [
    { src: '/projects/demo-nuevo-proyecto/textures/base-color.webp', alt: 'Mapa Base Color ficticio', caption: 'Base Color' },
    { src: '/projects/demo-nuevo-proyecto/textures/normal.webp', alt: 'Mapa Normal ficticio', caption: 'Normal' },
    { src: '/projects/demo-nuevo-proyecto/textures/roughness.webp', alt: 'Mapa Roughness ficticio', caption: 'Roughness' },
    { src: '/projects/demo-nuevo-proyecto/textures/metallic.webp', alt: 'Mapa Metallic ficticio', caption: 'Metallic' },
  ],
  comparison: {
    concept: { src: '/projects/demo-nuevo-proyecto/comparison/concept.webp', alt: 'Concepto ficticio' },
    result: { src: '/projects/demo-nuevo-proyecto/comparison/result.webp', alt: 'Resultado ficticio' },
  },
  modelViewerUrl: 'https://sketchfab.com/models/REEMPLAZAR/embed',
  software: ['Software de demostración'],
  credits: ['Colaborador ficticio'],
}

export default templateDemo
