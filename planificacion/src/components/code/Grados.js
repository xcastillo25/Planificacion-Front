import React, {useState, useEffect} from 'react';
import '../design/Grados.css';
import axios from 'axios';
import { API_URL } from '../../config/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Grados = ({plataforma, setPlataformaVisible, userId, setCicloEscolar})=> {
    
    const [idCiclo, setIdCiclo] = useState('');
    const [ciclo, setCiclo] = useState('');

    const handleChangeCiclo = (e) => {setCiclo(e.target.value);};

    const [userData, setUserData] = useState({});

    const [cicloSeleccionado, setCicloSeleccionado] = useState(null);
    const [botonesVisibles, setBotonesVisibles] = useState(true); //

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
          const response = await axios.get(`${API_URL}/ciclos/${userId}`);
          setUserData(response.data);
          console.log("Datos", response.data);
        } catch (error) {
          console.log(error);
        }
    };

    const validarCampos = () => {
        const camposObligatorios = [
            { valor: ciclo, nombreCampo: 'Ciclo'}
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
    const registrarCiclo = async () => {
        setIsLoading(true)

        if (!validarCampos()) {
            setIsLoading(false);
            return;
        }

        try{
            const response = await axios.post(`${API_URL}/ciclo`, {
                ciclo: ciclo,
                id_docente: userId
            });
            console.log(response);
            handleSuccessMessage('Ciclo regisrado con éxito.');
            setIsLoading(false);
            fetchData();
        } catch (error){
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage(error.response.data.message);
            }
            setIsLoading(false);
        }
    }
    
    async function cambiarEstadoActivo(id) {
        setIsLoading(true);
        try {
            const response = await axios.put(`${API_URL}/estado-ciclo/${id}`);
            handleSuccessMessage('Visibilidad del ciclo escolar modificada con éxito');
            setIsLoading(false);
            fetchData();
            console.log(response)
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage('Hubo un error al actualizar al estudiante.');
            }
            setIsLoading(false);
        }
    }

    const eliminarCiclo = async (id) => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`${API_URL}/ciclo/${id}`);
            setIsLoading(false);
            fetchData();
            handleSuccessMessage('Ciclo Eliminado con éxito.')
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage('Hubo un error al eliminar el ciclo.');
                console.log(error.response.data.error);
            }
            setIsLoading(false);
        }
    }

    const actualizarCiclo = async () => {
            setIsLoading(true)

            if (!validarCampos()) {
                setIsLoading(false);
                return;
            }

            if (!idCiclo) {
                handleErrorMessage('No has seleccionado el Ciclo');
                setIsLoading(false);
                return;
            }

            try{
                const response = await axios.put(`${API_URL}/ciclo/${idCiclo}`, {
                    ciclo: ciclo,
                    id_docente: userId
                });
                console.log(response);
                handleSuccessMessage('Ciclo modificado con éxito');
                setIsLoading(false);
                fetchData();
            } catch (error){
                if (error.response && error.response.data && error.response.data.error) {
                    handleErrorMessage(error.response.data.error);
                } else {
                    handleErrorMessage('Hubo un error al actualizar el ciclo.');
                }
                setIsLoading(false);
            }
    }

    useEffect(() => {
        fetchData();
    }, [userId]);

    const handleSeleccionarCiclo = (ciclo) => {
        setCicloSeleccionado(ciclo);
        setBotonesVisibles(false);
    };

    useEffect(() => {
        if (cicloSeleccionado){
            setIdCiclo(cicloSeleccionado.id_ciclo);
            setCiclo(cicloSeleccionado.ciclo);
        }
    }, [cicloSeleccionado]);

    const notify = () => {
        toast(
          <>
            <h3>¿Está seguro que desea Eliminar este ciclo, se perderán todos los datos registrados?</h3>
            <button onClick={() => toast.dismiss()}>Cancelar</button>
            <button onClick={() => {
                    eliminarCiclo(idCiclo);
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
        <section className = "Grados" id = "Grados">
            <ToastContainer />
            <div className = "header">
                <span className="material-icons-sharp header-span title-span">filter_6</span>
                <h1>Ciclo Escolar: Grados y Secciones</h1>
            </div>
            
            <div className="grados-ciclo-container">
                <h1>Gestión de Ciclos</h1>
                <div className="grado-select">
                    <h2>Nuevo Ciclo:</h2>
                    <select
                        value={ciclo}
                        onChange={handleChangeCiclo}>
                        <option value="" disabled>Selecciona...</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="2029">2029</option>
                        <option value="2030">2030</option>
                    </select>
                    {botonesVisibles && (
                        <button onClick={registrarCiclo}
                        disabled={isLoading}>
                            {isLoading ? "Agregando..." : "Agregar"}
                        </button>
                    )}
                    {!botonesVisibles && (
                        <button onClick={actualizarCiclo}
                        disabled={isLoading}>
                            {isLoading ? "Actualizando..." : "Actualizar"}
                        </button>
                    )}
                    <button onClick={setBotonesVisibles}>
                        Limpiar
                    </button>

                </div>
                
                <div className="ciclo-content">
                    {userData.ciclosDocente && userData.ciclosDocente.length > 0 ? (
                        userData.ciclosDocente.map((ciclo) => (
                            <div key={ciclo.id_ciclo} className="ciclo">
                                <div key={ciclo.id_ciclo}>
                                    <h1>Ciclo Escolar {ciclo.ciclo}</h1>
                                    <h2>Estado: {ciclo.activo ? 'Activo' : 'Inactivo'}</h2>
                                </div>
                                <div className="buttons">
                                    <button
                                        type="button" className="grado-button1"
                                        onClick={() => {
                                            setCicloEscolar(ciclo);
                                            setPlataformaVisible('plataformaSecciones');
                                          }}>
                                        Ver Secciones
                                    </button>
                                    <button 
                                    onClick={() => handleSeleccionarCiclo(ciclo)}
                                    type="button" className="grado-button1">
                                        Seleccionar
                                    </button>
                                    <button 
                                        type="button" 
                                        className="grado-button1"
                                        disabled={isLoading}
                                        onClick = {() => cambiarEstadoActivo(ciclo.id_ciclo)}>
                                            {isLoading ? "Cambiando..." : "Cambiar Estado"}
                                    </button>
                                    {!botonesVisibles && (
                                        <>
                                            {!cicloSeleccionado || cicloSeleccionado.id_ciclo === ciclo.id_ciclo ? (
                                                <button 
                                                    type="button" 
                                                    className="grado-button2"
                                                    onClick={() => {
                                                        notify();
                                                        setIdCiclo(ciclo.id_ciclo);
                                                    }}>
                                                    Eliminar
                                                </button>
                                            ) : null}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{fontSize:'18px', textAlign:'center', color:'black', marginTop:'1rem',
                                fontWeight:'600'}}
                        >No hay establecimientos disponibles.</p>         
                    )}
                </div>
            </div>
        </section>
    );
}

export default Grados;