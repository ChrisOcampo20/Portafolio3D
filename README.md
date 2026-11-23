# Portafolio 3D — Christian Ocampo

Base del portafolio profesional construida con React, Vite y TypeScript. La interfaz está en español y los datos editables viven en `src/data/`.

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Para revisar el build de producción:

```bash
pnpm build
pnpm preview
```

## Añadir un proyecto

1. Crea una carpeta para el proyecto dentro de `public/projects/<slug>/` y guarda `cover.webp` junto con los recursos que vayas a mostrar.
2. Crea un archivo de datos en `src/data/projects/<slug>.ts`. Puedes copiar `template-demo.ts` y reemplazar el contenido ficticio. El ejemplo no forma parte del catálogo.
3. Exporta ese registro desde `src/data/projects/index.ts`; no hace falta cambiar `ProjectDetail`.
4. Los apartados de galería, concept art, referencias, workflow, topología, UV, mapas PBR, comparación, visor y créditos son opcionales y solo se muestran cuando tienen datos.
5. El visor es opcional. Para Sketchfab puedes conservar `modelViewerUrl` o usar `modelViewer: { type: 'sketchfab', url: SKETCHFAB_EMBED_URL }`. Para un archivo local, espera a tener el `.glb` o `.gltf` real dentro de `public/projects/<slug>/` y configura `modelViewer: { type: 'local', src: PUBLIC_MODEL_URL }` en el objeto del proyecto. `PUBLIC_MODEL_URL` debe ser la ruta pública exacta del archivo existente; no se crea ni se asume una ruta automáticamente.
6. `modelViewer` admite `poster` (si se omite, usa la portada del proyecto), `backgroundColor`, `description` y, para GLB/GLTF, `initialCamera` con `orbit`, `target` y `fieldOfView`. Sin una URL válida de Sketchfab o una ruta existente con extensión `.glb`/`.gltf`, la sección no aparece.

El visor local y su runtime solo se cargan después de que el visitante active «Cargar visor 3D». Al cerrar el visor, se desmonta el modelo y se libera su fuente. El visor Sketchfab conserva el iframe anterior y también se activa a demanda.

Sword es el primer ejemplo local: su FBX fuente se convirtió a `public/projects/Sword/07_Model/Sword.glb` y el proyecto referencia esa ruta junto al render principal como portada. El FBX original permanece en `assets/projects/Sword/05_Source/`.

La portada y todos los recursos deben ir dentro de `public/projects/<slug>/`. Los tipos compartidos están en `src/types.ts`; la información de cada proyecto vive por separado de los componentes visuales.

## Completar el contenido personal

- `src/data/profile.ts`: perfil, estudios, experiencia, habilidades y herramientas. Los arreglos académicos y laborales están vacíos hasta recibir información confirmada.
- `src/data/contact.ts`: correo y perfiles sociales. Deja `href` vacío mientras no haya una dirección real; los enlaces pendientes no se activan.
- La sección de CRONOS está preparada sin un logotipo provisional. Cuando compartas los archivos originales, se pueden añadir en `public/` y enlazar desde sus datos.

## Imágenes incluidas

Las imágenes en `public/projects/demo-*/` son recursos conceptuales generados para probar la composición. Las tarjetas y fichas los identifican como demostración; no son trabajos atribuidos a Christian Ocampo. Se pueden reemplazar o quitar al incorporar proyectos reales.
