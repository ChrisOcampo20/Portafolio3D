export type ProjectCategory =
  | '3D Art' | 'Character Art' | 'Props & Weapons' | 'Environment Art' | 'Digital Sculpting' | '3D Modeling' | 'Texturing & Materials'
  | 'VR' | 'AR'
  | 'Virtual Reality (VR)' | 'Augmented Reality (AR)' | 'Interactive Experiences' | 'Digital Twins' | 'Virtual Tours & 360°'
  | 'Personajes' | 'Props' | 'Entornos' | 'Escultura' | 'VR/AR'
export type ProjectArea = '3d-art' | 'xr-experiences'
export type ProjectPublicationStatus = 'draft' | 'published'
export type ProjectType = 'Personal' | 'Académico' | 'Curso' | 'Freelance' | 'Demostración'

export interface XrProjectDetails {
  technologies?: string[]
  devices?: string[]
  functionalities?: string[]
}

export interface ProjectMedia {
  src: string
  alt: string
  caption?: string
  kind?: 'image' | 'video'
  poster?: string
  width?: number
  height?: number
  credit?: { label: string; url: string }
}

export interface ImageComparison {
  title: string
  description?: string
  before: ProjectMedia
  after: ProjectMedia
  beforeLabel: string
  afterLabel: string
  initialPosition?: number
}

export interface WorkflowStep {
  name: string
  description?: string
  image?: string
  comparison?: ImageComparison
}

export interface ProjectTextureGroup {
  material: string
  preview: string
  maps: ProjectMedia[]
}

export type PbrMapName = 'Base Color' | 'Normal' | 'Roughness' | 'Metallic' | 'Ambient Occlusion' | 'Height / Displacement' | 'Emissive' | 'Opacity'

export interface TechnicalPbrMap {
  name: PbrMapName
  image?: ProjectMedia
  resolution?: string
}

export interface ProjectTechnicalSheet {
  polygons?: number
  vertices?: number
  triangles?: number
  topology?: 'Low Poly' | 'High Poly' | 'Low + High Poly'
  objectCount?: number
  materialCount?: number
  textureResolution?: string
  modelFormats?: string[]
  software?: string[]
  renderEngine?: string
  pbrMaps?: TechnicalPbrMap[]
  wireframe?: ProjectMedia
  uvLayout?: ProjectMedia
  retopology?: ProjectMedia[]
  additionalInfo?: Array<{ label: string; value: string }>
}

export interface ModelViewerInitialCamera {
  orbit?: string
  target?: string
  fieldOfView?: string
}

export type ProjectModelViewerConfig =
  | {
      type: 'sketchfab'
      url: string
      poster?: string
      backgroundColor?: string
      description?: string
    }
  | {
      type: 'local'
      src: string
      poster?: string
      backgroundColor?: string
      description?: string
      initialCamera?: ModelViewerInitialCamera
    }

export interface ProjectCollaborator {
  role: string
  name: string
  handle?: string
  url?: string
}

export interface Project {
  id: string
  title: string
  area?: ProjectArea
  category: ProjectCategory
  publicationStatus?: ProjectPublicationStatus
  type?: ProjectType
  cover: string
  coverAlt: string
  description: string
  objective?: string
  date?: string
  role?: string[]
  software?: string[]
  tags?: string[]
  isDemo?: boolean
  xrDetails?: XrProjectDetails
  conceptArt?: ProjectMedia[]
  references?: ProjectMedia[]
  gallery?: ProjectMedia[]
  processImages?: ProjectMedia[]
  comparison?: { concept: ProjectMedia; result: ProjectMedia }
  modelComparisons?: ImageComparison[]
  technicalSheet?: ProjectTechnicalSheet
  modelViewer?: ProjectModelViewerConfig
  workflow?: WorkflowStep[]
  topology?: ProjectMedia[]
  uvMaps?: ProjectMedia[]
  textures?: ProjectMedia[]
  textureGroups?: ProjectTextureGroup[]
  videos?: ProjectMedia[]
  modelViewerUrl?: string
  credits?: string[]
  collaborators?: ProjectCollaborator[]
}
