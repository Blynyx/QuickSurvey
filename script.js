// 1. Arreglo de preguntas (fuente de verdad)
var preguntas = [
  {
    id: 1,
    texto: "¿Qué tan satisfecho estás con el curso?",
    tipo: "radio",
    opciones: [
      "1 - Muy insatisfecho",
      "2 - Insatisfecho",
      "3 - Neutral",
      "4 - Satisfecho",
      "5 - Muy satisfecho"
    ],
    obligatoria: true
  },
  {
    id: 2,
    texto: "¿Cómo consideras la dificultad del curso?",
    tipo: "select",
    opciones: [
      "Muy fácil",
      "Fácil",
      "Adecuada",
      "Difícil",
      "Muy difícil"
    ],
    obligatoria: true
  },
  {
    id: 3,
    texto: "¿Qué recurso te ayuda más a aprender?",
    tipo: "radio",
    opciones: [
      "Clases teóricas",
      "Prácticas",
      "Ejemplos de código",
      "Material de estudio",
      "Trabajo individual"
    ],
    obligatoria: true
  },
  {
    id: 4,
    texto: "¿Qué aspecto del curso mejorarías?",
    tipo: "textarea",
    obligatoria: false
  },
  {
    id: 5,
    texto: "¿Recomendarías el curso a otro estudiante?",
    tipo: "radio",
    opciones: [
      "Sí",
      "No"
    ],
    obligatoria: true
  }
];

// 2. Respuestas del usuario (solo en memoria)
var respuestas = {};

// 3. Índice de la pregunta que se está mostrando
var preguntaActual = 0;

// 4. Selección de elementos del DOM
var encuesta = document.querySelector("#encuesta");
var resultados = document.querySelector("#resultados");
var contenedorPregunta = document.querySelector("#contenedor-pregunta");
var textoProgreso = document.querySelector("#texto-progreso");
var rellenoProgreso = document.querySelector("#relleno-progreso");
var mensajeValidacion = document.querySelector("#mensaje-validacion");
var resumen = document.querySelector("#resumen");
var estadisticas = document.querySelector("#estadisticas");
var botonAnterior = document.querySelector("#boton-anterior");
var botonSiguiente = document.querySelector("#boton-siguiente");
var botonFinalizar = document.querySelector("#boton-finalizar");
var botonReiniciar = document.querySelector("#boton-reiniciar");

// 5. Renderizado de la pregunta actual
function limpiarContenedor(contenedor) {
  while (contenedor.firstChild) {
    contenedor.firstChild.remove();
  }
}

function crearOpcionesRadio(pregunta, respuestaGuardada) {
  var contenedor = document.createElement("div");
  contenedor.setAttribute("class", "opciones-radio");

  var i;
  for (i = 0; i < pregunta.opciones.length; i++) {
    var textoOpcion = pregunta.opciones[i];

    var etiqueta = document.createElement("label");
    etiqueta.setAttribute("class", "opcion");

    var input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.setAttribute("name", "respuesta");
    input.setAttribute("value", textoOpcion);

    if (respuestaGuardada === textoOpcion) {
      input.checked = true;
    }

    var texto = document.createElement("span");
    texto.textContent = textoOpcion;

    etiqueta.appendChild(input);
    etiqueta.appendChild(texto);
    contenedor.appendChild(etiqueta);
  }

  return contenedor;
}

function crearSelect(pregunta, respuestaGuardada) {
  var select = document.createElement("select");
  select.setAttribute("id", "control-respuesta");

  var opcionVacia = document.createElement("option");
  opcionVacia.setAttribute("value", "");
  opcionVacia.textContent = "Selecciona una opción";
  select.appendChild(opcionVacia);

  var i;
  for (i = 0; i < pregunta.opciones.length; i++) {
    var textoOpcion = pregunta.opciones[i];
    var opcion = document.createElement("option");
    opcion.setAttribute("value", textoOpcion);
    opcion.textContent = textoOpcion;

    if (respuestaGuardada === textoOpcion) {
      opcion.selected = true;
    }

    select.appendChild(opcion);
  }

  return select;
}

