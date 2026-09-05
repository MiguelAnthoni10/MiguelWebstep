/* ==========================================================================
   Pushaq-IA — script.js
   --------------------------------------------------------------------------
   Este archivo está dividido en partes:
     1) ÍCONOS SVG          -> símbolos reutilizables en toda la app
     2) DATOS DE TRÁMITES    -> contenido en español (es) y quechua (qu)
     3) ASISTENTE            -> estructura + textos del "chatbot" guiado
     4) TEXTOS DE INTERFAZ   -> botones, títulos y mensajes (es / qu)
     5) ACCESIBILIDAD        -> tamaño de letra y lectura por voz
     6) LÓGICA DE LA APP     -> idioma, navegación, búsqueda, render

   ⚠️  SOBRE EL QUECHUA (leer antes de publicar)
   Los textos en quechua de este archivo son una PRIMERA VERSIÓN de
   referencia, escrita con apoyo de herramientas de traducción y
   vocabulario general del quechua sureño (Cusco-Collao). No reemplazan
   la revisión de una persona que hable el quechua de tu zona.
   Antes de publicar la web, pide a alguien que domine el quechua local
   que revise especialmente los campos "qu" de la sección 2 y 3.
   Los nombres oficiales de trámites (como "Licencia de Funcionamiento"
   o "DNI") se dejaron en español a propósito, porque son términos
   legales sin una traducción oficial y así se usan en la práctica.
   ========================================================================== */


/* ============================================================
   1) ÍCONOS SVG  ← reutilízalos donde quieras agregar un ícono nuevo
   ------------------------------------------------------------
   Cada ícono es un string SVG de 24x24 que usa "currentColor",
   así que toma el color de texto del elemento que lo contiene.
   ============================================================ */
const ICONS = {
  tienda: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 9L5 4H19L20 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 9V19H20V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 19V14H15V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 9C4 9 5.5 11 8 11C10 11 10.5 9 12 9C13.5 9 14 11 16 11C18.5 11 20 9 20 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  recibo: `<svg viewBox="0 0 24 24" fill="none"><path d="M6 3H18V21L15.5 19L13 21L10.5 19L8 21L6 19V3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8H15M9 12H15M9 16H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  documento: `<svg viewBox="0 0 24 24" fill="none"><path d="M7 3H14L18 7V21H7V3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 3V7H18" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10 12H15M10 16H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  dialogo: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 5H20V16H9L4 20V5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  ayuda: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M9.5 9.5C9.5 8 10.6 7 12 7C13.4 7 14.5 8 14.5 9.3C14.5 10.6 13.2 11 12.4 11.7C12 12 12 12.4 12 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16.2" r="1" fill="currentColor"/></svg>`,
  checklist: `<svg viewBox="0 0 24 24" fill="none"><path d="M9 6H20M9 12H20M9 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4 6L5 7L7 5M4 12L5 13L7 11M4 18L5 19L7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  ruta: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 20C4 20 6 14 9 14C12 14 12 17 15 17C18 17 20 11 20 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="4" cy="20" r="1.6" fill="currentColor"/><circle cx="20" cy="11" r="1.6" fill="currentColor"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 21C12 21 19 14.5 19 9.5C19 5.4 15.9 2 12 2C8.1 2 5 5.4 5 9.5C5 14.5 12 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="9.5" r="2.6" stroke="currentColor" stroke-width="2"/></svg>`,
  bombilla: `<svg viewBox="0 0 24 24" fill="none"><path d="M9 18H15M10 21H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 2C8.7 2 6 4.7 6 8C6 10.2 7.2 11.6 8.3 12.7C9 13.4 9.5 14 9.6 15H14.4C14.5 14 15 13.4 15.7 12.7C16.8 11.6 18 10.2 18 8C18 4.7 15.3 2 12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  altavoz: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 9V15H8L14 19V5L8 9H4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M17.5 9C18.5 10 18.5 14 17.5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M20 7C21.8 9 21.8 15 20 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  edificio: `<svg viewBox="0 0 24 24" fill="none"><path d="M5 21V5C5 3.9 5.9 3 7 3H13C14.1 3 15 3.9 15 5V21" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M15 10H17C18.1 10 19 10.9 19 12V21" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 7H10M8 11H10M8 15H10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  anillos: `<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="14.5" r="5" stroke="currentColor" stroke-width="2"/><circle cx="15" cy="9.5" r="5" stroke="currentColor" stroke-width="2"/></svg>`,
  casaNumero: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 11L12 4L20 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10V19H18V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="9.3" y="13" width="5.4" height="6" rx="1" stroke="currentColor" stroke-width="1.6"/><path d="M10.3 16H13.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  corazon: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 20C12 20 4 14.5 4 9C4 6.2 6.2 4 9 4C10.5 4 11.6 4.8 12 5.8C12.4 4.8 13.5 4 15 4C17.8 4 20 6.2 20 9C20 14.5 12 20 12 20Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`
};


/* ============================================================
   2) DATOS DE TRÁMITES  ← EDITAR AQUÍ
   ------------------------------------------------------------
   Cada trámite tiene "es" (español) y "qu" (quechua, provisional).
   Para agregar un trámite nuevo, copia un bloque completo y
   cambia el "id" (único, sin espacios) y el "icono" (ver lista
   de ICONS arriba).
   ============================================================ */
