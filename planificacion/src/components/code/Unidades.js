import React, {useEffect, useState} from 'react';
import '../design/Unidades.css';
import axios from 'axios';
import { API_URL } from '../../config/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Areas from '../../assets/ArrowLeft.png';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
const { format } = require('date-fns');

const Unidades = ({plataforma, setPlataformaVisible, seccion, setMisSecciones, setMiArea, setMiIdArea, area, idArea, userId, setIdMiUnidad}) => {

    const [tipo, setTipo] = useState('');
    const [idUnidad, setIdUnidad] = useState('');
    const [unidad, setUnidad] = useState('');
    const [fechaDel, setFechaDel] = useState('');
    const [fechaAl, setFechaAl] = useState('');
    const [idGrado, setIdGrado] = useState(seccion.id_grado);
    const [idCiclo, setIdCiclo] = useState(seccion.id_ciclo);
    const [idSeccion, setIdSeccion] = useState(seccion.id_seccion);
    const [botonesVisibles, setBotonesVisibles] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
    const [unidadesCreadas, setUnidadesCreadas] = useState(0);
    const [encabezado, setEncabezado] = useState({});
    const [datosTabla, setDatosTabla] = useState([]);

    const handleSuccessMessage = (message) => {
        toast.success(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            style: {
                fontSize: '18px',
                border: '1px solid green',
            }
        });
    };
      
    const handleErrorMessage = (message) => {
        toast.error(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            style: {
                fontSize: '15px',
                border: '1px solid red',
            }
        });
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_URL}/unidades/${idGrado}/${idArea}/${userId}/${idCiclo}`);
            setUserData(response.data);
            console.log("Unidades", response.data);
            setUnidadesCreadas(response.data.unidades.length);
        } catch (error) {
            console.log(error);
        }
    };   

    useEffect( () => {
        fetchData();
    }, []);

    const fetchReportes = async () =>{
        try {
            const migrado = seccion.grado;

            let endpoint;

            switch (migrado) {
                case 'Primero':
                    endpoint = `${API_URL}/reportesPrimero/${idUnidad}`;
                    break;
                case 'Segundo':
                    endpoint = `${API_URL}/reportesSegundo/${idUnidad}`;
                    break;
                case 'Tercero':
                    endpoint = `${API_URL}/reportesTercero/${idUnidad}`;
                    break;
                case 'Cuarto':
                    endpoint = `${API_URL}/reportesCuarto/${idUnidad}`;
                    break;
                case 'Quinto':
                    endpoint = `${API_URL}/reportesQuinto/${idUnidad}`;
                    break;
                case 'Sexto':
                    endpoint = `${API_URL}/reportesSexto/${idUnidad}`;
                    break; 
                default:
                    console.warn("Grado no reconocido:", migrado);
                    return;
            }

            const response = await axios.get(endpoint);
            const { encabezado, datosTabla } = response.data;
            setEncabezado(encabezado);
            setDatosTabla(datosTabla);
          } catch (error) {
            console.error(error);
          }
    };
  
    const generarPDF = async () => {
        try {
          await fetchReportes(); // Esperar a que fetchReportes termine
          if (!encabezado || !datosTabla.length) {
            // Si encabezado o datosTabla no están definidos, no generamos el PDF
            console.error("Error: No hay datos para generar el PDF");
            return;
          }
      
          const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'cm',
            format: 'letter',
            margins: { top: 0.5, right: 0.5, bottom: 0.5, left: 0.5 }
          });
      
          // Ajustar posición del encabezado manualmente
          let posY = 1;

          if (encabezado.logotipo) {
            const imgWidth = 1; 
            const imgHeight = 1;
      
            // Centrar la imagen
            const xImg = (doc.internal.pageSize.width - imgWidth) / 2;
            doc.addImage(encabezado.logotipo, 'JPEG', xImg, posY, imgWidth, imgHeight);
            posY += imgHeight + 0.5;
          }
      
          posY += 0.5;

          doc.setFontSize(16);

          doc.setFont('helvetica', 'bold');

          const centeredText = (text, y) => {
            const textWidth = doc.getStringUnitWidth(text) * 14 / doc.internal.scaleFactor;
            const x = (doc.internal.pageSize.width - textWidth) / 2;
            doc.text(text, x, y);
          };

          centeredText(`PLANIFICACIÓN ESCOLAR ${encabezado.ciclo}`, posY);
          posY += 0.7;

          doc.setFontSize(12);

          const lineY = posY + 0.1;
          doc.setLineWidth(0.01);

          doc.setFont('helvetica', 'bold');          
          doc.text('Nombre del Establecimiento:', 1, posY);
          doc.setFont('helvetica', 'normal');
          doc.text(encabezado.establecimiento, 7.5, posY);
          doc.line(7.5, lineY, 26.5, lineY);
          posY += 0.7;

          doc.setFont('helvetica', 'bold');
          doc.text(`Dirección del Establecimiento:`, 1, posY);
          doc.setFont('helvetica', 'normal');
          doc.text(`${encabezado.direccion}, ${encabezado.municipio}, ${encabezado.departamento}`, 7.5, posY);
          doc.line(7.5, lineY+0.7, 26.5, lineY+0.7);
          posY += 0.7;
    
          doc.setFont('helvetica', 'bold');
          doc.text(`Director:`, 1, posY);
          doc.setFont('helvetica', 'normal');
          doc.text(`${encabezado.director}`, 3, posY);
          doc.line(3, lineY+1.4, 13, lineY+1.4);
      
          doc.setFont('helvetica', 'bold');
          doc.text(`Ciclo Escolar:`, 13.5, posY);
          doc.setFont('helvetica', 'normal');
          doc.text(`${encabezado.ciclo}`, 16.5, posY);
          doc.line(16.5, lineY+1.4, 18.5, lineY+1.4);
                
          doc.setFont('helvetica', 'bold');
          doc.text(`Jornada:`, 19, posY);
          doc.setFont('helvetica', 'normal');
          doc.text(`${encabezado.jornada}`, 21, posY);
          doc.line(21, lineY+1.4, 26.5, lineY+1.4);
          posY += 0.7;
      
          doc.setFont('helvetica', 'bold');
          doc.text(`Docente:`,1, posY);
          doc.setFont('helvetica', 'normal');
          doc.text(`${encabezado.primer_nombre} ${encabezado.segundo_nombre} ${encabezado.otros_nombres} ${encabezado.primer_apellido} ${encabezado.segundo_apellido}`, 3, posY);
          doc.line(3, lineY+2.1, 13, lineY+2.1);
          
          doc.setFont('helvetica', 'bold');
          doc.text(`Grado:`, 13.5, posY);
          doc.setFont('helvetica', 'normal');
          doc.text(`${encabezado.grado}`, 15, posY);
          doc.line(15, lineY+2.1, 18.5, lineY+2.1);
          
          doc.setFont('helvetica', 'bold');
          doc.text(`Sección:`, 19, posY);
          doc.setFont('helvetica', 'normal');
          doc.text(`${encabezado.seccion}`, 21, posY);
          doc.line(21, lineY+2.1, 22.5, lineY+2.1);
      
          doc.setFont('helvetica', 'bold');
          doc.text(`Unidad:`, 23, posY);
          doc.setFont('helvetica', 'normal');
          doc.text(`${encabezado.unidad}`, 24.7, posY);
          doc.line(24.7, lineY+2.1, 26.5, lineY+2.1);
          posY += 0.7;

          doc.setFont('helvetica', 'bold');
          doc.text(`Area:`, 1, posY);
          doc.setFont('helvetica', 'normal');
          doc.text(`${encabezado.area}`, 2.2, posY);
          doc.line(2.2, lineY+2.8, 11, lineY+2.8);
         
          doc.setFont('helvetica', 'bold');
          doc.text(`Tipo de Planificación:`, 11.5, posY);
          doc.setFont('helvetica', 'normal');
          doc.text(`${encabezado.tipo}`, 16, posY);
          doc.line(16, lineY+2.8, 18.5, lineY+2.8);

          const fechaDelFormateada = format(new Date(encabezado.fechadel), 'dd/MM/yyyy');
          doc.setFont('helvetica', 'bold');
          doc.text(`Del:`, 19, posY);
          doc.setFont('helvetica', 'normal');
          doc.text(`${fechaDelFormateada}`, 20, posY);
          doc.line(20, lineY+2.8, 22.5, lineY+2.8);
          
          const fechaAlFormateada = format(new Date(encabezado.fechaal), 'dd/MM/yyyy');
          doc.setFont('helvetica', 'bold');
          doc.text(`Al:`, 23, posY);
          doc.setFont('helvetica', 'normal');
          doc.text(`${fechaAlFormateada}`, 23.8, posY);
          doc.line(23.8, lineY+2.8, 26.5, lineY+2.8);
          posY += 1.2;
      
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          centeredText(`PLANIFICACIÓN DE CONTENIDOS`, posY);          
          posY += 0.5;
      
          doc.autoTable({
            head: [['No.', 'Competencia', 'Indicador de Logro', 'Temas y Subtemas', 'Actividades de Aprendizaje', 'Actividades de Evaluación', 'Recursos']],
            body: datosTabla.map((fila, index) => [
              index + 1,
              fila.competencia,
              fila.indicador,
              fila.temas,
              fila.actividades,
              fila.aprendizaje,
              fila.recursos,
            ]),
            startY: posY,
            theme: 'grid',
            headStyles: {
                fillColor: [173, 216, 230],
                textColor: [0, 0, 0],
                lineWidth: 0.01,
                lineColor: [0, 0, 0],
                valign: 'middle',
                halign: 'center',
                fontSize: 11,
            },
            bodyStyles: {
                textColor: [0, 0, 0],
                lineWidth: 0.01,
                lineColor: [0, 0, 0],
                fontSize: 11,
            },
            repeatTableHead: false,
          });

          posY = doc.autoTable.previous.finalY + 1;

          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          centeredText(`PLANIFICACIÓN DE ACTIVIDADES DE EVALUACIÓN Y MEJORAMIENTO`, posY);

          posY += 0.5;

          doc.autoTable({
            head: [['No.', 'Temas', 'Actividades de Aprendizaje', 'Actividades de Mejoramiento', 'Herramienta', 'Fecha', 'Punteo']],
            body: datosTabla.map((fila, index) => [
              index + 1,
              fila.temas,
              fila.aprendizaje,
              fila.mejoramiento,
              fila.herramienta,
              fila.fechaentrega,
              fila.punteo,
            ]),
            startY: posY,
            theme: 'grid',
            headStyles: {
                fillColor: [173, 216, 230],
                textColor: [0, 0, 0],
                lineWidth: 0.01,
                lineColor: [0, 0, 0],
                valign: 'middle',
                halign: 'center',
                fontSize: 11,
            },
            bodyStyles: {
                textColor: [0, 0, 0],
                lineWidth: 0.01,
                lineColor: [0, 0, 0],
                fontSize: 11,
            },
            repeatTableHead: false,
          });

          posY = doc.autoTable.previous.finalY +1.5;
          
          const data = [
          [`f. _____________________________`, `f. _____________________________`],
          [`${encabezado.primer_nombre} ${encabezado.segundo_nombre} ${encabezado.otros_nombres} ${encabezado.primer_apellido} ${encabezado.segundo_apellido}`, `${encabezado.ctae}`],
          [`Director con Grados`, `C. T. A. E. ${encabezado.distrito}`], 
          ];

            // Crear la tabla de dos columnas
          doc.autoTable({
          body: data,
          startY: posY,
          theme: 'grid',
          bodyStyles: {
              textColor: [0, 0, 0],
              fontSize: 14,
              lineWidth: 0,
              lineColor: [0, 0, 0],
              valign: 'middle',
              halign: 'center',
          },
          didParseCell: function (data) {
            if (data.row.index > 0) { 
              data.cell.height = 0;
            }
          },
          });
 
         posY = doc.autoTable.previous.finalY + 10;

          // Guardar o mostrar el PDF
          doc.save('reporte.pdf');
        } catch (error) {
          console.error(error);
        }
    };
            
         
    const validarCampos = () => {
        const camposObligatorios = [
            {valor: tipo, nombreCampo: 'Tipo'},
            {valor: unidad, nombreCampo: 'Unidad'},
            {valor: fechaDel, nombreCampo: 'FechaDel'},
            {valor: fechaAl, nombreCampo: 'FechaAl'},
        ];

        const camposVacios = camposObligatorios.filter(campo => {
            if (typeof campo.valor === 'string') {
                return campo.valor.trim() === '';
            }

            return true;
        });

        if (camposVacios.length > 0) {
            const camposFaltantes = camposVacios.map(campo => campo.nombreCampo).join(', ');
            handleErrorMessage(`Los siguientes campos son obligatorios: ${camposFaltantes}.`);
            return false;
        };

        return true;
    }

    const registrarUnidad = async () => {
        setIsLoading(true);

        if (!validarCampos()) {
            setIsLoading(false);
            return;
        }

        try{
            const response = await axios.post(`${API_URL}/unidades`, {
                unidad: unidad,
                fechadel: fechaDel,
                fechaal: fechaAl,
                tipo: tipo,
                id_grado: seccion.id_grado,
                id_area: idArea,
                id_docente: userId,
                id_ciclo: seccion.id_ciclo
            });
            handleSuccessMessage('Unidad registrada con éxito');
            setIsLoading(false);
            fetchData();
            resetForm();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage(error.response.data.message);
            }
            setIsLoading(false);
        }
    }

    const actualizarUnidad = async () => {
        setIsLoading(true);

        if (!validarCampos()) {
            setIsLoading(false);
            return;
        }

        if (!idUnidad) {
            handleErrorMessage('No has seleccionado la Unidad');
            setIsLoading(false);
            return;
        }

        try{
            const response = await axios.put(`${API_URL}/unidades/${idUnidad}`, {
                unidad: unidad,
                fechadel: fechaDel,
                fechaal: fechaAl,
                tipo: tipo,
                id_grado: seccion.id_grado,
                id_area: idArea,
                id_docente: userId,
                id_ciclo: seccion.id_ciclo
            });
            console.log('Datos', response)
            handleSuccessMessage('Unidad modificada con éxito');
            setIsLoading(false);
            fetchData();
            resetForm();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage('Hubo un error al actualizar la unidad.');
            }
            setIsLoading(false);
        }
    }

    const eliminarUnidad = async (idUnidad) => {
        setIsLoading(true);
        try{
            const response = await axios.delete(`${API_URL}/unidades/${idUnidad}`);
            console.log('Datos', response);
            setIsLoading(false);
            fetchData();
            resetForm();
            handleSuccessMessage('Unidad Eliminada con éxito.')
        } catch(error) {
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage('Hubo un error al eliminar la unidad.');
                console.log(error.response.data.error);
            }
            setIsLoading(false);
        }
    }

    const handleSeleccionarUnidad = (unidad) => {
        setUnidadSeleccionada(unidad);
        setIdUnidad(unidad.id_unidad);
        setUnidad(unidad.unidad);
        setFechaDel(unidad.fechadel);
        setFechaAl(unidad.fechaal);
        setTipo(unidad.tipo);
        setBotonesVisibles(false);
        setIdMiUnidad(unidad.id_unidad);
    };

    const notify = () => {
        toast(
          <>
            <h3>¿Está seguro que desea Eliminar esta unidad, se perderán todos los datos registrados?</h3>
            <button onClick={() => toast.dismiss()}>Cancelar</button>
            <button onClick={() => {
                    eliminarUnidad(idUnidad);
                    toast.dismiss();
                }}> 
                    Aceptar 
            </button>
          </>,
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false,
            closeButton: false,
            closeOnClick: true,
            draggable: true,
            hideProgressBar: true,
            pauseOnHover: true,
            className: 'custom-toast',
            style: {
                fontSize: '18px',
                border: '2px solid blue',
                backdropFilter: 'blur(4px)',  // Para 
            }
          }
        );
    };

    const resetForm = () => {
        setIdUnidad('');
        setTipo('');
        setUnidad('');
        setFechaAl('');
        setFechaDel('');
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');  // Día
        const month = String(date.getMonth() + 1).padStart(2, '0');  // Mes (Enero es 0)
        const year = date.getFullYear();  // Año
      
        return `${day}/${month}/${year}`;
    }

    const notifyImprimir = () => {
        toast(
          <>
            <h3>¿Desea Imprimir la Planificación de esta unidad en formato PDF?</h3>
            <button onClick={() => toast.dismiss()}>Cancelar</button>
            <button onClick={() => {
                    generarPDF();
                    toast.dismiss();
                }}> 
                    Aceptar 
            </button>
          </>,
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false,
            closeButton: false,
            closeOnClick: true,
            draggable: true,
            hideProgressBar: true,
            pauseOnHover: true,
            className: 'custom-toast',
            style: {
                fontSize: '18px',
                border: '2px solid blue',
                backdropFilter: 'blur(4px)',  // Para 
            }
          }
        );
    };
    

    return (
        <section className = "Unidades" id= "Unidades">
            <ToastContainer/>
            <div className = "header">
                <span className="material-icons-sharp header-span title-span">dataset</span>
                <h1>Unidades</h1>
            </div>
            <div className="unidades-container">
                <div className="unidades-titulo">
                    <h1>{seccion.grado} {seccion.seccion}</h1>
                    <h2>{area}</h2>
                 </div>
                 <div className="unidades-datos">
                        <h2 style={{ color: 'blue' }}>Unidades creadas: {unidadesCreadas}</h2>
                        <button 
                            style={{height:"3.5rem", width:"9rem", marginLeft:"1rem"}}
                            onClick={()=>{setPlataformaVisible('plataformaMisAreas')}}>
                                <img src={Areas} alt="save"></img>
                                Mis Areas
                        </button>
                </div>
                 <div className="unidades-datos">          
                    <h2>Tipo de Planificación:</h2>
                    <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                        <option value="" disabled>Selecciona...</option>
                        <option value="Diaria">Diaria</option>
                        <option value="Semanal">Semanal</option>
                        <option value="Quincenal">Quincenal</option>
                        <option value="Mensual">Mensual</option>
                        <option value="Bimestrial">Bimestral</option>
                        <option value="Trimestral">Trimestral</option>
                        <option value="Semestral">Semestral</option>
                        <option value="Anual">Anual</option>
                    </select>
                    <h2>Unidad:</h2>
                    <select value={unidad} onChange={(e) => setUnidad(e.target.value)}>
                        <option value="" disabled>Selecciona...</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                    <h2>Del:</h2>
                    <input type="date" value={fechaDel} onChange={(e) => setFechaDel(e.target.value)}></input>
                    <h2>Al:</h2>
                    <input type="date" value={fechaAl} onChange={(e) => setFechaAl(e.target.value)}></input>
                    {botonesVisibles && (
                        <button onClick={registrarUnidad}
                        disabled={isLoading}>
                            {isLoading ? "Agregando..." : "Agregar"}
                        </button>
                    )}
                    {!botonesVisibles && (
                        <button onClick={actualizarUnidad}
                        disabled={isLoading}>
                            {isLoading ? "Actualizando..." : "Actualizar"}
                        </button>
                    )}
                    <button onClick={() => {setBotonesVisibles(true); resetForm()}}>
                        Limpiar
                    </button>
                </div>
                <div className="unidades-contenido">
                    {userData.unidades && userData.unidades.length > 0 ? (
                        userData.unidades.map((unidad) => (
                            <div className="unidad" key={unidad.id_unidad}>
                                <h1>Tipo: {unidad.tipo}</h1>
                                <h2>Unidad: {unidad.unidad}</h2>
                                <h2>Fecha Del: {formatDate(unidad.fechadel)}</h2>
                                <h2>Fecha Al: {formatDate(unidad.fechaal)}</h2>
                                <div>
                                    <button
                                    className = "unidades-boton1"
                                    onClick = {() => {handleSeleccionarUnidad(unidad);
                                        setPlataformaVisible('plataformaPlanificaciones');
                                        setIdUnidad(idUnidad);
                                    }}
                                    type="button">
                                        Planificar
                                    </button>
                                    {!botonesVisibles && (
                                        <>
                                            {!unidadSeleccionada || unidadSeleccionada.id_unidad === unidad.id_unidad ? (
                                                <button className = "unidades-boton3"
                                                type="button"
                                                onClick={async () => {
                                                    await setIdUnidad(unidad.id_unidad);
                                                    notifyImprimir();
                                                }}>
                                                    Imprimir
                                                </button>
                                            ): null}
                                            </>
                                     )}
                                </div>
                                <div>
                                    <button
                                     className = "unidades-boton1"
                                     onClick = {() => handleSeleccionarUnidad(unidad)}
                                     type="button">
                                        Seleccionar
                                     </button>
                                     {!botonesVisibles && (
                                        <>
                                            {!unidadSeleccionada || unidadSeleccionada.id_unidad === unidad.id_unidad ? (
                                                <button className = "unidades-boton2"
                                                type="button"
                                                onClick={() => {
                                                    notify();
                                                    setIdUnidad(unidad.id_unidad);
                                                }}>
                                                    Eliminar
                                                </button>
                                            ): null}
                                            </>
                                     )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{fontSize:'18px', textAlign:'center', color:'black', marginTop:'1rem',
                            fontWeight:'600'}}
                        >No hay seciones disponibles.</p>  
                    )}
                </div>
            </div>
        </section>
    )
}

export default Unidades;