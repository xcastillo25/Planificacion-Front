import React, {useState, useEffect} from 'react';
import '../design/TablasAdmin.css';
import axios from 'axios';
import { API_URL } from '../../config/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Search from '../../assets/Search.png';
import Modal from 'react-modal';
import Edit from '../../assets/Pencil.png';
import Cancel from '../../assets/Cancel.png';

Modal.setAppElement('#root');

const AdminDocentes = ({plataforma, setPlataformaVisible, UserId}) => {
    
    const [userData, setUserData] = useState([]);
    const [suscripcionData, setSuscripcionData] = useState([]);
    const [establecimientoData, setEstablecimientoData] = useState([]);
    const [datosFiltrados, setDatosFiltrados] = useState([]);
    const [buscarDocente, setBuscarDocente] = useState('');

    const [isOpenModal, setIsOpenModal] = useState(false);
    const openModal = () => setIsOpenModal(true);
    const closeModal = () => setIsOpenModal(false);

    const [isOpenModalDocente, setIsOpenModalDocente] = useState(false);
    const openModalDocente = () => setIsOpenModalDocente(true);
    const closeModalDocente = () => setIsOpenModalDocente(false);

    const [isOpenModalSuscripcion, setIsOpenModalSuscripcion] = useState(false);
    const openModalSuscripcion = () => setIsOpenModalSuscripcion(true);
    const closeModalSuscripcion= () => setIsOpenModalSuscripcion(false);

    const [idEstablecimiento, setIdEstablecimiento] = useState('');
    const [establecimiento, setEstablecimiento] = useState('');
    const [direccion, setDireccion] = useState('');
    const [codigo, setCodigo] = useState('');
    const [director, setDirector] = useState('');
    const [ctae, setCtae] = useState('');
    const [distrito, setDistrito] = useState('');
    const [municipio, setMunicipio] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [sector, setSector] = useState('');
    const [jornada, setJornada] = useState('');
    const [area, setArea] = useState('');
    const [modalidad, setModalidad] = useState('');
    const [foto, setFoto] = useState('');

    const [idDocente, setIdDocente] = useState('');
    const [primerNombre, setPrimerNombre] = useState('');
    const [segundoNombre, setSegundoNombre] = useState('');
    const [otrosNombres, setOtrosNombres] = useState('');
    const [primerApellido, setPrimerApellido] = useState('');
    const [segundoApellido, setSegundoApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [genero, setGenero] = useState('');
    const [password, setPassword] = useState('');
    const [esDirector, setEsDirector] = useState('');
    const [fechaRegistro, setFechaRegistro] = useState('');
    const [fechaPrueba, setFechaPrueba] = useState('');
    const [licencia, setLicencia] = useState('');
    const [idSuscripcion, setIdSuscripcion] = useState('');
    const [tipoPago, setTipoPago] = useState('');
    const [boletaPago, setBoletaPago] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [docenteCompleto, setDocenteCompleto] = useState('');
    const [diasRestantes, setDiasRestantes] = useState('');

    const fetchData = async () => {
        try{
            const response = await axios.get(`${API_URL}/docentes`);
            const data = response.data.docentes;

            const filteredData = buscarDocente? data.filter(docente => 
                docente.primer_nombre.toLowerCase().includes(buscarDocente.toLowerCase())
                
            ) : data;

            setUserData(filteredData);
            setCurrentPage(1);
            setDatosFiltrados(filteredData);
        } catch (error){
            console.log(error);
        }
    }

    const fetchSuscripciones = async (id) => {
        try{
            const response = await axios.get(`${API_URL}/suscripciones/${id}`);
            const data = response.data.suscripciones;

           
            setSuscripcionData(data);
        } catch (error){
            console.log(error);
        }
    }

    useEffect (() => {
     fetchData();   
    }, [])
    
    useEffect(() => {
        filtrarDatos();
    }, [buscarDocente]);

    const filtrarDatos = () => {
        if (!buscarDocente) {
            setDatosFiltrados(userData);
            return;
        }
    
        const filtrados = userData.filter(docente => 
            docente.primer_nombre.toLowerCase().includes(buscarDocente.toLowerCase())
        );
    
        setDatosFiltrados(filtrados);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const totalPages = Math.ceil(userData.length / itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = datosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

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

    const cambiarEstadoActivo = async (id) => {
        try{
            const response = await axios.put(`${API_URL}/estado-docente/${id}`)
            console.log(response);
            handleSuccessMessage('Estado cambiado exitosamente');
            fetchData();
        } catch(error) {
            handleErrorMessage('Error al actualizar el estado del docente', error);
        }
    }

    const activarSuscripcion = async (id_suscripcion) => {
        try{
            const response = await axios.put(`${API_URL}/activarsuscripcion/${id_suscripcion}`)
            console.log(response);
        } catch(error) {
        }
    }

    const desactivarSuscripcion = async (id_suscripcion) => {
        try{
            const response = await axios.put(`${API_URL}/desactivarsuscripcion/${id_suscripcion}`)
            console.log(response);
        } catch(error) {
        }
    }

    const handleDocenteRowClick = (docente) => {
        setIdDocente(docente.id_docente);
        setPrimerNombre(docente.primer_nombre);
        setSegundoNombre(docente.segundo_nombre);
        setPrimerApellido(docente.primer_apellido);
        setSegundoApellido(docente.segundo_apellido);
        setOtrosNombres(docente.otros_nombres);
        setTelefono(docente.telefono);
        setCorreo(docente.correo);
        setPassword(docente.password);
        setGenero(docente.genero);
        setEsDirector(docente.director);
        setFechaRegistro(docente.fecha_registro);
        setFechaPrueba(docente.fecha_prueba);
        setLicencia(docente.licencia);
        setDocenteCompleto(`${docente.primer_nombre} ${docente.primer_apellido}`)
    }

    const validarCampos = () => {
        const camposObligatorios = [
            { valor: primerNombre, nombreCampo: 'Primer Nombre'},
            { valor: primerApellido, nombreCampo: 'Primer Apellido'},
            { valor: telefono, nombreCampo: 'Teléfono'},
            { valor: correo, nombreCampo: 'Correo'},
            { valor: genero, nombreCampo: 'Género'},
            { valor: esDirector, nombreCampo: 'Es Director'},
            { valor: fechaRegistro, nombreCampo: 'Fecha de Registro'},
            { valor: fechaPrueba, nombreCampo: 'Fecha de Prueba'},
            { valor: licencia, nombreCampo: 'Licencia'},
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

        if (!/^[3-6]\d{7}$/.test(telefono)) {
            handleErrorMessage('El número de teléfono celular no es válido para Guatemala.');
            return false;
        }

        const correoRegex = /^[a-zA-Z0-9._%+-]{4,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!correoRegex.test(correo)) {
            handleErrorMessage('El correo debe tener al menos 4 caracteres antes del "@", seguir las normas para correos electrónicos y tener un dominio válido.');
            return false;
        }

        return true;
    }

    const [isLoading, setIsLoading] = useState(false);
    const actualizarDocente = async () => {
        setIsLoading(true);

        if (!validarCampos()) {
            setIsLoading(false);
            return;
        }

        if (!idDocente) {
            handleErrorMessage('No has seleccionado el Docente');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.put(`${API_URL}/docente/${idDocente}`, {
                primer_nombre: primerNombre,
                segundo_nombre: segundoNombre,
                otros_nombres: otrosNombres,
                primer_apellido: primerApellido,
                segundo_apellido: segundoApellido,
                telefono: telefono,
                correo: correo,
                password: password,
                genero: genero,
                director: esDirector,
                fecha_registro: fechaRegistro,
                fecha_prueba: fechaPrueba,
                licencia: licencia
            });

            console.log(response);
            handleSuccessMessage('Docente modificado con éxito.')
            setIsLoading(false);
            resetFormDocente();
            fetchData();
            closeModalDocente();
        } catch (error){
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage('Hubo un error al actualizar el docente.');
            }
            setIsLoading(false);
        }
    };

    const eliminarDocente = async () => {
        setIsLoading(true);

        if (!idDocente===''){
            handleErrorMessage('No has seleccionado el Docente');
            setIsLoading(false);
            return;
        }

        try{
            const response = await axios.delete(`${API_URL}/docente/${idDocente}`);
            handleSuccessMessage('Docente Eliminado con éxito');
            setIsLoading(false);
            fetchData();
        } catch (error){
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage('Hubo un error al eliminar el Docente.');
                console.log(error.response.data.error);
            }
            setIsLoading(false);
        }
    }

    const resetForm = () =>{
        setIdEstablecimiento('');
        setEstablecimiento('');
        setDireccion('');
        setCodigo('');
        setDirector('');
        setCtae('');
        setDistrito('');
        setMunicipio('');
        setDepartamento('');
        setSector('');
        setJornada('');
        setArea('');
        setModalidad('');
        closeModal();
    }

    const resetFormDocente = () =>{
        setIdDocente('');
        setPrimerNombre('');
        setSegundoNombre('');
        setOtrosNombres('');
        setPrimerApellido('');
        setSegundoApellido('');
        setTelefono('');
        setCorreo('');
        setPassword('');
        setGenero('');
        setDirector('');
        setFechaRegistro('');
        setFechaPrueba('');
        setLicencia('');
        closeModal();
    }

    const fetchEstablecimiento = async (id_docente) => {
        try {
          const response = await axios.get(`${API_URL}/establecimientos/${id_docente}`);
          const establecimientosDocente = response.data.establecimientosDocente;
      
          if (establecimientosDocente && establecimientosDocente.length > 0) {
            const establecimiento = establecimientosDocente[0];
      
            setIdEstablecimiento(establecimiento.id_establecimiento);
            setEstablecimiento(establecimiento.establecimiento);
            setDireccion(establecimiento.direccion);
            setCodigo(establecimiento.codigo);
            setDirector(establecimiento.director);
            setCtae(establecimiento.ctae);
            setDistrito(establecimiento.distrito);
            setMunicipio(establecimiento.municipio);
            setDepartamento(establecimiento.departamento);
            setSector(establecimiento.sector);
            setJornada(establecimiento.jornada);
            setArea(establecimiento.area);
            setModalidad(establecimiento.modalidad);
            setIdDocente(establecimiento.id_docente);
            setFoto(establecimiento.logotipo);
      
            console.log("Nombre:", establecimiento.direccion);
            console.log("Datos", establecimiento);
            fetchData();
            openModal();
          } else {
            console.error("No se encontraron establecimientos para el docente");
          }
        } catch (error) {
          console.error("Error al obtener datos del establecimiento", error);
        }
      };
      

    const notify = () => {
        toast(
          <>
            <h3>¿Está seguro que desea Eliminar este tema, se perderán todos los datos registrados?</h3>
            <button onClick={() => toast.dismiss()}>Cancelar</button>
            <button onClick={async () => {
                     eliminarSuscripcion();
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

    function calcularDiasRestantes(fechaFin) {
        const unDiaEnMilisegundos = 24 * 60 * 60 * 1000; // Número de milisegundos en un día
    
        // Obtener la fecha actual
        const fechaHoy = new Date();
        const tiempoHoy = fechaHoy.getTime();
    
        // Convertir la fecha de finalización a milisegundos
        const tiempoFin = fechaFin instanceof Date ? fechaFin.getTime() : new Date(fechaFin).getTime();
    
        // Calcular la diferencia en milisegundos
        const diferenciaMilisegundos = tiempoFin - tiempoHoy;
    
        // Calcular la diferencia en días
        const diferenciaDias = Math.floor(diferenciaMilisegundos / unDiaEnMilisegundos);
    
        return diferenciaDias;
    }

    const toggleEstadoSuscripcion = async (id_suscripcion, activo) => {
        try {
          if (activo) {
            // Si la suscripción está activa, desactívala
            await desactivarSuscripcion(id_suscripcion);
          } else {
            // Si la suscripción está inactiva, actívala
            await activarSuscripcion(id_suscripcion);
          }
          fetchData();
          handleSuccessMessage('Estado de suscripción cambiado exitosamente');
        } catch (error) {
          handleErrorMessage('Error al actualizar el estado de la suscripción', error);
        }
    };

    const eliminarSuscripcion = async () => {
        setIsLoading(true);

        try{
            const response = await axios.delete(`${API_URL}/eliminarsuscripcion/${idSuscripcion}`);
            handleSuccessMessage('Suscripcion Eliminada con éxito');
            setIsLoading(false);
            fetchSuscripciones(idDocente);
        } catch (error){
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage('Hubo un error al eliminar el Docente.');
                console.log(error.response.data.error);
            }
            setIsLoading(false);
        }
    }
    
    return (
        <>
        <section className="AdminEstablecimientos" id="AdminEstablecimientos">
            <ToastContainer />
            <div className = "header">
                <span className="material-icons-sharp header-span title-span">flag</span>
                <h1>Administración de Docentes</h1>
            </div>
            <div className="tablas-container">
                <h1>Listado de Docentes</h1>
                <div className="busqueda">
                    <label>Buscar:</label>
                    <input
                        onChange={(e) => setBuscarDocente(e.target.value)} 
                        value={buscarDocente} 
                        placeholder="Ingresa el nombre del Docente a buscar..."></input>
                    <button>
                        <img src={Search} alt="null"></img>
                        Buscar
                    </button>
                </div>
                <div className="tabla">
                    {userData.length > 0 ? (
                        <>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre del Docente</th>
                                        <th>Teléfono</th>
                                        <th>Correo</th>
                                        <th>Estado</th>
                                        <th>Cambiar Estado</th>
                                        <th>Establecimiento</th>
                                        <th>Suscripción</th>
                                        <th>Editar</th>
                                        <th>Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((docente) => (
                                        <tr key={docente.id_docente}>
                                            <td>{docente.primer_nombre} {docente.segundo_nombre} {docente.otros_nombres} {docente.primer_apellido} {docente.segundo_apellido}</td>
                                            <td>{docente.telefono}</td>
                                            <td>{docente.correo}</td>
                                            <td>
                                                <div className={`status-box ${docente.activo ? 'Activo' : 'Inactivo'}`}>
                                                    {docente.activo ? 'Activo' : 'Inactivo'}
                                                </div>
                                            </td>
                                            <td>
                                                <button className="button1"
                                                    onClick={async() =>{
                                                        await cambiarEstadoActivo(docente.id_docente);
                                                        fetchData();
                                                    }}>
                                                    {docente.activo ? 'Desactivar' : 'Activar'}
                                                </button>
                                            </td>
                                            <td>
                                                <button 
                                                    className="button4"
                                                    onClick={()=> {fetchEstablecimiento(docente.id_docente);
                                                    }}>
                                                    Ver
                                                </button>
                                            </td>
                                            <td>
                                                <button 
                                                    className="button5"
                                                    onClick={()=> {fetchSuscripciones(docente.id_docente);
                                                    handleDocenteRowClick(docente);
                                                    openModalSuscripcion();}}>
                                                    Ver
                                                </button>
                                            </td>
                                            <td>
                                                <button 
                                                    className="button2"
                                                    onClick={()=> {handleDocenteRowClick(docente);
                                                        openModalDocente();}}>
                                                    Editar
                                                </button>
                                            </td>
                                            <td>
                                                <button className="button3"
                                                onClick={()=>{setIdDocente(docente.id_docente);
                                                notify()}}>
                                                    Eliminar
                                                </button>
                                            </td>
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

        <Modal isOpen={isOpenModal} onRequestClose={closeModal} className="admin-modal-establecimiento">
            <h1>Datos del Establecimiento Registrado por el Docente:</h1>
            <div className="container">
                <div className = "column">
                    <label>Establecimiento:</label>
                    <input 
                    value={establecimiento}
                    onChange={(e) => setEstablecimiento(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Dirección:</label>
                    <input
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Código:</label>
                    <input
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Director:</label>
                    <input
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>CTAE:</label>
                    <input
                    value={ctae}
                    onChange={(e) => setCtae(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Distrito:</label>
                    <input
                    value={distrito}
                    onChange={(e) => setDistrito(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Municipio:</label>
                    <input
                    value={municipio}
                    onChange={(e) => setMunicipio(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Departamento:</label>
                    <input
                    value={departamento}
                    onChange={(e) => setDepartamento(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Sector:</label>
                    <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    >
                        <option value="Oficial">Oficial</option>
                        <option value="Privado">Privado</option>
                    </select>
                </div>
                <div className = "column">
                    <label>Jornada:</label>
                    <select
                    value={jornada}
                    onChange={(e) => setJornada(e.target.value)}
                    >
                        <option value="Matutina">Matutina</option>
                        <option value="Privado">Privado</option>
                    </select>
                </div>
                <div className = "column">
                    <label>Area:</label>
                    <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    >
                        <option value="Rural">Rural</option>
                        <option value="Urbana">Urbana</option>
                    </select>
                </div>
                <div className = "column">
                    <label>Modalidad:</label>
                    <select
                    value={modalidad}
                    onChange={(e) => setModalidad(e.target.value)}
                    >
                        <option value="Monolingüe">Monolingüe</option>
                        <option value="Bilingüe">Bilingüe</option>
                    </select>
                </div>
            </div>
            <div className="botones">
                <button onClick={closeModal}>
                    <img src={Cancel} alt="null"></img>
                    Cancelar
                </button>
            </div>
        </Modal>
        <Modal isOpen={isOpenModalDocente} onRequestClose={closeModalDocente} className="admin-modal-establecimiento">
            <h1>Editar Datos del Docente:</h1>
            <div className="container">
                <div className = "column">
                    <label>Primer Nombre:</label>
                    <input 
                    value={primerNombre}
                    onChange={(e) => setPrimerNombre(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Segundo Nombre:</label>
                    <input
                    value={segundoNombre}
                    onChange={(e) => setSegundoNombre(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Otros Nombres:</label>
                    <input
                    value={otrosNombres}
                    onChange={(e) => setOtrosNombres(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Primer Apellido:</label>
                    <input
                    value={primerApellido}
                    onChange={(e) => setPrimerApellido(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Segundo Apellido:</label>
                    <input
                    value={segundoApellido}
                    onChange={(e) => setSegundoApellido(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Teléfono:</label>
                    <input
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Correo:</label>
                    <input
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Género:</label>
                    <select
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                    >
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </select>
                </div>
                <div className = "column">
                    <label>Es Director:</label>
                    <select
                    value={esDirector}
                    onChange={(e) => setEsDirector(e.target.value)}
                    >
                        <option value="Si">Si</option>
                        <option value="No">No</option>
                    </select>
                </div>
                <div className = "column">
                    <label>Fecha de Registro:</label>
                    <input type="date"
                    value={fechaRegistro}
                    onChange={(e) => setFechaRegistro(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Fecha de Vencimiento de la Prueba:</label>
                    <input type="date"
                    value={fechaPrueba}
                    onChange={(e) => setFechaPrueba(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Licencia:</label>
                    <select
                    value={licencia}
                    onChange={(e) => setLicencia(e.target.value)}
                    >
                        <option value="TRIAL">TRIAL</option>
                        <option value="FULL">FULL</option>
                    </select>
                </div>
            </div>
            <div className="botones">
                <button onClick={actualizarDocente}>
                    <img src={Edit} alt="null"></img>
                    Actualizar
                </button>
                <button onClick={closeModalDocente}>
                    <img src={Cancel} alt="null"></img>
                    Cancelar
                </button>
            </div>
        </Modal>
        <Modal isOpen={isOpenModalSuscripcion} onRequestClose={closeModalSuscripcion} className="admin-modal-establecimiento">
            <h1>Administrar Suscripción:</h1>
            <h2>Docente: {primerNombre} {segundoNombre} {otrosNombres} {primerApellido} {segundoApellido}</h2>
            <div className="container">
                <div className = "column">
                    <label>Tipo de Pago:</label>
                    <input 
                    value={tipoPago}
                    onChange={(e) => setTipoPago(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Boleta de Pago:</label>
                    <input
                    value={boletaPago}
                    onChange={(e) => setBoletaPago(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Fecha de Inicio:</label>
                    <input type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Fecha de Finalización:</label>
                    <input type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    ></input>
                </div>
                <div className = "column">
                    <label>Días Restantes:</label>
                    <input
                    value={diasRestantes}
                    onChange={(e) => setDiasRestantes(e.target.value)}
                    ></input>
                </div>
            </div>
            <div className="tabla">
                    {suscripcionData.length > 0 ? (
                        <>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Tipo de Pago</th>
                                        <th>Boleta de Pago</th>
                                        <th>Fecha de Inicio</th>
                                        <th>Fecha de Finalización</th>
                                        <th>Días Restantes</th>
                                        <th>Estado</th>
                                        <th>Cambiar Estado</th>
                                        <th>Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suscripcionData.map((suscripcion) => (
                                        <tr key={suscripcion.id_suscripcion}>
                                            <td>{suscripcion.tipo_pago}</td>
                                            <td>{suscripcion.boleta_pago}</td>
                                            <td>{new Date(suscripcion.fecha_inicio).toLocaleDateString()}</td>
                                            <td>{new Date(suscripcion.fecha_fin).toLocaleDateString()}</td>
                                            <td>{calcularDiasRestantes(new Date(suscripcion.fecha_fin))} días</td>
                                            <td>
                                                <div className={`status-box ${suscripcion.activo ? 'Activo' : 'Inactivo'}`}>
                                                    {suscripcion.activo ? 'Activo' : 'Inactivo'}
                                                </div>
                                            </td>
                                            <td>
                                                <button className="button1"
                                                    onClick={async () => {
                                                        await toggleEstadoSuscripcion(suscripcion.id_suscripcion, suscripcion.activo);
                                                        await fetchSuscripciones(suscripcion.id_docente);
                                                      }}>
                                                    {suscripcion.activo ? 'Desactivar' : 'Activar'}
                                                </button>
                                            </td>
                                            <td>
                                                <button className="button3"
                                                onClick={async()=>{setIdDocente(suscripcion.id_docente);
                                                     setIdSuscripcion(suscripcion.id_suscripcion);
                                                notify()}}>
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                            No hay Suscripciones disponibles.
                        </p>
                    )}
                </div>
            <div className="botones">
                <button onClick={actualizarDocente}>
                    <img src={Edit} alt="null"></img>
                    Actualizar
                </button>
                <button onClick={closeModalSuscripcion}>
                    <img src={Cancel} alt="null"></img>
                    Cancelar
                </button>
            </div>
        </Modal>
        </>
        
    );
}

export default AdminDocentes;