function crearTextarea(respuestaGuardada) {
  var textarea = document.createElement("textarea");
  textarea.setAttribute("id", "control-respuesta");
  textarea.setAttribute("rows", "5");
  textarea.setAttribute("placeholder", "Escribe tu respuesta (opcional)");

  if (respuestaGuardada) {
    textarea.value = respuestaGuardada;
  }

  return textarea;
}

function mostrarPregunta() {
  limpiarContenedor(contenedorPregunta);

  var pregunta = preguntas[preguntaActual];
  var respuestaGuardada = respuestas[pregunta.id];

  var titulo = document.createElement("h2");
  titulo.textContent = pregunta.texto;
  contenedorPregunta.appendChild(titulo);

  var aviso = document.createElement("p");
  if (pregunta.obligatoria) {
    aviso.setAttribute("class", "aviso-obligatoria");
    aviso.textContent = "Pregunta obligatoria";
  } else {
    aviso.setAttribute("class", "aviso-opcional");
    aviso.textContent = "Pregunta opcional";
  }
  contenedorPregunta.appendChild(aviso);

  var control;
  if (pregunta.tipo === "radio") {
    control = crearOpcionesRadio(pregunta, respuestaGuardada);
  }
  if (pregunta.tipo === "select") {
    control = crearSelect(pregunta, respuestaGuardada);
  }
  if (pregunta.tipo === "textarea") {
    control = crearTextarea(respuestaGuardada);
  }

  contenedorPregunta.appendChild(control);

  actualizarProgreso();
  actualizarBotones();
  ocultarValidacion();
}

// 6. Guardar la respuesta de la pregunta actual
function obtenerValorActual() {
  var pregunta = preguntas[preguntaActual];

  if (pregunta.tipo === "radio") {
    var radios = document.querySelectorAll('input[name="respuesta"]');
    var i;
    for (i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        return radios[i].value;
      }
    }
    return "";
  }

  if (pregunta.tipo === "select") {
    var select = document.querySelector("#control-respuesta");
    if (select) {
      return select.value;
    }
    return "";
  }

  if (pregunta.tipo === "textarea") {
    var textarea = document.querySelector("#control-respuesta");
    if (textarea) {
      return textarea.value.trim();
    }
    return "";
  }

  return "";
}

function guardarRespuesta() {
  var pregunta = preguntas[preguntaActual];
  var valor = obtenerValorActual();
  respuestas[pregunta.id] = valor;
}

// 7. Validar si se puede avanzar o finalizar
function mostrarValidacion(mensaje) {
  mensajeValidacion.textContent = mensaje;
  mensajeValidacion.classList.remove("oculto");
}

function ocultarValidacion() {
  mensajeValidacion.textContent = "";
  mensajeValidacion.classList.add("oculto");
}

function esRespuestaVacia(valor) {
  return valor === undefined || valor === "";
}

function validarRespuesta() {
  guardarRespuesta();

  var pregunta = preguntas[preguntaActual];
  var valor = respuestas[pregunta.id];

  if (pregunta.obligatoria && esRespuestaVacia(valor)) {
    mostrarValidacion("Esta pregunta es obligatoria. Debes responder para continuar.");
    return false;
  }

  ocultarValidacion();
  return true;
}

function hayObligatoriasSinResponder() {
  var i;
  for (i = 0; i < preguntas.length; i++) {
    var pregunta = preguntas[i];
    var valor = respuestas[pregunta.id];

    if (pregunta.obligatoria && esRespuestaVacia(valor)) {
      return true;
    }
  }

  return false;
}

// 8. Avanzar a la siguiente pregunta
function avanzar() {
  if (!validarRespuesta()) {
    return;
  }

  preguntaActual = preguntaActual + 1;
  mostrarPregunta();
}

// 9. Retroceder a la pregunta anterior
function retroceder() {
  guardarRespuesta();
  preguntaActual = preguntaActual - 1;
  mostrarPregunta();
}

// 10. Actualizar progreso y botones
function actualizarProgreso() {
  var numero = preguntaActual + 1;
  var total = preguntas.length;
  textoProgreso.textContent = "Pregunta " + numero + " de " + total;

  rellenoProgreso.classList.remove("paso-1", "paso-2", "paso-3", "paso-4", "paso-5");
  rellenoProgreso.classList.add("paso-" + numero);
}

