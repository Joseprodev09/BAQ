/**
 * Secciones explicativas de la propuesta de valor Barranquilla 360
 * (basadas en la presentación del Sprint 2). Se pintan en los contenedores
 * #p-* de index.html y se repintan al cambiar de idioma.
 * Los textos son propios del proyecto (no vienen de datos externos).
 */
import { cargarJSON } from './utils.js';
import { getIdioma } from './idioma.js';

const TEXTO = {
  es: {
    dx: {
      etq: '01 · EL DESAFÍO',
      titulo: 'El desafío es la capacidad de la ciudad',
      lead: 'La llegada simultánea de visitantes puede superar la oferta habitual de servicios.',
      cols: [
        ['Causas a validar', 'Viajes concentrados, oferta limitada en picos, información dispersa y barreras de idioma y acceso.'],
        ['Problema central', 'Desajuste entre una demanda extraordinaria y la capacidad urbana disponible.'],
        ['Consecuencias', 'Congestión, saturación hotelera, dificultades de atención y deterioro de servicios para los residentes.'],
      ],
      n: '100 %',
      nTxt: 'Ocupación hotelera reportada durante la final Sudamericana 2026.',
      nNota: 'Evidencia de presión en alojamiento; no demuestra saturación de todos los sistemas.',
      obj: 'Objetivo: atender grandes eventos sin perjudicar la operación cotidiana.',
    },
    pilares: {
      etq: '02 · PROPUESTA DE VALOR',
      titulo: 'Una red urbana, tres responsabilidades',
      lead: 'No es una aplicación aislada ni tres proyectos separados.',
      items: [
        ['BAQ ROUTES', 'Distribuir', 'Conecta destinos y organiza la movilidad, el alojamiento y el turismo.', 'Mapa + señalización + plan de transporte'],
        ['BAQ POINTS', 'Atender', 'Acerca servicios de información, bienestar, asistencia y comercio local.', 'Red de establecimientos + módulos'],
        ['BAQ CONNECT', 'Gestionar', 'Anticipa déficits, compara alternativas y coordina refuerzos verificables.', 'Inventario + simulador + acciones'],
      ],
      total: '24 problemáticas abordadas · 8 mecanismos directos · 16 intervenciones condicionadas',
      totalNota: 'Alcance de las respuestas propuestas; no representa problemas solucionados.',
    },
    routes: {
      etq: '03 · BAQ ROUTES · DISTRIBUIR',
      titulo: 'Cinco corredores con una identidad común',
      lead: 'Color + código + destino + pictograma. La señalización orienta; la capacidad real se consigue con operación de transporte, y el color no sustituye las señales oficiales.',
      mecT: 'Mover más personas sin afectar a los residentes',
      mec: [
        ['Desorientación urbana', 'DIRECTA', 'Códigos, colores, mapas bilingües y señales antes y después de cada decisión.', 'Aeropuerto, estaciones, hoteles y cruces.'],
        ['Congestión en horas pico', 'CONDICIONADA', 'Llegadas escalonadas, lanzaderas, recogidas agrupadas y Park & Ride evaluado.', 'Murillo, Calle 30 y Circunvalar.'],
        ['Transporte insuficiente', 'CONDICIONADA', 'Calcular plazas por franja y contratar refuerzos con vehículos y conductores confirmados.', 'Transmetro y servicios autorizados.'],
        ['Presión sobre residentes', 'CONDICIONADA', 'Reservar la oferta habitual; medir espera y ocupación antes de añadir servicios especiales.', 'Estaciones y rutas de uso diario.'],
      ],
      dnde: 'Dónde',
      leyenda: 'Directa: mecanismo diseñado por el programa · Condicionada: exige recursos, operadores y permisos.',
      demoT: 'Recorre cada corredor',
      demo: 'Elige un servicio y mira su trazado sobre calles reales, sus paradas, los hoteles cercanos y la señal que vería el visitante.',
    },
    points: {
      etq: '04 · BAQ POINTS · ATENDER',
      titulo: 'Tres niveles de atención, no un módulo para todo',
      lead: 'Una red de atención física complementa los mapas digitales. Cada punto tiene operador, horario, servicios, capacidad y mantenimiento.',
      niveles: [
        ['BASIC', 'Información', 'Cartel + mapa + QR + guía bilingüe.', 'Hoteles, restaurantes, museos y comercios.', 'Baja'],
        ['PLUS', 'Bienestar', 'Atención, agua, baños, sombra, descanso y residuos, según disponibilidad.', 'Estadio, Malecón, parques y zonas turísticas.', 'Media'],
        ['SMART', 'Continuidad', 'Terminal digital, comunicación, respaldo y guía física.', 'Aeropuerto, Portal de Soledad y nodos de alta demanda.', 'Variable'],
      ],
      ubic: 'Ubicación candidata',
      inv: 'Inversión relativa',
      nota: 'Solo se anuncian servicios habilitados; no se sustituyen Policía, Bomberos ni Salud. Nombres y niveles son propuestas.',
    },
    connect: {
      etq: '05 · BAQ CONNECT · GESTIONAR',
      titulo: 'Cada déficit se convierte en una decisión',
      lead: 'Medir capacidad antes de comprometer recursos. Oferta libre = capacidad operativa − reserva habitual − compromisos no duplicados.',
      cab: ['Servicio', 'Demanda', 'Oferta libre', 'Brecha', 'Respuesta propuesta'],
      filas: [
        ['Transporte (ida)', '42.250 plazas', '30.800 plazas', '11.450', '82 viajes equivalentes de refuerzo'],
        ['Alojamiento', '10.000 hab.', '7.200 hab.', '2.800', 'Cupos y enlaces confirmados'],
        ['Residuos', '32,5 t', '25 t', '7,5 t', 'Capacidad y turnos extra'],
        ['Agua de consumo', '65.000 L', 'Sin dato', 'Pendiente', 'Solicitar capacidad real'],
      ],
      estados: 'Estados de cada acción: pendiente → en evaluación → aprobado → confirmado → verificado.',
      nota: 'Escenario hipotético de planificación; no son déficits medidos en Barranquilla.',
    },
    flujo: {
      etq: '06 · FUNCIONAMIENTO',
      titulo: 'Un recorrido que integra los tres pilares',
      lead: 'Ejemplo del piloto: aeropuerto → Portal de Soledad → estadio.',
      pasos: [
        ['Planificar', 'Connect dimensiona demanda, plazas y servicios.'],
        ['Orientar', 'Routes guía desde las llegadas B01 y la conexión B02.'],
        ['Atender', 'Points informa, ofrece servicios y canaliza asistencia.'],
        ['Verificar', 'Connect registra refuerzos y ajusta resultados.'],
      ],
      nota: 'El operador verifica la capacidad y ejecuta; el programa no sustituye sus competencias. Rutas y horarios deben verificarse en campo.',
    },
    cierre: {
      titulo: 'Preparar la ciudad, no solo el estadio.',
      lema: 'Aprovechar antes de construir. Medir antes de invertir. Prevenir antes de reaccionar.',
      nota: 'QUIJAM 2034 es un escenario hipotético. Ubicaciones, recursos, costos y acuerdos requieren validación. Documento maestro Barranquilla 360 v2.1 (26/11/2026) y entregables del Sprint 1.',
    },
  },
  en: {
    dx: {
      etq: '01 · THE CHALLENGE',
      titulo: "The challenge is the city's capacity",
      lead: 'Visitors arriving at the same time can exceed the usual supply of services.',
      cols: [
        ['Causes to validate', 'Concentrated trips, limited supply at peak times, scattered information, and language and access barriers.'],
        ['Core problem', 'A mismatch between extraordinary demand and the urban capacity available.'],
        ['Consequences', 'Congestion, full hotels, difficulty serving visitors and worse services for residents.'],
      ],
      n: '100 %',
      nTxt: 'Hotel occupancy reported during the 2026 Copa Sudamericana final.',
      nNota: 'Evidence of pressure on lodging; it does not show that every system was saturated.',
      obj: 'Goal: host major events without harming everyday operations.',
    },
    pilares: {
      etq: '02 · VALUE PROPOSITION',
      titulo: 'One urban network, three responsibilities',
      lead: 'Not a stand-alone app, and not three separate projects.',
      items: [
        ['BAQ ROUTES', 'Distribute', 'Connects destinations and organises mobility, lodging and tourism.', 'Map + signage + transport plan'],
        ['BAQ POINTS', 'Assist', 'Brings information, wellbeing, assistance and local commerce closer.', 'Network of venues + modules'],
        ['BAQ CONNECT', 'Manage', 'Anticipates shortfalls, compares alternatives and coordinates verifiable reinforcements.', 'Inventory + simulator + actions'],
      ],
      total: '24 problems addressed · 8 direct mechanisms · 16 conditional interventions',
      totalNota: 'Scope of the proposed responses; it does not mean the problems are solved.',
    },
    routes: {
      etq: '03 · BAQ ROUTES · DISTRIBUTE',
      titulo: 'Five corridors with a shared identity',
      lead: 'Colour + code + destination + pictogram. Signage guides people; real capacity comes from running transport, and colour does not replace official signs.',
      mecT: 'Move more people without affecting residents',
      mec: [
        ['Getting lost in the city', 'DIRECT', 'Codes, colours, bilingual maps and signs before and after every decision.', 'Airport, stations, hotels and junctions.'],
        ['Peak-hour congestion', 'CONDITIONAL', 'Staggered arrivals, shuttles, grouped pick-ups and an assessed Park & Ride.', 'Murillo, Calle 30 and Circunvalar.'],
        ['Not enough transport', 'CONDITIONAL', 'Calculate seats per time slot and contract reinforcements with confirmed vehicles and drivers.', 'Transmetro and authorised services.'],
        ['Pressure on residents', 'CONDITIONAL', 'Protect regular service; measure waiting and occupancy before adding special services.', 'Stations and everyday routes.'],
      ],
      dnde: 'Where',
      leyenda: 'Direct: mechanism designed by the programme · Conditional: needs resources, operators and permits.',
      demoT: 'Ride each corridor',
      demo: 'Pick a service and see its path over real streets, its stops, nearby hotels and the sign a visitor would see.',
    },
    points: {
      etq: '04 · BAQ POINTS · ASSIST',
      titulo: 'Three levels of service, not one module for everything',
      lead: 'A physical service network complements digital maps. Every point has an operator, hours, services, capacity and maintenance.',
      niveles: [
        ['BASIC', 'Information', 'Sign + map + QR + bilingual guide.', 'Hotels, restaurants, museums and shops.', 'Low'],
        ['PLUS', 'Wellbeing', 'Assistance, water, toilets, shade, rest and waste, depending on availability.', 'Stadium, Malecón, parks and tourist areas.', 'Medium'],
        ['SMART', 'Continuity', 'Digital terminal, communications, backup and a physical guide.', 'Airport, Portal de Soledad and high-demand hubs.', 'Variable'],
      ],
      ubic: 'Candidate location',
      inv: 'Relative investment',
      nota: 'Only enabled services are announced; Police, Fire and Health services are not replaced. Names and levels are proposals.',
    },
    connect: {
      etq: '05 · BAQ CONNECT · MANAGE',
      titulo: 'Every shortfall becomes a decision',
      lead: 'Measure capacity before committing resources. Free supply = operating capacity − usual reserve − non-duplicated commitments.',
      cab: ['Service', 'Demand', 'Free supply', 'Gap', 'Proposed response'],
      filas: [
        ['Transport (outbound)', '42,250 seats', '30,800 seats', '11,450', '82 equivalent reinforcement trips'],
        ['Lodging', '10,000 rooms', '7,200 rooms', '2,800', 'Confirmed quotas and links'],
        ['Waste', '32.5 t', '25 t', '7.5 t', 'Capacity and extra shifts'],
        ['Drinking water', '65,000 L', 'No data', 'Pending', 'Request real capacity'],
      ],
      estados: 'Status of each action: pending → under review → approved → confirmed → verified.',
      nota: 'Hypothetical planning scenario; these are not shortfalls measured in Barranquilla.',
    },
    flujo: {
      etq: '06 · HOW IT WORKS',
      titulo: 'One journey that joins the three pillars',
      lead: 'Pilot example: airport → Portal de Soledad → stadium.',
      pasos: [
        ['Plan', 'Connect sizes demand, seats and services.'],
        ['Guide', 'Routes guides people from B01 arrivals and the B02 link.'],
        ['Assist', 'Points informs, offers services and channels assistance.'],
        ['Verify', 'Connect records reinforcements and adjusts results.'],
      ],
      nota: 'The operator checks capacity and delivers; the programme does not replace its responsibilities. Routes and schedules must be checked in the field.',
    },
    cierre: {
      titulo: 'Prepare the city, not just the stadium.',
      lema: 'Use what exists before building. Measure before investing. Prevent before reacting.',
      nota: 'QUIJAM 2034 is a hypothetical scenario. Locations, resources, costs and agreements need validation. Master document Barranquilla 360 v2.1 (26/11/2026) and Sprint 1 deliverables.',
    },
  },
  pt: {
    dx: {
      etq: '01 · O DESAFIO',
      titulo: 'O desafio é a capacidade da cidade',
      lead: 'A chegada simultânea de visitantes pode superar a oferta habitual de serviços.',
      cols: [
        ['Causas a validar', 'Viagens concentradas, oferta limitada nos picos, informação dispersa e barreiras de idioma e acesso.'],
        ['Problema central', 'Descompasso entre uma demanda extraordinária e a capacidade urbana disponível.'],
        ['Consequências', 'Congestionamento, hotéis lotados, dificuldade de atendimento e piora dos serviços para os moradores.'],
      ],
      n: '100 %',
      nTxt: 'Ocupação hoteleira registrada durante a final da Sul-Americana 2026.',
      nNota: 'Evidência de pressão na hospedagem; não demonstra saturação de todos os sistemas.',
      obj: 'Objetivo: receber grandes eventos sem prejudicar a operação cotidiana.',
    },
    pilares: {
      etq: '02 · PROPOSTA DE VALOR',
      titulo: 'Uma rede urbana, três responsabilidades',
      lead: 'Não é um aplicativo isolado nem três projetos separados.',
      items: [
        ['BAQ ROUTES', 'Distribuir', 'Conecta destinos e organiza a mobilidade, a hospedagem e o turismo.', 'Mapa + sinalização + plano de transporte'],
        ['BAQ POINTS', 'Atender', 'Aproxima serviços de informação, bem-estar, assistência e comércio local.', 'Rede de estabelecimentos + módulos'],
        ['BAQ CONNECT', 'Gerir', 'Antecipa déficits, compara alternativas e coordena reforços verificáveis.', 'Inventário + simulador + ações'],
      ],
      total: '24 problemas abordados · 8 mecanismos diretos · 16 intervenções condicionadas',
      totalNota: 'Alcance das respostas propostas; não significa que os problemas estejam resolvidos.',
    },
    routes: {
      etq: '03 · BAQ ROUTES · DISTRIBUIR',
      titulo: 'Cinco corredores com uma identidade comum',
      lead: 'Cor + código + destino + pictograma. A sinalização orienta; a capacidade real vem da operação de transporte, e a cor não substitui a sinalização oficial.',
      mecT: 'Mover mais pessoas sem afetar os moradores',
      mec: [
        ['Desorientação urbana', 'DIRETA', 'Códigos, cores, mapas bilíngues e sinais antes e depois de cada decisão.', 'Aeroporto, estações, hotéis e cruzamentos.'],
        ['Congestionamento nos picos', 'CONDICIONADA', 'Chegadas escalonadas, vans, embarques agrupados e Park & Ride avaliado.', 'Murillo, Calle 30 e Circunvalar.'],
        ['Transporte insuficiente', 'CONDICIONADA', 'Calcular lugares por faixa horária e contratar reforços com veículos e motoristas confirmados.', 'Transmetro e serviços autorizados.'],
        ['Pressão sobre os moradores', 'CONDICIONADA', 'Reservar a oferta habitual; medir espera e ocupação antes de acrescentar serviços especiais.', 'Estações e rotas de uso diário.'],
      ],
      dnde: 'Onde',
      leyenda: 'Direta: mecanismo desenhado pelo programa · Condicionada: exige recursos, operadores e licenças.',
      demoT: 'Percorra cada corredor',
      demo: 'Escolha um serviço e veja seu traçado sobre ruas reais, suas paradas, os hotéis próximos e o sinal que o visitante veria.',
    },
    points: {
      etq: '04 · BAQ POINTS · ATENDER',
      titulo: 'Três níveis de atendimento, não um módulo para tudo',
      lead: 'Uma rede de atendimento físico complementa os mapas digitais. Cada ponto tem operador, horário, serviços, capacidade e manutenção.',
      niveles: [
        ['BASIC', 'Informação', 'Cartaz + mapa + QR + guia bilíngue.', 'Hotéis, restaurantes, museus e comércios.', 'Baixa'],
        ['PLUS', 'Bem-estar', 'Atendimento, água, banheiros, sombra, descanso e resíduos, conforme a disponibilidade.', 'Estádio, Malecón, parques e zonas turísticas.', 'Média'],
        ['SMART', 'Continuidade', 'Terminal digital, comunicação, reserva de energia e guia físico.', 'Aeroporto, Portal de Soledad e nós de alta demanda.', 'Variável'],
      ],
      ubic: 'Local candidato',
      inv: 'Investimento relativo',
      nota: 'Só se anunciam serviços habilitados; não se substituem Polícia, Bombeiros nem Saúde. Nomes e níveis são propostas.',
    },
    connect: {
      etq: '05 · BAQ CONNECT · GERIR',
      titulo: 'Cada déficit vira uma decisão',
      lead: 'Medir a capacidade antes de comprometer recursos. Oferta livre = capacidade operacional − reserva habitual − compromissos não duplicados.',
      cab: ['Serviço', 'Demanda', 'Oferta livre', 'Lacuna', 'Resposta proposta'],
      filas: [
        ['Transporte (ida)', '42.250 lugares', '30.800 lugares', '11.450', '82 viagens equivalentes de reforço'],
        ['Hospedagem', '10.000 quartos', '7.200 quartos', '2.800', 'Cotas e vínculos confirmados'],
        ['Resíduos', '32,5 t', '25 t', '7,5 t', 'Capacidade e turnos extras'],
        ['Água potável', '65.000 L', 'Sem dado', 'Pendente', 'Solicitar capacidade real'],
      ],
      estados: 'Estados de cada ação: pendente → em avaliação → aprovado → confirmado → verificado.',
      nota: 'Cenário hipotético de planejamento; não são déficits medidos em Barranquilla.',
    },
    flujo: {
      etq: '06 · FUNCIONAMENTO',
      titulo: 'Um percurso que integra os três pilares',
      lead: 'Exemplo do piloto: aeroporto → Portal de Soledad → estádio.',
      pasos: [
        ['Planejar', 'O Connect dimensiona demanda, lugares e serviços.'],
        ['Orientar', 'O Routes guia desde as chegadas B01 e a conexão B02.'],
        ['Atender', 'O Points informa, oferece serviços e encaminha assistência.'],
        ['Verificar', 'O Connect registra reforços e ajusta resultados.'],
      ],
      nota: 'O operador verifica a capacidade e executa; o programa não substitui suas competências. Rotas e horários devem ser verificados em campo.',
    },
    cierre: {
      titulo: 'Preparar a cidade, não só o estádio.',
      lema: 'Aproveitar antes de construir. Medir antes de investir. Prevenir antes de reagir.',
      nota: 'QUIJAM 2034 é um cenário hipotético. Locais, recursos, custos e acordos exigem validação. Documento mestre Barranquilla 360 v2.1 (26/11/2026) e entregas do Sprint 1.',
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
    <div class="p-mec">${routes.mec
      .map(
        ([t, tipo, d, w]) =>
          `<div class="p-card"><span class="p-tipo ${tipo.startsWith('DIRECT') || tipo === 'DIRETA' ? 'dir' : 'cond'}">${tipo}</span><h3>${t}</h3><p>${d}</p><small><b>${routes.dnde}:</b> ${w}</small></div>`,
      )
      .join('')}</div>
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
    <p class="p-nota">${points.nota}</p>`,
  );

  poner(
    'p-connect',
    `${cab(connect.etq, connect.titulo, connect.lead)}
    <div class="p-tabla" role="region" tabindex="0" aria-label="${connect.titulo}"><table>
      <thead><tr>${connect.cab.map((c) => `<th scope="col">${c}</th>`).join('')}</tr></thead>
      <tbody>${connect.filas.map((f) => `<tr>${f.map((c, i) => (i ? `<td>${c}</td>` : `<th scope="row">${c}</th>`)).join('')}</tr>`).join('')}</tbody>
    </table></div>
    <p class="p-total">${connect.estados}</p><p class="p-nota">${connect.nota}</p>`,
  );

  poner(
    'p-flujo',
    `${cab(flujo.etq, flujo.titulo, flujo.lead)}
    <ol class="p-pasos">${flujo.pasos.map(([t, d], i) => `<li><span class="n">${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
    <p class="p-nota">${flujo.nota}</p>`,
  );

  poner(
    'p-cierre',
    `<h2>${cierre.titulo}</h2><p class="p-lema">${cierre.lema}</p><p class="p-nota">${cierre.nota}</p>`,
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
