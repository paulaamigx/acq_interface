/*
Idle:
    Seleccionando una fuente de video (si es que no hubiera alguna seleccionada):
        * Renderizar el canvas y no el video.
        * Actualizar el contenido del boton de control a "Empezar" y deshabilitarlo.
        * Mostrar un mensaje en el canvas indicando que seleccione una fuente en el panel.
        * Mostrar en el panel la pestaña de configuración, deshabilitando las otras.
        * Deshabilitar el botón de captura.
        * Esconder la barra de progreso.
        * Esconder el spinner.
    # Nota 1: En este estado se debe ejecutar una funcion de limpieza que resetee toda la memoria.
GetCon:
    Negociando la conexión con AWS.
        * Renderizar el canvas y no el video.
        * Actualizar el contenido del boton de control a "Cancelar" y deshabilitarlo.
        * Mostrar un mensaje en el canvas indicando que se está estableciendo conexión.
        * Mostrar en el panel la pestaña de configuración, deshabilitando las otras.
        * Deshabilitar el botón de captura.
        * Esconder la barra de progreso.
        * Mostrar el spinner.

CountDown:
    Mostramos un overlay con una cuenta atrás de 10 segundos antes de empezar.
        * Renderizar el canvas y no el video.
        * Actualizar el contenido del boton de control a "Cancelar" y habilitarlo.
        * Mostrar un countdown sobre el canvas.
        * Mostrar en el panel la pestaña de configuración, deshabilitando las otras.
        * Deshabilitar el botón de captura.
        * Mostrar la barra de progreso.
        * Esconder el spinner.

Examination:
    Examinación en curso. Enviamos los frames a AWS.
        * Renderizar el canvas y no el video.
        * Actualizar el contenido del boton de control a "Finalizar" y habilitarlo.
        * Mostrar sólo la imagen del dispositivo sobre el canvas.
        * Mostrar en el panel la pestaña de capturas, deshabilitando las otras.
        * Habilitar el botón de captura.
        * Mostrar la barra de progreso.
        * Esconder el spinner.

Review:
    La examinación ya terminó. Esperamos que llegue el diagnóstico. Ofrecemos descargas.
        * Renderizar el video y no el canvas.
        * Actualizar el contenido del boton de control a "Nueva Examinación" y habilitarlo.
        * Ocultar el canvas.
        * Mostrar en el panel la pestaña de capturas, descargas y diagnóstico, deshabilitando la otra.
        * Habilitar el botón de captura.
        * Esconder la barra de progreso.
        * Esconder el spinner.
    # Nota 1: En este caso se ofrece además la posibilidad de generar capturas adicionales desde el video.
    # Nota 2: Se debe mostrar un spinner dentro de la pestaña de diagnóstico mientras llega un diagnóstico.

Video -> Tiene un src fijo.
Canvas -> Obtiene capturas desde el video.
Controles:
    Start/Stop/Cancel
    Captura
    Spinner
Progreso -> Se activa solo durante la examinacion.
Menu -> 4 tabs.
    Configuracion: Espejado y la selección de cámara.
    Capturas: Muestra galería con las capturas de cámara realizadas.
    Descargas: Nos ofrece el video grabado y las capturas realizadas.
    Diagnostico: Resumen de los resultados de la examinación.
*/

export function manageStates(state){
	var flags = {};
	switch(state){
		case 'Idle':
            flags={
                // Render canvas or video
                renderCanvas: true,
                // Canvas Message
                canvasMessage: "Seleccione un dispositivo de imagen en el panel de configuración.",
                // Show Spinner
                showSpinner: false,
                // Button state
                textCtrlBtn: "Empezar",
                enableCtrlBtn: true,
                enableCaptureBtn: false,
                // Side Panel
                tabsEnabled: [1,0,0,0],
  							GallerySrc: [],
  
  							isVideoLoading: true,
  							hideSidePanel: false,
  
  							tabOn: 1

            };
            break;
        case 'GetCon':
            flags={
                // Render canvas or video
                renderCanvas: true,
                // Canvas Message
                canvasMessage: "Estableciendo conexión.",
                // Button state
                textCtrlBtn: "Cancelar",
                enableCtrlBtn: false,
                enableCaptureBtn: false,
                // Side Panel
                tabsEnabled: [0,0,0,0],
            };
            break;
        case 'Countdown':
            flags={			  
                // Render canvas or video
                renderCanvas: true,
                // Canvas Message
                canvasMessage: "",
                // Button state
                textCtrlBtn: "Cancelar",
                enableCtrlBtn: true,
                enableCaptureBtn: false,
                // Side Panel
                tabsEnabled: [0,0,0,0],
            };
            break;
        case 'Examination':
            flags={
                // Render canvas or video
                renderCanvas: true,
                // Canvas Message
                canvasMessage: "",
                // Button state
                textCtrlBtn: "Finalizar",
                enableCtrlBtn: true,
                enableCaptureBtn: true,
                // Side Panel
                tabsEnabled: [0,0,1,0],
            };
            break;
        case 'Review':
            flags={
                // Render canvas or video
                renderCanvas: false,
                // Canvas Message
                canvasMessage: "",
                // Button state
                textCtrlBtn: "Nueva Examinación",
                enableCtrlBtn: true,
                enableCaptureBtn: true,
                // Side Panel
                tabsEnabled: [0,0,1,1],
            };
            break;
        default:
            console.log('State not defined');  
    }
	return flags;
  }

 
  export default {manageStates};
