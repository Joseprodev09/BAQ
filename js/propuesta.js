/**
 * Secciones explicativas de la propuesta de valor Barranquilla 360
 * (basadas en el documento «Barranquilla 360 · Sprint 2 · Plan operativo y prototipo»). Se pintan en los contenedores
 * #p-* de index.html y se repintan al cambiar de idioma.
 * Los textos son propios del proyecto (no vienen de datos externos).
 */
import { cargarJSON } from './utils.js';
import { getIdioma } from './idioma.js';

const TEXTO = {
  es: {
    tipos: { D: 'DIRECTA', C: 'CONDICIONADA' },
    comprobar: 'Por qué / cómo comprobar',
    dx: {
      etq: '01 · EL PROBLEMA',
      titulo: 'La demanda extraordinaria puede superar la capacidad disponible',
      lead: 'Barranquilla 360 prepara a la ciudad para recibir grandes eventos sin deteriorar la operación cotidiana. No es una aplicación aislada ni una ampliación obligatoria del estadio: combina capacidad real de transporte, servicios físicos de proximidad y gestión de recursos con datos verificables.',
      cols: [
        ['Problema central', 'El riesgo de que la demanda extraordinaria supere la capacidad operativa disponible.'],
        ['24 problemáticas', 'Son necesidades y riesgos a abordar, no 24 fallas actuales comprobadas.'],
        ['Legado', 'El Mundial es el escenario hipotético del reto; el legado también debe servir al Carnaval, partidos, conciertos y congresos.'],
      ],
      n: '100 %',
      nTxt: 'Ocupación hotelera reportada en la final de la Sudamericana 2026, antecedente de presión usado en el diagnóstico.',
      nNota: 'No demuestra que todos los demás servicios estén colapsados.',
      obj: 'El valor del programa es ligar cada déficit a una intervención física, financiada y verificable.',
    },
    pilares: {
      etq: '02 · PROPUESTA DE VALOR',
      titulo: 'Una red, tres responsabilidades',
      lead: 'Cada pilar implementa algo concreto y tiene definido qué recibe y qué entrega a los otros dos.',
      items: [
        ['BAQ ROUTES', 'Distribuir', 'Corredores, señalización, conexiones autorizadas, refuerzos y alojamiento conectado.', 'Recibe el plan aprobado; publica conexiones y devuelve tiempos, ocupación y barreras.'],
        ['BAQ POINTS', 'Atender', 'Red de establecimientos y módulos con información, agua, baños, descanso y asistencia según disponibilidad.', 'Recibe demanda y ubicaciones; devuelve disponibilidad, incidencias y necesidades de reposición.'],
        ['BAQ CONNECT', 'Gestionar', 'Inventario de capacidades, simulación por franja y acciones con responsable, costo y evidencia.', 'Recibe datos de operadores; entrega brechas y refuerzos confirmados a Routes y Points.'],
      ],
      total: 'Una señal no crea plazas, una alerta no produce agua y una plataforma no reemplaza a las autoridades.',
      totalNota: 'D = mecanismo directo de diseño; C = intervención condicionada a capacidad, acuerdos o permisos. D no significa problema ya resuelto.',
    },
    routes: {
      etq: '03 · BAQ ROUTES · DISTRIBUIR',
      titulo: 'Organizar la demanda y añadir capacidad de transporte cuando hace falta',
      lead: 'Una identidad visual continua para que el visitante reconozca su conexión sin depender del teléfono: color + código + destino + pictograma, en ES/EN. El color no indica congestión ni sustituye las señales oficiales.',
      mecT: 'Movilidad, territorio y turismo',
      mec: [
        ['01', 'Desorientación', 'D', 'Directorios al salir del aeropuerto, carteles antes de giros y confirmaciones tras transbordos. Los códigos se repiten en mapas y vehículos autorizados.', 'Evita decisiones erróneas; comparar tiempo y errores con y sin señalización.'],
        ['02', 'Congestión', 'C', 'Escalonar llegadas; agrupar recogidas fuera de carriles de circulación; evaluar Park & Ride y lanzaderas en Murillo, Calle 30 y Circunvalar.', 'Medir tiempos, colas y ocupación antes de aprobar.'],
        ['03', 'Transporte insuficiente', 'C', 'Calcular plazas adicionales por franja; comprobar tiempos de ciclo, flota, conductores, plataformas y retorno. Contratar o programar servicios autorizados.', 'Añade oferta efectiva, no solo información; medir plazas confirmadas y usuarios trasladados.'],
        ['04', 'Afectación a residentes', 'C', 'Reservar primero las frecuencias y plazas de la demanda cotidiana. No retirar vehículos de rutas habituales sin reposición.', 'Comparar espera y ocupación con la línea base.'],
        ['05', 'Conexiones débiles', 'C', 'Programar conexiones aeropuerto–hoteles–estadio y sus retornos. Consolidar horarios y puntos de recogida autorizados en B01/B02 y zonas hoteleras.', 'Verificar el viaje completo y las plazas por enlace.'],
        ['06', 'Accesibilidad física', 'C', 'Auditar andenes, rampas, cruces, obstáculos y ascenso al bus. Marcar rutas verificadas, registrar barreras y solicitar adecuaciones.', 'Recorrido con usuarios; validar barreras sin prometer rutas inexistentes.'],
        ['08', 'Saturación hotelera', 'C', 'Reservar cupos por noche y huésped con Connect; sumar Norte, Centro, Soledad y Puerto Colombia solo si oferta y transporte están confirmados.', 'Medir habitaciones contratadas y tiempos de conexión.'],
        ['09', 'Turismo concentrado', 'C', 'Circuitos culturales y costeros con horario, aforo y retorno: Barrio Abajo, Centro, Malecón, Puerto Mocho, Mallorquín y Puerto Colombia.', 'Medir afluencia por sitio sin superar límites ambientales.'],
      ],
      plan: 'Plan de transporte: levantar origen, destino, franjas de llegada y salida, capacidad real por viaje, ocupación habitual y tiempo de ciclo; reservar la oferta cotidiana, calcular el refuerzo y dimensionar el retorno por separado. El piloto estudia aeropuerto → Portal de Soledad → estadio.',
      leyenda: 'Las frecuencias y el número de vehículos serán simulados hasta disponer de información operativa real. Rutas, horarios y puntos de ascenso deben verificarse en campo.',
      demoT: 'Recorre cada corredor',
      demo: 'Elige un servicio y mira su trazado sobre calles reales, sus paradas, los hoteles cercanos y la señal que vería el visitante.',
    },
    points: {
      etq: '04 · BAQ POINTS · ATENDER',
      titulo: 'Reutilizar establecimientos y construir módulos solo donde falte cobertura',
      lead: 'No basta con mostrar dónde hay un servicio: el punto debe tenerlo habilitado y un operador responsable.',
      niveles: [
        ['BASIC', 'Información', 'Cartel, mapa, QR y guía bilingüe.', 'Hoteles, restaurantes, museos y comercios.', 'Bajo costo relativo'],
        ['PLUS', 'Servicios', 'Atención y servicios disponibles: agua, baños, sombra, descanso y separación de residuos.', 'Estaciones, estadio, Malecón y sitios turísticos.', 'Costo medio relativo'],
        ['SMART', 'Continuidad', 'Terminal digital, comunicación y respaldo de funciones críticas, más señal física.', 'Aeropuerto, Portal de Soledad y nodos de alta demanda.', 'Costo variable'],
      ],
      ubic: 'Ubicación candidata',
      inv: 'Inversión',
      mecT: 'Inclusión, bienestar y comercio',
      mec: [
        ['12', 'Idioma', 'D', 'Mapas y atención ES/EN, pictogramas, guía de transporte y ayuda humana en aeropuerto, hoteles, estaciones y sitios turísticos.', 'Probar la comprensión en ambos idiomas.'],
        ['13', 'Exclusión digital', 'D', 'Directorios impresos, señales físicas y orientación humana. El QR es complementario, nunca obligatorio.', 'Probar con el móvil apagado.'],
        ['14', 'Servicios desconocidos', 'D', 'Ficha de cada Point con código, horarios, servicios, accesibilidad, estado y última verificación, publicada en el mapa.', 'Cotejar la ficha con la prestación real.'],
        ['15', 'Calor y descanso', 'C', 'Sombra y descanso en estaciones, estadio y sitios turísticos; coordinar hidratación y protocolos de salud.', 'Verificar condiciones, aforo y disponibilidad. No elimina el riesgo térmico.'],
        ['16', 'Sanitarios insuficientes', 'C', 'Acordar baños en establecimientos y recintos con acceso, horario, limpieza, capacidad y accesibilidad.', 'Medir disponibilidad y cola; cerrar la ficha si no funciona.'],
        ['17', 'Agua potable', 'C', 'Identificar fuentes potables, reposición, higiene y capacidad de dispensación en estadio, Malecón y nodos de transporte.', 'Verificar litros disponibles y reposición, no solo el dispensador.'],
        ['18', 'Residuos', 'C', 'Recipientes en áreas de consumo, fuera de evacuación; separación blanco/negro/verde y recolección dimensionada con el prestador.', 'Medir volumen o peso y frecuencia.'],
        ['10', 'Comercio poco visible', 'D', 'Vincular negocios voluntarios en Barrio Abajo, Centro, Malecón y costa con ficha de horarios, precios y servicios.', 'Medir comercios activos, consultas y visitas; no garantiza ventas.'],
      ],
      nota: 'Todo punto tiene operador identificado, ficha vigente, código BP-xxx, ubicación, horario, servicios anunciados, capacidad verificable, responsable de limpieza y actualización, y procedimiento de incidencias. Un BAQ Point no es un puesto médico ni policial.',
    },
    connect: {
      etq: '05 · BAQ CONNECT · GESTIONAR',
      titulo: 'Identificar necesidades, convertir déficits en acciones y verificarlas',
      lead: 'Oferta libre = máximo(0, capacidad operativa − reserva habitual − compromisos no duplicados). Brecha = máximo(0, demanda extraordinaria − oferta libre). Si falta un dato se marca «pendiente»: no se usa cero ni se afirma suficiencia.',
      mecT: 'Información, decisiones y seguridad',
      mec: [
        ['07', 'Información hotelera dispersa', 'D', 'Registro por establecimiento, noche, habitaciones, camas, reservas y fuente, sin duplicados. Mesa hotelera y tablero.', 'Comparar registros con cupos confirmados.'],
        ['11', 'Inversiones sin evidencia', 'D', 'Comparar aprovechar, contratar refuerzo o construir: costo total, capacidad adicional, mantenimiento y legado.', 'Comparar costo por plaza, habitación o servicio.'],
        ['19', 'Interrupciones eléctricas', 'C', 'Inventariar cargas críticas, UPS, generador y autonomía; pruebas con prestadores y responsables de nodos.', 'Medir autonomía y transferencia.'],
        ['20', 'Fallas de internet', 'C', 'Mapas descargables, registros locales, señal física y comunicación redundante; mostrar la fecha del último dato.', 'Probar sin conexión.'],
        ['24', 'Decisiones tardías', 'D', 'Abrir una acción por brecha con responsable, recurso, presupuesto, plazo, estado, aprobación y evidencia.', 'Medir acciones confirmadas y verificadas.'],
        ['21', 'Lluvias e inundaciones', 'C', 'Registrar cierres y zonas afectadas; consultar Gestión del Riesgo y Tránsito; publicar solo alternativas autorizadas.', 'Simular un cierre y validar la comunicación.'],
        ['22', 'Seguridad y aglomeraciones', 'C', 'Aforos autorizados, accesos, iluminación, cruces seguros y puntos de encuentro; avisos oficiales en Connect y señalización.', 'Verificar plan aprobado, claridad y capacidad.'],
        ['23', 'Acceso a emergencias', 'C', 'Points orienta hacia Salud, Policía o Bomberos; Connect mantiene directorio y recursos confirmados.', 'Probar la derivación sin simular un despacho real.'],
      ],
      casoT: 'Caso de simulación: evento de 65.000 asistentes',
      cab: ['Servicio', 'Demanda', 'Oferta libre*', 'Brecha', 'Acción'],
      filas: [
        ['Transporte (ida)', '42.250 plazas', '30.800', '11.450', '82 viajes equivalentes a 140 plazas'],
        ['Alojamiento', '10.000 hab.', '7.200', '2.800', 'Contratar cupos y conexión'],
        ['Residuos', '32,5 t', '25 t', '7,5 t', 'Reforzar recolección'],
        ['Agua de consumo', '65.000 L', 'Sin dato', 'Pendiente', 'Pedir capacidad'],
      ],
      estados: 'Estados de acción: pendiente → en evaluación → aprobado → confirmado → verificado. Aprobado no significa ejecutado.',
      nota: '*Ofertas simuladas. Supuestos ilustrativos: 65 % usa transporte colectivo; 20.000 huéspedes, dos por habitación; 0,5 kg de residuos y 1 L de agua por asistente. El retorno se calcula por separado y 82 viajes no equivalen a 82 buses. La decisión de seguridad es de las autoridades.',
    },
    flujo: {
      etq: '06 · FUNCIONAMIENTO',
      titulo: 'El ciclo operativo que hace funcionar la solución',
      lead: 'Se repite en cada evento y mejora con lo aprendido.',
      pasos: [
        ['Registrar', 'Cada operador comunica capacidad, demanda habitual, compromisos, fuente y fecha.'],
        ['Dimensionar', 'Connect calcula la demanda extraordinaria y la compara con la oferta libre; si falta información, queda pendiente.'],
        ['Decidir', 'La mesa operativa compara alternativas y asigna responsable, costo y plazo. Los operadores autorizan y confirman recursos.'],
        ['Ejecutar y comunicar', 'Routes publica conexiones reales y Points habilita servicios. No se publican alternativas no confirmadas.'],
        ['Verificar', 'Se contrastan tiempos, plazas, servicios y costos con la línea base y se ajusta el plan para el siguiente evento.'],
      ],
      nota: 'Economía: aprovechar (señalización, mapas, capacitación), reforzar (conductores, vehículos, agua, aseo, personal) y construir solo si persiste una brecha. El ingreso bruto de los negocios no equivale a beneficio neto ni a retorno fiscal.',
    },
    cierre: {
      titulo: 'Preparar la ciudad, no solo el estadio.',
      lema: 'Sprint 2 construir → Sprint 3 validar → piloto territorial → escalar.',
      etapas: [
        ['Sprint 2 · construir', 'MVP navegable, cartelera, Point inicial, guion y pruebas registradas; costos preliminares.'],
        ['Sprint 3 · validar', 'Pruebas con usuarios, revisión de resultados, corrección y backlog.'],
        ['Piloto territorial', 'Permisos, responsables, inventarios reales, presupuesto y umbrales de servicio acordados.'],
        ['Escalar', 'Resultados comprobados, mantenimiento financiado y cobertura por corredores según demanda.'],
      ],
      nota: 'QUIJAM 2034 es un escenario hipotético. El Metropolitano se mantiene en 65.000 plazas. Ubicaciones, costos y acuerdos son preliminares; actores propuestos sin convenios ni financiación confirmados. Fuente: Barranquilla 360 · Sprint 2 · Plan operativo y prototipo (26/11/2026).',
    },
  },
  en: {
    tipos: { D: 'DIRECT', C: 'CONDITIONAL' },
    comprobar: 'Why / how to check',
    dx: {
      etq: '01 · THE PROBLEM',
      titulo: 'Extraordinary demand can exceed the capacity available',
      lead: 'Barranquilla 360 prepares the city to host major events without degrading everyday operations. It is not a stand-alone app or a mandatory stadium expansion: it combines real transport capacity, physical services nearby and resource management based on verifiable data.',
      cols: [
        ['Core problem', 'The risk that extraordinary demand exceeds the operating capacity available.'],
        ['24 problems', 'They are needs and risks to address, not 24 proven current failures.'],
        ['Legacy', 'The World Cup is the hypothetical scenario of the challenge; the legacy must also serve Carnival, matches, concerts and conferences.'],
      ],
      n: '100 %',
      nTxt: 'Hotel occupancy reported at the 2026 Sudamericana final, the pressure precedent used in the diagnosis.',
      nNota: 'It does not show that every other service collapsed.',
      obj: 'The value of the programme is to tie every shortfall to a physical, funded and verifiable intervention.',
    },
    pilares: {
      etq: '02 · VALUE PROPOSITION',
      titulo: 'One network, three responsibilities',
      lead: 'Each pillar delivers something concrete and has a defined input and output to the other two.',
      items: [
        ['BAQ ROUTES', 'Distribute', 'Corridors, signage, authorised connections, reinforcements and connected lodging.', 'Receives the approved plan; publishes connections and returns times, occupancy and barriers.'],
        ['BAQ POINTS', 'Assist', 'Network of venues and modules with information, water, toilets, rest and assistance where available.', 'Receives demand and locations; returns availability, incidents and restocking needs.'],
        ['BAQ CONNECT', 'Manage', 'Capacity inventory, simulation by time slot and actions with an owner, cost and evidence.', 'Receives operator data; delivers gaps and confirmed reinforcements to Routes and Points.'],
      ],
      total: 'A sign does not create seats, an alert does not produce water and a platform does not replace the authorities.',
      totalNota: 'D = direct design mechanism; C = intervention conditional on capacity, agreements or permits. D does not mean the problem is already solved.',
    },
    routes: {
      etq: '03 · BAQ ROUTES · DISTRIBUTE',
      titulo: 'Organise demand and add transport capacity when needed',
      lead: 'A continuous visual identity so visitors recognise their connection without relying on a phone: colour + code + destination + pictogram, in ES/EN. Colour does not indicate congestion or replace official signs.',
      mecT: 'Mobility, territory and tourism',
      mec: [
        ['01', 'Getting lost', 'D', 'Directories on leaving the airport, signs before turns and confirmations after transfers. Codes repeated on maps and authorised vehicles.', 'Avoids wrong decisions; compare time and errors with and without signage.'],
        ['02', 'Congestion', 'C', 'Stagger arrivals; group pick-ups off traffic lanes; assess Park & Ride and shuttles on Murillo, Calle 30 and Circunvalar.', 'Measure times, queues and occupancy before approving.'],
        ['03', 'Not enough transport', 'C', 'Calculate extra seats per time slot; check cycle times, fleet, drivers, platforms and return. Contract or schedule authorised services.', 'Adds real supply, not just information; measure confirmed seats and people moved.'],
        ['04', 'Impact on residents', 'C', 'Reserve everyday frequencies and seats first. Do not pull vehicles from regular routes without replacing them.', 'Compare waiting and occupancy with the baseline.'],
        ['05', 'Weak connections', 'C', 'Schedule airport–hotels–stadium connections and their returns. Consolidate timetables and authorised pick-up points on B01/B02 and hotel areas.', 'Check the full trip and seats per link.'],
        ['06', 'Physical accessibility', 'C', 'Audit pavements, ramps, crossings, obstacles and bus boarding. Mark verified routes, log barriers and request fixes.', 'Walk-through with users; validate barriers without promising routes that do not exist.'],
        ['08', 'Full hotels', 'C', 'Reserve rooms per night and guest with Connect; add North, Centre, Soledad and Puerto Colombia only if supply and transport are confirmed.', 'Measure contracted rooms and connection times.'],
        ['09', 'Concentrated tourism', 'C', 'Cultural and coastal circuits with timetable, capacity and return: Barrio Abajo, Centre, Malecón, Puerto Mocho, Mallorquín and Puerto Colombia.', 'Measure visitors per site without exceeding environmental limits.'],
      ],
      plan: 'Transport plan: survey origin, destination, arrival and departure slots, real capacity per trip, usual occupancy and cycle time; reserve everyday supply, calculate the reinforcement and size the return separately. The pilot studies airport → Portal de Soledad → stadium.',
      leyenda: 'Frequencies and vehicle numbers are simulated until real operating data is available. Routes, timetables and boarding points must be checked on site.',
      demoT: 'Ride each corridor',
      demo: 'Pick a service and see its path over real streets, its stops, nearby hotels and the sign a visitor would see.',
    },
    points: {
      etq: '04 · BAQ POINTS · ASSIST',
      titulo: 'Reuse existing venues and build modules only where coverage is missing',
      lead: 'Showing where a service is is not enough: the point must actually offer it and have a responsible operator.',
      niveles: [
        ['BASIC', 'Information', 'Sign, map, QR code and bilingual guide.', 'Hotels, restaurants, museums and shops.', 'Low relative cost'],
        ['PLUS', 'Services', 'Assistance and available services: water, toilets, shade, rest and waste sorting.', 'Stations, stadium, Malecón and tourist sites.', 'Medium relative cost'],
        ['SMART', 'Continuity', 'Digital terminal, communication and backup for critical functions, plus physical signage.', 'Airport, Portal de Soledad and high-demand hubs.', 'Variable cost'],
      ],
      ubic: 'Candidate location',
      inv: 'Investment',
      mecT: 'Inclusion, wellbeing and commerce',
      mec: [
        ['12', 'Language', 'D', 'ES/EN maps and assistance, pictograms, transport guide and human help at the airport, hotels, stations and tourist sites.', 'Test understanding in both languages.'],
        ['13', 'Digital exclusion', 'D', 'Printed directories, physical signs and human guidance. QR codes are complementary, never required.', 'Test with the phone switched off.'],
        ['14', 'Unknown services', 'D', 'A sheet for every Point with code, hours, services, accessibility, status and last check, published on the map.', 'Compare the sheet with the actual service.'],
        ['15', 'Heat and rest', 'C', 'Shade and rest at stations, the stadium and tourist sites; coordinate hydration and health protocols.', 'Check conditions, capacity and availability. It does not remove heat risk.'],
        ['16', 'Not enough toilets', 'C', 'Agree toilets in venues with access, hours, cleaning, capacity and accessibility.', 'Measure availability and queues; close the sheet if it does not work.'],
        ['17', 'Drinking water', 'C', 'Identify drinking sources, restocking, hygiene and dispensing capacity at the stadium, Malecón and transport hubs.', 'Check litres available and restocking, not just the dispenser.'],
        ['18', 'Waste', 'C', 'Bins in eating areas, away from evacuation routes; white/black/green sorting and collection sized with the provider.', 'Measure volume or weight and frequency.'],
        ['10', 'Low-visibility commerce', 'D', 'Link voluntary businesses in Barrio Abajo, Centre, Malecón and the coast, with a sheet of hours, prices and services.', 'Measure active businesses, queries and visits; sales are not guaranteed.'],
      ],
      nota: 'Every point has an identified operator, a current sheet, a BP-xxx code, location, hours, listed services, verifiable capacity, someone responsible for cleaning and updates, and an incident procedure. A BAQ Point is not a medical or police post.',
    },
    connect: {
      etq: '05 · BAQ CONNECT · MANAGE',
      titulo: 'Identify needs, turn shortfalls into actions and verify them',
      lead: 'Free supply = max(0, operating capacity − usual reserve − non-duplicated commitments). Gap = max(0, extraordinary demand − free supply). Missing data is marked "pending": zero is never used and sufficiency is never claimed.',
      mecT: 'Information, decisions and safety',
      mec: [
        ['07', 'Scattered hotel information', 'D', 'Records per venue, night, rooms, beds, bookings and source, without duplicates. Hotel desk and dashboard.', 'Compare records with confirmed rooms.'],
        ['11', 'Investment without evidence', 'D', 'Compare using what exists, contracting reinforcement or building: total cost, extra capacity, maintenance and legacy.', 'Compare cost per seat, room or service.'],
        ['19', 'Power cuts', 'C', 'Inventory critical loads, UPS, generator and autonomy; tests with providers and hub managers.', 'Measure autonomy and switchover.'],
        ['20', 'Internet outages', 'C', 'Downloadable maps, local records, physical signs and redundant communication; show the date of the latest data.', 'Test offline.'],
        ['24', 'Late decisions', 'D', 'Open one action per gap with owner, resource, budget, deadline, status, approval and evidence.', 'Measure confirmed and verified actions.'],
        ['21', 'Rain and flooding', 'C', 'Log closures and affected areas; consult Risk Management and Traffic; publish only authorised alternatives.', 'Simulate a closure and validate communication.'],
        ['22', 'Safety and crowds', 'C', 'Authorised capacities, entrances, lighting, safe crossings and meeting points; official notices in Connect and on signs.', 'Check the approved plan, clarity and capacity.'],
        ['23', 'Access to emergencies', 'C', 'Points directs people to Health, Police or Fire services; Connect keeps a directory of confirmed resources.', 'Test referral without simulating a real dispatch.'],
      ],
      casoT: 'Simulation case: an event with 65,000 attendees',
      cab: ['Service', 'Demand', 'Free supply*', 'Gap', 'Action'],
      filas: [
        ['Transport (outbound)', '42,250 seats', '30,800', '11,450', '82 trips equivalent to 140 seats'],
        ['Lodging', '10,000 rooms', '7,200', '2,800', 'Contract rooms and connection'],
        ['Waste', '32.5 t', '25 t', '7.5 t', 'Reinforce collection'],
        ['Drinking water', '65,000 L', 'No data', 'Pending', 'Request capacity'],
      ],
      estados: 'Action states: pending → under assessment → approved → confirmed → verified. Approved does not mean carried out.',
      nota: '*Simulated supply. Illustrative assumptions: 65 % use public transport; 20,000 guests, two per room; 0.5 kg of waste and 1 L of water per attendee. The return trip is calculated separately and 82 trips are not 82 buses. Safety decisions belong to the authorities.',
    },
    flujo: {
      etq: '06 · HOW IT WORKS',
      titulo: 'The operating cycle that makes the solution work',
      lead: 'It repeats for every event and improves with what is learned.',
      pasos: [
        ['Register', 'Each operator reports capacity, usual demand, commitments, source and date.'],
        ['Size', 'Connect calculates extraordinary demand and compares it with free supply; missing information stays pending.'],
        ['Decide', 'The operations desk compares alternatives and assigns owner, cost and deadline. Operators authorise and confirm resources.'],
        ['Execute and communicate', 'Routes publishes real connections and Points enables services. Unconfirmed alternatives are never published.'],
        ['Verify', 'Times, seats, services and costs are checked against the baseline and the plan is adjusted for the next event.'],
      ],
      nota: 'Economy: use what exists (signage, maps, training), reinforce (drivers, vehicles, water, cleaning, staff) and build only if a gap persists. Gross business income is not net benefit or fiscal return.',
    },
    cierre: {
      titulo: 'Prepare the city, not just the stadium.',
      lema: 'Sprint 2 build → Sprint 3 validate → territorial pilot → scale up.',
      etapas: [
        ['Sprint 2 · build', 'Navigable MVP, signage set, first Point, script and logged tests; preliminary costs.'],
        ['Sprint 3 · validate', 'User testing, review of results, fixes and backlog.'],
        ['Territorial pilot', 'Permits, owners, real inventories, budget and agreed service thresholds.'],
        ['Scale up', 'Proven results, funded maintenance and coverage by corridor according to demand.'],
      ],
      nota: 'QUIJAM 2034 is a hypothetical scenario. The Metropolitano stays at 65,000 seats. Locations, costs and agreements are preliminary; proposed partners have no confirmed agreements or funding. Source: Barranquilla 360 · Sprint 2 · Operating plan and prototype (26/11/2026).',
    },
  },
  pt: {
    tipos: { D: 'DIRETA', C: 'CONDICIONADA' },
    comprobar: 'Por quê / como verificar',
    dx: {
      etq: '01 · O PROBLEMA',
      titulo: 'A demanda extraordinária pode superar a capacidade disponível',
      lead: 'Barranquilla 360 prepara a cidade para receber grandes eventos sem prejudicar a operação cotidiana. Não é um aplicativo isolado nem uma ampliação obrigatória do estádio: combina capacidade real de transporte, serviços físicos de proximidade e gestão de recursos com dados verificáveis.',
      cols: [
        ['Problema central', 'O risco de a demanda extraordinária superar a capacidade operacional disponível.'],
        ['24 problemas', 'São necessidades e riscos a tratar, não 24 falhas atuais comprovadas.'],
        ['Legado', 'A Copa do Mundo é o cenário hipotético do desafio; o legado também deve servir ao Carnaval, jogos, shows e congressos.'],
      ],
      n: '100 %',
      nTxt: 'Ocupação hoteleira relatada na final da Sul-Americana 2026, antecedente de pressão usado no diagnóstico.',
      nNota: 'Não demonstra que todos os outros serviços entraram em colapso.',
      obj: 'O valor do programa é ligar cada déficit a uma intervenção física, financiada e verificável.',
    },
    pilares: {
      etq: '02 · PROPOSTA DE VALOR',
      titulo: 'Uma rede, três responsabilidades',
      lead: 'Cada pilar implementa algo concreto e tem definido o que recebe e o que entrega aos outros dois.',
      items: [
        ['BAQ ROUTES', 'Distribuir', 'Corredores, sinalização, conexões autorizadas, reforços e hospedagem conectada.', 'Recebe o plano aprovado; publica conexões e devolve tempos, ocupação e barreiras.'],
        ['BAQ POINTS', 'Atender', 'Rede de estabelecimentos e módulos com informação, água, banheiros, descanso e assistência conforme disponibilidade.', 'Recebe demanda e localizações; devolve disponibilidade, incidentes e necessidades de reposição.'],
        ['BAQ CONNECT', 'Gerir', 'Inventário de capacidades, simulação por faixa horária e ações com responsável, custo e evidência.', 'Recebe dados dos operadores; entrega lacunas e reforços confirmados a Routes e Points.'],
      ],
      total: 'Uma placa não cria vagas, um alerta não produz água e uma plataforma não substitui as autoridades.',
      totalNota: 'D = mecanismo direto de desenho; C = intervenção condicionada a capacidade, acordos ou licenças. D não significa problema já resolvido.',
    },
    routes: {
      etq: '03 · BAQ ROUTES · DISTRIBUIR',
      titulo: 'Organizar a demanda e somar capacidade de transporte quando necessário',
      lead: 'Uma identidade visual contínua para que o visitante reconheça sua conexão sem depender do celular: cor + código + destino + pictograma, em ES/EN. A cor não indica congestionamento nem substitui a sinalização oficial.',
      mecT: 'Mobilidade, território e turismo',
      mec: [
        ['01', 'Desorientação', 'D', 'Diretórios na saída do aeroporto, placas antes das curvas e confirmações após as baldeações. Códigos repetidos em mapas e veículos autorizados.', 'Evita decisões erradas; comparar tempo e erros com e sem sinalização.'],
        ['02', 'Congestionamento', 'C', 'Escalonar chegadas; agrupar embarques fora das faixas de circulação; avaliar Park & Ride e lançadeiras na Murillo, Calle 30 e Circunvalar.', 'Medir tempos, filas e ocupação antes de aprovar.'],
        ['03', 'Transporte insuficiente', 'C', 'Calcular vagas adicionais por faixa; verificar tempos de ciclo, frota, motoristas, plataformas e retorno. Contratar ou programar serviços autorizados.', 'Acrescenta oferta real, não só informação; medir vagas confirmadas e pessoas transportadas.'],
        ['04', 'Impacto nos moradores', 'C', 'Reservar primeiro as frequências e vagas da demanda cotidiana. Não retirar veículos das linhas habituais sem reposição.', 'Comparar espera e ocupação com a linha de base.'],
        ['05', 'Conexões fracas', 'C', 'Programar conexões aeroporto–hotéis–estádio e seus retornos. Consolidar horários e pontos de embarque autorizados em B01/B02 e zonas hoteleiras.', 'Verificar a viagem completa e as vagas por conexão.'],
        ['06', 'Acessibilidade física', 'C', 'Auditar calçadas, rampas, travessias, obstáculos e embarque no ônibus. Marcar rotas verificadas, registrar barreiras e pedir adequações.', 'Percurso com usuários; validar barreiras sem prometer rotas inexistentes.'],
        ['08', 'Saturação hoteleira', 'C', 'Reservar vagas por noite e hóspede com o Connect; incluir Norte, Centro, Soledad e Puerto Colombia só se oferta e transporte estiverem confirmados.', 'Medir quartos contratados e tempos de conexão.'],
        ['09', 'Turismo concentrado', 'C', 'Circuitos culturais e costeiros com horário, lotação e retorno: Barrio Abajo, Centro, Malecón, Puerto Mocho, Mallorquín e Puerto Colombia.', 'Medir a afluência por local sem superar limites ambientais.'],
      ],
      plan: 'Plano de transporte: levantar origem, destino, faixas de chegada e saída, capacidade real por viagem, ocupação habitual e tempo de ciclo; reservar a oferta cotidiana, calcular o reforço e dimensionar o retorno separadamente. O piloto estuda aeroporto → Portal de Soledad → estádio.',
      leyenda: 'Frequências e número de veículos serão simulados até haver informação operacional real. Rotas, horários e pontos de embarque devem ser verificados em campo.',
      demoT: 'Percorra cada corredor',
      demo: 'Escolha um serviço e veja o traçado sobre ruas reais, as paradas, os hotéis próximos e a placa que o visitante veria.',
    },
    points: {
      etq: '04 · BAQ POINTS · ATENDER',
      titulo: 'Reaproveitar estabelecimentos e construir módulos só onde faltar cobertura',
      lead: 'Não basta mostrar onde há um serviço: o ponto precisa oferecê-lo de fato e ter um operador responsável.',
      niveles: [
        ['BASIC', 'Informação', 'Placa, mapa, QR e guia bilíngue.', 'Hotéis, restaurantes, museus e comércios.', 'Custo relativo baixo'],
        ['PLUS', 'Serviços', 'Atendimento e serviços disponíveis: água, banheiros, sombra, descanso e separação de resíduos.', 'Estações, estádio, Malecón e pontos turísticos.', 'Custo relativo médio'],
        ['SMART', 'Continuidade', 'Terminal digital, comunicação e backup das funções críticas, além de sinalização física.', 'Aeroporto, Portal de Soledad e nós de alta demanda.', 'Custo variável'],
      ],
      ubic: 'Local candidato',
      inv: 'Investimento',
      mecT: 'Inclusão, bem-estar e comércio',
      mec: [
        ['12', 'Idioma', 'D', 'Mapas e atendimento ES/EN, pictogramas, guia de transporte e ajuda humana no aeroporto, hotéis, estações e pontos turísticos.', 'Testar a compreensão nos dois idiomas.'],
        ['13', 'Exclusão digital', 'D', 'Diretórios impressos, placas físicas e orientação humana. O QR é complementar, nunca obrigatório.', 'Testar com o celular desligado.'],
        ['14', 'Serviços desconhecidos', 'D', 'Ficha de cada Point com código, horários, serviços, acessibilidade, estado e última verificação, publicada no mapa.', 'Comparar a ficha com o serviço real.'],
        ['15', 'Calor e descanso', 'C', 'Sombra e descanso em estações, estádio e pontos turísticos; coordenar hidratação e protocolos de saúde.', 'Verificar condições, lotação e disponibilidade. Não elimina o risco térmico.'],
        ['16', 'Banheiros insuficientes', 'C', 'Acordar banheiros em estabelecimentos com acesso, horário, limpeza, capacidade e acessibilidade.', 'Medir disponibilidade e fila; fechar a ficha se não funcionar.'],
        ['17', 'Água potável', 'C', 'Identificar fontes potáveis, reposição, higiene e capacidade de distribuição no estádio, Malecón e nós de transporte.', 'Verificar litros disponíveis e reposição, não só o bebedouro.'],
        ['18', 'Resíduos', 'C', 'Recipientes nas áreas de consumo, fora das rotas de evacuação; separação branco/preto/verde e coleta dimensionada com o prestador.', 'Medir volume ou peso e frequência.'],
        ['10', 'Comércio pouco visível', 'D', 'Vincular negócios voluntários em Barrio Abajo, Centro, Malecón e litoral com ficha de horários, preços e serviços.', 'Medir comércios ativos, consultas e visitas; não garante vendas.'],
      ],
      nota: 'Todo ponto tem operador identificado, ficha vigente, código BP-xxx, localização, horário, serviços anunciados, capacidade verificável, responsável por limpeza e atualização e procedimento de incidentes. Um BAQ Point não é posto médico nem policial.',
    },
    connect: {
      etq: '05 · BAQ CONNECT · GERIR',
      titulo: 'Identificar necessidades, transformar déficits em ações e verificá-las',
      lead: 'Oferta livre = máximo(0, capacidade operacional − reserva habitual − compromissos não duplicados). Lacuna = máximo(0, demanda extraordinária − oferta livre). Se faltar um dado, ele fica «pendente»: não se usa zero nem se afirma suficiência.',
      mecT: 'Informação, decisões e segurança',
      mec: [
        ['07', 'Informação hoteleira dispersa', 'D', 'Registro por estabelecimento, noite, quartos, camas, reservas e fonte, sem duplicados. Mesa hoteleira e painel.', 'Comparar registros com vagas confirmadas.'],
        ['11', 'Investimentos sem evidência', 'D', 'Comparar aproveitar, contratar reforço ou construir: custo total, capacidade adicional, manutenção e legado.', 'Comparar custo por vaga, quarto ou serviço.'],
        ['19', 'Quedas de energia', 'C', 'Inventariar cargas críticas, nobreak, gerador e autonomia; testes com prestadores e responsáveis dos nós.', 'Medir autonomia e transferência.'],
        ['20', 'Falhas de internet', 'C', 'Mapas para baixar, registros locais, sinalização física e comunicação redundante; mostrar a data do último dado.', 'Testar sem conexão.'],
        ['24', 'Decisões tardias', 'D', 'Abrir uma ação por lacuna com responsável, recurso, orçamento, prazo, estado, aprovação e evidência.', 'Medir ações confirmadas e verificadas.'],
        ['21', 'Chuvas e inundações', 'C', 'Registrar fechamentos e áreas afetadas; consultar a Gestão de Risco e o Trânsito; publicar só alternativas autorizadas.', 'Simular um fechamento e validar a comunicação.'],
        ['22', 'Segurança e aglomerações', 'C', 'Lotações autorizadas, acessos, iluminação, travessias seguras e pontos de encontro; avisos oficiais no Connect e na sinalização.', 'Verificar plano aprovado, clareza e capacidade.'],
        ['23', 'Acesso a emergências', 'C', 'Points orienta para Saúde, Polícia ou Bombeiros; o Connect mantém diretório e recursos confirmados.', 'Testar o encaminhamento sem simular um despacho real.'],
      ],
      casoT: 'Caso de simulação: evento com 65.000 pessoas',
      cab: ['Serviço', 'Demanda', 'Oferta livre*', 'Lacuna', 'Ação'],
      filas: [
        ['Transporte (ida)', '42.250 vagas', '30.800', '11.450', '82 viagens equivalentes a 140 vagas'],
        ['Hospedagem', '10.000 quartos', '7.200', '2.800', 'Contratar vagas e conexão'],
        ['Resíduos', '32,5 t', '25 t', '7,5 t', 'Reforçar a coleta'],
        ['Água de consumo', '65.000 L', 'Sem dado', 'Pendente', 'Pedir capacidade'],
      ],
      estados: 'Estados da ação: pendente → em avaliação → aprovado → confirmado → verificado. Aprovado não significa executado.',
      nota: '*Ofertas simuladas. Premissas ilustrativas: 65 % usam transporte coletivo; 20.000 hóspedes, dois por quarto; 0,5 kg de resíduos e 1 L de água por pessoa. O retorno é calculado separadamente e 82 viagens não são 82 ônibus. A decisão de segurança cabe às autoridades.',
    },
    flujo: {
      etq: '06 · FUNCIONAMENTO',
      titulo: 'O ciclo operacional que faz a solução funcionar',
      lead: 'Repete-se a cada evento e melhora com o aprendizado.',
      pasos: [
        ['Registrar', 'Cada operador informa capacidade, demanda habitual, compromissos, fonte e data.'],
        ['Dimensionar', 'O Connect calcula a demanda extraordinária e a compara com a oferta livre; se faltar informação, fica pendente.'],
        ['Decidir', 'A mesa operacional compara alternativas e define responsável, custo e prazo. Os operadores autorizam e confirmam recursos.'],
        ['Executar e comunicar', 'Routes publica conexões reais e Points habilita serviços. Alternativas não confirmadas não são publicadas.'],
        ['Verificar', 'Tempos, vagas, serviços e custos são comparados com a linha de base e o plano é ajustado para o próximo evento.'],
      ],
      nota: 'Economia: aproveitar (sinalização, mapas, capacitação), reforçar (motoristas, veículos, água, limpeza, pessoal) e construir só se a lacuna persistir. A receita bruta dos negócios não equivale a benefício líquido nem a retorno fiscal.',
    },
    cierre: {
      titulo: 'Preparar a cidade, não só o estádio.',
      lema: 'Sprint 2 construir → Sprint 3 validar → piloto territorial → escalar.',
      etapas: [
        ['Sprint 2 · construir', 'MVP navegável, placas, Point inicial, roteiro e testes registrados; custos preliminares.'],
        ['Sprint 3 · validar', 'Testes com usuários, revisão de resultados, correções e backlog.'],
        ['Piloto territorial', 'Licenças, responsáveis, inventários reais, orçamento e limites de serviço acordados.'],
        ['Escalar', 'Resultados comprovados, manutenção financiada e cobertura por corredores conforme a demanda.'],
      ],
      nota: 'QUIJAM 2034 é um cenário hipotético. O Metropolitano mantém 65.000 lugares. Locais, custos e acordos são preliminares; os atores propostos não têm convênios nem financiamento confirmados. Fonte: Barranquilla 360 · Sprint 2 · Plano operacional e protótipo (26/11/2026).',
    },
  },
};

