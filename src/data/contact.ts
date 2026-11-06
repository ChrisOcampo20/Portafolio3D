export type ContactChannel = 'Correo electrónico' | 'Instagram' | 'ArtStation' | 'Behance' | 'LinkedIn' | 'GitHub'

/** Añade aquí tus direcciones reales. Si href está vacío, el enlace se muestra como pendiente. */
export const contactLinks: Array<{ label: ContactChannel; href: string }> = [
  { label: 'Correo electrónico', href: '' },
  { label: 'Instagram', href: '' },
  { label: 'ArtStation', href: '' },
  { label: 'Behance', href: '' },
  { label: 'LinkedIn', href: '' },
  { label: 'GitHub', href: '' },
]