const TRAMITES = [
  {
    id: "licencia-funcionamiento",
    icono: "tienda",
    es: {
      nombre: "Licencia de Funcionamiento",
      resumen: "Para abrir o formalizar un negocio",
      descripcion: "Autorización que otorga la municipalidad para que un local pueda operar legalmente como negocio (tienda, restaurante, bodega, taller, etc.) dentro del distrito.",
      requisitos: [
        "DNI vigente del titular o representante legal",
        "RUC activo y con el giro del negocio registrado",
        "Croquis o plano simple de ubicación del local",
        "Declaración jurada de observancia de condiciones de seguridad",
        "Vigencia de poder, si el trámite lo realiza un representante"
      ],
      pasos: [
        "Reúne los documentos y verifica que tu local cumpla la zonificación permitida.",
        "Llena el formulario único de trámite (FUT) en Mesa de Partes o en línea.",
        "Presenta los documentos y paga la tasa correspondiente en Caja.",
        "Espera la evaluación (generalmente 5 a 15 días hábiles según el riesgo del local).",
        "Recoge tu licencia o descárgala si el trámite fue virtual."
      ],
      lugar: { area: "Gerencia de Desarrollo Económico Local", direccion: "Palacio Municipal, Mesa de Partes — Piso 1", horario: "Lunes a viernes, 8:00 a.m. – 3:00 p.m." },
      recomendaciones: [
        "Verifica antes la zonificación de tu local: algunos giros no se permiten en zonas residenciales.",
        "Si tu local es de bajo riesgo, el trámite puede aprobarse automáticamente al presentar la declaración jurada.",
        "Guarda el cargo o número de expediente para hacer seguimiento."
      ],
      preguntasFrecuentes: [
        { pregunta: "¿Cuánto demora el trámite?", respuesta: "Depende del riesgo de tu local. Los de bajo riesgo suelen aprobarse al momento; los demás pueden tomar de 5 a 15 días hábiles." },
        { pregunta: "¿Puedo hacerlo si alquilo el local?", respuesta: "Sí. Solo necesitas el contrato de alquiler o autorización del propietario junto con tus demás documentos." }
      ],
      palabrasClave: ["negocio", "tienda", "bodega", "abrir negocio", "formalizar", "licencia comercial", "restaurante"]
    },
    qu: {
      nombre: "Licencia de Funcionamiento",
      nombreComprensible: "Negocio uryachinapaq",
      resumen: "Huk negociota qallarinaykipaq otaq allin kaqman churanaykipaq",
      descripcion: "Municipalidad nisqa qun kay autorizaciónta, huk local negociopaq legalmente llamk'ananpaq (tienda, restaurante, bodega, taller, ima kaqpas), distritopi.",
      requisitos: [
        "Titular otaq representante legal-pa DNI vigenteqa",
        "RUC activo, negociopa girinwan registrasqa",
        "Localpa maypi kasqanmanta croquis otaq plano sencillo",
        "Seguridad condicionkunata cumplisqamanta declaración jurada",
        "Poder vigentin, sichus representantemi trámiteta ruwan"
      ],
      pasos: [
        "Documentokunata huñuy, chaymanta localniyki zonificación nisqata cumplisqanta qhaway.",
        "FUT formulariota Mesa de Partes-pi otaq internetpi hunt'ay.",
        "Documentokunata quy, chaymanta Caja-pi tasata pagay.",
        "Evaluaciónta suyay (normalmente 5 hasta 15 p'unchaw, localpa riesgonman hina).",
        "Licenciaykita apakuy otaq descargay, sichus trámiteqa virtualmi karqan."
      ],
      lugar: { area: "Gerencia de Desarrollo Económico Local", direccion: "Palacio Municipal, Mesa de Partes — Piso 1", horario: "Lunes-manta viernes-kama, 8:00 a.m. – 3:00 p.m." },
      recomendaciones: [
        "Ñawpaqta zonificaciónta qhaway: wakin negociokunaqa manam zonas residencialespi atikunchu.",
        "Sichus localniyki pisi riesgoyuqmi, declaración jurada quptin automáticamente aprobasqa kanman.",
        "Cargoykita otaq expediente numeroykita waqaychay, seguimientota ruwanaykipaq."
      ],
      preguntasFrecuentes: [
        { pregunta: "¿Hayk'a tiempotan trámiteqa qichun?", respuesta: "Localniykip riesgonman hina. Pisi riesgoyuqqa kaqllapi aprobakun; hukkunaqa 5 hasta 15 p'unchaw hábilta qichunman." },
        { pregunta: "¿Atinichu ruwayta sichus localta alquilani?", respuesta: "Arí. Contrato de alquiler otaq dueñop autorizacionllanta necesitanki huk documentoswan." }
      ],
      palabrasClave: ["negocio", "qatu", "tienda", "llamk'ay"]
    }
  },
  {
    id: "impuesto-predial",
    icono: "recibo",
    es: {
      nombre: "Pago del Impuesto Predial",
      resumen: "Impuesto anual por tu vivienda o terreno",
      descripcion: "Impuesto que pagan los propietarios de una casa, departamento o terreno cada año. Se puede pagar al contado o en cuatro cuotas trimestrales.",
      requisitos: [
        "DNI del propietario",
        "Número de HR (Hoja de Resumen) o código del predio, si ya lo tienes",
        "Documento de propiedad (si es la primera vez que declaras el predio)"
      ],
      pasos: [
        "Consulta el monto actualizado con tu DNI en el módulo de Rentas o en la web municipal.",
        "Elige la modalidad de pago: al contado (con descuento) o en 4 cuotas.",
        "Realiza el pago en Caja, banco autorizado o en línea.",
        "Guarda tu comprobante de pago (recibo o boleta electrónica)."
      ],
      lugar: { area: "Gerencia de Administración Tributaria — Módulo de Rentas", direccion: "Palacio Municipal, Módulo de Rentas — Piso 1", horario: "Lunes a viernes, 8:00 a.m. – 4:00 p.m." },
      recomendaciones: [
        "El pago al contado (usualmente hasta fines de febrero) suele tener descuento.",
        "Si eres adulto mayor o tienes pensión mínima, pregunta si calificas para algún beneficio.",
        "Revisa que tus datos (área del predio, uso) estén correctos: eso define el monto."
      ],
      preguntasFrecuentes: [
        { pregunta: "¿Qué pasa si no pago a tiempo?", respuesta: "Se generan intereses moratorios sobre el monto pendiente. Es mejor consultar a tiempo si puedes fraccionar el pago." },
        { pregunta: "¿Hay descuentos para adultos mayores?", respuesta: "Muchas municipalidades ofrecen beneficios para adultos mayores o personas con discapacidad. Consulta en el módulo de Rentas si calificas." }
      ],
      palabrasClave: ["impuesto", "predial", "autoavalúo", "arbitrios", "pago de tributos", "casa", "terreno"]
    },
    qu: {
      nombre: "Pago del Impuesto Predial",
      nombreComprensible: "Wasi impuesto pagana",
      resumen: "Wata wata pagana impuesto, wasiyki otaq hallp'ayki rayku",
      descripcion: "Kay impuestotaqa wasiyuq, departamentoyuq otaq hallp'ayuq runakuna wata sapa paganku. Contadopi otaq tawa cuotapi pagayta atinku.",
      requisitos: [
        "Propietariop DNIn",
        "HR numero (Hoja de Resumen) otaq predio código, sichus ñam charinkichu",
        "Propiedad documento (sichus ñawpaq kutita predioykita declarankichu)"
      ],
      pasos: [
        "DNIykiwan actualizasqa montota tapuriy, Rentas módulopi otaq municipal webpi.",
        "Pagay modalidadta akllay: contado (descuentowan) otaq tawa cuotapi.",
        "Cajapi, banco autorizadopi otaq internetpi pagay.",
        "Comprobante de pagoykita waqaychay (recibo otaq boleta electrónica)."
      ],
      lugar: { area: "Gerencia de Administración Tributaria — Módulo de Rentas", direccion: "Palacio Municipal, Módulo de Rentas — Piso 1", horario: "Lunes-manta viernes-kama, 8:00 a.m. – 4:00 p.m." },
      recomendaciones: [
        "Contado pagoqa (febrero tukuykama) descuentoyuqmi kanman.",
        "Sichus adulto mayor kanki otaq pensión mínimayuq, tapuriy beneficiokunata.",
        "Datosniykikuna allin kasqanta qhaway (predio área, imapaq usasqa), chaymi montota decide."
      ],
      preguntasFrecuentes: [
        { pregunta: "¿Imataq pasan mana tiempopi pagaptiy?", respuesta: "Intereses moratorios nisqa wiñan mana pagasqa montopi. Aswan allinqa tiempopi tapuriyqa, fraccionamientota atisqaykimanta." },
        { pregunta: "¿Kanchu descuentokuna adultos mayorespaq?", respuesta: "Achkha municipalidadkunapi beneficiokuna kanku adultos mayores otaq discapacidadyuq runakunapaq. Rentas módulopi tapuriy." }
      ],
      palabrasClave: ["impuesto", "qullqi", "pagana", "wasi"]
    }
  },
  {
    id: "certificado-numeracion",
    icono: "casaNumero",
    es: {
      nombre: "Certificado de Numeración Domiciliaria",
      resumen: "Constancia oficial del número de tu vivienda",
      descripcion: "Documento que certifica el número oficial asignado a una vivienda o local, útil para trámites bancarios, servicios básicos o formalización de propiedad.",
      requisitos: [
        "DNI del solicitante",
        "Documento que acredite posesión o propiedad del predio",
        "Croquis de ubicación del inmueble",
        "Recibo de pago de la tasa por derecho de trámite"
      ],
      pasos: [
        "Solicita el formulario de numeración en Mesa de Partes.",
        "Paga la tasa correspondiente en Caja.",
        "Un inspector municipal puede verificar la ubicación (según el distrito).",
        "Recoge el certificado en la fecha indicada en tu cargo."
      ],
      lugar: { area: "Subgerencia de Catastro", direccion: "Palacio Municipal, Oficina de Catastro — Piso 2", horario: "Lunes a viernes, 8:30 a.m. – 3:30 p.m." },
      recomendaciones: [
        "Lleva un croquis lo más claro posible: agiliza la verificación.",
        "Este certificado suele ser requisito previo para otros trámites, como instalar servicios de agua o luz.",
        "El tiempo de entrega varía si se requiere inspección de campo."
      ],
      preguntasFrecuentes: [
        { pregunta: "¿Para qué me sirve este certificado?", respuesta: "Lo piden para instalar agua o luz, para trámites bancarios, o para inscribir tu propiedad, entre otros usos." },
        { pregunta: "¿Necesito estar presente en la inspección?", respuesta: "Es recomendable, para orientar al inspector y resolver cualquier duda sobre la ubicación de tu predio." }
      ],
      palabrasClave: ["numeracion", "numero de casa", "domicilio", "catastro", "direccion oficial"]
    },
    qu: {
      nombre: "Certificado de Numeración Domiciliaria",
      nombreComprensible: "Wasi numerota churana",
      resumen: "Wasiykip numeronmanta oficial constancia",
      descripcion: "Kay documentoqa huk wasip otaq localpa oficial numeronta certifican, útil kaspa bancario trámitekunapaq, servicios básicospaq otaq propiedad formalizacionpaq.",
      requisitos: [
        "Mañakuqpa DNIn",
        "Predio posesiónta otaq propiedadta acreditaq documento",
        "Inmueblep ubicacionmanta croquis",
        "Trámite derechomanta tasa pago recibo"
      ],
      pasos: [
        "Numeración formulariota Mesa de Partes-pi mañakuy.",
        "Correspondiente tasata Cajapi pagay.",
        "Huk inspector municipal ubicacionta verificayta atin (distritoman hina).",
        "Certificadota apakuy, cargoykipi nisqa fechapi."
      ],
      lugar: { area: "Subgerencia de Catastro", direccion: "Palacio Municipal, Oficina de Catastro — Piso 2", horario: "Lunes-manta viernes-kama, 8:30 a.m. – 3:30 p.m." },
      recomendaciones: [
        "Aswan sut'i croquista apay: verificacionta utqhaychan.",
        "Kay certificadoqa hukkuna trámitepaq requisito previo kanman, yaku otaq luz instalanapaq hina.",
        "Entrega tiempoqa variyanmi, sichus campo inspección necesitakun."
      ],
      preguntasFrecuentes: [
        { pregunta: "¿Imapaqtaq kay certificadoqa sirvewan?", respuesta: "Yakuta otaq luzta instalanapaq, bancario trámitekunapaq, otaq propiedadta inscribinapaq mañankuku, hukkunapiwan." },
        { pregunta: "¿Necesitanichu inspecciónpi kanaypaq?", respuesta: "Recomendable kanmi, inspectorta orientanaykipaq predioykip ubicacionninmanta ima tapuytapas allichanapaq." }
      ],
      palabrasClave: ["numeracion", "wasi numero", "catastro"]
    }
  },
  {
    id: "licencia-edificacion",
    icono: "edificio",
    es: {
      nombre: "Licencia de Edificación",
      resumen: "Para construir, ampliar o remodelar",
      descripcion: "Autorización necesaria antes de iniciar una obra nueva, ampliación, remodelación o demolición, para asegurar que cumple las normas de construcción y seguridad.",
      requisitos: [
        "DNI del propietario y título de propiedad",
        "Planos de arquitectura firmados por un profesional colegiado",
        "Comprobante de pago de derechos de revisión",
        "Formulario único de edificación (FUE) debidamente llenado"
      ],
      pasos: [
        "Contrata a un arquitecto o ingeniero civil colegiado para tus planos.",
        "Presenta el expediente completo en Mesa de Partes de Obras Privadas.",
        "Espera la revisión técnica (puede pasar por una Comisión Técnica según la modalidad).",
        "Paga los derechos si el expediente es observado favorablemente o aprobado.",
        "Recoge tu licencia antes de iniciar cualquier trabajo de construcción."
      ],
      lugar: { area: "Subgerencia de Obras Privadas y Catastro", direccion: "Palacio Municipal, Oficina de Obras Privadas — Piso 2", horario: "Lunes a viernes, 8:00 a.m. – 3:00 p.m." },
      recomendaciones: [
        "Nunca inicies la obra antes de tener la licencia: puede generar multas o paralización.",
        "Verifica con anticipación qué modalidad de licencia corresponde según el tamaño de tu proyecto.",
        "Consulta si tu proyecto requiere revisión de Defensa Civil."
      ],
      preguntasFrecuentes: [
        { pregunta: "¿Puedo empezar la obra mientras espero la licencia?", respuesta: "No. Iniciar sin licencia puede generar multas o la paralización de la obra. Espera la aprobación." },
        { pregunta: "¿Toda obra necesita un arquitecto?", respuesta: "Sí, los planos deben estar firmados por un profesional colegiado, incluso para ampliaciones pequeñas." }
      ],
      palabrasClave: ["construir", "construccion", "remodelar", "ampliar", "obra", "edificacion", "licencia de obra"]
    },
    qu: {
      nombre: "Licencia de Edificación",
      nombreComprensible: "Wasi ruwana permiso",
      resumen: "Ruwanaykipaq, ampliyanaykipaq otaq allinchanaykipaq",
      descripcion: "Kay autorizaciónqa necesitakun huk obra mosoqta qallarinaykipaq, ampliaciónta, remodelaciónta otaq demoliciónta ruwanaykipaq, construcción normaskunata seguridadwan cumplisqanta seguranapaq.",
      requisitos: [
        "Propietariop DNIn, propiedad títulopiwan",
        "Arquitectura planos, colegiado profesionalpa firmasqan",
        "Revisión derechokunamanta pago comprobante",
        "FUE formulario, allinta hunt'asqa"
      ],
      pasos: [
        "Huk arquitecto otaq ingeniero civil colegiadota contratay planosniykipaq.",
        "Tukuy expedientota Obras Privadas Mesa de Partes-pi quy.",
        "Revisión técnicata suyay (Comisión Técnicaman rinman modalidadman hina).",
        "Derechokunata pagay, sichus expedienteqa favorablemente observasqa otaq aprobasqa kaqtin.",
        "Licenciaykita apakuy, imayna trabajo construcciónta qallarinaykipaq ñawpaqta."
      ],
      lugar: { area: "Subgerencia de Obras Privadas y Catastro", direccion: "Palacio Municipal, Oficina de Obras Privadas — Piso 2", horario: "Lunes-manta viernes-kama, 8:00 a.m. – 3:00 p.m." },
      recomendaciones: [
        "Mana licenciayuq kaspaqa manam obrata qallarinkichu: multakunata otaq paralizacionta generanman.",
        "Ñawpaqmanta qhaway ima modalidad licenciachus proyectoykip tamañonman hina corresponden.",
        "Tapuriy proyectoyki Defensa Civil revisiónta necesitanchu."
      ],
      preguntasFrecuentes: [
        { pregunta: "¿Atinichu obrata qallariyta licencia suyaspa?", respuesta: "Manam. Mana licenciayuq qallariyqa multakunata otaq obra paralizacionta generanman. Aprobaciónta suyay." },
        { pregunta: "¿Tukuy obra arquitectota necesitanchu?", respuesta: "Arí, planosqa colegiado profesionalpa firmasqan kananmi, pisi ampliacionkunapaqpas." }
      ],
      palabrasClave: ["ruway", "wasi ruway", "obra"]
    }
  },
  {
    id: "matrimonio-civil",
    icono: "anillos",
    es: {
      nombre: "Matrimonio Civil Municipal",
      resumen: "Para casarte por civil en la municipalidad",
      descripcion: "Trámite para formalizar legalmente la unión entre dos personas ante la municipalidad, cumpliendo los requisitos establecidos por el Código Civil.",
      requisitos: [
        "DNI vigente de ambos contrayentes",
        "Partida de nacimiento actualizada (no mayor a 90 días) de ambos",
        "Certificado médico prenupcial",
        "Declaración jurada de domicilio y soltería (o documento de estado civil según corresponda)",
        "Dos testigos mayores de edad con DNI"
      ],
      pasos: [
        "Presenta el expediente completo en el Registro Civil de la municipalidad.",
        "Se publica el edicto matrimonial (aviso público) por el plazo que indique la ley.",
        "Si no hay oposición, se programa la fecha y hora de la ceremonia.",
        "Asiste a la ceremonia civil con tus testigos y documentos originales.",
        "Recibe tu acta de matrimonio."
      ],
      lugar: { area: "Oficina de Registro Civil", direccion: "Palacio Municipal, Registro Civil — Piso 1", horario: "Lunes a viernes, 8:00 a.m. – 1:00 p.m. (con cita previa)" },
      recomendaciones: [
        "Inicia el trámite con al menos 4 a 6 semanas de anticipación por el tiempo del edicto.",
        "Verifica la vigencia de tu certificado médico: suele tener un plazo corto de validez.",
        "Confirma si tu municipalidad exige cita previa para presentar el expediente."
      ],
      preguntasFrecuentes: [
        { pregunta: "¿Con cuánta anticipación debo iniciar el trámite?", respuesta: "Se recomienda entre 4 y 6 semanas antes de la fecha deseada, por el tiempo que toma el edicto matrimonial." },
        { pregunta: "¿Los testigos pueden ser familiares?", respuesta: "Sí, no hay restricción sobre el parentesco. Solo deben ser mayores de edad y presentar su DNI." }
      ],
      palabrasClave: ["casarme", "matrimonio", "civil", "boda", "registro civil"]
    },
    qu: {
      nombre: "Matrimonio Civil Municipal",
      nombreComprensible: "Civilpi casarakuna",
      resumen: "Municipalidadpi civilpi casarakunaykipaq",
      descripcion: "Kay trámiteqa iskay runakunap unionninta legalmente formalizananpaq, municipalidad ñawpaqinpi, Código Civil-pa requisitonkunata cumplispa.",
      requisitos: [
        "Iskaynin contrayentekunap DNI vigenten",
        "Iskaynin partida de nacimiento actualizasqa (mana 90 p'unchawmanta aswan)",
        "Certificado médico prenupcial",
        "Domicilio, solteria declaración jurada (otaq estado civil documento, correspondenman hina)",
        "Iskay testigo mayores de edad, DNI-yuq"
      ],
      pasos: [
        "Tukuy expedientota municipalidadpa Registro Civil-npi quy.",
        "Edicto matrimonial nisqa publicakun, leyqa nisqan tiempopi.",
        "Sichus manam oposición kanchu, ceremoniap fecha hora programakun.",
        "Ceremonia civilman riy testigosniykiwan, documentos originalesniykiwan.",
        "Acta de matrimonioykita chaskiy."
      ],
      lugar: { area: "Oficina de Registro Civil", direccion: "Palacio Municipal, Registro Civil — Piso 1", horario: "Lunes-manta viernes-kama, 8:00 a.m. – 1:00 p.m. (cita previawan)" },
      recomendaciones: [
        "Trámiteta qallariy 4 hasta 6 semana ñawpaqmanta, edicto tiempo rayku.",
        "Certificado médicoykip vigencianta qhaway: pisi tiempollam validoqa.",
        "Confirmariy municipalidadniyki cita previata exigenchu expedienteta presentanapaq."
      ],
      preguntasFrecuentes: [
        { pregunta: "¿Hayk'a ñawpaqmantan trámiteta qallarina kani?", respuesta: "Recomendakun 4 hasta 6 semana ñawpaqmanta, munasqa fecha, edicto matrimonial tiempo rayku." },
        { pregunta: "¿Testigokuna familiar kayta atinkuchu?", respuesta: "Arí, manam restricción kanchu parentescomanta. Mayores de edad kananku DNI-wan." }
      ],
      palabrasClave: ["casarakuy", "matrimonio", "civil"]
    }
  }
];


