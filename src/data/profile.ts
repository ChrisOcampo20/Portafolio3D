/** Datos editables de la sección Sobre mí. Completar solo con información confirmada. */
type EducationEntry = {
  id: string
  title: string
  institution: string
  period?: string
  level?: string
  status: string
  detail?: string
}

type ExperienceEntry = {
  id: string
  role: string
  organization: string
  period: string
  responsibilities?: readonly string[]
}

type AdditionalStudyEntry = {
  id: string
  title: string
  institution?: string
}

type SoftwareCategory = {
  id: string
  category: string
  tools: readonly string[]
}

export const profile = {
  name: 'Christian Ocampo',
  title: 'Artista digital 3D',
  specialties: [
    'Arte de personajes 3D',
    'Escultura digital',
    'Modelado 3D',
    'Texturizado',
    'Arte de entornos',
    'Experiencias 3D interactivas',
  ],
  introduction:
    'Perfil multidisciplinario que integra diseño digital y comunicación visual, modelado, escultura y producción 3D, con desarrollo de videojuegos y experiencias interactivas para tecnologías VR/AR.',
  education: [
    {
      id: 'diseno-grafico-digital',
      title: 'Profesional en Diseño Gráfico Digital',
      institution: 'UVirtual',
      level: 'Programa profesional',
      status: 'En curso',
    },
    {
      id: 'desarrollo-videojuegos',
      title: 'Tecnólogo en Desarrollo de Videojuegos y Entornos Interactivos',
      institution: 'SENA',
      period: '2024 – Junio de 2026',
      status: 'Etapa lectiva finalizada',
      detail: 'Etapa productiva en curso mediante vínculo laboral con LSV-Tech.',
    },
    {
      id: 'animacion-3d',
      title: 'Tecnólogo en Animación 3D',
      institution: 'SENA',
      period: '2017 – 2020',
      status: 'Finalizado',
    },
  ] as EducationEntry[],
  additionalStudies: [
    {
      id: 'adobe-certified-associate-photoshop',
      title: 'Adobe Certified Associate — Photoshop',
    },
    {
      id: 'graphic-design-illustrator',
      title: 'Graphic Design & Illustration using Adobe Illustrator',
    },
    {
      id: 'pedagogia-humana',
      title: 'Pedagogía Humana',
      institution: 'SENA',
    },
    {
      id: 'creacion-personajes',
      title: 'Técnicas para Creación de Personajes',
      institution: 'SENA',
    },
    {
      id: 'fundamentacion-animacion-3d',
      title: 'Fundamentación de Animación 3D',
      institution: 'SENA',
    },
    {
      id: 'marketing-publicidad',
      title: 'Marketing y Publicidad',
      institution: 'SENA',
    },
  ] as AdditionalStudyEntry[],
  experience: [
    {
      id: 'lsv-tech',
      role: 'Desarrollador VR/AR y Artista 3D',
      organization: 'LSV-Tech',
      period: 'Junio de 2022 – Actualidad',
      responsibilities: [
        'Desarrollo de experiencias inmersivas VR y AR.',
        'Modelado y optimización de activos 3D.',
        'Creación de recorridos virtuales 360° interactivos.',
        'Integración de contenido 3D en aplicaciones interactivas.',
        'Diseño de interfaces para experiencias digitales.',
        'Optimización de escenas para dispositivos móviles y VR.',
      ],
    },
    {
      id: 'citriko',
      role: 'Tutor Virtual',
      organization: 'Citriko Agencia Multimedia',
      period: 'Abril de 2023 – Octubre de 2023',
    },
    {
      id: 'sennova',
      role: 'Tecnólogo Experto en Animación 3D',
      organization: 'SENA (Proyecto SENNOVA)',
      period: 'Junio de 2021 – Diciembre de 2021',
    },
    {
      id: 'instituto-docente-caribe',
      role: 'Docente de Tecnología Digital',
      organization: 'Corporación Instituto Docente del Caribe',
      period: '2019 – 2021',
    },
    {
      id: 'acatana',
      role: 'Animador 3D',
      organization: 'ACATANA',
      period: '2019 – 2020',
    },
  ] as ExperienceEntry[],
  skills: [
    'Arte de personajes 3D',
    'Escultura digital',
    'Modelado 3D',
    'Texturizado',
    'Arte de entornos',
    'Experiencias 3D interactivas',
  ],
  software: [
    {
      id: '3d-videojuegos',
      category: '3D y desarrollo de videojuegos',
      tools: ['Blender', 'Unity', 'Substance Painter', '3ds Max', 'ZBrush', 'Marvelous Designer'],
    },
    {
      id: 'diseno-multimedia',
      category: 'Diseño y multimedia',
      tools: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe Premiere Pro'],
    },
    {
      id: 'xr-interactivo',
      category: 'XR e interactivo',
      tools: ['3DVista', 'Optimización Realtime', 'UI interactiva básica'],
    },
  ] as SoftwareCategory[],
  /** Sustituir este recurso por el archivo original de la marca cuando esté disponible. */
  cronosAssets: [],
} as const
