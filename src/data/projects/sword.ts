import type { Project } from '../../types'

const root = '/projects/Sword'
const texture = (material: string, map: string) => `${root}/03_Textura/${material}/${map}.png`
const mapMedia = (material: string, map: string) => ({
  src: texture(material, map),
  alt: `Mapa ${map} del material ${material}`,
  caption: map,
})
const finalRender = {
  src: `${root}/01_Renders/Sword_Render.png`,
  alt: 'Render final de Sword con materiales y texturas',
  caption: 'Final Render',
}
const swordConceptArt = {
  src: `${root}/02_ConceptArt/Moniek%20Schilder%20(@monschi_art)%20_%20Twitter.jpg`,
  alt: 'Concept art de referencia de Moniek Schilder',
  caption: 'Concept Art by Moniek Schilder (@monschi_art)',
  credit: {
    label: 'Publicación original de @monschi_art',
    url: 'https://x.com/monschi_art/status/1307036005501931520',
  },
}

const sword: Project = {
  id: 'sword',
  title: 'Sword',
  area: '3d-art',
  category: 'Props & Weapons',
  publicationStatus: 'published',
  tags: ['Prop 3D', 'Fantasy Weapon'],
  description: 'Prop 3D de fantasía medieval presentado mediante renders, imágenes de proceso y mapas de materiales.',
  cover: `${root}/01_Renders/Sword_Render.png`,
  coverAlt: 'Render principal de Sword, prop 3D de fantasía medieval',
  role: ['Modelado 3D', 'Texturizado'],
  technicalSheet: {
    polygons: 44010,
    vertices: 43975,
    triangles: 87870,
    objectCount: 20,
    materialCount: 8,
    textureResolution: '2048 × 2048 px',
    modelFormats: ['.fbx', '.blend'],
    software: ['Blender', 'Substance Painter', 'ZBrush', 'Adobe Photoshop'],
    pbrMaps: [
      { name: 'Base Color' },
      { name: 'Normal' },
      { name: 'Roughness' },
      { name: 'Metallic' },
      { name: 'Emissive' },
    ],
  },
  modelViewer: {
    type: 'local',
    src: `${root}/07_Model/Sword.glb`,
    poster: `${root}/01_Renders/Sword_Render.png`,
    backgroundColor: '#101419',
    initialCamera: { orbit: '0deg 75deg 400%', target: 'auto auto auto' },
    description: 'Explora el modelo 3D de Sword. Arrastra para rotar y usa la rueda o el gesto de pellizco para acercar.',
  },
  gallery: [
    finalRender,
    { src: `${root}/01_Renders/Sword_Model.png`, alt: 'Vista del modelo 3D de Sword sin el acabado final', caption: 'Model Render' },
    { src: `${root}/01_Renders/Sword_Wireframe.png`, alt: 'Wireframe de Sword', caption: 'Wireframe' },
    { src: `${root}/01_Renders/Sword_Texturas.png`, alt: 'Vista de Sword con sus materiales aplicados', caption: 'Textured Model' },
    { src: `${root}/01_Renders/Sword_Normal.png`, alt: 'Visualización del mapa normal de Sword', caption: 'Normal Map' },
  ],
  conceptArt: [swordConceptArt],
  modelComparisons: [{
    title: 'Referencia y resultado',
    description: 'Comparación visual entre el concept art de Moniek Schilder y el render final del prop 3D.',
    before: swordConceptArt,
    after: finalRender,
    beforeLabel: 'Concept Art · Moniek Schilder',
    afterLabel: 'Final Render · Christian Ocampo',
    initialPosition: 50,
  }],
  textureGroups: [
    { material: 'Bola', preview: `${root}/06_MaterialPreviews/bola.png`, maps: ['Base Color', 'Emissive', 'Normal', 'Roughness'].map((map) => mapMedia('Bola', map)) },
    { material: 'Bola 2', preview: `${root}/06_MaterialPreviews/bola-2.png`, maps: ['Base Color', 'Emissive', 'Metallic', 'Normal', 'Opacity', 'Roughness'].map((map) => mapMedia('Bola/2', map)) },
    { material: 'Hoja', preview: `${root}/06_MaterialPreviews/hoja.png`, maps: ['Base Color', 'Metallic', 'Normal', 'Roughness'].map((map) => mapMedia('Hoja', map)) },
    { material: 'Hoja 2', preview: `${root}/06_MaterialPreviews/hoja-2.png`, maps: ['Base Color', 'Metallic', 'Normal', 'Roughness'].map((map) => mapMedia('Hoja2', map)) },
    { material: 'Mazo', preview: `${root}/06_MaterialPreviews/mazo.png`, maps: ['Base Color', 'Metallic', 'Normal', 'Roughness'].map((map) => mapMedia('Mazo', map)) },
    { material: 'Piedras', preview: `${root}/06_MaterialPreviews/piedras.png`, maps: ['Base Color', 'Metallic', 'Normal', 'Roughness'].map((map) => mapMedia('Piedras', map)) },
    { material: 'Vendas', preview: `${root}/06_MaterialPreviews/vendas.png`, maps: ['Base Color', 'Normal', 'Roughness'].map((map) => mapMedia('Vendas', map)) },
  ],
  videos: [
    { src: `${root}/04_Videos/swodstory.mp4`, alt: 'Video de proceso y presentación de Sword', kind: 'video', poster: `${root}/01_Renders/Sword_Render.png`, width: 1080, height: 1920, caption: 'Video de presentación' },
  ],
  collaborators: [
    { role: '3D Modeling', name: 'Christian Ocampo' },
    { role: 'Texturing', name: 'Christian Ocampo' },
    { role: 'Concept Art', name: 'Moniek Schilder', handle: '@monschi_art', url: 'https://x.com/monschi_art/status/1307036005501931520' },
  ],
}

export default sword
