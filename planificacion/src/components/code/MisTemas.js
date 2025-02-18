import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../design/MisTemas.css';
import axios from 'axios';
import { API_URL } from '../../config/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchFile from '../../assets/Searchfile.png';
import Globe from '../../assets/Globe.png';
import Save from '../../assets/Save.png';
import Edit from '../../assets/Pencil.png';
import Note from '../../assets/Note.png';
import Table from '../../assets/Table.png';
import Books from '../../assets/Books.png';
import Areas from '../../assets/ArrowLeft.png';
import Search from '../../assets/Search.png';
import Filter from '../../assets/Filter.png';
import Cancel from '../../assets/Cancel.png';
import Export from '../../assets/Export.png';
import Delete from '../../assets/Delete.png';
import Acept from '../../assets/Acept.png';
import CNB1 from '../../assets/CNB1.pdf';
import CNB2 from '../../assets/CNB2.pdf';
import CNB3 from '../../assets/CNB3.pdf';
import CNB4 from '../../assets/CNB4.pdf';
import CNB5 from '../../assets/CNB5.pdf';
import CNB6 from '../../assets/CNB6.pdf';

Modal.setAppElement('#root');

const MisTemas = ({
  plataforma,
  setPlataformaVisible,
  seccion,    // Contiene info como seccion.grado
  area,
  idArea,
  userId
}) => {
  //------------------------------------------
  // ESTADOS de datos
  //------------------------------------------
  // Contenidos
  const [contenidosData, setContenidosData] = useState([]);
  const [contenidosFiltrados, setContenidosFiltrados] = useState([]);
  const [buscarContenido, setBuscarContenido] = useState('');

  // Temas
  const [temasData, setTemasData] = useState([]);
  const [temasFiltrados, setTemasFiltrados] = useState([]);
  const [buscarTema, setBuscarTema] = useState('');

  // Mis Temas
  const [misTemasData, setMisTemasData] = useState([]);
  const [misTemasFiltrados, setMisTemasFiltrados] = useState([]);
  const [buscarMiTema, setBuscarMiTema] = useState('');

  //------------------------------------------
  // ESTADOS de formulario - Contenido
  //------------------------------------------
  const [contenidoId, setContenidoId] = useState('');
  const [contenidoNumcontenido, setContenidoNumcontenido] = useState('');
  const [contenidoCompetencia, setContenidoCompetencia] = useState('');
  const [contenidoIndicador, setContenidoIndicador] = useState('');
  const [contenidoContenido, setContenidoContenido] = useState('');
  const [criterioBusqueda, setCriterioBusqueda] = useState('numcontenidos'); // Estado para el criterio de búsqueda

  //------------------------------------------
  // ESTADOS de formulario - Temas
  //------------------------------------------
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

  //------------------------------------------
  // ESTADOS de formulario - Mis Temas
  //------------------------------------------
  const [misTemasIdTema, setMisTemasIdTema] = useState('');
  const [misTemasIdContenido, setMisTemasIdContenido] = useState('');
  const [misTemasCompetencia, setMisTemasCompetencia] = useState('');
  const [misTemasIndicador, setMisTemasIndicador] = useState('');
  const [misTemasContenido, setMisTemasContenido] = useState('');
  const [misTemasTema, setMisTemasTema] = useState('');
  const [misTemasActividades, setMisTemasActividades] = useState('');
  const [misTemasRecursos, setMisTemasRecursos] = useState('');
  const [misTemasEvaluacion, setMisTemasEvaluacion] = useState('');
  const [misTemasMejoramiento, setMisTemasMejoramiento] = useState('');
  const [misTemasGrupos, setMisTemasGrupos] = useState('');
  const [misTemasAprendizaje, setMisTemasAprendizaje] = useState('');
  const [misTemasHerramienta, setMisTemasHerramienta] = useState('');
  const [misTemasFechaEntrega, setMisTemasFechaEntrega] = useState('');
  const [misTemasPunteo, setMisTemasPunteo] = useState('');
  const [misTemasResponsable, setMisTemasResponsable] = useState('');

  //------------------------------------------
  // Control de modales
  //------------------------------------------
  const [isOpenContenidosModal, setIsOpenContenidoModal] = useState(false);
  const openContenidosModal = () => setIsOpenContenidoModal(true);
  const closeContenidosModal = () => setIsOpenContenidoModal(false);

  const [isOpenTemasModal, setIsOpenTemasModal] = useState(false);
  const openTemasModal = () => setIsOpenTemasModal(true);
  const closeTemasModal = () => setIsOpenTemasModal(false);

  const [isOpenEvaluacionModal, setIsOpenEvaluacionModal] = useState(false);
  const openEvaluacionModal = () => setIsOpenEvaluacionModal(true);
  const closeEvaluacionModal = () => setIsOpenEvaluacionModal(false);

  //------------------------------------------
  // Botón "Guardar" vs "Actualizar"
  //------------------------------------------
  const [botonesVisibles, setBotonesVisibles] = useState(true);

  //------------------------------------------
  // Estado de carga
  //------------------------------------------
  const [isLoading, setIsLoading] = useState(false);

  //------------------------------------------
  // Mensajes
  //------------------------------------------
  const handleSuccessMessage = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      style: { fontSize: '18px', border: '1px solid green' }
    });
  };

  const handleErrorMessage = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      style: { fontSize: '15px', border: '1px solid red' }
    });
  };

  //------------------------------------------
  // Validar campos (MisTemas)
  //------------------------------------------
  const validarCampos = () => {
    const camposObligatorios = [
      { valor: misTemasCompetencia, nombreCampo: 'Competencia' },
      { valor: misTemasIndicador, nombreCampo: 'Indicador' },
      { valor: misTemasContenido, nombreCampo: 'Contenido' },
      { valor: misTemasTema, nombreCampo: 'Tema' },
      { valor: misTemasActividades, nombreCampo: 'Actividades' },
      { valor: misTemasRecursos, nombreCampo: 'Recursos' },
      { valor: misTemasEvaluacion, nombreCampo: 'Evaluación' }
    ];
    const camposVacios = camposObligatorios.filter((campo) =>
      typeof campo.valor === 'string' ? campo.valor.trim() === '' : true
    );
    if (camposVacios.length > 0) {
      const camposFaltantes = camposVacios.map((campo) => campo.nombreCampo).join(', ');
      handleErrorMessage(`Los siguientes campos son obligatorios: ${camposFaltantes}.`);
      return false;
    }
    return true;
  };

  //------------------------------------------
  // Fetch data (SIN filtrado en servidor)
  // 1. Carga "MisTemas" (todo)
  //------------------------------------------
  const fetchMisTemas = async () => {
    try {
      const grado = seccion.grado; // 'Primero', 'Segundo', ...
      let endpoint;
      switch (grado) {
        case 'Primero':
          endpoint = `${API_URL}/misTemasPrimero/${idArea}/${userId}`;
          break;
        case 'Segundo':
          endpoint = `${API_URL}/misTemasSegundo/${idArea}/${userId}`;
          break;
        case 'Tercero':
          endpoint = `${API_URL}/misTemasTercero/${idArea}/${userId}`;
          break;
        case 'Cuarto':
          endpoint = `${API_URL}/misTemasCuarto/${idArea}/${userId}`;
          break;
        case 'Quinto':
          endpoint = `${API_URL}/misTemasQuinto/${idArea}/${userId}`;
          break;
        case 'Sexto':
          endpoint = `${API_URL}/misTemasSexto/${idArea}/${userId}`;
          break;
        default:
          // console.warn('Grado no reconocido:', grado);
          return;
      }
      // Descarga TODOS los misTemas (sin filtrar)
      const response = await axios.get(endpoint);
      const data = response.data.mistemas; // Array con todos los temas

      // Guardamos "todo" en misTemasData
      setMisTemasData(data);
      // Por defecto, sin buscar nada, misTemasFiltrados = data
      setMisTemasFiltrados(data);
    } catch (error) {
      console.log(error);
    }
  };

  //------------------------------------------
  // 2. Carga "Temas" (todo)
  //------------------------------------------
  const fetchTemas = async () => {
    try {
      const grado = seccion.grado;
      let endpoint;
      switch (grado) {
        case 'Primero':
          endpoint = `${API_URL}/temasPrimero/${idArea}`;
          break;
        case 'Segundo':
          endpoint = `${API_URL}/temasSegundo/${idArea}`;
          break;
        case 'Tercero':
          endpoint = `${API_URL}/temasTercero/${idArea}`;
          break;
        case 'Cuarto':
          endpoint = `${API_URL}/temasCuarto/${idArea}`;
          break;
        case 'Quinto':
          endpoint = `${API_URL}/temasQuinto/${idArea}`;
          break;
        case 'Sexto':
          endpoint = `${API_URL}/temasSexto/${idArea}`;
          break;
        default:
          // console.warn('Grado no reconocido:', grado);
          return;
      }
      // Descarga TODOS los temas (sin filtrar)
      const response = await axios.get(endpoint);
      const data = response.data.temas;

      setTemasData(data);
      setTemasFiltrados(data);
    } catch (error) {
      console.log(error);
    }
  };

  //------------------------------------------
  // 3. Carga "Contenidos" (todo)
  //------------------------------------------
  const fetchContenidos = async () => {
    try {
      const grado = seccion.grado;
      let endpoint;
      switch (grado) {
        case 'Primero':
          endpoint = `${API_URL}/contenidosPrimero/${idArea}`;
          break;
        case 'Segundo':
          endpoint = `${API_URL}/contenidosSegundo/${idArea}`;
          break;
        case 'Tercero':
          endpoint = `${API_URL}/contenidosTercero/${idArea}`;
          break;
        case 'Cuarto':
          endpoint = `${API_URL}/contenidosCuarto/${idArea}`;
          break;
        case 'Quinto':
          endpoint = `${API_URL}/contenidosQuinto/${idArea}`;
          break;
        case 'Sexto':
          endpoint = `${API_URL}/contenidosSexto/${idArea}`;
          break;
        default:
          // console.warn('Grado no reconocido:', grado);
          return;
      }
      // Descarga TODOS los contenidos (sin filtrar)
      const response = await axios.get(endpoint);
      const data = response.data.contenidos;

      setContenidosData(data);
      setContenidosFiltrados(data);
    } catch (error) {
      console.log(error);
    }
  };

  //------------------------------------------
  // useEffect: Llamamos a "fetch" al montar
  // (o si seccion cambia), para traer
  // TODO sin filtrar.
  //------------------------------------------
  useEffect(() => {
    if (!seccion?.grado) return; // Evitar problemas si seccion no está
    fetchMisTemas();
    fetchTemas();
    fetchContenidos();
  }, [idArea, userId, seccion]);

  //------------------------------------------
  // Filtrado Local
  // Cada vez que cambia "buscarContenido",
  // filtramos "contenidosData"
  //------------------------------------------
  useEffect(() => {
    if (!buscarContenido) {
      setContenidosFiltrados(contenidosData);
    } else {
      const filtrados = contenidosData.filter((c) => {
        switch (criterioBusqueda) {
          case 'numcontenidos':
            return c.numcontenidos.toLowerCase().includes(buscarContenido.toLowerCase());
          case 'competencia':
            return c.competencia.toLowerCase().includes(buscarContenido.toLowerCase());
          case 'indicador':
            return c.indicador.toLowerCase().includes(buscarContenido.toLowerCase());
          case 'contenido':
            return c.contenido.toLowerCase().includes(buscarContenido.toLowerCase());
          default:
            return false;
        }
      });
      setContenidosFiltrados(filtrados);
    }
    setCurrentPage(1);
  }, [buscarContenido, criterioBusqueda, contenidosData]);
  

  // Filtrado local para TEMAS
  useEffect(() => {
    if (!buscarTema) {
      setTemasFiltrados(temasData);
    } else {
      const filtrados = temasData.filter((t) =>
        t.temas.toLowerCase().includes(buscarTema.toLowerCase())
      );
      setTemasFiltrados(filtrados);
    }
    setCurrentPageTemas(1);
  }, [buscarTema, temasData]);

  // Filtrado local para MIS TEMAS
  useEffect(() => {
    if (!buscarMiTema) {
      setMisTemasFiltrados(misTemasData);
    } else {
      const filtrados = misTemasData.filter((m) =>
        m.temas.toLowerCase().includes(buscarMiTema.toLowerCase())
      );
      setMisTemasFiltrados(filtrados);
    }
    setCurrentPageMisTemas(1);
  }, [buscarMiTema, misTemasData]);

  //------------------------------------------
  // Paginación para 3 tablas
  //------------------------------------------
  // 1) CONTENIDOS
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(contenidosFiltrados.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contenidosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const renderPageButtons = () => {
    const visibleRange = 2;
    let startPage = Math.max(1, currentPage - visibleRange);
    let endPage = Math.min(totalPages, currentPage + visibleRange);
    let pages = [];
    if (startPage > 1) pages.push('...');
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          style={{
            fontSize: currentPage === i ? '1.2rem' : '1rem',
            fontWeight: currentPage === i ? 'bold' : 'normal',
            backgroundColor: currentPage === i ? '#e0e0e0' : 'transparent'
          }}
        >
          {i}
        </button>
      );
    }
    if (endPage < totalPages) pages.push('...');
    return pages;
  };

  // 2) TEMAS
  const [currentPageTemas, setCurrentPageTemas] = useState(1);
  const itemsPerPageTemas = 12;
  const totalPagesTemas = Math.ceil(temasFiltrados.length / itemsPerPageTemas);
  const indexOfLastItemTemas = currentPageTemas * itemsPerPageTemas;
  const indexOfFirstItemTemas = indexOfLastItemTemas - itemsPerPageTemas;
  const currentItemsTemas = temasFiltrados.slice(indexOfFirstItemTemas, indexOfLastItemTemas);

  const nextPageTemas = () => {
    if (currentPageTemas < totalPagesTemas) setCurrentPageTemas(currentPageTemas + 1);
  };
  const prevPageTemas = () => {
    if (currentPageTemas > 1) setCurrentPageTemas(currentPageTemas - 1);
  };
  const renderPageButtonsTemas = () => {
    const visibleRange = 2;
    let startPageTemas = Math.max(1, currentPageTemas - visibleRange);
    let endPageTemas = Math.min(totalPagesTemas, currentPageTemas + visibleRange);
    let pagesTemas = [];
    if (startPageTemas > 1) pagesTemas.push('...');
    for (let i = startPageTemas; i <= endPageTemas; i++) {
      pagesTemas.push(
        <button
          key={i}
          onClick={() => setCurrentPageTemas(i)}
          style={{
            fontSize: currentPageTemas === i ? '1.2rem' : '1rem',
            fontWeight: currentPageTemas === i ? 'bold' : 'normal',
            backgroundColor: currentPageTemas === i ? '#e0e0e0' : 'transparent'
          }}
        >
          {i}
        </button>
      );
    }
    if (endPageTemas < totalPagesTemas) pagesTemas.push('...');
    return pagesTemas;
  };

  // 3) MIS TEMAS
  const [currentPageMisTemas, setCurrentPageMisTemas] = useState(1);
  const itemsPerPageMisTemas = 10;
  const totalPagesMisTemas = Math.ceil(misTemasFiltrados.length / itemsPerPageMisTemas);
  const indexOfLastItemMisTemas = currentPageMisTemas * itemsPerPageMisTemas;
  const indexOfFirstItemMisTemas = indexOfLastItemMisTemas - itemsPerPageMisTemas;
  const currentItemsMisTemas = misTemasFiltrados.slice(indexOfFirstItemMisTemas, indexOfLastItemMisTemas);

  const nextPageMisTemas = () => {
    if (currentPageMisTemas < totalPagesMisTemas) setCurrentPageMisTemas(currentPageMisTemas + 1);
  };
  const prevPageMisTemas = () => {
    if (currentPageMisTemas > 1) setCurrentPageMisTemas(currentPageMisTemas - 1);
  };
  const renderPageButtonsMisTemas = () => {
    const visibleRange = 2;
    let startPageMisTemas = Math.max(1, currentPageMisTemas - visibleRange);
    let endPageMisTemas = Math.min(totalPagesMisTemas, currentPageMisTemas + visibleRange);
    let pages = [];
    if (startPageMisTemas > 1) pages.push('...');
    for (let i = startPageMisTemas; i <= endPageMisTemas; i++) {
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
    if (endPageMisTemas < totalPagesMisTemas) pages.push('...');
    return pages;
  };

  //------------------------------------------
  // Handlers para seleccionar filas
  //------------------------------------------
  // Contenidos
  const handleRowClick = (contenido) => {
    setContenidoId(contenido.id_contenido);
    setContenidoNumcontenido(contenido.numcontenidos);
    setContenidoCompetencia(contenido.competencia);
    setContenidoIndicador(contenido.indicador);
    setContenidoContenido(contenido.contenido);
  };

  // Temas
  const handleTemasRowClick = (tema) => {
    setTemasIdTema(tema.id_tema);
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

  // Mis Temas
  const handleMisTemasRowClick = (mitema) => {
    setMisTemasIdTema(mitema.id_mitema);
    setMisTemasIdContenido(mitema.id_contenido);
    setMisTemasCompetencia(mitema.competencia);
    setMisTemasIndicador(mitema.indicador);
    setMisTemasContenido(mitema.contenido);
    setMisTemasTema(mitema.temas);
    setMisTemasActividades(mitema.actividades);
    setMisTemasRecursos(mitema.recursos);
    setMisTemasEvaluacion(mitema.evaluacion);
    setMisTemasMejoramiento(mitema.mejoramiento);
    setMisTemasGrupos(mitema.grupos);
    setMisTemasAprendizaje(mitema.aprendizaje);
    setMisTemasHerramienta(mitema.herramienta);
    setMisTemasFechaEntrega(mitema.fechaentrega);
    setMisTemasPunteo(mitema.punteo);
    setMisTemasResponsable(mitema.responsable);
    setBotonesVisibles(false);
  };

  //------------------------------------------
  // Resetear campos
  //------------------------------------------
  const resetContenidoContenido = () => {
    setContenidoId('');
    setContenidoNumcontenido('');
    setContenidoContenido('');
    setBuscarContenido('');
  };
  const resetContenidoTodos = () => {
    setContenidoId('');
    setContenidoNumcontenido('');
    setContenidoCompetencia('');
    setContenidoIndicador('');
    setContenidoContenido('');
    setBuscarContenido('');
  };
  const resetMisTemas = () => {
    setMisTemasIdTema('');
    setMisTemasIdContenido('');
    setMisTemasCompetencia('');
    setMisTemasIndicador('');
    setMisTemasContenido('');
    setMisTemasTema('');
    setMisTemasActividades('');
    setMisTemasRecursos('');
    setMisTemasEvaluacion('');
    setMisTemasAprendizaje('');
    setMisTemasMejoramiento('');
    setMisTemasGrupos('');
    setMisTemasHerramienta('');
    setMisTemasFechaEntrega('');
    setMisTemasPunteo('');
    setMisTemasResponsable('');
    setBotonesVisibles(true);
  };

  //------------------------------------------
  // Handlers combos Planificación
  //------------------------------------------
  const handleChangeMisTemasGrupos = (e) => setMisTemasGrupos(e.target.value);
  const handleChangeMisTemasHerramienta = (e) => setMisTemasHerramienta(e.target.value);
  const handleChangeMisTemasResponsable = (e) => setMisTemasResponsable(e.target.value);

  //------------------------------------------
  // CRUD: registrar/actualizar/eliminar MisTemas
  //------------------------------------------
  const registrarMiTema = async () => {
    setIsLoading(true);
    if (!validarCampos()) {
      setIsLoading(false);
      return;
    }
    try {
      const grado = seccion.grado;
      let endpoint;
      switch (grado) {
        case 'Primero':
          endpoint = `${API_URL}/misTemasPrimero`;
          break;
        case 'Segundo':
          endpoint = `${API_URL}/misTemasSegundo`;
          break;
        case 'Tercero':
          endpoint = `${API_URL}/misTemasTercero`;
          break;
        case 'Cuarto':
          endpoint = `${API_URL}/misTemasCuarto`;
          break;
        case 'Quinto':
          endpoint = `${API_URL}/misTemasQuinto`;
          break;
        case 'Sexto':
          endpoint = `${API_URL}/misTemasSexto`;
          break;
        default:
          // console.warn('Grado no reconocido:', grado);
          return;
      }

      const response = await axios.post(endpoint, {
        id_contenido: misTemasIdContenido,
        id_docente: userId,
        competencia: misTemasCompetencia,
        indicador: misTemasIndicador,
        contenido: misTemasContenido,
        temas: misTemasTema,
        actividades: misTemasActividades,
        recursos: misTemasRecursos,
        evaluacion: misTemasEvaluacion,
        mejoramiento: misTemasMejoramiento,
        grupos: misTemasGrupos,
        aprendizaje: misTemasAprendizaje,
        herramienta: misTemasHerramienta,
        fechaentrega: misTemasFechaEntrega,
        punteo: misTemasPunteo,
        responsable: misTemasResponsable,
        id_area: idArea
      });
      console.log(response);
      handleSuccessMessage('Tema registrado con éxito');
      setIsLoading(false);
      fetchMisTemas(); // Vuelve a traer todo
      resetMisTemas();
    } catch (error) {
      if (error.response?.data?.error) {
        handleErrorMessage(error.response.data.error);
      } else {
        handleErrorMessage(error.response?.data?.message);
      }
      setIsLoading(false);
    }
  };

  const actualizarMiTema = async () => {
    setIsLoading(true);
    if (!validarCampos()) {
      setIsLoading(false);
      return;
    }
    if (!misTemasIdTema) {
      handleErrorMessage('No has seleccionado el Tema');
      setIsLoading(false);
      return;
    }
    try {
      const grado = seccion.grado;
      let endpoint;
      switch (grado) {
        case 'Primero':
          endpoint = `${API_URL}/misTemasPrimero/${misTemasIdTema}`;
          break;
        case 'Segundo':
          endpoint = `${API_URL}/misTemasSegundo/${misTemasIdTema}`;
          break;
        case 'Tercero':
          endpoint = `${API_URL}/misTemasTercero/${misTemasIdTema}`;
          break;
        case 'Cuarto':
          endpoint = `${API_URL}/misTemasCuarto/${misTemasIdTema}`;
          break;
        case 'Quinto':
          endpoint = `${API_URL}/misTemasQuinto/${misTemasIdTema}`;
          break;
        case 'Sexto':
          endpoint = `${API_URL}/misTemasSexto/${misTemasIdTema}`;
          break;
        default:
          // console.warn('Grado no reconocido:', grado);
          return;
      }

      const response = await axios.put(endpoint, {
        id_contenido: misTemasIdContenido,
        id_docente: userId,
        competencia: misTemasCompetencia,
        indicador: misTemasIndicador,
        contenido: misTemasContenido,
        temas: misTemasTema,
        actividades: misTemasActividades,
        recursos: misTemasRecursos,
        evaluacion: misTemasEvaluacion,
        mejoramiento: misTemasMejoramiento,
        grupos: misTemasGrupos,
        aprendizaje: misTemasAprendizaje,
        herramienta: misTemasHerramienta,
        fechaentrega: misTemasFechaEntrega,
        punteo: misTemasPunteo,
        responsable: misTemasResponsable,
        id_area: idArea
      });
      console.log(response);
      handleSuccessMessage('Tema modificado con éxito');
      setIsLoading(false);
      fetchMisTemas();
      resetMisTemas();
    } catch (error) {
      if (error.response?.data?.error) {
        handleErrorMessage(error.response.data.error);
      } else {
        handleErrorMessage(error.response?.data?.message);
      }
      setIsLoading(false);
    }
  };

  const eliminarMiTema = async () => {
    setIsLoading(true);
    if (!validarCampos()) {
      setIsLoading(false);
      return;
    }
    if (!misTemasIdTema) {
      handleErrorMessage('No has seleccionado el Tema');
      setIsLoading(false);
      return;
    }
    try {
      const grado = seccion.grado;
      let endpoint;
      switch (grado) {
        case 'Primero':
          endpoint = `${API_URL}/misTemasPrimero/${misTemasIdTema}`;
          break;
        case 'Segundo':
          endpoint = `${API_URL}/misTemasSegundo/${misTemasIdTema}`;
          break;
        case 'Tercero':
          endpoint = `${API_URL}/misTemasTercero/${misTemasIdTema}`;
          break;
        case 'Cuarto':
          endpoint = `${API_URL}/misTemasCuarto/${misTemasIdTema}`;
          break;
        case 'Quinto':
          endpoint = `${API_URL}/misTemasQuinto/${misTemasIdTema}`;
          break;
        case 'Sexto':
          endpoint = `${API_URL}/misTemasSexto/${misTemasIdTema}`;
          break;
        default:
          // console.warn('Grado no reconocido:', grado);
          return;
      }

      const response = await axios.delete(endpoint);
      console.log(response);
      handleSuccessMessage('Tema Eliminado con éxito');
      setIsLoading(false);
      fetchMisTemas();
      resetMisTemas();
    } catch (error) {
      if (error.response?.data?.error) {
        handleErrorMessage(error.response.data.error);
      } else {
        handleErrorMessage('Hubo un error al eliminar el tema.');
        console.log(error.response?.data?.error);
      }
      setIsLoading(false);
    }
  };

  //------------------------------------------
  // Exportar Contenido => MisTemas
  //------------------------------------------
  const handleMisTemas = () => {
    if (contenidoId === '') {
      handleErrorMessage('Selecciona un contenido antes de continuar');
      return;
    }
    setMisTemasIdContenido(contenidoId);
    setMisTemasCompetencia(contenidoCompetencia);
    setMisTemasIndicador(contenidoIndicador);
    setMisTemasContenido(contenidoContenido);
    closeContenidosModal();
  };

  //------------------------------------------
  // Exportar Tema => MisTemas
  //------------------------------------------
  const handleTemas = () => {
    if (temasIdContenido === '') {
      handleErrorMessage('Selecciona un tema antes de continuar');
      return;
    }
    setMisTemasIdContenido(temasIdContenido);
    setMisTemasCompetencia(temasCompetencia);
    setMisTemasIndicador(temasIndicador);
    setMisTemasContenido(temasContenido);
    setMisTemasTema(temasTema);
    setMisTemasActividades(temasActividades);
    setMisTemasRecursos(temasRecursos);
    setMisTemasEvaluacion(temasEvaluacion);
    setMisTemasMejoramiento(temasMejoramiento);
    setMisTemasGrupos(temasGrupos);
    setMisTemasAprendizaje(temasAprendizaje);
    setMisTemasHerramienta(temasHerramienta);
    setMisTemasFechaEntrega(temasFechaEntrega);
    setMisTemasPunteo(temasPunteo);
    setMisTemasResponsable(temasResponsable);
    closeTemasModal();
  };

  //------------------------------------------
  // Ver el CNB en PDF según el grado
  //------------------------------------------
  function getGradoCNB(grado) {
    switch (seccion.grado?.toLowerCase()) {
      case 'primero':
        return CNB1;
      case 'segundo':
        return CNB2;
      case 'tercero':
        return CNB3;
      case 'cuarto':
        return CNB4;
      case 'quinto':
        return CNB5;
      case 'sexto':
        return CNB6;
      default:
        return null;
    }
  }
  const abrirPDF = () => {
    const pdf = getGradoCNB(seccion.grado);
    if (pdf) {
      window.open(pdf, '_blank');
    } else {
      console.error('Grado no válido');
    }
  };

  //------------------------------------------
  // Confirmación para eliminar un tema (MisTemas)
  //------------------------------------------
  const notify = () => {
    toast(
      <>
        <h3>¿Está seguro que desea Eliminar este tema, se perderán todos los datos registrados?</h3>
        <button onClick={() => toast.dismiss()}>Cancelar</button>
        <button
          onClick={() => {
            eliminarMiTema(misTemasIdTema);
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

  //------------------------------------------
  // RENDER
  //------------------------------------------
  return (
    <>
      <section className="Temas" id="Temas">
        <ToastContainer />

        <div className="header">
          <span className="material-icons-sharp header-span title-span">rule</span>
          <h1>Mis Temas</h1>
        </div>

        {/* PANEL DE PLANIFICACIÓN */}
        <div className="temas-planificacion">
          <h1>Planificación de Temas</h1>
          <div className="datos">
            <h2>
              Grado: {seccion.grado} Área: {area}
            </h2>
          </div>
          <div className="planes">
            <div className="column1">
              <label>Competencia:</label>
              <textarea
                value={misTemasCompetencia}
                placeholder="Agrega una competencia"
                onChange={(e) => setMisTemasCompetencia(e.target.value)}
              ></textarea>
            </div>
            <div className="column1">
              <label>Indicador de Logro:</label>
              <textarea
                value={misTemasIndicador}
                placeholder="Agrega un indicador de logro"
                onChange={(e) => setMisTemasIndicador(e.target.value)}
              ></textarea>
            </div>
            <div className="column1">
              <label>Contenido:</label>
              <textarea
                value={misTemasContenido}
                placeholder="Agrega un contenido"
                onChange={(e) => setMisTemasContenido(e.target.value)}
              ></textarea>
            </div>
            <div className="column1">
              <label>Temas y Subtemas:</label>
              <textarea
                value={misTemasTema}
                placeholder="Agrega un tema o subtema"
                onChange={(e) => setMisTemasTema(e.target.value)}
              ></textarea>
            </div>
            <div className="column1">
              <label>Actividades:</label>
              <textarea
                value={misTemasActividades}
                placeholder="Agrega actividades de aprendizaje"
                onChange={(e) => setMisTemasActividades(e.target.value)}
              ></textarea>
            </div>
            <div className="column2">
              <label>Recursos:</label>
              <textarea
                value={misTemasRecursos}
                placeholder="Agrega los recursos"
                onChange={(e) => setMisTemasRecursos(e.target.value)}
              ></textarea>

              <label>Evaluación:</label>
              <textarea
                value={misTemasEvaluacion}
                placeholder="Agrega la evaluación"
                onChange={(e) => setMisTemasEvaluacion(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* BOTONES */}
          <div className="botones">
            <button onClick={openContenidosModal}>
              <img src={SearchFile} alt="buscar" />
              Buscar Contenidos
            </button>
            <button onClick={openTemasModal}>
              <img src={Globe} alt="importar" />
              Importar Temas
            </button>
            {botonesVisibles ? (
              <button onClick={registrarMiTema} disabled={isLoading}>
                <img src={Save} alt="guardar" />
                {isLoading ? 'Guardando...' : 'Guardar'}
              </button>
            ) : (
              <button onClick={actualizarMiTema} disabled={isLoading}>
                <img src={Edit} alt="editar" />
                {isLoading ? 'Actualizando...' : 'Actualizar'}
              </button>
            )}
            <button onClick={resetMisTemas}>
              <img src={Note} alt="nuevo" />
              Nuevo
            </button>
            <button onClick={openEvaluacionModal}>
              <img src={Table} alt="plan" />
              Planificación de Actividades
            </button>
            <button onClick={abrirPDF}>
              <img src={Books} alt="cnb" />
              CNB
            </button>
            <button onClick={() => setPlataformaVisible('plataformaMisAreas')}>
              <img src={Areas} alt="volver" />
              Mis Áreas
            </button>
          </div>
        </div>

        {/* TABLA DE MIS TEMAS */}
        <div className="temas-tabla">
          <div className="busqueda">
            <label>Buscar:</label>
            <input
              onChange={(e) => setBuscarMiTema(e.target.value)}
              value={buscarMiTema}
              placeholder="Ingresa el tema a buscar..."
            />
            <button>
              <img src={Search} alt="buscar" />
              Buscar
            </button>
            {!botonesVisibles && (
              <button
                onClick={() => {
                  notify();
                  setMisTemasIdTema();
                }}
              >
                <img src={Delete} alt="eliminar" />
                Eliminar
              </button>
            )}
          </div>
          <div className="tabla">
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
                      <tr
                        key={mitema.id_mitema}
                        onClick={() => {
                          handleMisTemasRowClick(mitema);
                          setMisTemasCompetencia(mitema.competencia);
                        }}
                      >
                        <td>{mitema.temas}</td>
                        <td>{mitema.actividades}</td>
                        <td>{mitema.aprendizaje}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* PAGINACIÓN MIS TEMAS */}
                <div className="paginacion-container">
                  <button
                    onClick={() => setCurrentPageMisTemas(1)}
                    disabled={currentPageMisTemas === 1}
                  >
                    Inicio
                  </button>
                  <button
                    onClick={prevPageMisTemas}
                    disabled={currentPageMisTemas === 1}
                  >
                    Anterior
                  </button>
                  {renderPageButtonsMisTemas()}
                  <button
                    onClick={nextPageMisTemas}
                    disabled={currentPageMisTemas === totalPagesMisTemas}
                  >
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
      </section>

      {/* MODAL CONTENIDOS */}
      <Modal
        isOpen={isOpenContenidosModal}
        onRequestClose={closeContenidosModal}
        className="tema-modal-contenidos"
      >
        <h1>Contenidos</h1>
        <div className="container">
          <div>
            <h1>Área: {area}</h1>
            <h1>Grado: {seccion.grado}</h1>
            <label>No. de Contenido:</label>
            <input
              value={contenidoNumcontenido}
              readOnly
              placeholder="Número de contenidos"
            />
            <label>Competencia:</label>
            <textarea
              value={contenidoCompetencia}
              readOnly
              placeholder="Competencia"
            />
            <label>Indicador de Logro:</label>
            <textarea
              value={contenidoIndicador}
              readOnly
              placeholder="Indicador de Logro"
            />
            <label>Contenido:</label>
            <textarea
              value={contenidoContenido}
              readOnly
              placeholder="Contenido"
            />
            <div className="botones">
              <button onClick={resetContenidoContenido}>
                <img src={Note} alt="null" />
                Nuevo
              </button>
              <button onClick={resetContenidoTodos}>
                <img src={Filter} alt="null" />
                Limpiar
              </button>
              <button onClick={handleMisTemas}>
                <img src={Export} alt="null" />
                Exportar
              </button>
              <button onClick={closeContenidosModal}>
                <img src={Cancel} alt="null" />
                Cancelar
              </button>
            </div>
          </div>
          <div>
            <h1>Currículum Nacional Base</h1>
            
            <div className="busqueda">
              <label>Buscar por:</label>
              <select onChange={(e) => setCriterioBusqueda(e.target.value)}>
                <option value="numcontenidos">Número de Contenido</option>
                <option value="competencia">Competencia</option>
                <option value="indicador">Indicador</option>
                <option value="contenido">Contenido</option>
              </select>
              <input
                type="text"
                onChange={(e) => setBuscarContenido(e.target.value)}
                value={buscarContenido}
                placeholder="Ingresa tu búsqueda..."
              />
            </div>
            <div className="tabla">
              {contenidosFiltrados.length > 0 ? (
                <>
                  <table>
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Competencia</th>
                        <th>Indicador</th>
                        <th>Contenido</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((contenido) => (
                        <tr
                          key={contenido.id_contenido}
                          onClick={() => handleRowClick(contenido)}
                        >
                          <td>{contenido.numcontenidos}</td>
                          <td>{contenido.competencia}</td>
                          <td>{contenido.indicador}</td>
                          <td>{contenido.contenido}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* PAGINACIÓN CONTENIDOS */}
                  <div className="paginacion-container">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      Inicio
                    </button>
                    <button onClick={prevPage} disabled={currentPage === 1}>
                      Anterior
                    </button>
                    {renderPageButtons()}
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      Final
                    </button>
                  </div>
                  <div className="paginacion-final">
                    Página {currentPage} de {totalPages}
                  </div>
                </>
              ) : (
                <p
                  style={{
                    fontSize: '18px',
                    textAlign: 'center',
                    color: 'black',
                    marginTop: '1rem',
                    fontWeight: '600'
                  }}
                >
                  No hay contenidos disponibles.
                </p>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* MODAL TEMAS */}
      <Modal
        isOpen={isOpenTemasModal}
        onRequestClose={closeTemasModal}
        className="tema-modal-temas"
      >
        <h1>Temas Existentes</h1>
        <div className="container">
          <div className="titulo">
            <h2>Área: {area}</h2>
            <h2>Grado: {seccion.grado}</h2>
            <h1>Tema Seleccionado: {temaSeleccionado}</h1>
          </div>
          <div className="busqueda">
            <h2>Buscar:</h2>
            <input
              type="text"
              onChange={(e) => setBuscarTema(e.target.value)}
              value={buscarTema}
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
            {temasFiltrados.length > 0 ? (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Temas</th>
                      <th>Actividades</th>
                      <th>Mejoramiento</th>
                      <th>Aprendizaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItemsTemas.map((tema) => (
                      <tr
                        key={tema.id_tema}
                        onClick={() => handleTemasRowClick(tema)}
                      >
                        <td>{tema.temas}</td>
                        <td>{tema.actividades}</td>
                        <td>{tema.mejoramiento}</td>
                        <td>{tema.aprendizaje}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* PAGINACIÓN TEMAS */}
                <div className="paginacion-container">
                  <button
                    onClick={() => setCurrentPageTemas(1)}
                    disabled={currentPageTemas === 1}
                  >
                    Inicio
                  </button>
                  <button
                    onClick={prevPageTemas}
                    disabled={currentPageTemas === 1}
                  >
                    Anterior
                  </button>
                  {renderPageButtonsTemas()}
                  <button
                    onClick={nextPageTemas}
                    disabled={currentPageTemas === totalPagesTemas}
                  >
                    Siguiente
                  </button>
                  <button
                    onClick={() => setCurrentPageTemas(totalPagesTemas)}
                    disabled={currentPageTemas === totalPagesTemas}
                  >
                    Final
                  </button>
                </div>
                <div className="paginacion-final">
                  Página {currentPageTemas} de {totalPagesTemas}
                </div>
              </>
            ) : (
              <p
                style={{
                  fontSize: '18px',
                  textAlign: 'center',
                  color: 'black',
                  marginTop: '1rem',
                  fontWeight: '600'
                }}
              >
                No hay Temas disponibles.
              </p>
            )}
          </div>
        </div>
      </Modal>

      {/* MODAL EVALUACION */}
      <Modal
        isOpen={isOpenEvaluacionModal}
        onRequestClose={closeEvaluacionModal}
        className="tema-modal-evaluacion"
      >
        <h1>Planificación de Actividades</h1>
        <div className="container">
          <div className="actividades">
            <h2>Actividades de Aprendizaje:</h2>
            <textarea
              value={misTemasAprendizaje}
              placeholder="Agrega actividades de aprendizaje"
              onChange={(e) => setMisTemasAprendizaje(e.target.value)}
            ></textarea>
            <h2>Actividades de Mejoramiento:</h2>
            <textarea
              value={misTemasMejoramiento}
              placeholder="Agrega actividades de mejoramiento"
              onChange={(e) => setMisTemasMejoramiento(e.target.value)}
            ></textarea>
          </div>
          <div className="datos">
            <h2>Cantidad de integrantes:</h2>
            <select value={misTemasGrupos} onChange={handleChangeMisTemasGrupos}>
              <option value="" disabled>
                Selecciona...
              </option>
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
              <option value="Otro">Otro</option>
            </select>

            <h2>Herramienta de Evaluación:</h2>
            <select
              value={misTemasHerramienta}
              onChange={handleChangeMisTemasHerramienta}
            >
              <option value="" disabled>
                Selecciona...
              </option>
              <option value="Escala de Rango">Escala de Rango</option>
              <option value="Lista de Cotejo">Lista de Cotejo</option>
              <option value="Rúbrica">Rúbrica</option>
              <option value="Laboatorio">Laboratorio</option>
              <option value="Preguntas">Preguntas</option>
              <option value="Portafolio">Portafolio</option>
              <option value="Diario en Clase">Diario en Clase</option>
              <option value="Otro">Otro</option>
            </select>

            <h2>Fecha de la Actividad:</h2>
            <input
              value={misTemasFechaEntrega}
              type="date"
              onChange={(e) => setMisTemasFechaEntrega(e.target.value)}
            />

            <h2>Punteo de la Actividad:</h2>
            <input
              value={misTemasPunteo}
              placeholder="Agrega un punteo"
              onChange={(e) => setMisTemasPunteo(e.target.value)}
            />

            <h2>Responsable:</h2>
            <select
              value={misTemasResponsable}
              onChange={handleChangeMisTemasResponsable}
            >
              <option value="" disabled>
                Selecciona...
              </option>
              <option value="Alumno">Alumno</option>
              <option value="Docente">Docente</option>
              <option value="Alumno y Docente">Alumno y Docente</option>
              <option value="Director">Director</option>
              <option value="Otro">Otro</option>
            </select>

            <div className="botones">
              <button onClick={closeEvaluacionModal}>
                <img src={Acept} alt="null" />
                Confirmar
              </button>
              <button onClick={closeEvaluacionModal}>
                <img src={Cancel} alt="null" />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MisTemas;
