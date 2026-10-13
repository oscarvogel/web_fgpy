/**
 * Datos operativos públicos. La empresa no publica volúmenes, flota ni cobertura:
 * solo cifras ya difundidas y descripciones cualitativas. La ficha técnica se entrega a pedido.
 */
export type Figure = { label: string; value: number; suffix?: string; unit: string }

export const capacity: Figure[] = [
  { label: 'Trayectoria', value: 15, suffix: '+', unit: 'años en el monte' },
  { label: 'Proyectos', value: 100, suffix: '+', unit: 'completados' },
  { label: 'Operación', value: 24, suffix: '/7', unit: 'disponibilidad en campo' },
]

export const chipSpec: { k: string; v: string }[] = [
  { k: 'Materia prima', v: 'Residuos forestales y subproductos de la industria maderera' },
  { k: 'Uso', v: 'Calderas industriales, energía renovable y calefacción' },
  { k: 'Producción', v: 'En origen, con chipeadora propia' },
  { k: 'Entrega', v: 'En planta del cliente, con flota propia' },
]

/** Logos de clientes o plantas abastecidas (solo con su autorización). Vacío = el ticker muestra servicios. */
export const clients: { name: string; logo: string }[] = []