function actualizarBotones() {
  var esPrimera = preguntaActual === 0;
  var esUltima = preguntaActual === preguntas.length - 1;

  if (esPrimera) {
    botonAnterior.classList.add("oculto");
    botonSiguiente.classList.remove("oculto");
    botonFinalizar.classList.add("oculto");
    return;
  }

  if (esUltima) {
    botonAnterior.classList.remove("oculto");
    botonSiguiente.classList.add("oculto");
    botonFinalizar.classList.remove("oculto");
    return;
  }

  botonAnterior.classList.remove("oculto");
  botonSiguiente.classList.remove("oculto");
  botonFinalizar.classList.add("oculto");
}

// 11. Finalizar la encuesta
function finalizarEncuesta() {
  if (!validarRespuesta()) {
    return;
  }

  if (hayObligatoriasSinResponder()) {
    mostrarValidacion("Faltan preguntas obligatorias por responder.");
    return;
  }

  encuesta.classList.add("oculto");
  resultados.classList.remove("oculto");

  mostrarResumen();
  calcularEstadisticas();
}

// 12. Mostrar resumen de respuestas
function mostrarResumen() {
  limpiarContenedor(resumen);

  var i;
  for (i = 0; i < preguntas.length; i++) {
    var pregunta = preguntas[i];
    var respuesta = respuestas[pregunta.id];

    if (esRespuestaVacia(respuesta)) {
      respuesta = "Sin respuesta";
    }

    var item = document.createElement("article");
    item.setAttribute("class", "item-resumen");

    var titulo = document.createElement("h3");
    titulo.textContent = pregunta.texto;

    var valor = document.createElement("p");
    valor.textContent = respuesta;

    item.appendChild(titulo);
    item.appendChild(valor);
    resumen.appendChild(item);
  }
}

// 13. Calcular y mostrar estadísticas simples
function crearItemEstadistica(titulo, valor) {
  var item = document.createElement("article");
  item.setAttribute("class", "item-estadistica");

  var encabezado = document.createElement("h3");
  encabezado.textContent = titulo;

  var dato = document.createElement("p");
  dato.textContent = valor;

  item.appendChild(encabezado);
  item.appendChild(dato);
  return item;
}

function calcularEstadisticas() {
  limpiarContenedor(estadisticas);

  var total = preguntas.length;
  var respondidas = 0;
  var obligatoriasCompletadas = 0;
  var i;

  for (i = 0; i < preguntas.length; i++) {
    var pregunta = preguntas[i];
    var valor = respuestas[pregunta.id];
    var tieneRespuesta = !esRespuestaVacia(valor);

    if (tieneRespuesta) {
      respondidas = respondidas + 1;
    }

    if (pregunta.obligatoria && tieneRespuesta) {
      obligatoriasCompletadas = obligatoriasCompletadas + 1;
    }
  }

  var porcentaje = Math.round((respondidas / total) * 100);

  var satisfaccion = respuestas[1];
  if (esRespuestaVacia(satisfaccion)) {
    satisfaccion = "Sin respuesta";
  }

  estadisticas.appendChild(crearItemEstadistica("Preguntas respondidas", String(respondidas)));
  estadisticas.appendChild(crearItemEstadistica("Total de preguntas", String(total)));
  estadisticas.appendChild(crearItemEstadistica("Porcentaje respondido", porcentaje + "%"));
  estadisticas.appendChild(crearItemEstadistica("Obligatorias completadas", String(obligatoriasCompletadas)));
  estadisticas.appendChild(crearItemEstadistica("Nivel de satisfacción", satisfaccion));
}

// 14. Reiniciar la encuesta sin recargar la página
function reiniciarEncuesta() {
  respuestas = {};
  preguntaActual = 0;

  limpiarContenedor(resumen);
  limpiarContenedor(estadisticas);

  resultados.classList.add("oculto");
  encuesta.classList.remove("oculto");

  ocultarValidacion();
  mostrarPregunta();
}

// 15. Eventos iniciales
botonAnterior.addEventListener("click", retroceder);
botonSiguiente.addEventListener("click", avanzar);
botonFinalizar.addEventListener("click", finalizarEncuesta);
botonReiniciar.addEventListener("click", reiniciarEncuesta);

// 16. Inicio de la aplicación
mostrarPregunta();