/* ============================================================
   4) TEXTOS DE INTERFAZ (traducciones)  ← EDITAR AQUÍ
   ------------------------------------------------------------
   TRANSLATIONS.es = textos en español (fuente de verdad).
   TRANSLATIONS.qu = textos en quechua (⚠️ provisional, ver el
   aviso al inicio de este archivo).

   Para agregar un TERCER IDIOMA en el futuro:
   1. Copia por completo el bloque "es: { ... }" de abajo.
   2. Pégalo como una nueva propiedad, ej. "en: { ... }".
   3. Traduce cada valor (no cambies las claves ni los {llaves}).
   4. Haz lo mismo en cada trámite de TRAMITES (agrega un campo
      "en: {...}" junto a "es"/"qu").
   5. Agrega un botón nuevo en index.html (access-bar y pantalla
      de idioma) con data-lang="en", copiando un botón existente.
   ============================================================ */
const TRANSLATIONS = {
  es: {
    common: {
      accessLabel: "Tamaño de letra",
      languageLabel: "Idioma",
      fontSmall: "Letra pequeña",
      fontMedium: "Letra normal",
      fontLarge: "Letra grande",
      appTagline: "Te ayudamos a conocer los pasos de tu trámite",
      whatDoYouNeed: "¿Qué necesitas hacer?",
      searchPlaceholder: "Buscar trámite...",
      frequentProcedures: "Trámites frecuentes",
      unsureTitle: "No sé qué trámite necesito",
      unsureSub: "Te hago unas preguntas simples y te oriento",
      emptyState: "No encontramos un trámite con ese nombre. Prueba con otra palabra o usa la opción de abajo.",
      back: "Volver",
      home: "Inicio",
      assistantTab: "Asistente",
      assistantTitle: "Asistente",
      listen: "Escuchar información",
      stopListen: "Detener lectura",
      listenUnsupported: "Lectura por voz no disponible en este navegador",
      description: "Descripción",
      whatToBring: "Qué necesitas llevar",
      stepsTitle: "Pasos que debes seguir",
      whereTitle: "Dónde realizarlo",
      recommendationsTitle: "Recomendaciones",
      faqTitle: "Preguntas frecuentes",
      feedbackTitle: "¿Esta información te ayudó?",
      yes: "Sí",
      no: "No",
      feedbackNoteLabel: "¿Qué podríamos mejorar? (opcional)",
      feedbackNotePlaceholder: "Escribe aquí tu comentario...",
      feedbackSubmit: "Enviar comentario",
      feedbackThanks: "¡Gracias! Tu comentario nos ayuda a mejorar Pushaq-IA.",
      backHome: "Volver al inicio",
      fichaLabel: "Ficha de trámite",
      footerNote: "Prototipo educativo desarrollado para orientación ciudadana. No constituye una plataforma oficial de la Municipalidad.",
      aiChatTitle: "Asistente con IA",
      aiChatSubtitle: "Respuestas generadas por inteligencia artificial",
      aiChatPlaceholder: "Escribe tu pregunta...",
      aiChatWelcome: "¡Hola! Soy el asistente virtual de Pushaq-IA. Puedes preguntarme lo que necesites sobre tus trámites municipales, en español o en quechua.",
      aiChatSend: "Enviar",
      aiChatThinking: "Escribiendo...",
      aiChatError: "No se pudo conectar con el asistente. Verifica tu conexión a internet e intenta de nuevo.",
      aiChatListen: "Escuchar",
      aiChatStop: "Detener",
      aiDisclaimer: "Las respuestas son generadas por inteligencia artificial y pueden contener errores. Verifica siempre en la municipalidad."
    }
  },
  qu: {
    /* ⚠️ Traducción provisional — revisar con hablante de quechua local */
    common: {
      accessLabel: "Qillqa sayaynin",
      languageLabel: "Simi",
      fontSmall: "Huch'uy qillqa",
      fontMedium: "Kaq qillqa",
      fontLarge: "Hatun qillqa",
      appTagline: "Yanapaykiku trámiteykip pasosninta yachanaykipaq",
      whatDoYouNeed: "¿Imatan ruwayta munanki?",
      searchPlaceholder: "Trámiteta maskay...",
      frequentProcedures: "Aswan maskasqa trámitekuna",
      unsureTitle: "Manam yachanichu ima trámitetachus necesitani",
      unsureSub: "Wakin sut'i tapuykunata ruwaspa yanapasqayki",
      emptyState: "Manam chay sutiyuq trámitetachu tarinchik. Huk simiwan yaykuchiy otaq urapi kaq opciónta akllay.",
      back: "Kutiy",
      home: "Qallariy",
      assistantTab: "Yanapaq",
      assistantTitle: "Yanapaq",
      listen: "Willakuyta uyariy",
      stopListen: "Uyariyta sayachiy",
      listenUnsupported: "Kay navegadorpi manam uyarichiy atikunchu",
      description: "Willakuy",
      whatToBring: "Ima apanaykipaq",
      stepsTitle: "Qatinaykipaq pasoskuna",
      whereTitle: "Maypi ruwanapaq",
      recommendationsTitle: "Yuyaychakuykuna",
      faqTitle: "Aswan tapusqa tapuykuna",
      feedbackTitle: "¿Kay willakuy yanapasurkichu?",
      yes: "Arí",
      no: "Mana",
      feedbackNoteLabel: "¿Imatataq allinchayta atisunman? (munaspalla)",
      feedbackNotePlaceholder: "Kaypi comentarioykita qillqay...",
      feedbackSubmit: "Comentariota apachiy",
      feedbackThanks: "¡Sulpayki! Comentarioykiwan Pushaq-IAta allinchayta atisunchik.",
      backHome: "Qallariyman kutiy",
      fichaLabel: "Trámite willakuy",
      footerNote: "Kayqa yachay prototipo, ciudadanokunata yanapananpaq ruwasqa. Manam Municipalidadpa oficial plataformanchu.",
      aiChatTitle: "IA Yanapaq",
      aiChatSubtitle: "Inteligencia artificial-wan kutichisqa",
      aiChatPlaceholder: "Tapukuykita qillqay...",
      aiChatWelcome: "¡Napaykullayki! Ñuqam kani Pushaq-IAp yanapaqnin. Tapukuway ima trámite municipalmantapas, quechuapi otaq castellanopi.",
      aiChatSend: "Apachiy",
      aiChatThinking: "Qillqashan...",
      aiChatError: "Manam yanapaqwan tinkuyta atirqanichu. Internet conexionniykita qhaway, kutimanta intentay.",
      aiChatListen: "Uyariy",
      aiChatStop: "Sayachiy",
      aiDisclaimer: "Kay kutichiykuna inteligencia artificial-wan ruwasqam, pantasqapas kanman. Municipalidadpi siempre confirmariy."
    }
  }
};


