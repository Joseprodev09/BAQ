/**
 * Textos de la interfaz en español, inglés y portugués.
 *
 * - En index.html, un elemento con data-i18n="clave" recibe el texto de esa clave.
 *   data-i18n-aria="clave" lo pone en aria-label y data-i18n-html="clave" admite HTML.
 * - Los textos con {llaves} se completan desde el código, por ejemplo t('enEstacion', { e: 'La Ocho' }).
 *
 * Para agregar un idioma: copia el bloque "es", traduce los valores, cambia la clave
 * (por ejemplo "fr") y añade la opción en el selector "idioma" de index.html.
 * Los textos del letrero para turistas están aparte, en js/i18n.js.
 */
const fuente = (texto, url, sitio, resto = '') => `${texto} <a href="${url}">${sitio}</a>${resto}`;
const URL_MURILLO =
  'https://www.elheraldo.co/barranquilla/mas-de-409-millones-de-usuarios-movilizados-por-transmetro-en-14-anos-1109097';
const URL_ESTADIO =
  'https://www.eltiempo.com/colombia/barranquilla/junior-vs-nacional-rutas-de-transmetro-en-barranquilla-618500';
const URL_SUSPENSION =
  'https://www.elheraldo.co/atlantico/barranquilla/2026/05/15/trasnmetro-suspende-despachos-b2-con-destino-a-parque-cultural-y-r2-hacia-joe-arroyo-desde-este-19-de-mayo/';
const URL_SENALIZACION =
  'https://www.elheraldo.co/barranquilla/en-cinco-estaciones-de-transmetro-realizaran-labores-de-mantenimiento-1079579';
const URL_TARIFA = 'https://colombiatramita.co/?p=1804';
const OSM =
  '<a href="https://www.openstreetmap.org/relation/2382291">R1 (2382291)</a>, <a href="https://www.openstreetmap.org/relation/2382289">B1 (2382289)</a>';

