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

1. Crea una carpeta para el proyecto dentro de `public/projects/`, por ejemplo `public/projects/aelion/`.
2. Guarda la portada optimizada como `cover.webp` y el resto de recursos en esa misma carpeta (puedes usar subcarpetas como `renders/`, `workflow/` y `textures/`).
3. Duplica un objeto de ejemplo en `src/data/projects.ts`, cambia sus datos y utiliza rutas públicas como `/projects/aelion/cover.webp`.
4. Elige una categoría y tipo. Los campos opcionales (`conceptArt`, `workflow`, `textures`, `gallery`, `modelViewerUrl`, `credits`) solo aparecen en la ficha cuando tienen contenido.

La portada y todos los recursos deben ir dentro de `public/projects/<slug>/`. No es necesario editar los componentes para agregar una ficha.

## Completar el contenido personal

- `src/data/profile.ts`: perfil, estudios, experiencia, habilidades y herramientas. Los arreglos académicos y laborales están vacíos hasta recibir información confirmada.
- `src/data/contact.ts`: correo y perfiles sociales. Deja `href` vacío mientras no haya una dirección real; los enlaces pendientes no se activan.
- La sección de CRONOS está preparada sin un logotipo provisional. Cuando compartas los archivos originales, se pueden añadir en `public/` y enlazar desde sus datos.

## Imágenes incluidas

Las imágenes en `public/projects/demo-*/` son recursos conceptuales generados para probar la composición. Las tarjetas y fichas los identifican como demostración; no son trabajos atribuidos a Christian Ocampo. Se pueden reemplazar o quitar al incorporar proyectos reales.
