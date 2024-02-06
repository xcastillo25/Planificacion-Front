import React, {useEffect, useState} from 'react';
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

const AdminTemas=({plataforma, setPlataformaVisible, area, idArea, idGrado, isOpen, onClose}) => {

    const [isOpenContenidosModal, setIsOpenContenidoModal] = useState(false);
    const openContenidosModal = () => setIsOpenContenidoModal(true);
    const closeContenidosModal = () => setIsOpenContenidoModal(false);
    const [isOpenTemasModal, setIsOpenTemasModal] = useState(false);
    const openTemasModal = () => setIsOpenTemasModal(true);
    const closeTemasModal = () => setIsOpenTemasModal(false);
    const [isOpenEvaluacionModal, setIsOpenEvaluacionModal] = useState(false);
    const openEvaluacionModal = () => setIsOpenEvaluacionModal(true);
    const closeEvaluacionModal = () => setIsOpenEvaluacionModal(false);

    const [contenidoId, setContenidoId] = useState('');
    const [contenidoNumcontenido, setContenidoNumcontenido] = useState('');
    const [contenidoCompetencia, setContenidoCompetencia] = useState('');
    const [contenidoIndicador, setContenidoIndicador] = useState('');
    const [contenidoContenido, setContenidoContenido] = useState('');
    const [buscarContenido, setBuscarContenido] = useState('');
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
    const [buscarTema, setBuscarTema] = useState('');
    const [buscarMiTema, setBuscarMiTema] = useState('');
    const [temaSeleccionado, setTemaSeleccionado] = useState('');
    const [grado, setGrado] = useState('');

    const [idDocente, setIdDocente] = useState([]);
    const [contenidosData, setContenidosData] = useState([]);
    const [contenidosFiltrados, setContenidosFiltrados] = useState([]);
    const [temasData, setTemasData] = useState([]);
    const [temasFiltrados, setTemasFiltrados] = useState([]);
    const [misTemasData, setMisTemasData] = useState([]);
    const [misTemasFiltrados, setMisTemasFiltrados] = useState([]);
    const [botonesVisibles, setBotonesVisibles] = useState(true);
    const handleChangeTemasGrupos = (e) => {setTemasGrupos(e.target.value);};
    const handleChangeTemasHerramienta = (e) => {setTemasHerramienta(e.target.value);};
    const handleChangeTemasResponsable = (e) => {setTemasResponsable(e.target.value);};

    const validarCampos = () => {
        const camposObligatorios = [
            { valor: temasCompetencia, nombreCampo: 'Competencia'},
            { valor: temasIndicador, nombreCampo: 'Indicador'},
            { valor: temasContenido, nombreCampo: 'Contenido'},
            { valor: temasTema, nombreCampo: 'Tema'},
            { valor: temasActividades, nombreCampo: 'Actividades'},
            { valor: temasRecursos, nombreCampo: 'Recursos'},
            { valor: temasEvaluacion, nombreCampo: 'Evaluacion'},
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
        }

        return true;
    }

    const [isLoading, setIsLoading] = useState(false);
    const fetchTemas = async () => {
        try {
            const migrado = idGrado;
            console.log("Grado=", migrado);
    
            let endpoint;
            let findpoint;
    
    
            switch (migrado) {
                case 1:
                    endpoint = `${API_URL}/temasPrimero/${idArea}`;
                    findpoint = `${API_URL}/misTemasPrimeroTema/${idArea}/${buscarMiTema}`;
                    setGrado('Primero');
                    break;
                case 2:
                    endpoint = `${API_URL}/temasSegundo/${idArea}`;
                    findpoint = `${API_URL}/temasSegundoTema/${idArea}/${buscarMiTema}`;
                    setGrado('Segundo');
                    break;
                case 3:
                    endpoint = `${API_URL}/temasTercero/${idArea}`;
                    findpoint = `${API_URL}/temasTerceroTema/${idArea}/${buscarMiTema}`;
                    setGrado('Tercero');
                    break;
                case 4:
                    endpoint = `${API_URL}/temasCuarto/${idArea}`;
                    findpoint = `${API_URL}/temasCuartoTema/${idArea}/${buscarMiTema}`;
                    setGrado('Cuarto');
                    break;
                case 5:
                    endpoint = `${API_URL}/temasQuinto/${idArea}`;
                    findpoint = `${API_URL}/temasQuintoTema/${idArea}/${buscarMiTema}`;
                    setGrado('Quinto');
                    break;
                case 6:
                    endpoint = `${API_URL}/temasSexto/${idArea}`;
                    findpoint = `${API_URL}/temasSextoTema/${idArea}/${buscarMiTema}`;
                    setGrado('Sexto');
                    break; 
                default:
                    console.warn("Grado no reconocido:", migrado);
                    return;
            }
    
            const response = await axios.get(buscarMiTema ? findpoint : endpoint);
            const data = response.data.temas;
            
            const filteredDataTemas = buscarTema? data.filter(tema => 
                tema.temas.toLowerCase().includes(buscarTema.toLowerCase())
                
            ) : data;

            setTemasData(filteredDataTemas);
            setCurrentPageTemas(1); // Regresa a la primera página después de cada búsqueda
            setTemasFiltrados(filteredDataTemas); 
        } catch (error) {
            console.log(error);
        }
    };
    
    useEffect(() => {
        fetchTemas();
    }, [idArea]);

    const fetchContenidos = async () => {
        try {
            const migrado = idGrado;
            console.log("Grado=", migrado);
    
            let endpoint;
            let findpoint;
    
            switch (migrado) {
                case 1:
                    endpoint = `${API_URL}/contenidosPrimero/${idArea}`;
                    break;
                case 2:
                    endpoint = `${API_URL}/contenidosSegundo/${idArea}`;
                    break;
                case 3:
                    endpoint = `${API_URL}/contenidosTercero/${idArea}`;
                    break;
                case 4:
                    endpoint = `${API_URL}/contenidosCuarto/${idArea}`;
                    break;
                case 5:
                    endpoint = `${API_URL}/contenidosQuinto/${idArea}`;
                    break;
                case 6:
                    endpoint = `${API_URL}/contenidosSexto/${idArea}`;
                    break; 
                default:
                    console.warn("Grado no reconocido:", migrado);
                    return;
            }
    
            const response = await axios.get(buscarContenido ? findpoint : endpoint);
            const data = response.data.contenidos;
            
            const filteredData = buscarContenido ? data.filter(contenido => 
                contenido.numcontenidos.toLowerCase().includes(buscarContenido.toLowerCase())
                
            ) : data;

            setContenidosData(filteredData);
            setCurrentPage(1); // Regresa a la primera página después de cada búsqueda
            setContenidosFiltrados(filteredData); 
        } catch (error) {
            console.log(error);
        }
    };
    
    useEffect(() => {
        fetchContenidos();
    }, [idArea]);

    const filtrarContenidos = () => {
        if (!buscarContenido) {
            setContenidosFiltrados(contenidosData);
            return;
        }
    
        const filtrados = contenidosData.filter(contenido => 
            contenido.numcontenidos.toLowerCase().includes(buscarContenido.toLowerCase())
        );
    
        setContenidosFiltrados(filtrados);
    };

    const filtrarTemas = () => {
        if (!buscarTema) {
            setTemasFiltrados(temasData);
            return;
        }
    
        const filtrados = temasData.filter(tema => 
            tema.temas.toLowerCase().includes(buscarTema.toLowerCase())
        );
    
        setTemasFiltrados(filtrados);
    };
    
    useEffect(() => {
        filtrarContenidos();
    }, [buscarContenido]);

    useEffect(() => {
        filtrarTemas();
    }, [buscarTema]);


    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageTemas, setCurrentPageTemas] = useState(1);
    const itemsPerPage = 12;
    const itemsPerPageTemas = 12;
    const totalPages = Math.ceil(contenidosData.length / itemsPerPage);
    const totalPagesTemas = Math.ceil(temasData.length / itemsPerPageTemas);
    
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const nextPageTemas = () => {
        if (currentPageTemas < totalPagesTemas) {
            setCurrentPageTemas(currentPageTemas + 1);
        }
    };
    
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const prevPageTemas = () => {
        if (currentPageTemas > 1) {
            setCurrentPageTemas(currentPageTemas - 1);
        }
    };

    const renderPageButtons = () => {
        const visibleRange = 2; // Cantidad de páginas a cada lado de la página actual que se mostrarán
        let startPage = Math.max(1, currentPage - visibleRange);
        let endPage = Math.min(totalPages, currentPage + visibleRange);
    
        let pages = [];
    
        if (startPage > 1) {
            pages.push('...'); // Separador para páginas iniciales omitidas
        }
    
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
    
        if (endPage < totalPages) {
            pages.push('...'); // Separador para páginas finales omitidas
        }
    
        return pages;
    };

    const renderPageButtonsTemas = () => {
        const visibleRangeTemas = 2; // Cantidad de páginas a cada lado de la página actual que se mostrarán
        let startPageTemas = Math.max(1, currentPageTemas - visibleRangeTemas);
        let endPageTemas = Math.min(totalPagesTemas, currentPageTemas + visibleRangeTemas);
    
        let pagesTemas = [];
    
        if (startPageTemas > 1) {
            pagesTemas.push('...'); // Separador para páginas iniciales omitidas
        }
    
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
    
        if (endPageTemas < totalPagesTemas) {
            pagesTemas.push('...'); // Separador para páginas finales omitidas
        }
    
        return pagesTemas;
    };
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfLastItemTemas = currentPageTemas * itemsPerPageTemas;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const indexOfFirstItemTemas = indexOfLastItemTemas - itemsPerPageTemas;
    const currentItems = contenidosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
    const currentItemsTemas = temasFiltrados.slice(indexOfFirstItemTemas, indexOfLastItemTemas);

    const handleRowClick = (contenido) => {
        setContenidoId(contenido.id_contenido);
        setContenidoNumcontenido(contenido.numcontenidos); 
        setContenidoCompetencia(contenido.competencia); 
        setContenidoIndicador(contenido.indicador); 
        setContenidoContenido(contenido.contenido); 
    };

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

        setBotonesVisibles(false);
    };
    
    const resetContenidoContenido = () => {
        setContenidoId('');
        setContenidoNumcontenido('');
        setContenidoContenido('');
        setBuscarContenido('');
    }

    const resetContenidoTodos = () => {
        setContenidoId('');
        setContenidoNumcontenido('');
        setContenidoCompetencia('');
        setContenidoIndicador('');
        setContenidoContenido('');
        setBuscarContenido('');
    }

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

    const handleTemas = () => {
        
        if(contenidoId === ''){
            handleErrorMessage('Selecciona un tema antes de continuar');
            return;
        }

        setTemasIdContenido(contenidoId);
        setTemasCompetencia(contenidoCompetencia);
        setTemasIndicador(contenidoIndicador);
        setTemasContenido(contenidoContenido);

        closeContenidosModal();
    }

    function getGradoCNB(grado) {
        switch (idGrado) {
          case 1:
            return CNB1;
          case 2:
            return CNB2;
          case 3:
            return CNB3;
          case 4:
            return CNB4;
          case 5:
            return CNB5;
          case 6:
            return CNB6;
          default:
            return null;
        }
    } 

    const abrirPDF = (grado) => {
        const pdf = getGradoCNB(grado);
        if (pdf) {
          window.open(pdf, '_blank');
        } else {
          console.error('Grado no válido');
        }
    };

    const resetTemas = () => {
        setTemasIdTema('');
        setTemasIdContenido('');
        setTemasCompetencia('');
        setTemasIndicador('');
        setTemasContenido('');
        setTemasTema('');
        setTemasActividades('');
        setTemasRecursos('');
        setTemasEvaluacion('');
        setTemasAprendizaje('');
        setTemasMejoramiento('');
        setTemasGrupos('');
        setTemasHerramienta('');
        setTemasFechaEntrega('');
        setTemasPunteo('');
        setTemasResponsable('');
        setBotonesVisibles(true);
    }

    const notify = () => {
        toast(
          <>
            <h3>¿Está seguro que desea Eliminar este tema, se perderán todos los datos registrados?</h3>
            <button onClick={() => toast.dismiss()}>Cancelar</button>
            <button onClick={() => {
                    eliminarTema(temasIdTema);
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
    
    const registrarTema = async () => {
        setIsLoading(true);

        if (!validarCampos()){
            setIsLoading(false);
            return;
        }

        try{
            const migrado = idGrado;

            let endpoint;

            switch (migrado) {
                case 1:
                    endpoint = `${API_URL}/temasPrimero`;
                    break;
                case 2:
                    endpoint = `${API_URL}/temasSegundo`;
                    break;
                case 3:
                    endpoint = `${API_URL}/temasTercero`;
                    break;
                case 4:
                    endpoint = `${API_URL}/temasCuarto`;
                    break;
                case 5:
                    endpoint = `${API_URL}/temasQuinto`;
                    break;
                case 6:
                    endpoint = `${API_URL}/temasSexto`;
                    break;
                default:
                    console.warn("Grado no reconocido:", migrado);
                    return;
            }

            const response = await axios.post(endpoint, {
                id_contenido: temasIdContenido,
                competencia: temasCompetencia,
                indicador: temasIndicador,
                contenido: temasContenido,
                temas: temasTema,
                actividades: temasActividades,
                recursos: temasRecursos,
                evaluacion: temasEvaluacion,
                mejoramiento: temasMejoramiento,
                grupos: temasGrupos,
                aprendizaje: temasAprendizaje,
                herramienta: temasHerramienta,
                fechaentrega: temasFechaEntrega,
                punteo: temasPunteo,
                responsable: temasResponsable,
                id_area: idArea
            });
            console.log(response);
            handleSuccessMessage('Tema registrado con éxito');
            setIsLoading(false);
            fetchTemas();
            resetTemas();
            filtrarContenidos();
        } catch (error){
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage(error.response.data.message);
            }
            setIsLoading(false);
        }
    }

    const actualizarTema = async () => {
        setIsLoading(true);

        if (!validarCampos()){
            setIsLoading(false);
            return;
        }

        if (!temasIdTema) {
            handleErrorMessage('No has seleccionado el Tema');
            setIsLoading(false);
            return;
        }

        try{
            const migrado = idGrado;

            let endpoint;

            switch (migrado) {
                case 1:
                    endpoint = `${API_URL}/temasPrimero/${temasIdTema}`;
                    break;
                case 2:
                    endpoint = `${API_URL}/temasSegundo/${temasIdTema}`;
                    break;
                case 3:
                    endpoint = `${API_URL}/temasTercero/${temasIdTema}`;
                    break;
                case 4:
                    endpoint = `${API_URL}/temasCuarto/${temasIdTema}`;
                    break;
                case 5:
                    endpoint = `${API_URL}/temasQuinto/${temasIdTema}`;
                    break;
                case 6:
                    endpoint = `${API_URL}/temasSexto/${temasIdTema}`;
                    break;
                default:
                    console.warn("Grado no reconocido:", migrado);
                    return;
            }

            const response = await axios.put(endpoint, {
                id_contenido: temasIdContenido,
                competencia: temasCompetencia,
                indicador: temasIndicador,
                contenido: temasContenido,
                temas: temasTema,
                actividades: temasActividades,
                recursos: temasRecursos,
                evaluacion: temasEvaluacion,
                mejoramiento: temasMejoramiento,
                grupos: temasGrupos,
                aprendizaje: temasAprendizaje,
                herramienta: temasHerramienta,
                fechaentrega: temasFechaEntrega,
                punteo: temasPunteo,
                responsable: temasResponsable,
                id_area: idArea
            });
            console.log(response);
            handleSuccessMessage('Tema modificado con éxito');
            setIsLoading(false);
            fetchTemas();
            resetTemas();
            filtrarContenidos();
        } catch (error){
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage(error.response.data.message);
            }
            setIsLoading(false);
        }
    }

    const eliminarTema = async () => {
        setIsLoading(true);

        if (!validarCampos()){
            setIsLoading(false);
            return;
        }

        if (!temasIdTema) {
            handleErrorMessage('No has seleccionado el Tema');
            setIsLoading(false);
            return;
        }

        try{
            const migrado = idGrado;

            let endpoint;

            switch (migrado) {
                case 1:
                    endpoint = `${API_URL}/temasPrimero/${temasIdTema}`;
                    break;
                case 2:
                    endpoint = `${API_URL}/temasSegundo/${temasIdTema}`;
                    break;
                case 3:
                    endpoint = `${API_URL}/temasTercero/${temasIdTema}`;
                    break;
                case 4:
                    endpoint = `${API_URL}/temasCuarto/${temasIdTema}`;
                    break;
                case 5:
                    endpoint = `${API_URL}/temasQuinto/${temasIdTema}`;
                    break;
                case 6:
                    endpoint = `${API_URL}/temasSexto/${temasIdTema}`;
                    break;
                default:
                    console.warn("Grado no reconocido:", migrado);
                    return;
            }

            const response = await axios.delete(endpoint);
            console.log(response);
            handleSuccessMessage('Tema Eliminado con éxito');
            setIsLoading(false);
            fetchTemas();
            resetTemas();
            filtrarContenidos();
        } catch (error){
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage('Hubo un error al eliminar el tema.');
                console.log(error.response.data.error);
            }
            setIsLoading(false);
        }
    }

    return(
        <>
            <section className="Temas" id="Temas">
            <ToastContainer />
            <div className ="header">
                <span className="material-icons-sharp header-span title-span">rule</span>
                    <h1>Mis Temas</h1>
            </div>
            <div className="temas-planificacion">
                <h1>Planificación de Temas</h1>
                <div className="datos">
                    <h2>Grado: {grado} Área: {area}</h2>
                </div>
                <div className="planes">
                    <div className="column1">
                        <label>Competencia:</label>
                        <textarea 
                            value={temasCompetencia} 
                            placeholder="Agrega una competencia"
                            onChange={(e) => setTemasCompetencia(e.target.value)}>         
                        </textarea>
                    </div>
                    <div className="column1">
                        <label>Indicador de Logro:</label>
                        <textarea 
                            value={temasIndicador} 
                            placeholder="Agrega un indicador de logro"
                            onChange={(e) => setTemasIndicador(e.target.value)}>
                        </textarea>
                    </div>
                    <div className="column1">
                        <label>Contenido:</label>
                        <textarea 
                            value={temasContenido} 
                            placeholder="Agrega un contenido"
                            onChange={(e) => setTemasContenido(e.target.value)}>
                        </textarea>
                    </div>
                    <div className="column1">
                        <label>Temas y Subtemas:</label>
                        <textarea 
                            value={temasTema} 
                            placeholder="Agrega un tema o subtema"
                            onChange={(e) => setTemasTema(e.target.value)}>
                        </textarea>
                    </div>
                    <div className="column1">
                        <label>Actividades:</label>
                        <textarea 
                            value={temasActividades} 
                            placeholder="Agrega actividades de aprendizaje"
                            onChange={(e) => setTemasActividades(e.target.value)}>
                        </textarea>
                    </div>
                    <div className="column2">
                        <label>Recursos:</label>
                        <textarea 
                            value={temasRecursos} 
                            placeholder="Agrega los recursos"
                            onChange={(e) => setTemasRecursos(e.target.value)}>
                        </textarea>
                        <label>Evaluación:</label>
                        <textarea 
                            value={temasEvaluacion} 
                            placeholder="Agrega la evaluación"
                            onChange={(e) => setTemasEvaluacion(e.target.value)}>
                        </textarea>
                    </div>
                </div>
                <div className="botones">
                    <button onClick={openContenidosModal}>
                        <img src={SearchFile} alt="save"></img>
                        Buscar Contenidos
                    </button>
                    {botonesVisibles && (
                        <button
                        onClick={registrarTema}
                        disabled={isLoading}>
                            <img src={Save} alt="save"></img>
                            {isLoading ? "Guardando..." : "Guardar"}
                        </button>
                    )}
                    {!botonesVisibles && (
                        <button
                        onClick={actualizarTema}
                        disabled = {isLoading}>
                            <img src={Edit} alt="save"></img>
                            {isLoading ? "Actualizando..." : "Actualizar"}
                        </button>
                    )}
                    <button onClick={resetTemas}>
                        <img src={Note} alt="save"></img>
                        Nuevo
                    </button>
                    <button onClick={openEvaluacionModal}>
                        <img src={Table} alt="save"></img>
                        Planificación de Actividades
                    </button>
                    <button onClick={()=>{abrirPDF()}}>
                        <img src={Books} alt="save"></img>
                        CNB
                    </button>
                    <button onClick={()=>{setPlataformaVisible('plataformaAdminAreas')}}>
                        <img src={Areas} alt="save"></img>
                        Áreas
                    </button>
                </div>
            </div>
            <div className="temas-tabla">
                <div className="busqueda">
                    <label>Buscar:</label>
                    <input 
                        onChange={(e) => setBuscarTema(e.target.value)} 
                        value={buscarTema} 
                        placeholder="Ingresa el tema a buscar..."
                        ></input>
                    <button>
                        <img src={Search} alt="save"></img>
                        Buscar
                    </button>
                    {!botonesVisibles && ( 
                        <button onClick={()=> {notify(); setTemasIdTema();}}>
                            <img src={Delete} alt="null"></img>
                            Eliminar
                        </button>
                    )}
                </div>
                <div className="tabla">
                    {temasData.length > 0 ? (
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
                                    {currentItemsTemas.map((tema) => (
                                        <tr key={tema.id_mitema} 
                                        onClick={()=> {handleTemasRowClick(tema); setTemasCompetencia(tema.competencia);}}>
                                            <td>{tema.temas}</td>
                                            <td>{tema.actividades}</td>
                                            <td>{tema.aprendizaje}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="paginacion-container">
                                <button onClick={() => setCurrentPageTemas(1)} disabled={currentPageTemas === 1}>
                                    Inicio
                                </button>
                                <button onClick={() => prevPageTemas()} disabled={currentPageTemas === 1}>
                                    Anterior
                                </button>

                                {renderPageButtonsTemas()}

                                <button onClick={() => nextPageTemas()} disabled={currentPageTemas === totalPagesTemas}>
                                    Siguiente
                                </button>
                                <button onClick={() => setCurrentPageTemas(totalPagesTemas)} disabled={currentPageTemas === totalPagesTemas}>
                                    Final
                                </button>
                            </div>

                            <div className="paginacion-final">
                                Página {currentPageTemas} de {totalPagesTemas}
                            </div>
                        </>
                    ) : (
                        <p style={{
                            fontSize: '18px',
                            textAlign: 'center',
                            color: 'black',
                            margin: '1rem',
                            fontWeight: '600',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}>
                            No hay Temas disponibles.
                        </p>
                    )}
                </div>
            </div>
            </section>
            <Modal isOpen={isOpenContenidosModal} onRequestClose={closeContenidosModal} className="tema-modal-contenidos">
                <h1>Contenidos</h1>
                <div className="container">
                    <div>
                        <h1>Área: {area}</h1>
                        <h1>Grado: {idGrado}</h1>
                        <label>No. de Contenido:</label>
                        <input value={contenidoNumcontenido} readOnly placeholder="Número de contenidos"></input>
                        <label>Competencia:</label>
                        <textarea value={contenidoCompetencia} readOnly placeholder="Competencia"></textarea>
                        <label>Indicador de Logro:</label>
                        <textarea value={contenidoIndicador} readOnly placeholder="Indicador de Logro"></textarea>
                        <label>Contenido:</label>
                        <textarea value={contenidoContenido} readOnly placeholder="Contenido"></textarea>
                        <div className="botones">
                            <button onClick={() => {resetContenidoContenido()}}>
                                <img src={Note} alt="null"></img>
                                Nuevo
                            </button>
                            <button onClick={() => {resetContenidoTodos()}}>
                                <img src={Filter} alt="null"></img>
                                Limpiar
                            </button>
                            <button onClick={() => {handleTemas()}}>
                                <img src={Export} alt="null"></img>
                                Exportar
                            </button>
                            <button onClick={() => {closeContenidosModal()}}>
                                <img src={Cancel} alt="null"></img>
                                Cancelar
                            </button>
                        </div>
                    </div>
                    <div>
                        <h1>Currículum Nacional Base</h1>
                        <div className="busqueda">
                            <label>Buscar:</label>
                            <select>
                                <option>Número de Contenido</option>
                            </select>
                            <input 
                                onChange={(e) => setBuscarContenido(e.target.value)} 
                                value={buscarContenido} 
                                placeholder="Ingresa el contenido a buscar..." 
                            />
                        </div>
                        <div className="tabla">
                            {contenidosData.length > 0 ? (
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
                                                <tr key={contenido.id_contenido} onClick={() => handleRowClick(contenido)}>
                                                    <td>{contenido.numcontenidos}</td>
                                                    <td>{contenido.competencia}</td>
                                                    <td>{contenido.indicador}</td>
                                                    <td>{contenido.contenido}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="paginacion-container">
                                        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                                            Inicio
                                        </button>
                                        <button onClick={() => prevPage()} disabled={currentPage === 1}>
                                            Anterior
                                        </button>

                                        {renderPageButtons()}

                                        <button onClick={() => nextPage()} disabled={currentPage === totalPages}>
                                            Siguiente
                                        </button>
                                        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                                            Final
                                        </button>
                                    </div>

                                    <div className="paginacion-final">
                                        Página {currentPage} de {totalPages}
                                    </div>
                                </>
                            ) : (
                                <p style={{
                                    fontSize: '18px',
                                    textAlign: 'center',
                                    color: 'black',
                                    marginTop: '1rem',
                                    fontWeight: '600'
                                }}>
                                    No hay contenidos disponibles.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={isOpenEvaluacionModal} onRequestClose={closeEvaluacionModal} className="tema-modal-evaluacion">
                <h1>Planificación de Actividades</h1>
                <div className="container">
                    <div className="actividades">
                        <h2>Actividades de Aprendizaje:</h2>
                        <textarea 
                            value={temasAprendizaje}
                            placeholder="Agrega actvidades de aprendizaje"
                            onChange={(e) => setTemasAprendizaje(e.target.value)}></textarea>
                        <h2>Actividades de Mejoramiento:</h2>
                        <textarea 
                            value={temasMejoramiento} 
                            placeholder="Agrega actividades de mejoramiento"
                            onChange={(e) => setTemasMejoramiento(e.target.value)}></textarea>
                    </div>
                    <div className="datos">
                        <h2>Cantidad de integrantes:</h2>
                        <select value={temasGrupos} onChange={handleChangeTemasGrupos}>
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
                            <option value="Otro">Otro</option>
                        </select>
                        <h2>Herramienta de Evaluación:</h2>
                        <select value={temasHerramienta} onChange={handleChangeTemasHerramienta}>
                            <option value="" disabled>Selecciona...</option>
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
                            value={temasFechaEntrega} 
                            type="date"
                            onChange={(e) => setTemasFechaEntrega(e.target.value)}></input>
                        <h2>Punteo Obtenido:</h2>
                        <input 
                            value={temasPunteo} 
                            placeholder="Agrega un punteo"
                            onChange={(e) => setTemasPunteo(e.target.value)}></input>
                        <h2>Responsable:</h2>
                        <select value={temasResponsable} onChange={handleChangeTemasResponsable}>
                            <option value="" disabled>Selecciona...</option>
                            <option value="Alumno">Alumno</option>
                            <option value="Docente">Docente</option>
                            <option value="Alumno y Docente">Alumno y Docente</option>
                            <option value="Director">Director</option>
                            <option value="Otro">Otro</option>
                        </select>
                        <div className="botones">
                            <button onClick={() => {closeEvaluacionModal()}}>
                                <img src={Acept} alt="null"></img>
                                Confirmar
                            </button>
                            <button onClick={() => {closeEvaluacionModal()}}>
                                <img src={Cancel} alt="null"></img>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
     </>
    );
};

export default AdminTemas;