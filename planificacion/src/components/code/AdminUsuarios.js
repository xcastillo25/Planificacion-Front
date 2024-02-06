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

const AdminUsuarios = ({plataforma, setPlataformaVisible}) => {
    
    const [userData, setUserData] = useState([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [buscarUsuario, setBuscarUsuario] = useState('');

    const [idUsuario, setIdUsuario] = useState('');

    const fetchData = async () => {
        try{
            const response = await axios.get(`${API_URL}/usuarios`);
            const data = response.data.usuarios;

            const filteredDataUsuarios = buscarUsuario? data.filter(usuario => 
                usuario.nombres.toLowerCase().includes(buscarUsuario.toLowerCase())
                
            ) : data;

            setUserData(filteredDataUsuarios);
            setCurrentPage(1);
            setUsuariosFiltrados(filteredDataUsuarios);
        } catch (error){
            console.log(error);
        }
    }

    useEffect (() => {
     fetchData();   
    }, [])
    
    useEffect(() => {
        filtrarUsuarios();
    }, [buscarUsuario]);

    const filtrarUsuarios = () => {
        if (!buscarUsuario) {
            setUsuariosFiltrados(userData);
            return;
        }
    
        const filtrados = userData.filter(usuario => 
            usuario.nombres.toLowerCase().includes(buscarUsuario.toLowerCase())
        );
    
        setUsuariosFiltrados(filtrados);
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
    const currentItems = usuariosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

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
            const response = await axios.put(`${API_URL}/estado-usuario/${id}`)
            console.log(response);
            handleSuccessMessage('Estado cambiado exitosamente');
        } catch(error) {
            handleErrorMessage('Error al actualizar el estado del usuario', error);
        }
    }

    const handleUsuarioRowClick = (usuario) => {
        setIdUsuario(usuario.id_usuario);
    }


    const [isLoading, setIsLoading] = useState(false);
    const eliminarUsuario = async () => {
        setIsLoading(true);

        if (!idUsuario===''){
            handleErrorMessage('No has seleccionado el Usuario');
            setIsLoading(false);
            return;
        }

        try{
            const response = await axios.delete(`${API_URL}/establecimientos/${idUsuario}`);
            handleSuccessMessage('Usuario Eliminado con éxito');
            setIsLoading(false);
            fetchData();
        } catch (error){
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage('Hubo un error al eliminar el Usuario.');
                console.log(error.response.data.error);
            }
            setIsLoading(false);
        }
    }

    const notify = () => {
        toast(
          <>
            <h3>¿Está seguro que desea Eliminar este tema, se perderán todos los datos registrados?</h3>
            <button onClick={() => toast.dismiss()}>Cancelar</button>
            <button onClick={() => {
                    eliminarUsuario(idUsuario);
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
                <h1>Administración de Usuarios</h1>
            </div>
            <div className="tablas-container">
                <h1>Listado de Usuarios</h1>
                <div className="busqueda">
                    <label>Buscar:</label>
                    <input
                        onChange={(e) => setBuscarUsuario(e.target.value)} 
                        value={buscarUsuario} 
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
                                        <th>Nombres</th>
                                        <th>Apellidos</th>
                                        <th>Correo</th>
                                        <th>Rol</th>
                                        <th>Teléfono</th>
                                        <th>Estado</th>
                                        <th>Cambiar Estado</th>
                                        <th>Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((usuario) => (
                                        <tr key={usuario.id_usuario}>
                                            <td>{usuario.nombres}</td>
                                            <td>{usuario.apellidos}</td>
                                            <td>{usuario.correo}</td>
                                            <td>{usuario.rol}</td>
                                            <td>{usuario.telefono}</td>
                                            <td>
                                                <div className={`status-box ${usuario.activo ? 'Activo' : 'Inactivo'}`}>
                                                    {usuario.activo ? 'Activo' : 'Inactivo'}
                                                </div>
                                            </td>
                                            <td>
                                                <button className="button1"
                                                    onClick={async() =>{
                                                        await cambiarEstadoActivo(usuario.id_usuario);
                                                        fetchData();
                                                    }}>
                                                    {usuario.activo ? 'Desactivar' : 'Activar'}
                                                </button>
                                            </td>
                                            <td>
                                                <button className="button3"
                                                onClick={()=>{setIdUsuario(usuario.id_usuario);
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
        </>
        
    );
}

export default AdminUsuarios;