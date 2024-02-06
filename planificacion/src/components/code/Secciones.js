import React, {useEffect, useState} from 'react';
import '../design/Secciones.css';
import axios from 'axios';
import { API_URL } from '../../config/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Primero from '../../assets/n1.png';
import Segundo from '../../assets/n2.png';
import Tercero from '../../assets/n3.png';
import Cuarto from '../../assets/n4.png';
import Quinto from '../../assets/n5.png';
import Sexto from '../../assets/n6.png';

const Secciones =({plataforma, setPlataformaVisible, userId, ciclo}) => {
    
    const [idSeccion, setIdSeccion] = useState();
    const [seccion, setSeccion] = useState('');
    const [grado, setGrado] = useState('');
    const [idGrado, setIdGrado] = useState('');
    const [idDocente, setIdDocente] = useState(userId);
    const [idCiclo, setIdCiclo] = useState(ciclo.id_ciclo);

    const [grados, setGrados] = useState([]);
    const [userData, setUserData] = useState({});
    const [seccionesCreadas, setSeccionesCreadas] = useState(0);

    const handleSelectChange = (e) => {
        setIdGrado(e.target.value);
    };

    const GRADO_IMAGES = {
        1: Primero,
        2: Segundo,
        3: Tercero,
        4: Cuarto,
        5: Quinto,
        6: Sexto
    };

    const getGradoImage = (id_grado) => {
        return GRADO_IMAGES[id_grado] || '';
    }

    const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);
    const [botonesVisibles, setBotonesVisibles] = useState(true);

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
    
    useEffect(() => {
        if (ciclo) {
        }
    }, [ciclo]);

    const fetchGrados = async () => {
        try {
            const response = await axios.get(`${API_URL}/grados`);
            setGrados(response.data.grados);
            console.log("Grados", response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchData = async () => {
        try {
          const response = await axios.get(`${API_URL}/secciones/${idDocente}/${idCiclo}`);
          setUserData(response.data);
          console.log("Datos", response.data);
          setSeccionesCreadas(response.data.seccionDocente.length);
        } catch (error) {
          console.log(error);
        }
    };

    useEffect( () => {
        fetchGrados();
        fetchData();
    }, [])

    const validarCampos = () => {
        if (!idGrado) {
            handleErrorMessage('Debes seleccionar un grado.');
            return false;
        }
        
        if (!seccion) {
            handleErrorMessage('Debes seleccionar una sección.');
            return false;
        }

        return true;
    }

    const [isLoading, setIsLoading] = useState(false);
    const registrarSeccion = async () => {
        setIsLoading(true);

        if (!validarCampos()) {
            setIsLoading(false);
            return;
        }

        try{
            const response = await axios.post(`${API_URL}/seccion`, {
                seccion: seccion,
                id_docente: idDocente,
                id_grado: idGrado,
                id_ciclo: idCiclo,
            });
            console.log(response);
            handleSuccessMessage('Sección regisrada con éxito');
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

    const actualizarSeccion = async () => {
        setIsLoading(true)

        if (!validarCampos()) {
            setIsLoading(false);
            return;
        }

        if (!idSeccion) {
            handleErrorMessage('No has seleccionado la Sección');
            setIsLoading(false);
            return;
        }

        try{
            const response = await axios.put(`${API_URL}/seccion/${idSeccion}`, {
                seccion: seccion,
                id_docente: idDocente,
                id_grado: idGrado,
                id_ciclo: idCiclo,
            });
            console.log(response);
            handleSuccessMessage('Sección modificada con éxito');
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

    const eliminarSeccion = async (id) => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`${API_URL}/seccion/${id}`);
            setIsLoading(false);
            fetchData();
            handleSuccessMessage('Sección Eliminada con éxito.')
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage('Hubo un error al eliminar la sección.');
                console.log(error.response.data.error);
            }
            setIsLoading(false);
        }
    }

    const handleSeleccionarSeccion = (seccion) => {
        setSeccionSeleccionada(seccion);
        setIdGrado(seccion.id_grado);
        setSeccion(seccion.seccion);
        setIdSeccion(seccion.id_seccion);
        setIdCiclo(seccion.id_ciclo);
        setBotonesVisibles(false);
    };

    const getGradoName = (id_grado) => {
        const grado = grados.find(g => g.id_grado === id_grado);
        return grado ? grado.grado : 'Desconocido';
    }

    const notify = () => {
        toast(
          <>
            <h3>¿Está seguro que desea Eliminar esta sección, se perderán todos los datos registrados?</h3>
            <button onClick={() => toast.dismiss()}>Cancelar</button>
            <button onClick={() => {
                    eliminarSeccion(idSeccion);
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
        <section className = "Secciones" id = "Secciones">
            <ToastContainer/>
            <div className = "header">
                <span className="material-icons-sharp header-span title-span">bookmarks</span>
                <h1>Grados y Secciones</h1>
            </div>
            <div className="secciones-container">
                <div className="secciones-titulo">
                    <h1>Ciclo Escolar {ciclo.ciclo}</h1>
                    <h2>Nuevo Grado:</h2>
                    <div>
                        <h2>Grado:</h2>
                        <select value={idGrado} onChange={handleSelectChange}>
                            <option value="" disabled>Selecciona...</option>
                            {grados.map((grado) => (
                                <option key={grado.id_grado} value={grado.id_grado}>
                                    {grado.grado}
                                </option>
                            ))}
                        </select>
                        <h2>Sección:</h2>
                        <select value={seccion} onChange={(e) => setSeccion(e.target.value)}>
                            <option value="" disabled>Selecciona...</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                            <option value="F">F</option>
                        </select>
                        {botonesVisibles && (
                            <button onClick={registrarSeccion}
                            disabled={isLoading}>
                                {isLoading ? "Agregando..." : "Agregar"}
                            </button>
                        )}
                        {!botonesVisibles && (
                            <button onClick={actualizarSeccion}
                            disabled={isLoading}>
                                {isLoading ? "Actualizando..." : "Actualizar"}
                            </button>
                        )}
                        <button onClick={setBotonesVisibles}>
                            Limpiar
                        </button>
                    </div>
                    <h2 style={{ color: 'blue' }}>Secciones creadas: {seccionesCreadas}</h2>
                </div>
                <div className="secciones-grados">
                    {userData.seccionDocente && userData.seccionDocente.length > 0 ? (
                        userData.seccionDocente.map((seccion) => (
                            <div className="grado">
                                <h2>Grado: {getGradoName(seccion.id_grado)}</h2>
                                <h2>Sección: {seccion.seccion}</h2>
                                <h2>Ciclo Escolar: {ciclo.ciclo}</h2>
                                <img src={getGradoImage(seccion.id_grado)} className="numero-grado" alt="foto-grado"></img> 
                                <div>
                                    <button 
                                    className = "boton1"
                                    onClick = {() => handleSeleccionarSeccion(seccion)}
                                    type="button">
                                        Seleccionar
                                    </button>
                                    {!botonesVisibles && (
                                        <>
                                            {!seccionSeleccionada || seccionSeleccionada.id_seccion === seccion.id_seccion ? (
                                                <button className = "boton2"
                                                type="button"
                                                onClick={() => {
                                                    notify();
                                                    setIdSeccion(seccion.id_seccion);
                                                }}>
                                                Eliminar</button>
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
    );
}

export default Secciones;