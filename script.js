// Array para almacenar las metas SMART
let metasSMART = [];

// Función para calcular pomodoros
function calcularPomodoros(horas) {
  // Convertir horas a minutos
  const minutosTotales = horas * 60;
  
  // Cada pomodoro tiene 25 minutos de trabajo
  // Cada pomodoro tiene 5 minutos descanso
  // Cada 4 pomodoros hay un descanso largo de 30 minutos
  
  let minutosRestantes = minutosTotales;
  let pomodoros = 0;
  let minutosDescansoCorto = 0;
  let minutosDescansoLargo = 0;
  
  while (minutosRestantes > 0) {
    // Verificar si tenemos tiempo para un pomodoro completo (25 minutos)
    if (minutosRestantes >= 25) {
      pomodoros++;
      minutosRestantes -= 25;
      
      // Agregar descanso (5 minutos o 30 minutos cada 4 pomodoros)
      if (pomodoros % 4 === 0) {
        // Descanso largo de 30 minutos
        minutosDescansoLargo += 30;
        minutosRestantes -= 30;
      } else {
        // Descanso corto de 5 minutos
        minutosDescansoCorto += 5;
        minutosRestantes -= 5;
      }
    } else {
      // Si no hay suficiente tiempo para un pomodoro completo, terminamos
      break;
    }
  }
  
  const minutosDescansoTotal = minutosDescansoCorto + minutosDescansoLargo;
  const ciclosCompletos = Math.floor(pomodoros / 4);
  
  // Generar plan de trabajo detallado
  const planTrabajo = [];
  let minutosRestantesPlan = minutosTotales;
  let pomodoroContador = 1;
  
  while (minutosRestantesPlan > 0) {
    // Verificar si tenemos tiempo para un pomodoro completo (25 minutos)
    if (minutosRestantesPlan >= 25) {
      planTrabajo.push({
        tipo: 'pomodoro',
        nombre: `Pomodoro ${pomodoroContador}`,
        duracion: 25,
        color: '#4a6fa5'
      });
      pomodoroContador++;
      minutosRestantesPlan -= 25;
      
      // Agregar descanso (5 minutos o 30 minutos cada 4 pomodoros)
      if ((pomodoroContador - 1) % 4 === 0) {
        // Descanso largo de 30 minutos
        planTrabajo.push({
          tipo: 'descanso-largo',
          nombre: 'Descanso Largo',
          duracion: 30,
          color: '#ff6b6b'
        });
        minutosRestantesPlan -= 30;
      } else {
        // Descanso corto de 5 minutos
        planTrabajo.push({
          tipo: 'descanso-corto',
          nombre: 'Descanso Corto',
          duracion: 5,
          color: '#6b8cbc'
        });
        minutosRestantesPlan -= 5;
      }
    } else {
      // Si no hay suficiente tiempo para un pomodoro completo, terminamos
      break;
    }
  }
  
  return {
    pomodoros: pomodoros,
    minutosDescansoCorto: minutosDescansoCorto,
    minutosDescansoLargo: minutosDescansoLargo,
    minutosDescansoTotal: minutosDescansoTotal,
    ciclosCompletos: ciclosCompletos,
    planTrabajo: planTrabajo
  };
}

// Función para mostrar resultado de pomodoros
function mostrarResultadoPomodoros() {
  const horasEstudio = parseFloat(document.getElementById('horas-estudio').value);
  
  if (isNaN(horasEstudio) || horasEstudio <= 0) {
    document.getElementById('resultado-pomodoros').innerHTML = '<p style="color: var(--danger-color);">Por favor, ingresa un número válido de horas.</p>';
    return;
  }
  
  const resultado = calcularPomodoros(horasEstudio);
  
  document.getElementById('resultado-pomodoros').innerHTML = `
    <p>Para ${horasEstudio} horas de estudio necesitas:</p>
    <ul>
      <li><strong>${resultado.pomodoros}</strong> pomodoros de 25 minutos</li>
      <li><strong>${resultado.minutosDescansoCorto}</strong> minutos de descansos cortos (5 minutos cada uno)</li>
      <li><strong>${resultado.minutosDescansoLargo}</strong> minutos de descansos largos (30 minutos cada 4 pomodoros)</li>
      <li><strong>${resultado.minutosDescansoTotal}</strong> minutos de descanso total</li>
      <li><strong>${resultado.ciclosCompletos}</strong> ciclos completos de 4 pomodoros</li>
    </ul>
  `;
  
  // Generar gráfico
  generarGraficoPomodoros(resultado);
}

