const contenedorCitas = document.getElementById('citas');
const contenedorImagenes = document.getElementById('imagenes');
const botonVerificar = document.getElementById('chequear');
const contenedorResultado = document.getElementById('resultado');
const lienzoFlechas = document.getElementById('flechas');

let datosCitas = [];
let datosImagenes = [];
let citasAleatorias = [];
let imagenesAleatorias = [];

let seleccionActual = [];
let listaEmparejamientos = [];

function barajarLista(lista) {
  return lista
    .map(item => ({ item, orden: Math.random() }))
    .sort((a, b) => a.orden - b.orden)
    .map(({ item }) => item);
}

function generarContenido() {
  contenedorCitas.innerHTML = '';
  contenedorImagenes.innerHTML = '';
  lienzoFlechas.innerHTML = '';

  citasAleatorias.forEach((elemento, indice) => {
    const divCita = document.createElement('div');
    divCita.classList.add('cita');
    divCita.textContent = elemento.quote;
    divCita.dataset.index = indice;
    divCita.addEventListener('click', () => manejarSeleccion('cita', indice));
    contenedorCitas.appendChild(divCita);
  });

  imagenesAleatorias.forEach((elemento, indice) => {
    const divImagen = document.createElement('div');
    divImagen.classList.add('imagen');
    divImagen.dataset.index = indice;
    const img = document.createElement('img');
    img.src = elemento.image;
    img.alt = elemento.character;
    divImagen.appendChild(img);
    divImagen.addEventListener('click', () => manejarSeleccion('imagen', indice));
    contenedorImagenes.appendChild(divImagen);
  });
}

function manejarSeleccion(tipoElemento, indiceElemento) {
  if (seleccionActual.length === 2) return;
  if (seleccionActual.find(el => el.tipo === tipoElemento && el.index === indiceElemento)) return;
  if (seleccionActual.length === 1 && seleccionActual[0].tipo === tipoElemento) return;

  seleccionActual.push({ tipo: tipoElemento, index: indiceElemento });
  resaltarSeleccion(tipoElemento, indiceElemento);

  if (seleccionActual.length === 2) {
    const indiceCita = seleccionActual.find(el => el.tipo === 'cita').index;
    const indiceImagen = seleccionActual.find(el => el.tipo === 'imagen').index;

    listaEmparejamientos.push({ citaIndex: indiceCita, imagenIndex: indiceImagen });

    deshabilitarElemento('cita', indiceCita);
    deshabilitarElemento('imagen', indiceImagen);

    trazarLinea(indiceCita, indiceImagen);

    seleccionActual = [];
  }
}

function resaltarSeleccion(tipo, index) {
  const contenedor = tipo === 'cita' ? contenedorCitas : contenedorImagenes;
  const elemento = contenedor.children[index];
  elemento.classList.add('seleccionado');
}

function deshabilitarElemento(tipo, index) {
  const contenedor = tipo === 'cita' ? contenedorCitas : contenedorImagenes;
  const elemento = contenedor.children[index];
  elemento.style.pointerEvents = 'none';
  elemento.classList.add('seleccionado');
}

function verificarEmparejamientos() {
  let totalCorrectos = 0;
  listaEmparejamientos.forEach(pareja => {
    const cita = citasAleatorias[pareja.citaIndex];
    const imagen = imagenesAleatorias[pareja.imagenIndex];
    const divCita = contenedorCitas.children[pareja.citaIndex];
    const divImagen = contenedorImagenes.children[pareja.imagenIndex];

    if (cita.character === imagen.character) {
      totalCorrectos++;
      divCita.classList.add('correcto');
      divImagen.classList.add('correcto');
    } else {
      divCita.classList.add('incorrecto');
      divImagen.classList.add('incorrecto');
    }
  });

  contenedorResultado.textContent = `Acertaste \n ${totalCorrectos} / ${listaEmparejamientos.length} `;
}

function trazarLinea(indiceCita, indiceImagen) {
  const elementoCita = contenedorCitas.children[indiceCita];
  const elementoImagen = contenedorImagenes.children[indiceImagen];

  const inicio = elementoCita.getBoundingClientRect();
  const fin = elementoImagen.getBoundingClientRect();

  const marco = document.body.getBoundingClientRect();

  const xInicio = inicio.right - marco.left;
  const yInicio = inicio.top + inicio.height / 2 - marco.top;

  const xFin = fin.left - marco.left;
  const yFin = fin.top + fin.height / 2 - marco.top;

  const linea = document.createElementNS("http://www.w3.org/2000/svg", "line");
  linea.setAttribute("x1", xInicio);
  linea.setAttribute("y1", yInicio);
  linea.setAttribute("x2", xFin);
  linea.setAttribute("y2", yFin);
  linea.setAttribute("stroke", "black");
  linea.setAttribute("stroke-width", "2");
  linea.setAttribute("marker-end", "url(#flecha)");

  lienzoFlechas.appendChild(linea);
}

function obtenerDatos() {
  fetch('https://thesimpsonsquoteapi.glitch.me/quotes?count=5')
    .then(resp => resp.json())
    .then(info => {
      datosCitas = info.map(item => ({
        quote: item.quote,
        character: item.character,
        image: item.image
      }));

      citasAleatorias = barajarLista(datosCitas);
      imagenesAleatorias = barajarLista(datosCitas);

      definirMarcadorFlecha();
      generarContenido();
      seleccionActual = [];
      listaEmparejamientos = [];
    })
    .catch(() => {
      contenedorResultado.textContent = 'Error al cargar las citas.';
    });
}

function definirMarcadorFlecha() {
  lienzoFlechas.innerHTML = `
    <defs>
      <marker id="flecha" markerWidth="10" markerHeight="7" refX="10" refY="3.5"
        orient="auto" markerUnits="strokeWidth">
        <polygon points="0 0, 10 3.5, 0 7" fill="black" />
      </marker>
    </defs>
  `;
}

botonVerificar.addEventListener('click', () => {
  if (listaEmparejamientos.length === 0) {
    contenedorResultado.textContent = 'No has emparejado nada aún.';
    return;
  }
  verificarEmparejamientos();
});

obtenerDatos();
