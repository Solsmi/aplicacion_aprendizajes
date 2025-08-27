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
  
  return {
    pomodoros: pomodoros,
    minutosDescansoCorto: minutosDescansoCorto,
    minutosDescansoLargo: minutosDescansoLargo,
    minutosDescansoTotal: minutosDescansoTotal,
    ciclosCompletos: ciclosCompletos
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