import React, {useState, useEffect, useRef} from 'react';
import '../design/Establecimientos.css';
import axios from 'axios';
import { API_URL } from '../../config/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Establecimientos = ({plataforma, setPlataformaVisible, userId}) => {

    const [idEstablecimiento, setIdEstablecimiento] = useState('');
    const [establecimiento, setEstablecimiento] = useState('');
    const [direccion, setDireccion] = useState('');
    const [codigo, setCodigo] = useState('');
    const [director, setDirector] = useState('');
    const [ctae, setCtae] = useState('');
    const [distrito, setDistrito] = useState('');
    const [municipio, setMunicipio] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [sector, setSector] = useState('Oficial');
    const [jornada, setJornada] = useState('Matutina');
    const [area, setArea] = useState('Rural');
    const [modalidad, setModalidad] = useState('Bilingüe');

    const handleChangeSector = (e) => {setSector(e.target.value);};
    const handleChangeJornada = (e) => {setJornada(e.target.value);};
    const handleChangeArea = (e) => {setArea(e.target.value);};
    const handleChangeModalidad = (e) => {setModalidad(e.target.value);};

    const [userData, setUserData] = useState({});

    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [establecimientoSeleccionado, setEstablecimientoSeleccionado] = useState(null);
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

    const handleFileSelection = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setPreviewImage('');
        }
    };

    const uploadFile = async () => {
        const formData = new FormData();
        formData.append('photo', selectedFile);
        
        const response = await axios.post(`${API_URL}/photo-upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      
        return response.data.cloudinaryURL;
    }

    const handleDeletePhoto = () => {
        setSelectedFile(null);
        setPreviewImage('');
    };

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

        if (!previewImage || previewImage.trim() === '') {
            handleErrorMessage(`Debes cargar una foto antes de guardar.`);
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

    const fetchData = async () => {
        try {
          const response = await axios.get(`${API_URL}/establecimientos/${userId}`);
          setUserData(response.data);
          console.log("Datos", response.data);
        } catch (error) {
          console.log(error);
        }
    };

    const [isLoading, setIsLoading] = useState(false);
    const registrarEstablecimiento = async () => {
        setIsLoading(true);

        if (!validarCampos()) {
            setIsLoading(false);
            return;
        }

        let photoPath = '';
        if (selectedFile){
            try{
                photoPath = await uploadFile();
            } catch (error){
                handleErrorMessage('Hubo un error al subir el logotipo');
                setIsLoading(false);
                return;
            }
        } else {
            handleErrorMessage('Por favor, carga un logotipo antes de guardar.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/establecimiento`, {
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
                id_docente: userId,
                logotipo: photoPath
            });
            console.log(response);
            handleSuccessMessage('Establecimiento registrado con éxito.');
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
    };

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

        let photoPath = '';
        if (selectedFile) {
            try {
                photoPath = await uploadFile();
            } catch (error) {
                handleErrorMessage('Hubo un error al subir el logotipo');
                setIsLoading(false);
                return;
            }
        } else {
            photoPath = previewImage;
            setIsLoading(false);
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
                id_docente: userId,
                logotipo: photoPath
            });

            console.log(response);
            handleSuccessMessage('Establecimiento modificado con éxito.')
            setIsLoading(false);
            resetForm();
            fetchData();
        } catch (error){
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage('Hubo un error al actualizar al estudiante.');
            }
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    const handleSeleccionarEstablecimiento = (establecimiento) => {
        setEstablecimientoSeleccionado(establecimiento);
        setBotonesVisibles(false);
    };

    const resetForm = () => {
        setIdEstablecimiento('');
        setEstablecimiento('');
        setDireccion('');
        setCodigo('');
        setDirector('');
        setCtae('');
        setDistrito('');
        setMunicipio('');
        setDepartamento('');
        setSector('Oficial');
        setJornada('Matutina');
        setArea('Area');
        setModalidad('Bilingüe');
        setSelectedFile(null);
        setPreviewImage('');
        fetchData();
    }

    useEffect(() => {
        if (establecimientoSeleccionado) {
            setIdEstablecimiento(establecimientoSeleccionado.id_establecimiento);
            setEstablecimiento(establecimientoSeleccionado.establecimiento);
            setDireccion(establecimientoSeleccionado.direccion);
            setCodigo(establecimientoSeleccionado.codigo);
            setDirector(establecimientoSeleccionado.director);
            setCtae(establecimientoSeleccionado.ctae);
            setDistrito(establecimientoSeleccionado.distrito);
            setMunicipio(establecimientoSeleccionado.municipio);
            setDepartamento(establecimientoSeleccionado.departamento);
            setSector(establecimientoSeleccionado.sector);
            setJornada(establecimientoSeleccionado.jornada);
            setArea(establecimientoSeleccionado.area);
            setModalidad(establecimientoSeleccionado.modalidad);
            setPreviewImage(establecimientoSeleccionado.logotipo);
        }
      }, [establecimientoSeleccionado]);
      
    return(
        <section className="Establecimientos" id="Establecimientos">
            <ToastContainer />
            <div className = "header">
                <span className="material-icons-sharp header-span title-span">flag</span>
                <h1>Datos del Establecimiento</h1>
            </div>
            <div className = "establecimiento-container">
                <div className = "container-datos">
                    <div className="column1">
                        <div>
                            <h2>Establecimiento:</h2>
                            <input type="text" placeholder="Ingresa el nombre del Establecimiento"
                                value={establecimiento}
                                onChange={(e) => setEstablecimiento(e.target.value)}
                                tabIndex="1"
                            />
                        </div>
                        <div>
                            <h2>Dirección:</h2>
                            <input type="text" placeholder="Ingresa la Dirección del Establecimiento"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                tabIndex="2"
                            />
                        </div>
                        <div>
                            <h2>Código:</h2>
                            <input type="text" placeholder="Ingresa el Código del Establecimiento sin Guiones"
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                                tabIndex="3"
                            />
                        </div>
                        <div>
                            <h2>Director:</h2>
                            <input type="text" placeholder="Ingresa el Nombre del Director"
                                value={director}
                                onChange={(e) => setDirector(e.target.value)}
                                tabIndex="4"
                            />
                        </div>
                        <div>
                            <h2>CTAE:</h2>
                            <input type="text" placeholder="Ingresa el Nombre del Comisionado Temporal de Administración Educativa"
                                value={ctae}
                                onChange={(e) => setCtae(e.target.value)}
                                tabIndex="5"
                            />
                        </div>
                        <div>
                            <h2>Distrito:</h2>
                            <input type="text" placeholder="Ingresa el distrito escolar con guiones"
                                value={distrito}
                                onChange={(e) => setDistrito(e.target.value)}
                                tabIndex="6"
                            />
                        </div>
                        <div>
                            {botonesVisibles && (
                                <button tabIndex="15" 
                                onClick={registrarEstablecimiento}
                                disabled={isLoading}>
                                    {isLoading ? "Guardando..." : "Guardar Establecimiento"}
                                </button>
                            )}
                            {!botonesVisibles && (
                                <button tabIndex="16"
                                onClick={actualizarEstablecimiento}
                                disabled = {isLoading}>
                                    {isLoading ? "Actualizando..." : "Actualizar Establecimiento"}
                                </button>
                            )}
                                <button 
                                tabIndex="15" 
                                onClick={() => {
                                    resetForm();
                                    setBotonesVisibles(true);}}
                                >
                                    Limpiar
                                </button>
                        </div>
                    </div>
                    <div className="column2">
                        <div>
                            <h2>Municipio:</h2>
                            <input type="text" placeholder="Municipio"
                                value={municipio}
                                onChange={(e) => setMunicipio(e.target.value)}
                                tabIndex="7"
                            />
                        </div>
                        <div>
                            <h2>Departamento:</h2>
                            <input type="text" placeholder="Departamento"
                                value={departamento}
                                onChange={(e) => setDepartamento(e.target.value)}
                                tabIndex="8"
                            />
                        </div>
                        <div>
                            <h2>Sector:</h2>
                            <select value={sector} onChange={handleChangeSector} tabIndex="9">
                                <option value="" disabled>Selecciona...</option>
                                <option value="Oficial">Oficial</option>
                                <option value="Privado">Privado</option>
                            </select>
                        </div>
                        <div>
                            <h2>Jornada:</h2>
                            <select value={jornada} onChange={handleChangeJornada } tabIndex="10">
                                <option value="" disabled>Selecciona...</option>
                                <option value="Matutina">Matutina</option>
                                <option value="Vespertina">Vespertina</option>
                            </select>
                        </div>
                        <div>
                            <h2>Area:</h2>
                            <select value={area} onChange={handleChangeArea} tabIndex="11">
                                <option value="" disabled>Selecciona...</option>
                                <option value="Rural">Rural</option>
                                <option value="Urbana">Urbana</option>
                            </select>
                        </div>
                        <div>
                            <h2>Modalidad:</h2>
                            <select 
                                value={modalidad} 
                                onChange={handleChangeModalidad} 
                                tabIndex="12">
                                <option value="" disabled>Selecciona...</option>
                                <option value="Bilingüe">Bilingüe</option>
                                <option value="Monolingüe">Monolingüe</option>
                            </select>
                        </div>
                    </div>
                    <div className="column3">
                        <h2>Logotipo:</h2>
                        <input type="file" accept="image/*" onChange={handleFileSelection} style={{ display: 'none' }} ref={fileInputRef} />
                        {previewImage && <img src={previewImage} alt="Vista Previa"/>}
                        <div>
                            <button className="button1" onClick={() => fileInputRef.current.click()}>
                                Agregar
                            </button>
                            {selectedFile && <button className="button2" onClick={handleDeletePhoto}>
                                Borrar
                            </button>}
                        </div>
                    </div>
                </div>

                <div className="container-botones">
                    <div>
                        {botonesVisibles && (
                            <button tabIndex="15" 
                            onClick={registrarEstablecimiento}
                            disabled={isLoading}>
                                {isLoading ? "Guardando..." : "Guardar Establecimiento"}
                            </button>
                        )}
                        {!botonesVisibles && (
                            <button tabIndex="16"
                            onClick={actualizarEstablecimiento}
                            disabled = {isLoading}>
                                {isLoading ? "Actualizando..." : "Actualizar Establecimiento"}
                            </button>
                        )}
                            <button 
                            tabIndex="15" 
                            onClick={() => {
                                resetForm();
                                setBotonesVisibles(true);}}
                            >
                                Limpiar
                            </button>
                    </div>
                </div>
                
                {userData.establecimientosDocente && userData.establecimientosDocente.length > 0 ? (
                    userData.establecimientosDocente.map((establecimiento) => (
                        <div className = "establecimiento-datos">
                            <div className="content">
                                    <div key={establecimiento.id_establecimiento}>
                                        <h2>{establecimiento.codigo}&nbsp;</h2>
                                        <h2>{establecimiento.establecimiento}&nbsp;</h2>
                                        <h2>{establecimiento.direccion},&nbsp;</h2>
                                        <h2>{establecimiento.municipio},&nbsp;</h2>
                                        <h2>{establecimiento.departamento}</h2>
                                    </div>
                                    <div style={{gap:'1rem'}}>
                                    <button onClick={() => handleSeleccionarEstablecimiento(establecimiento)}>Seleccionar</button>
                                    <button>Solicitar Eliminación</button>
                                </div>
                            </div>        
                        </div>
                            ))
                ) : (
                    <p style={{fontSize:'18px', textAlign:'center', color:'black', marginTop:'1rem',
                                fontWeight:'600'}}
                    >No hay establecimientos disponibles.</p>
                )}            
            </div>
        </section>
    );
};

export default Establecimientos;