export const TEXTOS_UI = {
  es: {
    titulo: 'Simulador de recorrido Transmetro · Barranquilla',
    intro:
      'Rutas troncales reales R1 y B1 sobre el trazado de OpenStreetMap, con hoteles cercanos a cada estación y una propuesta de señalización para turistas. Proyecto BAQ360.',
    idioma: 'Idioma',
    modoOscuro: 'Modo oscuro',
    modoClaro: 'Modo claro',
    ruta: 'Ruta',
    mapaAria: 'Mapa del recorrido del bus',
    seguir: 'Seguir el bus',
    verTodo: 'Ver ruta completa',
    acercar: 'Acercar',
    alejar: 'Alejar',
    lgRuta: 'Ruta {r}',
    lgEstacion: 'Estación',
    lgHotel: 'Hotel',
    lgSiguiente: 'Siguiente hotel',
    lgVisitado: 'Hotel ya visitado',
    lgDatos: 'Datos: © colaboradores de OpenStreetMap (ODbL), 26 nov 2026',
    dirActual: 'Dirección actual',
    hotelLlegaron: 'Hotel al que llegaron',
    siguienteHotel: 'Siguiente hotel',
    ningunHotel: 'Aún ninguno',
    aBordo: 'El grupo sigue a bordo',
    enEstacion: 'En la estación {e}',
    entre: 'Entre {a} y {b}',
    bajaron: 'Bajaron en {e} · {m} min a pie',
    bajar: 'Bajar en {e} · {m} min a pie',
    faltan: 'Bajar en {e} · faltan {km} en bus + {m} min a pie',
    recorridoCompleto: 'Recorrido de hoteles completo',
    eligeHoteles: 'Elige hoteles en la lista',
    sinHoteles: 'No hay hoteles registrados cerca de esta ruta.',
    modoAria: 'Modo de recorrido',
    auto: 'Automático',
    manual: 'Manual',
    anterior: '◀ Estación anterior',
    siguiente: 'Estación siguiente ▶',
    pausar: 'Pausar',
    reproducir: 'Reproducir',
    velocidad: 'Velocidad',
    reiniciar: 'Reiniciar',
    posAria: 'Posición en la ruta',
    deTotal: '{a} de {b}',
    tiempo: 'Tiempo simulado {t}',
    proxima: 'Próxima: {e}',
    llego: 'Llegó a {e}',
    ayudaControles:
      'Manual: arrastra la barra, usa los botones o las flechas ← → del teclado (100 m por pulsación; Mayús + flecha salta de estación). Automático: el bus avanza a una velocidad comercial supuesta de 22 km/h y se detiene 20 s en cada estación (valores del simulador, no datos de Transmetro).',
    hotelesRecorrido: 'Hoteles del recorrido',
    notaCaminata: 'Distancias a pie: línea recta × 1,3, a 75 m/min (estimado).',
    senalTitulo: 'Señalización para turistas (propuesta)',
    letreroAria: 'Idioma del letrero',
    rotar: 'Rotar idiomas',
    notaLetrero:
      'El letrero cambia con la posición del bus: muestra la próxima estación, qué hotel o atractivo queda cerca y cuánto se camina.',
    mejorasTitulo: 'Mejoras de señalización según las problemáticas del diagnóstico',
    fuentesTitulo: 'Datos y fuentes',
    fuentes: [
      `Trazado, estaciones, calles y hoteles: OpenStreetMap, relaciones ${OSM}, consultadas el 26 de noviembre de 2026. Los hoteles son los registrados en OSM a menos de 600 m del corredor; conviene confirmar que sigan operando antes de una demostración.`,
      fuente('Troncales Murillo (Calle 45) y Olaya Herrera (Carrera 46):', URL_MURILLO, 'El Heraldo', '.'),
      fuente(
        'Estaciones más cercanas al Metropolitano (Joaquín Barrios Polo y Pedro Ramayá):',
        URL_ESTADIO,
        'El Tiempo',
        '.',
      ),
      fuente(
        'Suspensión temporal de los servicios B2 y R2 desde el 19 de mayo de 2026 (por eso se simulan R1 y B1):',
        URL_SUSPENSION,
        'El Heraldo',
        '.',
      ),
      fuente(
        'Necesidad de mejorar la señalización de rutas y zonas de espera en la estación Joe Arroyo:',
        URL_SENALIZACION,
        'El Heraldo',
        '.',
      ),
      fuente(
        'Tarifa 2026 y pago solo con tarjeta:',
        URL_TARIFA,
        'Colombia Tramita',
        ' (fuente secundaria; confirmar en transmetro.gov.co).',
      ),
      'Velocidad del bus y tiempos de parada: valores supuestos del simulador.',
    ],
    errorCarga:
      'No se pudieron cargar los datos. Abre el proyecto con un servidor local (<code>npm start</code>) en lugar de hacer doble clic en el archivo. Más detalles en el README.',
  },

  en: {
    titulo: 'Transmetro Route Simulator · Barranquilla',
    intro:
      'Real R1 and B1 trunk routes on the OpenStreetMap layout, with hotels near each station and a wayfinding proposal for visitors. BAQ360 project.',
    idioma: 'Language',
    modoOscuro: 'Dark mode',
    modoClaro: 'Light mode',
    ruta: 'Route',
    mapaAria: 'Map of the bus route',
    seguir: 'Follow the bus',
    verTodo: 'Show full route',
    acercar: 'Zoom in',
    alejar: 'Zoom out',
    lgRuta: 'Route {r}',
    lgEstacion: 'Station',
    lgHotel: 'Hotel',
    lgSiguiente: 'Next hotel',
    lgVisitado: 'Hotel already visited',
    lgDatos: 'Data: © OpenStreetMap contributors (ODbL), 26 Nov 2026',
    dirActual: 'Current location',
    hotelLlegaron: 'Hotel reached',
    siguienteHotel: 'Next hotel',
    ningunHotel: 'None yet',
    aBordo: 'The group is still on board',
    enEstacion: 'At {e} station',
    entre: 'Between {a} and {b}',
    bajaron: 'Got off at {e} · {m} min walk',
    bajar: 'Get off at {e} · {m} min walk',
    faltan: 'Get off at {e} · {km} left by bus + {m} min walk',
    recorridoCompleto: 'All hotels visited',
    eligeHoteles: 'Choose hotels from the list',
    sinHoteles: 'No hotels registered near this route.',
    modoAria: 'Ride mode',
    auto: 'Automatic',
    manual: 'Manual',
    anterior: '◀ Previous station',
    siguiente: 'Next station ▶',
    pausar: 'Pause',
    reproducir: 'Play',
    velocidad: 'Speed',
    reiniciar: 'Restart',
    posAria: 'Position on the route',
    deTotal: '{a} of {b}',
    tiempo: 'Simulated time {t}',
    proxima: 'Next: {e}',
    llego: 'Arrived at {e}',
    ayudaControles:
      'Manual: drag the bar, use the buttons or the ← → keys (100 m per press; Shift + arrow jumps between stations). Automatic: the bus moves at an assumed commercial speed of 22 km/h and stops 20 s at each station (simulator values, not Transmetro data).',
    hotelesRecorrido: 'Hotels on the tour',
    notaCaminata: 'Walking distances: straight line × 1.3, at 75 m/min (estimate).',
    senalTitulo: 'Wayfinding for visitors (proposal)',
    letreroAria: 'Sign language',
    rotar: 'Rotate languages',
    notaLetrero:
      'The sign changes with the bus position: it shows the next station, which hotel or attraction is nearby and how far it is to walk.',
    mejorasTitulo: 'Wayfinding improvements based on the diagnosis',
    fuentesTitulo: 'Data and sources',
    fuentes: [
      `Route layout, stations, streets and hotels: OpenStreetMap, relations ${OSM}, accessed 26 November 2026. Hotels are those registered in OSM within 600 m of the corridor; confirm they are still open before a demo.`,
      fuente('Murillo (Calle 45) and Olaya Herrera (Carrera 46) trunk corridors:', URL_MURILLO, 'El Heraldo', '.'),
      fuente(
        'Stations closest to the Metropolitano stadium (Joaquín Barrios Polo and Pedro Ramayá):',
        URL_ESTADIO,
        'El Tiempo',
        '.',
      ),
      fuente(
        'Temporary suspension of B2 and R2 services from 19 May 2026 (which is why R1 and B1 are simulated):',
        URL_SUSPENSION,
        'El Heraldo',
        '.',
      ),
      fuente(
        'Need for better route and waiting-area signage at Joe Arroyo station:',
        URL_SENALIZACION,
        'El Heraldo',
        '.',
      ),
      fuente(
        '2026 fare and card-only payment:',
        URL_TARIFA,
        'Colombia Tramita',
        ' (secondary source; confirm at transmetro.gov.co).',
      ),
      'Bus speed and dwell times: values assumed by the simulator.',
    ],
    errorCarga:
      'The data could not be loaded. Open the project with a local server (<code>npm start</code>) instead of double-clicking the file. See the README for details.',
  },

  pt: {
    titulo: 'Simulador de percurso Transmetro · Barranquilla',
    intro:
      'Rotas troncais reais R1 e B1 sobre o traçado do OpenStreetMap, com hotéis perto de cada estação e uma proposta de sinalização para turistas. Projeto BAQ360.',
    idioma: 'Idioma',
    modoOscuro: 'Modo escuro',
    modoClaro: 'Modo claro',
    ruta: 'Rota',
    mapaAria: 'Mapa do percurso do ônibus',
    seguir: 'Seguir o ônibus',
    verTodo: 'Ver rota completa',
    acercar: 'Aproximar',
    alejar: 'Afastar',
    lgRuta: 'Rota {r}',
    lgEstacion: 'Estação',
    lgHotel: 'Hotel',
    lgSiguiente: 'Próximo hotel',
    lgVisitado: 'Hotel já visitado',
    lgDatos: 'Dados: © colaboradores do OpenStreetMap (ODbL), 26 nov 2026',
    dirActual: 'Localização atual',
    hotelLlegaron: 'Hotel alcançado',
    siguienteHotel: 'Próximo hotel',
    ningunHotel: 'Nenhum ainda',
    aBordo: 'O grupo continua a bordo',
    enEstacion: 'Na estação {e}',
    entre: 'Entre {a} e {b}',
    bajaron: 'Desceram em {e} · {m} min a pé',
    bajar: 'Descer em {e} · {m} min a pé',
    faltan: 'Descer em {e} · faltam {km} de ônibus + {m} min a pé',
    recorridoCompleto: 'Todos os hotéis visitados',
    eligeHoteles: 'Escolha hotéis na lista',
    sinHoteles: 'Não há hotéis registrados perto desta rota.',
    modoAria: 'Modo de percurso',
    auto: 'Automático',
    manual: 'Manual',
    anterior: '◀ Estação anterior',
    siguiente: 'Próxima estação ▶',
    pausar: 'Pausar',
    reproducir: 'Reproduzir',
    velocidad: 'Velocidade',
    reiniciar: 'Reiniciar',
    posAria: 'Posição na rota',
    deTotal: '{a} de {b}',
    tiempo: 'Tempo simulado {t}',
    proxima: 'Próxima: {e}',
    llego: 'Chegou a {e}',
    ayudaControles:
      'Manual: arraste a barra, use os botões ou as setas ← → do teclado (100 m por toque; Shift + seta pula de estação). Automático: o ônibus anda a uma velocidade comercial suposta de 22 km/h e para 20 s em cada estação (valores do simulador, não dados do Transmetro).',
    hotelesRecorrido: 'Hotéis do percurso',
    notaCaminata: 'Distâncias a pé: linha reta × 1,3, a 75 m/min (estimativa).',
    senalTitulo: 'Sinalização para turistas (proposta)',
    letreroAria: 'Idioma da placa',
    rotar: 'Alternar idiomas',
    notaLetrero:
      'A placa muda com a posição do ônibus: mostra a próxima estação, qual hotel ou atração fica perto e quanto se caminha.',
    mejorasTitulo: 'Melhorias de sinalização segundo os problemas do diagnóstico',
    fuentesTitulo: 'Dados e fontes',
    fuentes: [
      `Traçado, estações, ruas e hotéis: OpenStreetMap, relações ${OSM}, consultadas em 26 de novembro de 2026. Os hotéis são os registrados no OSM a menos de 600 m do corredor; convém confirmar que continuam funcionando antes de uma demonstração.`,
      fuente('Troncais Murillo (Calle 45) e Olaya Herrera (Carrera 46):', URL_MURILLO, 'El Heraldo', '.'),
      fuente(
        'Estações mais próximas do estádio Metropolitano (Joaquín Barrios Polo e Pedro Ramayá):',
        URL_ESTADIO,
        'El Tiempo',
        '.',
      ),
      fuente(
        'Suspensão temporária dos serviços B2 e R2 desde 19 de maio de 2026 (por isso são simuladas R1 e B1):',
        URL_SUSPENSION,
        'El Heraldo',
        '.',
      ),
      fuente(
        'Necessidade de melhorar a sinalização de rotas e áreas de espera na estação Joe Arroyo:',
        URL_SENALIZACION,
        'El Heraldo',
        '.',
      ),
      fuente(
        'Tarifa 2026 e pagamento só com cartão:',
        URL_TARIFA,
        'Colombia Tramita',
        ' (fonte secundária; confirmar em transmetro.gov.co).',
      ),
      'Velocidade do ônibus e tempos de parada: valores supostos pelo simulador.',
    ],
    errorCarga:
      'Não foi possível carregar os dados. Abra o projeto com um servidor local (<code>npm start</code>) em vez de clicar duas vezes no arquivo. Mais detalhes no README.',
  },
};

/** Palabras que unen la avenida con la calle que cruza, por idioma (ver geo.js). */
export const CONECTORES = {
  es: { con: ' con ', altura: ' a la altura de ' },
  en: { con: ' at ', altura: ' near ' },
  pt: { con: ' com ', altura: ' na altura de ' },
};
