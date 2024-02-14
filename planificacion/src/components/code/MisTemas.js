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

const MisTemas=({plataforma, setPlataformaVisible, seccion, area, idArea, userId, isOpen, onClose}) => {

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

    const [contenidosData, setContenidosData] = useState([]);
    const [contenidosFiltrados, setContenidosFiltrados] = useState([]);
    const [temasData, setTemasData] = useState([]);
    const [temasFiltrados, setTemasFiltrados] = useState([]);
    const [misTemasData, setMisTemasData] = useState([]);
    const [misTemasFiltrados, setMisTemasFiltrados] = useState([]);
    const [botonesVisibles, setBotonesVisibles] = useState(true);
    const handleChangeMisTemasGrupos = (e) => {setMisTemasGrupos(e.target.value);};
    const handleChangeMisTemasHerramienta = (e) => {setMisTemasHerramienta(e.target.value);};
    const handleChangeMisTemasResponsable = (e) => {setMisTemasResponsable(e.target.value);};

    const validarCampos = () => {
        const camposObligatorios = [
            { valor: misTemasCompetencia, nombreCampo: 'Competencia'},
            { valor: misTemasIndicador, nombreCampo: 'Indicador'},
            { valor: misTemasContenido, nombreCampo: 'Contenido'},
            { valor: misTemasTema, nombreCampo: 'Tema'},
            { valor: misTemasActividades, nombreCampo: 'Actividades'},
            { valor: misTemasRecursos, nombreCampo: 'Recursos'},
            { valor: misTemasEvaluacion, nombreCampo: 'Evaluacion'},
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

    const fetchMisTemas = async () => {
        try {
            const migrado = seccion.grado;
            console.log("Grado=", migrado);
    
            let endpoint;
            let findpoint;
    
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
                    console.warn("Grado no reconocido:", migrado);
                    return;
            }
    
            const response = await axios.get(buscarMiTema ? findpoint : endpoint);
            const data = response.data.mistemas;
            
            const filteredDataMisTemas = buscarMiTema? data.filter(mitema => 
                mitema.temas.toLowerCase().includes(buscarTema.toLowerCase())
                
            ) : data;

            setMisTemasData(filteredDataMisTemas);
            setCurrentPageMisTemas(1); // Regresa a la primera página después de cada búsqueda
            setMisTemasFiltrados(filteredDataMisTemas); 
        } catch (error) {
            console.log(error);
        }
    };
    
    useEffect(() => {
        fetchMisTemas();
    }, [idArea, userId]);

    const [isLoading, setIsLoading] = useState(false);
    const registrarMiTema = async () => {
        setIsLoading(true);

        if (!validarCampos()){
            setIsLoading(false);
            return;
        }

        try{
            const migrado = seccion.grado;

            let endpoint;

            switch (migrado) {
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
                    console.warn("Grado no reconocido:", migrado);
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
            fetchMisTemas();
            resetMisTemas();
        } catch (error){
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage(error.response.data.message);
            }
            setIsLoading(false);
        }
    }

    const actualizarMiTema = async () => {
        setIsLoading(true);

        if (!validarCampos()){
            setIsLoading(false);
            return;
        }

        if (!misTemasIdTema) {
            handleErrorMessage('No has seleccionado el Tema');
            setIsLoading(false);
            return;
        }

        try{
            const migrado = seccion.grado;

            let endpoint;

            switch (migrado) {
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
                    console.warn("Grado no reconocido:", migrado);
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
        } catch (error){
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage(error.response.data.message);
            }
            setIsLoading(false);
        }
    }

    const eliminarMiTema = async () => {
        setIsLoading(true);

        if (!validarCampos()){
            setIsLoading(false);
            return;
        }

        if (!misTemasIdTema) {
            handleErrorMessage('No has seleccionado el Tema');
            setIsLoading(false);
            return;
        }

        try{
            const migrado = seccion.grado;

            let endpoint;

            switch (migrado) {
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
                    console.warn("Grado no reconocido:", migrado);
                    return;
            }

            const response = await axios.delete(endpoint);
            console.log(response);
            handleSuccessMessage('Tema Eliminado con éxito');
            setIsLoading(false);
            fetchMisTemas();
            resetMisTemas();
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

    const fetchTemas = async () => {
        try {
            const migrado = seccion.grado;
            console.log("Grado=", migrado);
    
            let endpoint;
            let findpoint;
    
            switch (migrado) {
                case 'Primero':
                    endpoint = `${API_URL}/temasPrimero/${idArea}`;
                    findpoint = `${API_URL}/temasPrimeroTema/${idArea}/${buscarTema}`;
                    break;
                case 'Segundo':
                    endpoint = `${API_URL}/temasSegundo/${idArea}`;
                    findpoint = `${API_URL}/temasSegundoTema/${idArea}/${buscarTema}`;
                    break;
                case 'Tercero':
                    endpoint = `${API_URL}/temasTercero/${idArea}`;
                    findpoint = `${API_URL}/temasTerceroTema/${idArea}/${buscarTema}`;
                    break;
                case 'Cuarto':
                    endpoint = `${API_URL}/temasCuarto/${idArea}`;
                    findpoint = `${API_URL}/temasCuartoTema/${idArea}/${buscarTema}`;
                    break;
                case 'Quinto':
                    endpoint = `${API_URL}/temasQuinto/${idArea}`;
                    findpoint = `${API_URL}/temasQuintoTema/${idArea}/${buscarTema}`;
                    break;
                case 'Sexto':
                    endpoint = `${API_URL}/temasSexto/${idArea}`;
                    findpoint = `${API_URL}/temasSextoTema/${idArea}/${buscarTema}`;
                    break; 
                default:
                    console.warn("Grado no reconocido:", migrado);
                    return;
            }
    
            const response = await axios.get(buscarTema ? findpoint : endpoint);
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
            const migrado = seccion.grado;
            console.log("Grado=", migrado);
    
            let endpoint;
            let findpoint;
    
            switch (migrado) {
                case 'Primero':
                    endpoint = `${API_URL}/contenidosPrimero/${idArea}`;
                    findpoint = `${API_URL}/contenidosPrimeroNumero/${idArea}/${buscarContenido}`;
                    break;
                case 'Segundo':
                    endpoint = `${API_URL}/contenidosSegundo/${idArea}`;
                    findpoint = `${API_URL}/contenidosSegundoNumero/${idArea}/${buscarContenido}`;
                    break;
                case 'Tercero':
                    endpoint = `${API_URL}/contenidosTercero/${idArea}`;
                    findpoint = `${API_URL}/contenidosTerceroNumero/${idArea}/${buscarContenido}`;
                    break;
                case 'Cuarto':
                    endpoint = `${API_URL}/contenidosCuarto/${idArea}`;
                    findpoint = `${API_URL}/contenidosCuartoNumero/${idArea}/${buscarContenido}`;
                    break;
                case 'Quinto':
                    endpoint = `${API_URL}/contenidosQuinto/${idArea}`;
                    findpoint = `${API_URL}/contenidosQuintoNumero/${idArea}/${buscarContenido}`;
                    break;
                case 'Sexto':
                    endpoint = `${API_URL}/contenidosSexto/${idArea}`;
                    findpoint = `${API_URL}/contenidosSextoNumero/${idArea}/${buscarContenido}`;
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

    const filtrarMisTemas = () => {
        if (!buscarMiTema) {
            setMisTemasFiltrados(misTemasData);
            return;
        }
    
        const filtrados = misTemasData.filter(mitema => 
            mitema.temas.toLowerCase().includes(buscarMiTema.toLowerCase())
        );
    
        setMisTemasFiltrados(filtrados);
    };
    
    useEffect(() => {
        filtrarContenidos();
    }, [buscarContenido]);

    useEffect(() => {
        filtrarTemas();
    }, [buscarTema]);

    useEffect(() => {
        filtrarMisTemas();
    }, [buscarMiTema]);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageTemas, setCurrentPageTemas] = useState(1);
    const [currentPageMisTemas, setCurrentPageMisTemas] = useState(1);
    const itemsPerPage = 12;
    const itemsPerPageTemas = 12;
    const itemsPerPageMisTemas = 12;
    const totalPages = Math.ceil(contenidosData.length / itemsPerPage);
    const totalPagesTemas = Math.ceil(temasData.length / itemsPerPageTemas);
    const totalPagesMisTemas = Math.ceil(misTemasData.length / itemsPerPageMisTemas);
    
    const goToPage = (page) => {
        setCurrentPage(page);
    };
    
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

    const nextPageMisTemas = () => {
        if (currentPageMisTemas < totalPagesMisTemas) {
            setCurrentPageMisTemas(currentPageMisTemas + 1);
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

    const prevPageMisTemas = () => {
        if (currentPageMisTemas > 1) {
            setCurrentPageMisTemas(currentPageMisTemas - 1);
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

    const renderPageButtonsMisTemas = () => {
        const visibleRangeMisTemas = 2; // Cantidad de páginas a cada lado de la página actual que se mostrarán
        let startPageMisTemas = Math.max(1, currentPageMisTemas - visibleRangeMisTemas);
        let endPageMisTemas = Math.min(totalPagesMisTemas, currentPageMisTemas + visibleRangeMisTemas);
    
        let pagesMisTemas = [];
    
        if (startPageMisTemas > 1) {
            pagesMisTemas.push('...'); // Separador para páginas iniciales omitidas
        }
    
        for (let i = startPageMisTemas; i <= endPageMisTemas; i++) {
            pagesMisTemas.push(
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
    
        if (endPageMisTemas < totalPagesMisTemas) {
            pagesMisTemas.push('...'); // Separador para páginas finales omitidas
        }
    
        return pagesMisTemas;
    };
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfLastItemTemas = currentPageTemas * itemsPerPageTemas;
    const indexOfLastItemMisTemas = currentPageMisTemas * itemsPerPageMisTemas;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const indexOfFirstItemTemas = indexOfLastItemTemas - itemsPerPageTemas;
    const indexOfFirstItemMisTemas = indexOfLastItemMisTemas - itemsPerPageMisTemas;
    const currentItems = contenidosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
    const currentItemsTemas = temasFiltrados.slice(indexOfFirstItemTemas, indexOfLastItemTemas);
    const currentItemsMisTemas = misTemasFiltrados.slice(indexOfFirstItemMisTemas, indexOfLastItemMisTemas);

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
    };

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
        setMisTemasAprendizaje(mitema.apredizaje);
        setMisTemasHerramienta(mitema.herramienta);
        setMisTemasFechaEntrega(mitema.fechaentrega);
        setMisTemasPunteo(mitema.punteo);
        setMisTemasResponsable(mitema.responsable);
        setBotonesVisibles(false);
    }
    
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

    const handleMisTemas = () => {
        
        if(contenidoId === ''){
            handleErrorMessage('Selecciona un contenido antes de continuar');
            return;
        }

        setMisTemasIdContenido(contenidoId);
        setMisTemasCompetencia(contenidoCompetencia);
        setMisTemasIndicador(contenidoIndicador);
        setMisTemasContenido(contenidoContenido);

        closeContenidosModal();
    }

    const handleTemas = () => {
        
        if(temasIdContenido === ''){
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
    }

    function getGradoCNB(grado) {
        switch (seccion.grado.toLowerCase()) {
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

    const abrirPDF = (grado) => {
        const pdf = getGradoCNB(grado);
        if (pdf) {
          window.open(pdf, '_blank');
        } else {
          console.error('Grado no válido');
        }
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
    }

    const notify = () => {
        toast(
          <>
            <h3>¿Está seguro que desea Eliminar este tema, se perderán todos los datos registrados?</h3>
            <button onClick={() => toast.dismiss()}>Cancelar</button>
            <button onClick={() => {
                    eliminarMiTema(misTemasIdTema);
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
                    <h2>Grado: {seccion.grado} Área: {area}</h2>
                </div>
                <div className="planes">
                    <div className="column1">
                        <label>Competencia:</label>
                        <textarea 
                            value={misTemasCompetencia} 
                            placeholder="Agrega una competencia"
                            onChange={(e) => setMisTemasCompetencia(e.target.value)}>         
                        </textarea>
                    </div>
                    <div className="column1">
                        <label>Indicador de Logro:</label>
                        <textarea 
                            value={misTemasIndicador} 
                            placeholder="Agrega un indicador de logro"
                            onChange={(e) => setMisTemasIndicador(e.target.value)}>
                        </textarea>
                    </div>
                    <div className="column1">
                        <label>Contenido:</label>
                        <textarea 
                            value={misTemasContenido} 
                            placeholder="Agrega un contenido"
                            onChange={(e) => setMisTemasContenido(e.target.value)}>
                        </textarea>
                    </div>
                    <div className="column1">
                        <label>Temas y Subtemas:</label>
                        <textarea 
                            value={misTemasTema} 
                            placeholder="Agrega un tema o subtema"
                            onChange={(e) => setMisTemasTema(e.target.value)}>
                        </textarea>
                    </div>
                    <div className="column1">
                        <label>Actividades:</label>
                        <textarea 
                            value={misTemasActividades} 
                            placeholder="Agrega actividades de aprendizaje"
                            onChange={(e) => setMisTemasActividades(e.target.value)}>
                        </textarea>
                    </div>
                    <div className="column2">
                        <label>Recursos:</label>
                        <textarea 
                            value={misTemasRecursos} 
                            placeholder="Agrega los recursos"
                            onChange={(e) => setMisTemasRecursos(e.target.value)}>
                        </textarea>
                        <label>Evaluación:</label>
                        <textarea 
                            value={misTemasEvaluacion} 
                            placeholder="Agrega la evaluación"
                            onChange={(e) => setMisTemasEvaluacion(e.target.value)}>
                        </textarea>
                    </div>
                </div>
                <div className="botones">
                    <button onClick={openContenidosModal}>
                        <img src={SearchFile} alt="save"></img>
                        Buscar Contenidos
                    </button>
                    <button onClick={openTemasModal}>
                        <img src={Globe} alt="save"></img>
                        Importar Temas
                    </button>
                    {botonesVisibles && (
                        <button
                        onClick={registrarMiTema}
                        disabled={isLoading}>
                            <img src={Save} alt="save"></img>
                            {isLoading ? "Guardando..." : "Guardar"}
                        </button>
                    )}
                    {!botonesVisibles && (
                        <button
                        onClick={actualizarMiTema}
                        disabled = {isLoading}>
                            <img src={Edit} alt="save"></img>
                            {isLoading ? "Actualizando..." : "Actualizar"}
                        </button>
                    )}
                    <button onClick={resetMisTemas}>
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
                    <button onClick={()=>{setPlataformaVisible('plataformaMisAreas')}}>
                        <img src={Areas} alt="save"></img>
                        Mis Áreas
                    </button>
                </div>
            </div>
            <div className="temas-tabla">
                <div className="busqueda">
                    <label>Buscar:</label>
                    <input 
                        onChange={(e) => setBuscarMiTema(e.target.value)} 
                        value={buscarMiTema} 
                        placeholder="Ingresa el tema a buscar..."
                        ></input>
                    <button>
                        <img src={Search} alt="save"></img>
                        Buscar
                    </button>
                    {!botonesVisibles && ( 
                        <button onClick={()=> {notify(); setMisTemasIdTema();}}>
                            <img src={Delete} alt="null"></img>
                            Eliminar
                        </button>
                    )}
                </div>
                <div className="tabla">
                    {misTemasData.length > 0 ? (
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
                                        <tr key={mitema.id_mitema} 
                                        onClick={()=> {handleMisTemasRowClick(mitema); setMisTemasCompetencia(mitema.competencia);}}>
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
                                <button onClick={() => prevPageMisTemas()} disabled={currentPageMisTemas === 1}>
                                    Anterior
                                </button>

                                {renderPageButtonsMisTemas()}

                                <button onClick={() => nextPageMisTemas()} disabled={currentPageMisTemas === totalPagesMisTemas}>
                                    Siguiente
                                </button>
                                <button onClick={() => setCurrentPageMisTemas(totalPagesMisTemas)} disabled={currentPageMisTemas === totalPagesMisTemas}>
                                    Final
                                </button>
                            </div>

                            <div className="paginacion-final">
                                Página {currentPageMisTemas} de {totalPagesMisTemas}
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
                        <h1>Grado: {seccion.grado}</h1>
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
                            <button onClick={() => {handleMisTemas()}}>
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
            <Modal isOpen={isOpenTemasModal} onRequestClose={closeTemasModal} className="tema-modal-temas">
                <h1>Temas Existentes</h1>
                <div className="container">
                    <div className="titulo">
                        <h2>Área: {area}</h2>
                        <h2>Grado: {seccion.grado}</h2>
                        <h1>Tema Seleccionado: {temaSeleccionado}</h1>
                    </div>
                    <div className= "busqueda">
                        <h2>Buscar:</h2>
                        <input 
                            type="text"
                            onChange={(e) => setBuscarTema(e.target.value)} 
                            value={buscarTema} 
                            placeholder="Ingresa el tema a buscar..." ></input>
                        <button onClick={() => {handleTemas()}}>
                            <img src={Export} alt="save"></img>
                            Exportar
                        </button>
                        <button onClick={() => {closeTemasModal()}}>
                            <img src={Cancel} alt="save"></img>
                            Cancelar
                        </button>
                        
                    </div>
                    <div className="tabla">
                            {temasData.length > 0 ? (
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
                                                <tr key={tema.id_tema} onClick={() => handleTemasRowClick(tema)}>
                                                    <td>{tema.temas}</td>
                                                    <td>{tema.actividades}</td>
                                                    <td>{tema.mejoramiento}</td>
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
                                    marginTop: '1rem',
                                    fontWeight: '600',
                                }}>
                                    No hay Temas disponibles.
                                </p>
                            )}
                        </div>
                </div>
            </Modal>
            <Modal isOpen={isOpenEvaluacionModal} onRequestClose={closeEvaluacionModal} className="tema-modal-evaluacion">
                <h1>Planificación de Actividades</h1>
                <div className="container">
                    <div className="actividades">
                        <h2>Actividades de Aprendizaje:</h2>
                        <textarea 
                            value={misTemasAprendizaje}
                            placeholder="Agrega actvidades de aprendizaje"
                            onChange={(e) => setMisTemasAprendizaje(e.target.value)}></textarea>
                        <h2>Actividades de Mejoramiento:</h2>
                        <textarea 
                            value={misTemasMejoramiento} 
                            placeholder="Agrega actividades de mejoramiento"
                            onChange={(e) => setMisTemasMejoramiento(e.target.value)}></textarea>
                    </div>
                    <div className="datos">
                        <h2>Cantidad de integrantes:</h2>
                        <select value={misTemasGrupos} onChange={handleChangeMisTemasGrupos}>
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
                        <select value={misTemasHerramienta} onChange={handleChangeMisTemasHerramienta}>
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
                            value={misTemasFechaEntrega} 
                            type="date"
                            onChange={(e) => setMisTemasFechaEntrega(e.target.value)}></input>
                        <h2>Punteo Obtenido:</h2>
                        <input 
                            value={misTemasPunteo} 
                            placeholder="Agrega un punteo"
                            onChange={(e) => setMisTemasPunteo(e.target.value)}></input>
                        <h2>Responsable:</h2>
                        <select value={misTemasResponsable} onChange={handleChangeMisTemasResponsable}>
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

export default MisTemas;