/**
 * Textos del letrero para turistas en español, inglés y portugués.
 * Para agregar un idioma: copia un bloque, cambia la clave (por ejemplo "fr")
 * y añade el botón correspondiente en index.html (data-l="fr").
 */
export const TEXTOS = {
  es: {
    proxima: 'Próxima estación',
    actual: 'Estación actual',
    fin: 'Fin del recorrido',
    ubicacion: 'Usted está en',
    aPie: 'min a pie',
    bajeseAqui: 'Bájese aquí para',
    estadio: 'Estadio Metropolitano: bájese en esta estación',
    romelio: 'Estadio Romelio Martínez',
    pocasCuadras: 'A pocas cuadras',
    tarifa: 'Pago con tarjeta Transmetro. No se acepta efectivo',
    tarifaDetalle: 'COP 3.700 lun–sáb · COP 3.800 dom y festivos',
    info: 'Información turística y recarga en taquilla',
  },
  en: {
    proxima: 'Next stop',
    actual: 'Current stop',
    fin: 'Last stop',
    ubicacion: 'You are at',
    aPie: 'min walk',
    bajeseAqui: 'Get off here for',
    estadio: 'Metropolitano Stadium: get off at this stop',
    romelio: 'Romelio Martínez Stadium',
    pocasCuadras: 'A few blocks away',
    tarifa: 'Pay with Transmetro card only. No cash',
    tarifaDetalle: 'COP 3,700 Mon–Sat · COP 3,800 Sun and holidays',
    info: 'Tourist info and card top-up at ticket office',
  },
  pt: {
    proxima: 'Próxima estação',
    actual: 'Estação atual',
    fin: 'Fim do percurso',
    ubicacion: 'Você está em',
    aPie: 'min a pé',
    bajeseAqui: 'Desça aqui para',
    estadio: 'Estádio Metropolitano: desça nesta estação',
    romelio: 'Estádio Romelio Martínez',
    pocasCuadras: 'A poucas quadras',
    tarifa: 'Pagamento só com cartão Transmetro. Não aceita dinheiro',
    tarifaDetalle: 'COP 3.700 seg–sáb · COP 3.800 dom e feriados',
    info: 'Informação turística e recarga na bilheteria',
  },
};

/** Orden en que rotan los idiomas. */
export const ORDEN_IDIOMAS = ['es', 'en', 'pt'];
