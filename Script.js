function actualizarReloj() {
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const segundos = ahora.getSeconds().toString().padStart(2, '0');
    const horaFormateada = `${horas}:${minutos}:${segundos}`;
    document.getElementById('reloj').textContent = horaFormateada;
}

setInterval(actualizarReloj, 1000);
actualizarReloj();

document.addEventListener('DOMContentLoaded', () => {
    const botonRegistrar = document.getElementById('registrar-asistencia');
    const selectorIntegrante = document.getElementById('integrante');
    const mensajeConfirmacion = document.getElementById('mensaje-confirmacion'); // Lo mantendremos oculto
    const mensajesApp = document.getElementById('mensajes-app');
    let asistenciaRegistrada = false;
    const salaEnsayoCoordenadas = { latitude: -24.7859, longitude: -65.4117 }; // Coordenadas de Salta (aproximadas)
    const radioTolerancia = 0.1; // Radio en kilómetros
    const horaSaltaOffset = -3; // Diferencia horaria de Salta con UTC

    function calcularDistancia(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    function mostrarMensajeApp(mensaje, tipo) {
        mensajesApp.textContent = mensaje;
        mensajesApp.className = tipo; // 'error' o 'success'
    }

    function registrarAsistencia(nombre, estado) {
        mostrarMensajeApp(`Asistencia registrada como: ${estado}`, 'success');
        selectorIntegrante.disabled = true;
        botonRegistrar.disabled = true;
        asistenciaRegistrada = true;

        const ahoraSalta = new Date(new Date().getTime() + horaSaltaOffset * 60 * 60 * 1000);
        const mes = ahoraSalta.getMonth();
        const año = ahoraSalta.getFullYear();
        console.log(`Asistencia registrada para: ${nombre} - Estado: ${estado} - Hora (Salta): ${ahoraSalta.toLocaleTimeString()}`);

        if (estado === 'Llegada Tarde') {
            const llegadasTardeMes = Math.floor(Math.random() * 3);
            mostrarMensajeApp(`Llegada Tarde. Has acumulado ${llegadasTardeMes} llegadas tarde este mes.`, 'error');
        }
    }

    botonRegistrar.addEventListener('click', () => {
        if (asistenciaRegistrada) {
            mostrarMensajeApp('Ya has registrado tu asistencia para este ensayo.', 'error');
            return;
        }

        const nombreSeleccionado = selectorIntegrante.value;

        if (!nombreSeleccionado) {
            mostrarMensajeApp('Por favor, selecciona tu nombre.', 'error');
            return;
        }

        const ahoraUTC = new Date();
        const
