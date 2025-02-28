import React, {useEffect, useState} from 'react';
import '../design/Planificaciones.css';
import Modal from 'react-modal';
import axios from 'axios';
import { API_URL } from '../../config/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Areas from '../../assets/ArrowLeft.png';
import SearchFile from '../../assets/Searchfile.png';
import Save from '../../assets/Save.png';
import Note from '../../assets/Note.png';
import Search from '../../assets/Search.png';
import Cancel from '../../assets/Cancel.png';
import Delete from '../../assets/Delete.png';
import Export from '../../assets/Export.png';
import Details from '../../assets/Details.png';

Modal.setAppElement('#root');

const Planificaciones = ({
  plataforma,
  setPlataformaVisible,
  seccion,
  area,
  idArea,
  userId,
  idMiUnidad,
  isOpen,
  onClose
}) => {
  const [isOpenTemasModal, setIsOpenTemasModal] = useState(false);
  const openTemasModal = () => setIsOpenTemasModal(true);
  const closeTemasModal = () => setIsOpenTemasModal(false);

  const [isOpenDetallesModal, setIsOpenDetallesModal] = useState(false);
  const openDetallesModal = () => setIsOpenDetallesModal(true);
  const closeDetallesModal = () => setIsOpenDetallesModal(false);

  // Búsquedas
  const [buscarMiTema, setBuscarMiTema] = useState('');
  const [buscarPlanificacion, setBuscarPlanificacion] = useState('');

  // Datos de "Mis Temas" (tab)
  const [misTemasData, setMisTemasData] = useState([]);
  const [misTemasFiltrados, setMisTemasFiltrados] = useState([]);

  // Datos de Planificaciones
  const [planificacionesData, setPlanificacionesData] = useState([]);
  const [planificacionesFiltradas, setPlanificacionesFiltradas] = useState([]);

  // Estados de selección de "Mis Temas"
  const [temasIdTema, setTemasIdTema] = useState('');
  const [temasIdContenido, setTemasIdContenido] = useState('');
  const [temasCompetencia, setTemasCompetencia] = useState('');
  const [temasIndicador, setTemasIndicador] = useState('');
  const [temasContenido, setTemasContenido] = useState('');
  const [temasTema, setTemasTema] = useState('');
  const [temasActividades, setTemasActividades] = useState('');
  const [temasRecursos, setTemasRecursos] = useState('');
  const [temasEvaluacion, setTemasEvaluacion] = useState('');
  const [temasMejoramiento, setTemasMejoramiento] = useState('');
  const [temasGrupos, setTemasGrupos] = useState('');
  const [temasAprendizaje, setTemasAprendizaje] = useState('');
  const [temasHerramienta, setTemasHerramienta] = useState('');
  const [temasFechaEntrega, setTemasFechaEntrega] = useState('');
  const [temasPunteo, setTemasPunteo] = useState('');
  const [temasResponsable, setTemasResponsable] = useState('');
  const [temaSeleccionado, setTemaSeleccionado] = useState('');

  // Estados de detalles de la Planificación
  const [idPlanificacion, setIdPlanificacion] = useState('');
  const [competencia, setCompetencia] = useState('');
  const [indicador, setIndicador] = useState('');
  const [contenido, setContenido] = useState('');
  const [tema, setTema] = useState('');
  const [recursos, setRecursos] = useState('');
  const [evaluacion, setEvaluacion] = useState('');
  const [actividades, setActividades] = useState('');
  const [aprendizaje, setAprendizaje] = useState('');
  const [mejoramiento, setMejoramiento] = useState('');
  const [integrantes, setIntegrantes] = useState('');
  const [herramienta, setHerramienta] = useState('');
  const [fecha, setFecha] = useState('');
  const [punteo, setPunteo] = useState('');
  const [responsable, setResponsable] = useState('');
  const [botonesVisibles, setBotonesVisibles] = useState(true);

  // Paginación: "Mis Temas"
  const [currentPageMisTemas, setCurrentPageMisTemas] = useState(1);
  const itemsPerPageMisTemas = 10;

  // Paginación: "Planificaciones"
  const [currentPagePlanificaciones, setCurrentPagePlanificaciones] = useState(1);
  const itemsPerPagePlanificaciones = 12;

  // IMPORTANTE: Calculamos totalPages a partir de los ARRAYS FILTRADOS
  const totalPagesMisTemas = Math.ceil(misTemasFiltrados.length / itemsPerPageMisTemas);
  const totalPagesPlanificaciones = Math.ceil(planificacionesFiltradas.length / itemsPerPagePlanificaciones);

  // Obtenemos el slice de los datos FILTRADOS
  const indexOfLastItemMisTemas = currentPageMisTemas * itemsPerPageMisTemas;
  const indexOfFirstItemMisTemas = indexOfLastItemMisTemas - itemsPerPageMisTemas;
  const currentItemsMisTemas = misTemasFiltrados.slice(indexOfFirstItemMisTemas, indexOfLastItemMisTemas);

  const indexOfLastItemPlanificaciones = currentPagePlanificaciones * itemsPerPagePlanificaciones;
  const indexOfFirstItemPlanificaciones = indexOfLastItemPlanificaciones - itemsPerPagePlanificaciones;
  const currentItemsPlanificaciones = planificacionesFiltradas.slice(
    indexOfFirstItemPlanificaciones,
    indexOfLastItemPlanificaciones
  );

  // Manejo de páginas Siguientes/Anteriores en "Mis Temas"
  const nextPageMisTemas = () => {
    if (currentPageMisTemas < totalPagesMisTemas) {
      setCurrentPageMisTemas(currentPageMisTemas + 1);
    }
  };
  const prevPageMisTemas = () => {
    if (currentPageMisTemas > 1) {
      setCurrentPageMisTemas(currentPageMisTemas - 1);
    }
  };

  // Manejo de páginas Siguientes/Anteriores en "Planificaciones"
  const nextPagePlanificaciones = () => {
    if (currentPagePlanificaciones < totalPagesPlanificaciones) {
      setCurrentPagePlanificaciones(currentPagePlanificaciones + 1);
    }
  };
  const prevPagePlanificaciones = () => {
    if (currentPagePlanificaciones > 1) {
      setCurrentPagePlanificaciones(currentPagePlanificaciones - 1);
    }
  };

  // Renderizar botones de paginación (Mis Temas)
  const renderPageButtonsMisTemas = () => {
    const visibleRange = 2;
    let startPage = Math.max(1, currentPageMisTemas - visibleRange);
    let endPage = Math.min(totalPagesMisTemas, currentPageMisTemas + visibleRange);
    let pages = [];

    if (startPage > 1) pages.push('...');
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPageMisTemas(i)}
          style={{
            fontSize: currentPageMisTemas === i ? '1.2rem' : '1rem',
            fontWeight: currentPageMisTemas === i ? 'bold' : 'normal',
            backgroundColor: currentPageMisTemas === i ? '#e0e0e0' : 'transparent'
          }}
        >
          {i}
        </button>
      );
    }
    if (endPage < totalPagesMisTemas) pages.push('...');
    return pages;
  };

  // Renderizar botones de paginación (Planificaciones)
  const renderPageButtonsPlanificaciones = () => {
    const visibleRange = 2;
    let startPage = Math.max(1, currentPagePlanificaciones - visibleRange);
    let endPage = Math.min(totalPagesPlanificaciones, currentPagePlanificaciones + visibleRange);
    let pages = [];

    if (startPage > 1) pages.push('...');
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPagePlanificaciones(i)}
          style={{
            fontSize: currentPagePlanificaciones === i ? '1.2rem' : '1rem',
            fontWeight: currentPagePlanificaciones === i ? 'bold' : 'normal',
            backgroundColor: currentPagePlanificaciones === i ? '#e0e0e0' : 'transparent'
          }}
        >
          {i}
        </button>
      );
    }
    if (endPage < totalPagesPlanificaciones) pages.push('...');
    return pages;
  };

  // Llamada para obtener las planificaciones (endpoint o findpoint)
  const fetchPlanificaciones = async () => {
    try {
      const migrado = seccion.grado;
      let endpoint, findpoint;

      switch (migrado) {
        case 'Primero':
          endpoint = `${API_URL}/viewplanificacionesPrimero/${seccion.id_grado}/${idArea}/${userId}/${seccion.id_ciclo}`;
          findpoint = `${API_URL}/viewplanificacionesPrimeroTema/${seccion.id_grado}/${idArea}/${userId}/${seccion.id_ciclo}/${buscarPlanificacion}`;
          break;
        case 'Segundo':
          endpoint = `${API_URL}/viewplanificacionesSegundo/${seccion.id_grado}/${idArea}/${userId}/${seccion.id_ciclo}`;
          findpoint = `${API_URL}/viewplanificacionesSegundoTema/${seccion.id_grado}/${idArea}/${userId}/${seccion.id_ciclo}/${buscarPlanificacion}`;
          break;
        case 'Tercero':
          endpoint = `${API_URL}/viewplanificacionesTercero/${seccion.id_grado}/${idArea}/${userId}/${seccion.id_ciclo}`;
          findpoint = `${API_URL}/viewplanificacionesTerceroTema/${seccion.id_grado}/${idArea}/${userId}/${seccion.id_ciclo}/${buscarPlanificacion}`;
          break;
        case 'Cuarto':
          endpoint = `${API_URL}/viewplanificacionesCuarto/${seccion.id_grado}/${idArea}/${userId}/${seccion.id_ciclo}`;
          findpoint = `${API_URL}/viewplanificacionesCuartoTema/${seccion.id_grado}/${idArea}/${userId}/${seccion.id_ciclo}/${buscarPlanificacion}`;
          break;
        case 'Quinto':
          endpoint = `${API_URL}/viewplanificacionesQuinto/${seccion.id_grado}/${idArea}/${userId}/${seccion.id_ciclo}`;
          findpoint = `${API_URL}/viewplanificacionesQuintoTema/${seccion.id_grado}/${idArea}/${userId}/${seccion.id_ciclo}/${buscarPlanificacion}`;
          break;
        case 'Sexto':
          endpoint = `${API_URL}/viewplanificacionesSexto/${seccion.id_grado}/${idArea}/${userId}/${seccion.id_ciclo}`;
          findpoint = `${API_URL}/viewplanificacionesSextoTema/${seccion.id_grado}/${idArea}/${userId}/${seccion.id_ciclo}/${buscarPlanificacion}`;
          break;
        default:
          // console.warn('Grado no reconocido:', migrado);
          return;
      }

      // Llamada principal
      const response = await axios.get(buscarPlanificacion ? findpoint : endpoint);
      const data = response.data.viewplanificaciones;

      // Guardamos el array completo
      setPlanificacionesData(data);
      // Por defecto, sin buscar, planificacionesFiltradas = data
      setPlanificacionesFiltradas(data);
      // Reiniciar paginación
      setCurrentPagePlanificaciones(1);
    } catch (error) {
      // console.log(error);
    }
  };

  // Llamada para obtener "Mis Temas"
  const fetchMisTemas = async () => {
    try {
      const migrado = seccion.grado;
      let endpoint, findpoint;

      switch (migrado) {
        case 'Primero':
          endpoint = `${API_URL}/misTemasPrimero/${idArea}/${userId}`;
          findpoint = `${API_URL}/misTemasPrimeroTema/${idArea}/${userId}/${buscarMiTema}`;
          break;
        case 'Segundo':
          endpoint = `${API_URL}/misTemasSegundo/${idArea}/${userId}`;
          findpoint = `${API_URL}/misTemasSegundoTema/${idArea}/${userId}/${buscarMiTema}`;
          break;
        case 'Tercero':
          endpoint = `${API_URL}/misTemasTercero/${idArea}/${userId}`;
          findpoint = `${API_URL}/misTemasTerceroTema/${idArea}/${userId}/${buscarMiTema}`;
          break;
        case 'Cuarto':
          endpoint = `${API_URL}/misTemasCuarto/${idArea}/${userId}`;
          findpoint = `${API_URL}/misTemasCuartoTema/${idArea}/${userId}/${buscarMiTema}`;
          break;
        case 'Quinto':
          endpoint = `${API_URL}/misTemasQuinto/${idArea}/${userId}`;
          findpoint = `${API_URL}/misTemasQuintoTema/${idArea}/${userId}/${buscarMiTema}`;
          break;
        case 'Sexto':
          endpoint = `${API_URL}/misTemasSexto/${idArea}/${userId}`;
          findpoint = `${API_URL}/misTemasSextoTema/${idArea}/${userId}/${buscarMiTema}`;
          break;
        default:
          console.warn('Grado no reconocido:', migrado);
          return;
      }

      // Llamada principal
      const response = await axios.get(buscarMiTema ? findpoint : endpoint);
      const data = response.data.mistemas;

      // Guardamos el array completo
      setMisTemasData(data);
      // Filtrados por defecto = data
      setMisTemasFiltrados(data);
      setCurrentPageMisTemas(1);
    } catch (error) {
      // console.log(error);
    }
  };

  // Efectos iniciales
  useEffect(() => {
    fetchMisTemas();
  }, [idArea, userId]);

  useEffect(() => {
    fetchPlanificaciones();
  }, [idMiUnidad, idArea, userId]);

  // Si quisieras filtrar localmente (además de la llamada findpoint),
  // podrías dejar esto para refinar resultados en el front. 
  // De momento, lo dejamos: 
  const filtrarMisTemas = () => {
    if (!buscarMiTema) {
      setMisTemasFiltrados(misTemasData);
      return;
    }
    const filtrados = misTemasData.filter((mitema) =>
      mitema.temas.toLowerCase().includes(buscarMiTema.toLowerCase())
    );
    setMisTemasFiltrados(filtrados);
    setCurrentPageMisTemas(1);
  };

  const filtrarPlanificaciones = () => {
    if (!buscarPlanificacion) {
      setPlanificacionesFiltradas(planificacionesData);
      return;
    }
    const filtrados = planificacionesData.filter((planificacion) =>
      planificacion.temas.toLowerCase().includes(buscarPlanificacion.toLowerCase())
    );
    setPlanificacionesFiltradas(filtrados);
    setCurrentPagePlanificaciones(1);
  };

  useEffect(() => {
    filtrarMisTemas();
  }, [buscarMiTema, misTemasData]);

  useEffect(() => {
    filtrarPlanificaciones();
  }, [buscarPlanificacion, planificacionesData]);

  // Mensajes
  const handleSuccessMessage = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      style: {
        fontSize: '18px',
        border: '1px solid green'
      }
    });
  };

  const handleErrorMessage = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      style: {
        fontSize: '15px',
        border: '1px solid red'
      }
    });
  };

  // Registro de Planificación
  const [isLoading, setIsLoading] = useState(false);
  const registrarPlanificacion = async () => {
    setIsLoading(true);
    if (temasIdTema === '') {
      setIsLoading(false);
      handleErrorMessage('No has seleccionado ningún tema.');
      return;
    }
    try {
      const migrado = seccion.grado;
      let endpoint;
      switch (migrado) {
        case 'Primero':
          endpoint = `${API_URL}/planificacionesPrimero`;
          break;
        case 'Segundo':
          endpoint = `${API_URL}/planificacionesSegundo`;
          break;
        case 'Tercero':
          endpoint = `${API_URL}/planificacionesTercero`;
          break;
        case 'Cuarto':
          endpoint = `${API_URL}/planificacionesCuarto`;
          break;
        case 'Quinto':
          endpoint = `${API_URL}/planificacionesQuinto`;
          break;
        case 'Sexto':
          endpoint = `${API_URL}/planificacionesSexto`;
          break;
        default:
          console.warn('Grado no reconocido:', migrado);
          return;
      }

      const response = await axios.post(endpoint, {
        id_grado: seccion.id_grado,
        id_area: idArea,
        id_unidad: idMiUnidad,
        id_mitema: temasIdTema,
        id_docente: userId,
        id_ciclo: seccion.id_ciclo
      });
      // console.log(response);
      handleSuccessMessage('Tema registrado con éxito');
      setIsLoading(false);
      fetchMisTemas();
      fetchPlanificaciones();
      resetForm();
    } catch (error) {
      if (error.response?.data?.error) {
        handleErrorMessage(error.response.data.error);
        // console.log(error);
      } else {
        handleErrorMessage(error.response?.data?.message);
        // console.log(error);
      }
      setIsLoading(false);
    }
  };

  // Eliminar Planificación
  const eliminarPlanificacion = async () => {
    setIsLoading(true);
    if (!idPlanificacion) {
      handleErrorMessage('No has seleccionado el Tema');
      setIsLoading(false);
      return;
    }
    try {
      const migrado = seccion.grado;
      let endpoint;
      switch (migrado) {
        case 'Primero':
          endpoint = `${API_URL}/planificacionesPrimero/${idPlanificacion}`;
          break;
        case 'Segundo':
          endpoint = `${API_URL}/planificacionesSegundo/${idPlanificacion}`;
          break;
        case 'Tercero':
          endpoint = `${API_URL}/planificacionesTercero/${idPlanificacion}`;
          break;
        case 'Cuarto':
          endpoint = `${API_URL}/planificacionesCuarto/${idPlanificacion}`;
          break;
        case 'Quinto':
          endpoint = `${API_URL}/planificacionesQuinto/${idPlanificacion}`;
          break;
        case 'Sexto':
          endpoint = `${API_URL}/planificacionesSexto/${idPlanificacion}`;
          break;
        default:
          // console.warn('Grado no reconocido:', migrado);
          return;
      }

      const response = await axios.delete(endpoint);
      // console.log(response);
      handleSuccessMessage('Tema Eliminado con éxito');
      setIsLoading(false);
      fetchPlanificaciones();
      resetForm();
    } catch (error) {
      if (error.response?.data?.error) {
        handleErrorMessage(error.response.data.error);
      } else {
        handleErrorMessage('Hubo un error al eliminar la sección.');
        // console.log(error.response?.data?.error);
      }
      setIsLoading(false);
    }
  };

  // Reset Form
  const resetForm = () => {
    setTemaSeleccionado('');
    setTemasIdTema('');
    setBotonesVisibles(true);
  };

  // Seleccionar fila en "Mis Temas"
  const handleMisTemasRowClick = (tema) => {
    setTemasIdTema(tema.id_mitema);
    setTemasIdContenido(tema.id_contenido);
    setTemasCompetencia(tema.competencia);
    setTemasIndicador(tema.indicador);
    setTemasContenido(tema.contenido);
    setTemasTema(tema.temas);
    setTemasActividades(tema.actividades);
    setTemasRecursos(tema.recursos);
    setTemasEvaluacion(tema.evaluacion);
    setTemasMejoramiento(tema.mejoramiento);
    setTemasGrupos(tema.grupos);
    setTemasAprendizaje(tema.aprendizaje);
    setTemasHerramienta(tema.herramienta);
    setTemasFechaEntrega(tema.fechaentega);
    setTemasPunteo(tema.punteo);
    setTemasResponsable(tema.responsable);
    setTemaSeleccionado(tema.temas);
  };

  // Seleccionar fila en "Planificaciones"
  const handlePlanificacionesRowClick = (planificacion) => {
    setIdPlanificacion(planificacion.id_planificacion);
    setTemasIdTema(planificacion.id_mitema);
    setTemaSeleccionado(planificacion.temas);
    setCompetencia(planificacion.competencia);
    setIndicador(planificacion.indicador);
    setContenido(planificacion.contenido);
    setTema(planificacion.temas);
    setRecursos(planificacion.recursos);
    setEvaluacion(planificacion.evaluacion);
    setActividades(planificacion.actividades);
    setAprendizaje(planificacion.aprendizaje);
    setMejoramiento(planificacion.mejoramiento);
    setIntegrantes(planificacion.grupos);
    setHerramienta(planificacion.herramienta);
    setFecha(planificacion.fechaentrega);
    setPunteo(planificacion.punteo);
    setResponsable(planificacion.responsable);
    setBotonesVisibles(false);
  };

  // Exportar datos del tema seleccionado desde la Modal "Mis Temas"
  const handleTemas = () => {
    if (temasIdContenido === '') {
      handleErrorMessage('Selecciona un tema antes de continuar');
      return;
    }
    // Ya guardamos los datos en la selección:
    closeTemasModal();
  };

  // Confirmación de eliminación
  const notify = () => {
    toast(
      <>
        <h3>¿Está seguro que desea Eliminar este tema, se perderán todos los datos registrados?</h3>
        <button onClick={() => toast.dismiss()}>Cancelar</button>
        <button
          onClick={() => {
            eliminarPlanificacion(idPlanificacion);
            toast.dismiss();
          }}
        >
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
          backdropFilter: 'blur(4px)'
        }
      }
    );
  };

  return (
    <>
      <section className="Planificacions" id="Planificaciones">
        <ToastContainer />
        <div className="header">
          <span className="material-icons-sharp header-span title-span">edit_note</span>
          <h1>Planificaciones</h1>
        </div>

        <div className="planificacion-titulo">
          <h1>Planificación de Mis Temas</h1>
        </div>

        <div className="planificacion-container">
          <div className="titulo">
            <h2>Grado: {seccion.grado}</h2>
            <h2>Area: {area}</h2>
            <div className="titulo-tema-seleccionado">
              <h1>Tema: {temaSeleccionado}</h1>
            </div>
          </div>

          <div className="botones">
            <button onClick={openTemasModal}>
              <img src={SearchFile} alt="save" />
              Buscar Temas
            </button>
            <button onClick={registrarPlanificacion} disabled={isLoading}>
              <img src={Save} alt="save" />
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
            <button onClick={resetForm}>
              <img src={Note} alt="save" />
              Nuevo
            </button>
            <button onClick={openDetallesModal}>
              <img src={Details} alt="save" />
              Detalles
            </button>
            <button onClick={() => setPlataformaVisible('plataformaUnidades')}>
              <img src={Areas} alt="save" />
              Mis Unidades
            </button>
          </div>

          <div className="tema-seleccionado">
            <div className="buscar">
              <h2>Buscar:</h2>
              <input
                onChange={(e) => setBuscarPlanificacion(e.target.value)}
                value={buscarPlanificacion}
                placeholder="Buscar..."
              />
              <button>
                <img src={Search} alt="save" />
                Buscar
              </button>
              {!botonesVisibles && (
                <button
                  onClick={() => {
                    notify();
                    setIdPlanificacion();
                  }}
                >
                  <img src={Delete} alt="save" />
                  Eliminar
                </button>
              )}
            </div>

            <div className="tabla">
              {/* IMPORTANTE: mostramos planificacionesFiltradas (o su slice) */}
              {planificacionesFiltradas.length > 0 ? (
                <>
                  <table>
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Temas</th>
                        <th>Actividades de Evaluación</th>
                        <th>Actividades de Aprendizaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItemsPlanificaciones.map((planificacion, index) => (
                        <tr
                          key={planificacion.id_planificacion}
                          onClick={() => {
                            handlePlanificacionesRowClick(planificacion);
                          }}
                        >
                          <td>
                            {(currentPagePlanificaciones - 1) * itemsPerPagePlanificaciones + index + 1}
                          </td>
                          <td>{planificacion.temas}</td>
                          <td>{planificacion.actividades}</td>
                          <td>{planificacion.aprendizaje}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="paginacion-container">
                    <button
                      onClick={() => setCurrentPagePlanificaciones(1)}
                      disabled={currentPagePlanificaciones === 1}
                    >
                      Inicio
                    </button>
                    <button
                      onClick={prevPagePlanificaciones}
                      disabled={currentPagePlanificaciones === 1}
                    >
                      Anterior
                    </button>

                    {renderPageButtonsPlanificaciones()}

                    <button
                      onClick={nextPagePlanificaciones}
                      disabled={currentPagePlanificaciones === totalPagesPlanificaciones}
                    >
                      Siguiente
                    </button>
                    <button
                      onClick={() => setCurrentPagePlanificaciones(totalPagesPlanificaciones)}
                      disabled={currentPagePlanificaciones === totalPagesPlanificaciones}
                    >
                      Final
                    </button>
                  </div>

                  <div className="paginacion-final">
                    Página {currentPagePlanificaciones} de {totalPagesPlanificaciones}
                  </div>
                </>
              ) : (
                <p
                  style={{
                    fontSize: '18px',
                    textAlign: 'center',
                    color: 'black',
                    margin: '1rem',
                    fontWeight: '600',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center'
                  }}
                >
                  No hay Temas disponibles.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MODAL "Mis Temas" */}
      <Modal isOpen={isOpenTemasModal} onRequestClose={closeTemasModal} className="planificacion-modal-temas">
        <h1>Mis Temas</h1>
        <div className="container">
          <div className="titulo">
            <h2>Área: {area}</h2>
            <h2>Grado: {seccion.grado}</h2>
            <h1>Tema Seleccionado: {temaSeleccionado}</h1>
          </div>
          <div className="busqueda">
            <h2>Buscar:</h2>
            <input
              className="busqueda"
              type="text"
              onChange={(e) => setBuscarMiTema(e.target.value)}
              value={buscarMiTema}
              placeholder="Ingresa el tema a buscar..."
            />
            <button onClick={handleTemas}>
              <img src={Export} alt="save" />
              Exportar
            </button>
            <button onClick={closeTemasModal}>
              <img src={Cancel} alt="save" />
              Cancelar
            </button>
          </div>
          <div className="tabla">
            {/* IMPORTANTE: mostramos misTemasFiltrados (o su slice) */}
            {misTemasFiltrados.length > 0 ? (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Temas</th>
                      <th>Actividades de Evaluación</th>
                      <th>Actividades de Aprendizaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItemsMisTemas.map((mitema) => (
                      <tr key={mitema.id_mitema} onClick={() => handleMisTemasRowClick(mitema)}>
                        <td>{mitema.temas}</td>
                        <td>{mitema.actividades}</td>
                        <td>{mitema.aprendizaje}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="paginacion-container">
                  <button onClick={() => setCurrentPageMisTemas(1)} disabled={currentPageMisTemas === 1}>
                    Inicio
                  </button>
                  <button onClick={prevPageMisTemas} disabled={currentPageMisTemas === 1}>
                    Anterior
                  </button>

                  {renderPageButtonsMisTemas()}

                  <button onClick={nextPageMisTemas} disabled={currentPageMisTemas === totalPagesMisTemas}>
                    Siguiente
                  </button>
                  <button
                    onClick={() => setCurrentPageMisTemas(totalPagesMisTemas)}
                    disabled={currentPageMisTemas === totalPagesMisTemas}
                  >
                    Final
                  </button>
                </div>

                <div className="paginacion-final">
                  Página {currentPageMisTemas} de {totalPagesMisTemas}
                </div>
              </>
            ) : (
              <p
                style={{
                  fontSize: '18px',
                  textAlign: 'center',
                  color: 'black',
                  margin: '1rem',
                  fontWeight: '600',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}
              >
                No hay Temas disponibles.
              </p>
            )}
          </div>
        </div>
      </Modal>

      {/* MODAL "Detalles" */}
      <Modal isOpen={isOpenDetallesModal} onRequestClose={closeDetallesModal} className="planificacion-modal-detalles">
        <h1>Detalle de Temas</h1>
        <div className="container">
          <div className="planes">
            <div>
              <label>Competencia:</label>
              <textarea value={competencia} readOnly />
            </div>
            <div>
              <label>Indicador de Logro:</label>
              <textarea value={indicador} readOnly />
            </div>
            <div>
              <label>Contenido:</label>
              <textarea value={contenido} readOnly />
            </div>
            <div>
              <label>Temas y Subtemas:</label>
              <textarea value={tema} readOnly />
            </div>
            <div>
              <label>Recursos:</label>
              <textarea value={recursos} readOnly />
            </div>
            <div>
              <label>Evaluación:</label>
              <textarea value={evaluacion} readOnly />
            </div>
          </div>
          <div className="actividades">
            <div>
              <label>Actividades de Evaluación:</label>
              <textarea value={actividades} readOnly />
            </div>
            <div>
              <label>Actividades de Aprendizaje:</label>
              <textarea value={aprendizaje} readOnly />
            </div>
            <div>
              <label>Actividades de Mejoramiento:</label>
              <textarea value={mejoramiento} readOnly />
            </div>
          </div>
          <div className="datos">
            <div>
              <label>Integrantes:</label>
              <input value={integrantes} readOnly />
            </div>
            <div>
              <label>Herramienta de Evaluación:</label>
              <input value={herramienta} readOnly />
            </div>
            <div>
              <label>Fecha de Actividad:</label>
              <input value={fecha} readOnly />
            </div>
            <div>
              <label>Punteo Obtenido:</label>
              <input value={punteo} readOnly />
            </div>
            <div>
              <label>Responsable:</label>
              <input value={responsable} readOnly />
            </div>
          </div>
          <div className="botones">
            <button onClick={closeDetallesModal}>
              <img src={Cancel} alt="save" />
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Planificaciones;
