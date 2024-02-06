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

const AdminEstablecimientos = ({plataforma, setPlataformaVisible, UserId}) => {
    
    const [userData, setUserData] = useState([]);
    const [establecimientosFiltrados, setEstablecimientosFiltrados] = useState([]);
    const [buscarEstablecimiento, setBuscarEstableciemiento] = useState('');

    const [isOpenModal, setIsOpenModal] = useState(false);
    const openModal = () => setIsOpenModal(true);
    const closeModal = () => setIsOpenModal(false);

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

    const fetchData = async () => {
        try{
            const response = await axios.get(`${API_URL}/establecimientos`);
            const data = response.data.establecimientos;

            const filteredDataEstablecimientos = buscarEstablecimiento? data.filter(establecimiento => 
                establecimiento.codigo.toLowerCase().includes(buscarEstablecimiento.toLowerCase())
                
            ) : data;

            setUserData(filteredDataEstablecimientos);
            setCurrentPage(1);
            setEstablecimientosFiltrados(filteredDataEstablecimientos);
        } catch (error){
            console.log(error);
        }
    }

    useEffect (() => {
     fetchData();   
    }, [])
    
    useEffect(() => {
        filtrarEstablecimientos();
    }, [buscarEstablecimiento]);

    const filtrarEstablecimientos = () => {
        if (!buscarEstablecimiento) {
            setEstablecimientosFiltrados(userData);
            return;
        }
    
        const filtrados = userData.filter(establecimiento => 
            establecimiento.codigo.toLowerCase().includes(buscarEstablecimiento.toLowerCase())
        );
    
        setEstablecimientosFiltrados(filtrados);
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
    const currentItems = establecimientosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

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
            const response = await axios.put(`${API_URL}/establecimientosActivo/${id}`)
            console.log(response);
            handleSuccessMessage('Estado cambiado exitosamente');
        } catch(error) {
            handleErrorMessage('Error al actualizar el estado del establecimiento', error);
        }
    }

    const handleEstablecimientoRowClick = (establecimiento) => {
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
    }

    const validarCampos = () => {
        const camposObligatorios = [
            { valor: establecimiento, nombreCampo: 'Establecimiento'},
            { valor: direccion, nombreCampo: 'Direccion'},
            { valor: codigo, nombreCampo: 'Codigo'},
            { valor: director, nombreCampo: 'Director'},
            { valor: ctae, nombreCampo: 'Ctae'},
            { valor: distrito, nombreCampo: 'Distrito'},
            { valor: municipio, nombreCampo: 'Municipio'},
            { valor: departamento, nombreCampo: 'Departamento'},
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

        const codigoRegex = /^\d{10}$/;
        if (!codigoRegex.test(codigo)) {
            handleErrorMessage('El código debe tener 10 números, no puede usar guiones.');
            return false;
        }

        const distritoRegex = /^\d{2}-\d{2}-\d{2}$/;
        if (!distritoRegex.test(distrito)) {
            handleErrorMessage('El sector debe tener el formato 00-00-00');
            return false;
        }

        return true;
    }

    const [isLoading, setIsLoading] = useState(false);
    const actualizarEstablecimiento = async () => {
        setIsLoading(true);

        if (!validarCampos()) {
            setIsLoading(false);
            return;
        }

        if (!idEstablecimiento) {
            handleErrorMessage('No has seleccionado el Establecimiento');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.put(`${API_URL}/establecimiento/${idEstablecimiento}`, {
                establecimiento: establecimiento,
                direccion: direccion,
                codigo: codigo,
                director: director,
                ctae: ctae,
                distrito: distrito,
                municipio: municipio,
                departamento: departamento,
                sector: sector,
                jornada: jornada,
                area: area,
                modalidad: modalidad,
                id_docente: idDocente,
                logotipo: foto
            });

            console.log(response);
            handleSuccessMessage('Establecimiento modificado con éxito.')
            setIsLoading(false);
            resetForm();
            fetchData();
            closeModal();
        } catch (error){
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage('Hubo un error al actualizar al estudiante.');
            }
            setIsLoading(false);
        }
    };

    const eliminarEstablecimiento = async () => {
        setIsLoading(true);

        if (!idEstablecimiento===''){
            handleErrorMessage('No has seleccionado el Establecimiento');
            setIsLoading(false);
            return;
        }

        try{
            const response = await axios.delete(`${API_URL}/establecimientos/${idEstablecimiento}`);
            handleSuccessMessage('Establecimiento Eliminado con éxito');
            setIsLoading(false);
            fetchData();
        } catch (error){
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage('Hubo un error al eliminar el Establecimeinto.');
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

    const notify = () => {
        toast(
          <>
            <h3>¿Está seguro que desea Eliminar este tema, se perderán todos los datos registrados?</h3>
            <button onClick={() => toast.dismiss()}>Cancelar</button>
            <button onClick={() => {
                    console.log(idEstablecimiento);
                    eliminarEstablecimiento(idEstablecimiento);
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
        <>
        <section className="AdminEstablecimientos" id="AdminEstablecimientos">
            <ToastContainer />
            <div className = "header">
                <span className="material-icons-sharp header-span title-span">flag</span>
                <h1>Administración de Establecimientos</h1>
            </div>
            <div className="tablas-container">
                <h1>Listado de Establecimientos</h1>
                <div className="busqueda">
                    <label>Buscar:</label>
                    <input
                        onChange={(e) => setBuscarEstableciemiento(e.target.value)} 
                        value={buscarEstablecimiento} 
                        placeholder="Ingresa el código del Establecimiento a buscar..."></input>
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
                                        <th>Establecimiento</th>
                                        <th>Dirección</th>
                                        <th>Código</th>
                                        <th>Distrito</th>
                                        <th>Director</th>
                                        <th>Jornada</th>
                                        <th>Estado</th>
                                        <th>Cambiar Estado</th>
                                        <th>Editar</th>
                                        <th>Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((establecimiento) => (
                                        <tr key={establecimiento.id_establecimiento}>
                                            <td>{establecimiento.establecimiento}</td>
                                            <td>{establecimiento.direccion}</td>
                                            <td>{establecimiento.codigo}</td>
                                            <td>{establecimiento.distrito}</td>
                                            <td>{establecimiento.director}</td>
                                            <td>{establecimiento.jornada}</td>
                                            <td>
                                                <div className={`status-box ${establecimiento.activo ? 'Activo' : 'Inactivo'}`}>
                                                    {establecimiento.activo ? 'Activo' : 'Inactivo'}
                                                </div>
                                            </td>
                                            <td>
                                                <button className="button1"
                                                    onClick={async() =>{
                                                        await cambiarEstadoActivo(establecimiento.id_establecimiento);
                                                        fetchData();
                                                    }}>
                                                    {establecimiento.activo ? 'Desactivar' : 'Activar'}
                                                </button>
                                            </td>
                                            <td>
                                                <button 
                                                    className="button2"
                                                    onClick={()=> {openModal();
                                                    handleEstablecimientoRowClick(establecimiento);}}>
                                                    Editar
                                                </button>
                                            </td>
                                            <td>
                                                <button className="button3"
                                                onClick={()=>{setIdEstablecimiento(establecimiento.id_establecimiento);
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
            <h1>Editar Datos del Establecimiento:</h1>
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
                <button onClick={actualizarEstablecimiento}>
                    <img src={Edit} alt="null"></img>
                    Actualizar
                </button>
                <button onClick={closeModal}>
                    <img src={Cancel} alt="null"></img>
                    Cancelar
                </button>
            </div>
        </Modal>
        </>
        
    );
}

export default AdminEstablecimientos;