// Función para generar gráfico de pomodoros
function generarGraficoPomodoros(datos) {
  const contenedorGrafico = document.getElementById('grafico-pomodoros');
  
  // Limpiar contenido previo
  contenedorGrafico.innerHTML = '';
  
  // Crear título para el gráfico
  const tituloGrafico = document.createElement('h3');
  tituloGrafico.textContent = 'Distribución del Tiempo';
  tituloGrafico.style.textAlign = 'center';
  contenedorGrafico.appendChild(tituloGrafico);
  
  // Verificar si hay plan de trabajo
  if (!datos.planTrabajo || datos.planTrabajo.length === 0) {
    contenedorGrafico.innerHTML += '<p>No hay plan de trabajo para mostrar.</p>';
    return;
  }
  
  // Crear contenedor para el gráfico y la leyenda
  const contenedorFlex = document.createElement('div');
  contenedorFlex.style.display = 'flex';
  contenedorFlex.style.flexWrap = 'wrap';
  contenedorFlex.style.justifyContent = 'center';
  contenedorFlex.style.alignItems = 'center';
  contenedorGrafico.appendChild(contenedorFlex);
  
  // Crear contenedor SVG
  const svgContainer = document.createElement('div');
  svgContainer.style.flex = '1';
  svgContainer.style.minWidth = '300px';
  contenedorFlex.appendChild(svgContainer);
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '300');
  svg.setAttribute('height', '300');
  svg.setAttribute('viewBox', '0 0 300 300');
  svgContainer.appendChild(svg);
  
  // Crear contenedor para la leyenda
  const leyendaContainer = document.createElement('div');
  leyendaContainer.style.flex = '1';
  leyendaContainer.style.minWidth = '200px';
  leyendaContainer.style.padding = '1rem';
  contenedorFlex.appendChild(leyendaContainer);
  
  // Datos para el gráfico (plan de trabajo detallado)
  const datosGrafico = datos.planTrabajo;
  
  // Calcular el valor total
  const valorTotal = datosGrafico.reduce((sum, d) => sum + d.duracion, 0);
  
  // Si no hay datos, mostrar un mensaje
  if (valorTotal === 0) {
    contenedorGrafico.innerHTML = '<p>No hay datos para mostrar en el gráfico.</p>';
    return;
  }
  
  // Crear gráfico circular
  const cx = 150; // Centro X
  const cy = 150; // Centro Y
  const r = 100;  // Radio
  
  let anguloAcumulado = 0;
  
  // Crear segmentos del gráfico circular
  datosGrafico.forEach((dato, indice) => {
    // Calcular ángulo para este segmento (en radianes)
    const angulo = (dato.duracion / valorTotal) * 2 * Math.PI;
    
    // Calcular punto inicial del arco
    const x1 = cx + r * Math.cos(anguloAcumulado);
    const y1 = cy + r * Math.sin(anguloAcumulado);
    
    // Calcular punto final del arco
    const x2 = cx + r * Math.cos(anguloAcumulado + angulo);
    const y2 = cy + r * Math.sin(anguloAcumulado + angulo);
    
    // Determinar si el arco es mayor a 180 grados
    const largeArcFlag = angulo > Math.PI ? 1 : 0;
    
    // Crear path para el segmento
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArcFlag},1 ${x2},${y2} Z`);
    path.setAttribute('fill', dato.color);
    svg.appendChild(path);
    
    // Actualizar ángulo acumulado
    anguloAcumulado += angulo;
  });
  
  // Crear leyenda simplificada con los tipos de actividad
  const tiposActividad = [
    { nombre: 'Pomodoro', color: '#4a6fa5' },
    { nombre: 'Descanso Corto', color: '#6b8cbc' },
    { nombre: 'Descanso Largo', color: '#ff6b6b' }
  ];
  
  tiposActividad.forEach(tipo => {
    const leyendaItem = document.createElement('div');
    leyendaItem.style.display = 'flex';
    leyendaItem.style.alignItems = 'center';
    leyendaItem.style.marginBottom = '0.5rem';
    
    const colorBox = document.createElement('div');
    colorBox.style.width = '20px';
    colorBox.style.height = '20px';
    colorBox.style.backgroundColor = tipo.color;
    colorBox.style.marginRight = '0.5rem';
    colorBox.style.borderRadius = '3px';
    
    const textoLeyenda = document.createElement('span');
    textoLeyenda.textContent = tipo.nombre;
    
    leyendaItem.appendChild(colorBox);
    leyendaItem.appendChild(textoLeyenda);
    leyendaContainer.appendChild(leyendaItem);
  });
  
  // Crear sección separada para el plan de trabajo detallado
  const tituloPlan = document.createElement('h4');
  tituloPlan.textContent = 'Plan de Trabajo Detallado';
  tituloPlan.style.marginTop = '2rem';
  contenedorGrafico.appendChild(tituloPlan);
  
  const planContainer = document.createElement('div');
  planContainer.style.display = 'flex';
  planContainer.style.flexWrap = 'wrap';
  planContainer.style.gap = '0.5rem';
  planContainer.style.justifyContent = 'flex-start';
  planContainer.style.marginTop = '1rem';
  contenedorGrafico.appendChild(planContainer);
  
  // Mostrar los primeros 30 elementos del plan de trabajo
  const elementosMostrar = Math.min(datos.planTrabajo.length, 30);
  for (let i = 0; i < elementosMostrar; i++) {
    const actividad = datos.planTrabajo[i];
    const actividadElement = document.createElement('div');
    actividadElement.textContent = actividad.nombre;
    actividadElement.style.backgroundColor = actividad.color;
    planContainer.appendChild(actividadElement);
  }
  
  // Si hay más elementos, mostrar un mensaje
  if (datos.planTrabajo.length > 30) {
    const mensajeExtra = document.createElement('p');
    mensajeExtra.textContent = `... y ${datos.planTrabajo.length - 30} más`;
    mensajeExtra.style.fontStyle = 'italic';
    mensajeExtra.style.textAlign = 'left';
    contenedorGrafico.appendChild(mensajeExtra);
  }
}

// Función para evaluar hábitos
function evaluarHabitos() {
  const checkboxes = document.querySelectorAll('input[name="habito"]:checked');
  const totalHabitos = document.querySelectorAll('input[name="habito"]').length;
  const habitosCompletados = checkboxes.length;
  
  const porcentaje = totalHabitos > 0 ? Math.round((habitosCompletados / totalHabitos) * 10) : 0;
  
  let mensajeMotivacional = '';
  
  if (porcentaje === 0) {
    mensajeMotivacional = '¡Empieza a desarrollar buenos hábitos de estudio! Todos podemos mejorar.';
  } else if (porcentaje <= 25) {
    mensajeMotivacional = '¡Buen comienzo! Sigue esforzándote para desarrollar más hábitos saludables.';
  } else if (porcentaje <= 50) {
    mensajeMotivacional = '¡Vas por buen camino! Estás desarrollando una rutina saludable de estudio.';
 } else if (porcentaje <= 75) {
    mensajeMotivacional = '¡Excelente trabajo! Tienes muchos buenos hábitos de estudio.';
  } else if (porcentaje < 100) {
    mensajeMotivacional = '¡Increíble! Estás muy cerca de tener una rutina de estudio perfecta.';
  } else {
    mensajeMotivacional = '¡Felicidades! Tienes una rutina de estudio ejemplar. Sigue así.';
  }
  
  document.getElementById('resultado-habitos').innerHTML = `
    <p>Hábitos completados: <strong>${habitosCompletados}/${totalHabitos}</strong> (${porcentaje}%)</p>
    <p>${mensajeMotivacional}</p>
  `;
}

// Función para validar si una meta es SMART
function esMetaSMART(descripcion) {
  // Esta es una validación simplificada
  // En una implementación real, se podrían hacer preguntas más específicas
  const palabrasClave = ['específic', 'medible', 'alcanzable', 'relevante', 'tiempo'];
  let cumpleCriterios = 0;
  
  for (const palabra of palabrasClave) {
    if (descripcion.toLowerCase().includes(palabra)) {
      cumpleCriterios++;
    }
  }
  
  return cumpleCriterios >= 3; // Debe cumplir al menos 3 criterios
}

// Función para generar meta SMART
function generarMetaSMART() {
  const descripcion = document.getElementById('descripcion-meta').value;
  
  if (!descripcion.trim()) {
    alert('Por favor, ingresa una descripción para tu meta.');
    return;
  }
  
  // Validar si la meta es SMART
  const esSMART = esMetaSMART(descripcion);
  
  // Almacenar la meta en el array
  metasSMART.push({
    descripcion: descripcion,
    esSMART: esSMART,
    fecha: new Date().toLocaleDateString()
  });
  
  // Mostrar resultado
  const mensaje = esSMART 
    ? '¡Tu meta cumple con los criterios SMART! Está bien definida.' 
    : 'Tu meta podría mejorarse para cumplir con los criterios SMART. Considera hacerla más específica, medible y con un tiempo definido.';
  
  document.getElementById('resultado-metas').innerHTML = `
    <p><strong>${mensaje}</strong></p>
    <p>Meta almacenada: ${descripcion}</p>
    <p>Fecha: ${new Date().toLocaleDateString()}</p>
  `;
  
  // Limpiar el textarea
  document.getElementById('descripcion-meta').value = '';
  
  // Opcional: Mostrar todas las metas almacenadas
  console.log('Metas almacenadas:', metasSMART);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Event listener para el formulario de pomodoros
  document.getElementById('pomodoro-form').addEventListener('submit', function(e) {
    e.preventDefault();
    mostrarResultadoPomodoros();
  });
  
  // Event listener para el botón de evaluar hábitos
  document.getElementById('evaluar-habitos').addEventListener('click', evaluarHabitos);
  
  // Event listener para el botón de generar meta SMART
  document.getElementById('generar-meta').addEventListener('click', generarMetaSMART);
});