let corredores = [];

const etq = (t) => `<p class="p-etq">${t}</p>`;
const cab = (e, t, l) => `<div class="p-cab">${etq(e)}<h2>${t}</h2>${l ? `<p class="p-lead">${l}</p>` : ''}</div>`;
const poner = (id, html) => {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
};

const tarjetasProblema = (lista, x) =>
  `<div class="p-mec">${lista
    .map(
      ([id, t, tipo, d, w]) =>
        `<div class="p-card"><span class="p-tipo ${tipo === 'D' ? 'dir' : 'cond'}">${id} · ${x.tipos[tipo]}</span><h3>${t}</h3><p>${d}</p><small><b>${x.comprobar}:</b> ${w}</small></div>`,
    )
    .join('')}</div>`;

export function pintarPropuesta() {
  const x = TEXTO[getIdioma()] || TEXTO.es;
  const { dx, pilares, routes, points, connect, flujo, cierre } = x;

  poner(
    'p-dx',
    `${cab(dx.etq, dx.titulo, dx.lead)}
    <div class="p-dx">
      <div class="p-cols">${dx.cols.map(([t, d]) => `<div class="p-card"><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
      <div class="p-stat"><b>${dx.n}</b><p>${dx.nTxt}</p><small>${dx.nNota}</small></div>
    </div>
    <p class="p-obj">${dx.obj}</p>`,
  );

  poner(
    'p-pilares',
    `${cab(pilares.etq, pilares.titulo, pilares.lead)}
    <div class="p-tres">${pilares.items
      .map(
        ([n, v, d, p], i) =>
          `<article class="p-pilar p-pilar-${i + 1}"><span class="p-nom">${n}</span><h3>${v}</h3><p>${d}</p><small>${p}</small></article>`,
      )
      .join('')}</div>
    <p class="p-total">${pilares.total}</p><p class="p-nota">${pilares.totalNota}</p>`,
  );

  poner(
    'p-routes',
    `${cab(routes.etq, routes.titulo, routes.lead)}
    <div class="p-corr">${corredores
      .map(
        (c) =>
          `<div class="p-corr-i"><span class="p-cod" style="background:${c.color};color:${c.texto}">${c.codigo}</span>
          <div><b>${c.nombre.es} / ${c.nombre.en}</b><small>${c.vias}</small></div></div>`,
      )
      .join('')}</div>
    <h3 class="p-sub">${routes.mecT}</h3>
    ${tarjetasProblema(routes.mec, x)}
    <p class="p-total">${routes.plan}</p>
    <p class="p-nota">${routes.leyenda}</p>
    <div class="p-demo"><h3>${routes.demoT}</h3><p>${routes.demo}</p></div>`,
  );

  poner(
    'p-points',
    `${cab(points.etq, points.titulo, points.lead)}
    <div class="p-tres">${points.niveles
      .map(
        ([n, t, d, u, i]) =>
          `<article class="p-pilar p-nivel"><span class="p-nom">BAQ POINT / ${n}</span><h3>${t}</h3><p>${d}</p>
          <small><b>${points.ubic}:</b> ${u}</small><small><b>${points.inv}:</b> ${i}</small></article>`,
      )
      .join('')}</div>
    <h3 class="p-sub">${points.mecT}</h3>
    ${tarjetasProblema(points.mec, x)}
    <p class="p-nota">${points.nota}</p>`,
  );

  poner(
    'p-connect',
    `${cab(connect.etq, connect.titulo, connect.lead)}
    <h3 class="p-sub">${connect.mecT}</h3>
    ${tarjetasProblema(connect.mec, x)}
    <h3 class="p-sub">${connect.casoT}</h3>
    <div class="p-tabla" role="region" tabindex="0" aria-label="${connect.titulo}"><table>
      <thead><tr>${connect.cab.map((c) => `<th scope="col">${c}</th>`).join('')}</tr></thead>
      <tbody>${connect.filas.map((f) => `<tr>${f.map((c, i) => (i ? `<td>${c}</td>` : `<th scope="row">${c}</th>`)).join('')}</tr>`).join('')}</tbody>
    </table></div>
    <p class="p-total">${connect.estados}</p><p class="p-nota">${connect.nota}</p>`,
  );

  poner(
    'p-flujo',
    `${cab(flujo.etq, flujo.titulo, flujo.lead)}
    <ol class="p-pasos p-cinco">${flujo.pasos.map(([t, d], i) => `<li><span class="n">${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
    <p class="p-nota">${flujo.nota}</p>`,
  );

  poner(
    'p-cierre',
    `<h2>${cierre.titulo}</h2><p class="p-lema">${cierre.lema}</p>
    <ol class="p-pasos p-etapas">${cierre.etapas.map(([t, d], i) => `<li><span class="n">${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
    <p class="p-nota">${cierre.nota}</p>`,
  );
}

export async function iniciarPropuesta() {
  try {
    corredores = (await cargarJSON('data/corredores.json')).corredores;
  } catch {
    corredores = [];
  }
  pintarPropuesta();
  document.addEventListener('idioma-cambiado', pintarPropuesta);
}