/* ============================================================
   5) ACCESIBILIDAD — tamaño de letra y lectura por voz
   ============================================================ */
(function () {
  "use strict";

  const ESCALAS = { sm: "90%", md: "100%", lg: "120%" };

  function aplicarEscala(nivel) {
    document.documentElement.style.fontSize = ESCALAS[nivel] || ESCALAS.md;
    document.querySelectorAll(".access-btn[data-scale]").forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.scale === nivel);
    });
    try { localStorage.setItem("muniguia_text_scale", nivel); } catch (e) {}
  }

  document.querySelectorAll(".access-btn[data-scale]").forEach(btn => {
    btn.addEventListener("click", () => aplicarEscala(btn.dataset.scale));
  });

  let nivelGuardado = "md";
  try { nivelGuardado = localStorage.getItem("muniguia_text_scale") || "md"; } catch (e) {}
  aplicarEscala(nivelGuardado);

  window.MuniGuiaVoz = {
    soportado: "speechSynthesis" in window,
    detener: function () {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    },
    leer: function (texto, lang, alTerminar) {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(texto);
      // El quechua ("qu-PE") tiene soporte de voz muy limitado según el
      // dispositivo/navegador; si no está disponible, el sistema suele
      // usar la voz predeterminada en su lugar.
      utter.lang = lang === "qu" ? "qu-PE" : "es-PE";
      utter.rate = 0.95;
      utter.onend = alTerminar || null;
      utter.onerror = alTerminar || null;
      window.speechSynthesis.speak(utter);
    }
  };
})();


