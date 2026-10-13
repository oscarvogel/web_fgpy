export type Service = {
  n: string
  slug: string
  title: string
  short: string
  tags: string[]
  img: string
}

// Migrated from web_fgpy/src/_data/todos_los_servicios.json
export const services: Service[] = [
  {
    n: '01', slug: 'trozado', title: 'Trozado con garra trozadora',
    short: 'Corte preciso en monte para optimizar el transporte y la manipulación de la madera.',
    tags: ['Cosecha', 'Maquinaria'],
    // shortcut: no garra trozadora photo exists; plantation shot until a real one arrives (the forwarder stays exclusive to the hero)
    img: '/img/slider1.webp',
  },
  {
    n: '02', slug: 'biomasa', title: 'Chips de biomasa',
    short: 'Transformamos residuos forestales en chips de alta calidad para energía renovable y calefacción industrial.',
    tags: ['Biomasa', 'Energía'],
    img: '/img/servicios/chipeado.webp',
  },
  {
    n: '03', slug: 'caminos', title: 'Caminos forestales',
    short: 'Mantenimiento y consolidado de caminos para un acceso seguro y operaciones sin interrupciones.',
    tags: ['Infraestructura'],
    img: '/img/servicios/caminos_forestales.webp',
  },
  {
    n: '04', slug: 'transporte', title: 'Transporte forestal',
    short: 'Traslado de madera y productos forestales con equipos adaptados al terreno.',
    tags: ['Logística'],
    img: '/img/servicios/transporte_forestal.webp',
  },
  {
    n: '05', slug: 'abastecimiento', title: 'Planes de abastecimiento',
    short: 'Planificación estratégica para un suministro continuo, eficiente y sostenible.',
    tags: ['Planificación', 'Logística'],
    img: '/img/servicios/planes_abastecimiento.webp',
  },
  {
    n: '06', slug: 'descarga', title: 'Descarga con garra forestal',
    short: 'Descarga de camiones rápida y segura, reduciendo tiempos y riesgos en planta.',
    tags: ['Maquinaria'],
    img: '/img/servicios/descarga_madera.webp',
  },
  {
    n: '07', slug: 'fletes', title: 'Fletes de máquinas',
    short: 'Traslado de maquinaria pesada con plancha transportadora, bajo normas de seguridad vigentes.',
    tags: ['Logística', 'Maquinaria'],
    img: '/img/servicios/flete_maquinas.webp',
  },
]