/* ============================================================
   6) LÓGICA DE LA APLICACIÓN
   ============================================================ */
(function () {
  "use strict";

  const els = {
    screens: document.querySelectorAll(".screen"),
    tabs: document.querySelectorAll(".tab"),
    tramiteList: document.getElementById("tramite-list"),
    emptyState: document.getElementById("empty-state"),
    searchInput: document.getElementById("search-input"),
    detailTitle: document.getElementById("detail-title"),
    detailBody: document.getElementById("detail-body"),
    chatLog: document.getElementById("chat-log"),
    chatOptions: document.getElementById("chat-options"),
    btnUnsure: document.getElementById("btn-unsure"),
    app: document.getElementById("app"),
    aiPanel: document.getElementById("ai-panel"),
    aiPanelClose: document.getElementById("ai-panel-close"),
    aiPanelClear: document.getElementById("ai-panel-clear"),
    aiChatLog: document.getElementById("ai-chat-log"),
    aiChatInput: document.getElementById("ai-chat-input"),
    aiChatSend: document.getElementById("ai-chat-send")
  };

  let currentLang = "es";
  let currentTramiteId = null;

  /* ---------- Traducción ---------- */
  function t(key) {
    const dict = TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang].common;
    if (dict && dict[key] !== undefined) return dict[key];
    return TRANSLATIONS.es.common[key] || key;
  }

  function campo(objetoTramite) {
    return objetoTramite[currentLang] || objetoTramite.es;
  }

  // En quechua, mostramos primero un nombre comprensible del trámite y,
  // debajo, el nombre oficial en español (el que el usuario va a encontrar
  // en la municipalidad). En español no hace falta duplicarlo.
  function nombrePrincipal(data) {
    if (currentLang === "qu" && data.nombreComprensible) return data.nombreComprensible;
    return data.nombre;
  }
  function nombreOficialSecundario(data) {
    if (currentLang === "qu" && data.nombreComprensible && data.nombreComprensible !== data.nombre) {
      return `${data.nombre} · nombre oficial`;
    }
    return null;
  }

  function aplicarTraduccionesEstaticas() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    const ariaScale = { sm: "fontSmall", md: "fontMedium", lg: "fontLarge" };
    document.querySelectorAll(".access-btn[data-scale]").forEach(btn => {
      btn.setAttribute("aria-label", t(ariaScale[btn.dataset.scale]));
    });
  }

  function applyLanguage(lang) {
    currentLang = TRANSLATIONS[lang] ? lang : "es";
    try { localStorage.setItem("muniguia_lang", currentLang); } catch (e) {}
    document.documentElement.lang = currentLang;
    document.querySelectorAll(".lang-btn").forEach(b => {
      b.classList.toggle("is-active", b.dataset.lang === currentLang);
    });
    aplicarTraduccionesEstaticas();
    renderTramiteList(filterTramites(els.searchInput.value));
    if (currentTramiteId) openDetail(currentTramiteId);
    // Reiniciamos el chat con IA para no mezclar idiomas en la misma conversación
    resetAiChat();
  }

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
  });

  document.querySelectorAll("[data-lang-select]").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.langSelect;
      els.app.classList.remove("lang-pending");
      applyLanguage(lang);
      showScreen("home");
    });
  });

  /* ---------- Navegación entre pantallas ---------- */
  function showScreen(name) {
    window.MuniGuiaVoz.detener();
    els.screens.forEach(s => s.classList.toggle("is-active", s.dataset.screen === name));
    els.tabs.forEach(tb => tb.classList.toggle("is-active", tb.dataset.tab === name));
    els.app.scrollTop = 0;
  }

  function goHome() { showScreen("home"); }

  /* ---------- Panel del asistente con IA ---------- */
  const esEscritorio = () => window.matchMedia("(min-width: 900px)").matches;

  function openAiPanel() {
    if (els.aiChatLog.children.length === 0) {
      addAiBubble(t("aiChatWelcome"), "bot");
    }
    if (!esEscritorio()) {
      els.aiPanel.classList.add("is-open");
    }
    els.tabs.forEach(tb => tb.classList.toggle("is-active", tb.dataset.tab === "assistant"));
    setTimeout(() => els.aiChatInput.focus(), esEscritorio() ? 0 : 260);
  }

  function closeAiPanel() {
    window.MuniGuiaVoz.detener();
    els.aiPanel.classList.remove("is-open");
    els.tabs.forEach(tb => tb.classList.toggle("is-active", tb.dataset.tab === "home"));
  }

  els.aiPanelClose.addEventListener("click", closeAiPanel);
  els.aiPanelClear.addEventListener("click", resetAiChat);

  document.querySelectorAll('[data-action="go-home"]').forEach(el =>
    el.addEventListener("click", goHome)
  );
  document.querySelectorAll('[data-action="go-assistant"]').forEach(el =>
    el.addEventListener("click", openAiPanel)
  );
  els.btnUnsure.addEventListener("click", openAiPanel);

  // Si la persona gira su celular o cambia de ventana a un tamaño de
  // escritorio, el panel deja de ser una pantalla superpuesta y pasa
  // a ser el panel lateral fijo (ver CSS, @media min-width:900px).
  window.matchMedia("(min-width: 900px)").addEventListener("change", () => {
    els.aiPanel.classList.remove("is-open");
  });

  /* ---------- Pantalla de inicio: tarjetas de trámites ---------- */
  function renderTramiteList(lista) {
    els.tramiteList.innerHTML = "";
    els.emptyState.hidden = lista.length !== 0;

    lista.forEach((tObj) => {
      const data = campo(tObj);
      const nombreOficial = nombreOficialSecundario(data);
      const card = document.createElement("button");
      card.type = "button";
      card.className = "ticket-card";
      card.setAttribute("role", "listitem");
      card.innerHTML = `
        <span class="ticket-card__icon" aria-hidden="true">${ICONS[tObj.icono] || ""}</span>
        <span class="ticket-card__body">
          <span class="ticket-card__name">${nombrePrincipal(data)}</span>
          ${nombreOficial ? `<span class="ticket-card__official">${nombreOficial}</span>` : ""}
          <span class="ticket-card__desc">${data.resumen}</span>
        </span>
        <span class="ticket-card__chevron" aria-hidden="true">›</span>
      `;
      card.addEventListener("click", () => openDetail(tObj.id));
      els.tramiteList.appendChild(card);
    });
  }

  function filterTramites(query) {
    const q = query.trim().toLowerCase();
    if (!q) return TRAMITES;
    return TRAMITES.filter(tObj => {
      const es = tObj.es, qu = tObj.qu;
      const haystack = [
        es.nombre, es.resumen, es.descripcion, ...(es.palabrasClave || []),
        qu.nombre, qu.resumen, ...(qu.palabrasClave || [])
      ].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }

  els.searchInput.addEventListener("input", (e) => {
    renderTramiteList(filterTramites(e.target.value));
  });

  /* ---------- Pantalla de detalle ---------- */
  function textoParaLeer(data) {
    const partes = [
      `${data.nombre}.`,
      `${t("whatToBring")}: ${data.requisitos.join(". ")}.`,
      `${t("stepsTitle")}: ${data.pasos.map((p, i) => `${i + 1}. ${p}`).join(" ")}`,
      `${t("whereTitle")}: ${data.lugar.area}, ${data.lugar.direccion}. ${data.lugar.horario}.`,
      `${t("recommendationsTitle")}: ${data.recomendaciones.join(". ")}.`
    ];
    return partes.join(" ");
  }

  function openDetail(tramiteId) {
    const tObj = TRAMITES.find(x => x.id === tramiteId);
    if (!tObj) return;
    currentTramiteId = tramiteId;
    const data = campo(tObj);
    const nombreOficial = nombreOficialSecundario(data);

    const faqHtml = (data.preguntasFrecuentes || []).map(f => `
      <details class="faq-item">
        <summary>${f.pregunta}</summary>
        <p>${f.respuesta}</p>
      </details>
    `).join("");

    els.detailBody.innerHTML = `
      <div class="detail-hero">
        <div class="detail-hero__icon" aria-hidden="true">${ICONS[tObj.icono] || ""}</div>
        <div>
          <h2 class="detail-hero__name">${nombrePrincipal(data)}</h2>
          ${nombreOficial ? `<p class="detail-hero__official">${nombreOficial}</p>` : ""}
        </div>
      </div>

      <button type="button" class="listen-btn" id="btn-listen">
        <span class="listen-btn__icon" aria-hidden="true">${ICONS.altavoz}</span>
        <span class="listen-btn__text">${t("listen")}</span>
      </button>

      <div class="detail-block">
        <p class="detail-block__title">${ICONS.documento}<span>${t("description")}</span></p>
        <p class="detail-desc">${data.descripcion}</p>
      </div>

      <div class="detail-block">
        <p class="detail-block__title">${ICONS.checklist}<span>${t("whatToBring")}</span></p>
        <ul class="req-list">
          ${data.requisitos.map(r => `<li>${r}</li>`).join("")}
        </ul>
      </div>

      <div class="detail-block">
        <p class="detail-block__title">${ICONS.ruta}<span>${t("stepsTitle")}</span></p>
        <ol class="step-list">
          ${data.pasos.map((p, i) => `
            <li>
              <span class="step-num">${i + 1}</span>
              <span class="step-text">${p}</span>
            </li>`).join("")}
        </ol>
      </div>

      <div class="detail-block">
        <p class="detail-block__title">${ICONS.pin}<span>${t("whereTitle")}</span></p>
        <div class="place-card">
          <span class="place-card__icon" aria-hidden="true">${ICONS.pin}</span>
          <div class="place-card__text">
            <p><strong>${data.lugar.area}</strong></p>
            <p>${data.lugar.direccion}</p>
            <p>${data.lugar.horario}</p>
          </div>
        </div>
      </div>

      <div class="detail-block">
        <p class="detail-block__title">${ICONS.bombilla}<span>${t("recommendationsTitle")}</span></p>
        <div class="tip-box">
          <ul>${data.recomendaciones.map(r => `<li>${r}</li>`).join("")}</ul>
        </div>
      </div>

      ${faqHtml ? `
      <div class="detail-block">
        <p class="detail-block__title">${ICONS.ayuda}<span>${t("faqTitle")}</span></p>
        ${faqHtml}
      </div>` : ""}

      <div class="feedback" id="feedback-${tObj.id}">
        <p class="feedback__title">${t("feedbackTitle")}</p>
        <div class="feedback__buttons">
          <button type="button" class="fb-btn" data-fb="si">${t("yes")}</button>
          <button type="button" class="fb-btn" data-fb="no">${t("no")}</button>
        </div>
        <label class="feedback__note-label" for="nota-${tObj.id}">${t("feedbackNoteLabel")}</label>
        <textarea class="feedback__note" id="nota-${tObj.id}" placeholder="${t("feedbackNotePlaceholder")}"></textarea>
        <button type="button" class="feedback__submit" disabled>${t("feedbackSubmit")}</button>
        <div class="feedback__thanks" hidden>
          <span class="stamp-mark">✓</span>
          <span>${t("feedbackThanks")}</span>
        </div>
      </div>

      <button type="button" class="back-home-btn" data-action="go-home">${t("backHome")}</button>
    `;

    els.detailBody.querySelector('[data-action="go-home"]').addEventListener("click", goHome);

    const listenBtn = els.detailBody.querySelector("#btn-listen");
    if (!window.MuniGuiaVoz.soportado) {
      listenBtn.disabled = true;
      listenBtn.querySelector(".listen-btn__text").textContent = t("listenUnsupported");
    } else {
      listenBtn.addEventListener("click", () => {
        const enLectura = listenBtn.classList.contains("is-speaking");
        if (enLectura) {
          window.MuniGuiaVoz.detener();
          listenBtn.classList.remove("is-speaking");
          listenBtn.querySelector(".listen-btn__text").textContent = t("listen");
        } else {
          listenBtn.classList.add("is-speaking");
          listenBtn.querySelector(".listen-btn__text").textContent = t("stopListen");
          window.MuniGuiaVoz.leer(textoParaLeer(data), currentLang, () => {
            listenBtn.classList.remove("is-speaking");
            listenBtn.querySelector(".listen-btn__text").textContent = t("listen");
          });
        }
      });
    }

    const fbBlock = els.detailBody.querySelector(".feedback");
    const fbButtons = fbBlock.querySelectorAll(".fb-btn");
    const submitBtn = fbBlock.querySelector(".feedback__submit");
    const thanks = fbBlock.querySelector(".feedback__thanks");
    let respuesta = null;

    fbButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        respuesta = btn.dataset.fb;
        fbButtons.forEach(b => b.classList.remove("is-selected-yes", "is-selected-no"));
        btn.classList.add(respuesta === "si" ? "is-selected-yes" : "is-selected-no");
        submitBtn.disabled = false;
      });
    });

    submitBtn.addEventListener("click", () => {
      const nota = fbBlock.querySelector(".feedback__note").value.trim();
      guardarFeedback(tObj.id, respuesta, nota);
      submitBtn.disabled = true;
      thanks.hidden = false;
    });

    showScreen("detail");
  }

  function guardarFeedback(tramiteId, util, nota) {
    try {
      const data = JSON.parse(localStorage.getItem("muniguia_feedback") || "[]");
      data.push({ tramiteId, util, nota, idioma: currentLang, fecha: new Date().toISOString() });
      localStorage.setItem("muniguia_feedback", JSON.stringify(data));
    } catch (err) {
      console.warn("No se pudo guardar el comentario localmente:", err);
    }
  }

  /* ---------- Chat con IA ---------- */
  let chatMessages = []; // { role: "user" | "assistant", content: string }
  let chatEnCurso = false;

  // Construye un resumen compacto de los trámites (en el idioma actual)
  // para que la IA responda con información real de Pushaq-IA y no
  // invente datos. Se genera solo con lo que ya existe en TRAMITES.
  function construirContextoTramites() {
    return TRAMITES.map(tObj => {
      const d = campo(tObj);
      return [
        `### ${d.nombre}`,
        `Resumen: ${d.resumen}`,
        `Descripción: ${d.descripcion}`,
        `Requisitos: ${d.requisitos.join("; ")}`,
        `Pasos: ${d.pasos.join(" → ")}`,
        `Lugar de atención: ${d.lugar.area}, ${d.lugar.direccion} (${d.lugar.horario})`,
        `Recomendaciones: ${d.recomendaciones.join("; ")}`
      ].join("\n");
    }).join("\n\n");
  }

  // Convierte un pequeño subconjunto de markdown (**negrita**, ### títulos,
  // listas con "-") en HTML seguro para mostrar dentro de la burbuja.
  function formatearRespuestaIA(texto) {
    const escapar = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const lineas = escapar(texto).split("\n");
    let html = "";
    let enLista = false;
    const cerrarLista = () => { if (enLista) { html += "</ul>"; enLista = false; } };

    lineas.forEach(linea => {
      const l = linea.trim();
      const conNegritas = (s) => s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      if (!l) { cerrarLista(); return; }
      if (l.startsWith("### ")) { cerrarLista(); html += `<h4>${conNegritas(l.slice(4))}</h4>`; return; }
      if (l.startsWith("## ")) { cerrarLista(); html += `<h3>${conNegritas(l.slice(3))}</h3>`; return; }
      if (l.startsWith("- ") || l.startsWith("* ")) {
        if (!enLista) { html += "<ul>"; enLista = true; }
        html += `<li>${conNegritas(l.slice(2))}</li>`;
        return;
      }
      cerrarLista();
      html += `<p>${conNegritas(l)}</p>`;
    });
    cerrarLista();
    return html || `<p>${escapar(texto)}</p>`;
  }

  function addAiBubble(texto, tipo) {
    const bubble = document.createElement("div");
    bubble.className = `bubble bubble--${tipo}`;
    if (tipo === "bot") {
      bubble.innerHTML = formatearRespuestaIA(texto);
      const acciones = document.createElement("div");
      acciones.className = "bubble__actions";
      const speakBtn = document.createElement("button");
      speakBtn.type = "button";
      speakBtn.className = "bubble-speak-btn";
      speakBtn.innerHTML = `${ICONS.altavoz}<span>${t("aiChatListen")}</span>`;
      speakBtn.addEventListener("click", () => {
        const hablando = speakBtn.classList.contains("is-speaking");
        if (hablando) {
          window.MuniGuiaVoz.detener();
          speakBtn.classList.remove("is-speaking");
          speakBtn.querySelector("span").textContent = t("aiChatListen");
        } else {
          document.querySelectorAll(".bubble-speak-btn.is-speaking").forEach(b => b.classList.remove("is-speaking"));
          speakBtn.classList.add("is-speaking");
          speakBtn.querySelector("span").textContent = t("aiChatStop");
          const textoPlano = texto.replace(/\*\*/g, "").replace(/#{1,3}\s?/g, "").replace(/^-\s/gm, "");
          window.MuniGuiaVoz.leer(textoPlano, currentLang, () => {
            speakBtn.classList.remove("is-speaking");
            speakBtn.querySelector("span").textContent = t("aiChatListen");
          });
        }
      });
      acciones.appendChild(speakBtn);
      bubble.appendChild(acciones);
    } else {
      bubble.textContent = texto;
    }
    els.aiChatLog.appendChild(bubble);
    els.aiChatLog.scrollTop = els.aiChatLog.scrollHeight;
    return bubble;
  }

  function mostrarEscribiendo() {
    const wrap = document.createElement("div");
    wrap.className = "bubble bubble--bot";
    wrap.id = "ai-typing-indicator";
    wrap.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    els.aiChatLog.appendChild(wrap);
    els.aiChatLog.scrollTop = els.aiChatLog.scrollHeight;
  }
  function quitarEscribiendo() {
    const el = document.getElementById("ai-typing-indicator");
    if (el) el.remove();
  }

  function mostrarErrorChat() {
    const div = document.createElement("div");
    div.className = "chat-error";
    div.textContent = t("aiChatError");
    els.aiChatLog.appendChild(div);
    els.aiChatLog.scrollTop = els.aiChatLog.scrollHeight;
  }

  async function enviarMensajeIA() {
    const texto = els.aiChatInput.value.trim();
    if (!texto || chatEnCurso) return;

    els.aiChatInput.value = "";
    els.aiChatInput.style.height = "auto";
    addAiBubble(texto, "user");
    chatMessages.push({ role: "user", content: texto });

    chatEnCurso = true;
    els.aiChatSend.disabled = true;
    mostrarEscribiendo();

    try {
      const respuesta = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatMessages,
          lang: currentLang,
          context: construirContextoTramites()
        })
      });

      quitarEscribiendo();

      if (!respuesta.ok) {
        mostrarErrorChat();
        return;
      }

      const data = await respuesta.json();
      const textoRespuesta = data.response || t("aiChatError");
      addAiBubble(textoRespuesta, "bot");
      chatMessages.push({ role: "assistant", content: textoRespuesta });
    } catch (err) {
      console.error("Error del chat con IA:", err);
      quitarEscribiendo();
      mostrarErrorChat();
    } finally {
      chatEnCurso = false;
      els.aiChatSend.disabled = false;
    }
  }

  function resetAiChat() {
    window.MuniGuiaVoz.detener();
    chatMessages = [];
    els.aiChatLog.innerHTML = "";
    addAiBubble(t("aiChatWelcome"), "bot");
  }

  els.aiChatSend.addEventListener("click", enviarMensajeIA);
  els.aiChatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensajeIA();
    }
  });
  // El campo de texto crece automáticamente hasta 4 líneas aproximadamente
  els.aiChatInput.addEventListener("input", () => {
    els.aiChatInput.style.height = "auto";
    els.aiChatInput.style.height = Math.min(els.aiChatInput.scrollHeight, 120) + "px";
  });

  /* ---------- Inicialización ---------- */
  let idiomaGuardado = null;
  try { idiomaGuardado = localStorage.getItem("muniguia_lang"); } catch (e) {}

  if (idiomaGuardado && TRANSLATIONS[idiomaGuardado]) {
    els.app.classList.remove("lang-pending");
    applyLanguage(idiomaGuardado);
    showScreen("home");
  } else {
    applyLanguage("es"); // idioma de la propia pantalla de bienvenida (textos internos)
    showScreen("language");
  }

  // En escritorio, el panel de IA siempre está visible (ver CSS), así que
  // mostramos el mensaje de bienvenida sin esperar a que el usuario navegue.
  if (esEscritorio()) openAiPanel();
})();

