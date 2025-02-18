import React, {useState, useEffect} from 'react';
import '../design/Docentes.css';
import axios from 'axios';
import { API_URL } from '../../config/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Edit from '../../assets/Pencil.png';
import Save from '../../assets/Save.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Docentes = ({plataforma, setPlataformaVisible, userId}) => {

    const [primerNombre, setPrimerNombre] = useState('');
    const [segundoNombre, setSegundoNombre] = useState('');
    const [otrosNombres, setOtrosNombres] = useState('');
    const [primerApellido, setPrimerApellido] = useState('');
    const [segundoApellido, setSegundoApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [genero, setGenero] = useState('');
    const [passwordActual, setPasswordActual] = useState('');
    const [passwordNueva, setPasswordNueva] = useState('');
    const [passwordNueva2, setPasswordNueva2] = useState('');
    const [director, setDirector] = useState('');
    const handleChangeGenero = (e) => {setGenero(e.target.value);};
    const handleChangeDirector = (e) => {setDirector(e.target.value);};
    const [userData, setUserData] = useState({});

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const togglePassword2 = () => {
        setShowPassword2(!showPassword2);
    };

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

    const [isLoading, setIsLoading] = useState(false);
    const fetchData = async () => {
        try {
          const response = await axios.get(`${API_URL}/docente/${userId}`);
          const userData = response.data;
    
        //   console.log("Mi Data:", userData);
    
          if (Array.isArray(userData.docente) && userData.docente.length > 0) {
            const docenteData = userData.docente[0];
            setUserData(docenteData);
            setPrimerNombre(docenteData.primer_nombre);
            setSegundoNombre(docenteData.segundo_nombre || '');
            setOtrosNombres(docenteData.otros_nombres || '');
            setPrimerApellido(docenteData.primer_apellido);
            setSegundoApellido(docenteData.segundo_apellido || '');
            setTelefono(docenteData.telefono);
            setCorreo(docenteData.correo);
            setGenero(docenteData.genero);
            setDirector(docenteData.director);
            resetPassword();
          } else {
            // console.error("Error: No se encontró ningún docente en la respuesta.");
          }
        } catch (error) {
        //   console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    const [isLoading2, setIsLoading2] = useState(false);
    const actualizarDocente = async () => {
        setIsLoading2(true);

        try {
            const response = await axios.put(`${API_URL}/docente/${userId}`, {
                primer_nombre: primerNombre,
                segundo_nombre: segundoNombre,
                otros_nombres: otrosNombres,
                primer_apellido: primerApellido,
                segundo_apellido: segundoApellido,
                telefono: telefono,
                correo: correo,
                password: passwordActual,
                coreo: correo,
                genero: genero,
                director: director,
            });

            // console.log(response);
            handleSuccessMessage('Docente modificado con éxito.')
            setIsLoading2(false);
            resetPassword();
            fetchData();
        } catch (error){
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage('Hubo un error al actualizar al estudiante.');
            }
            setIsLoading2(false);
        }
    };

    const resetPassword = () =>{
        setPasswordActual('');
        setPasswordNueva('');
        setPasswordNueva2(''); 
    }

    const [readOnly] = useState(true);

    const validarCampos = () => {
        const camposObligatorios = [
            
            {valor: passwordActual, nombreCampo: 'Contraseña Actual'},
            {valor: passwordNueva, nombreCampo: 'Contraseña Nueva Nueva'},
            {valor: passwordNueva2, nombreCampo: 'Verificación de Contraseña Nueva'}
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

        if (!/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{5,}/.test(passwordNueva)) {
            handleErrorMessage('La contraseña debe contener al menos una mayúscula, un número, un símbolo y tener al menos 5 caracteres.');
            return false;
        }
      
        if (passwordNueva !== passwordNueva2) {
            handleErrorMessage('Las contraseñas no coinciden.');
            return false;
        }

        if (passwordActual === passwordNueva) {
            handleErrorMessage('Elige una contraseña diferente a la actual.');
            return false;
        }

        if (!/^[3-6]\d{7}$/.test(telefono)) {
            handleErrorMessage('El número de teléfono celular no es válido para Guatemala.');
            return false;
        }
        
        return true;
    }

    const cambiarPassword = async () => {
        setIsLoading(true);

        if (!validarCampos()) {
            setIsLoading(false);
            return;
        }

        try {
          const response = await axios.post(`${API_URL}/cambiarpassword`, {
            id_docente: userId,
            passwordActual: passwordActual,
            nuevoPassword: passwordNueva,
          });
      
        //   console.log(response.data);
            handleSuccessMessage('Contraseña modificada con éxito.')
            setIsLoading(false);
            resetPassword();
            fetchData();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage('Error', error.response.data.error);
            }
            setIsLoading(false);
        }
    };
    
    return(
        <section className="Docentes" id="Docentes">
            <ToastContainer />
            <div className = "header">
                <span className="material-icons-sharp header-span title-span">person</span>
                <h1>Datos del Docente</h1>
            </div>

            <div className="docentes-container">
                <h1>Datos Personales:</h1>
                <div className="contenido">
                    <div className="column">
                        <label>
                            Primer Nombre:
                        </label>
                        <input 
                            value={primerNombre}
                            onChange={(e) => setPrimerNombre(e.target.value)}
                            placeholder="Ingresa el primer nombre"
                            readOnly={readOnly}></input>
                    </div>
                    <div className="column">
                        <label>
                            Segundo Nombre:
                        </label>
                        <input 
                            value={segundoNombre}
                            onChange={(e) => setSegundoNombre(e.target.value)}
                            placeholder="Ingresa el segundo nombre"></input>
                    </div>
                    <div className="column">
                        <label>
                            Otros Nombres:
                        </label>
                        <input 
                            value={otrosNombres}
                            onChange={(e) => setOtrosNombres(e.target.value)}
                            placeholder="Ingresa otros nombres"></input>
                    </div>
                    <div className="column">
                        <label>
                            Primer Apellido:
                        </label>
                        <input
                            value={primerApellido}
                            onChange={(e) => setPrimerApellido(e.target.value)}
                            placeholder="Ingresa el primer apellido"
                            readOnly={readOnly}></input>
                    </div>
                    <div className="column">
                        <label>
                            Segundo Apellido:
                        </label>
                        <input
                            value={segundoApellido}
                            onChange={(e) => setSegundoApellido(e.target.value)}
                            placeholder="Ingresa el segundo apellido"></input>
                    </div>
                    <div className="column">
                        <label>
                            Teléfono:
                        </label>
                        <input 
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            placeholder="Ingresa tu teléfono"></input>
                    </div>
                    <div className="column">
                        <label>
                            Correo:
                        </label>
                        <input
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="Ingresa tu correo"
                            readOnly={readOnly}></input>
                    </div>
                    <div className="column">
                        <label>
                            Género:
                        </label>
                        <select value={genero} onChange={handleChangeGenero}>
                            <option value="" disabled>Selecciona...</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                        </select>
                    </div>
                    <div className="column">
                        <label>
                            Director:
                        </label>
                        <select value={director} onChange={handleChangeDirector}>
                            <option value="" disabled>Selecciona...</option>
                            <option value="Si">Si</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>
                <div className="botones">
                    <button onClick={actualizarDocente} 
                        disabled={isLoading2}>
                        <img src={Edit} alt="null"></img>
                        {isLoading2 ? "Actualizando..." :"Actualizar"}
                    </button>
                </div>
                <h1>Datos del Usuario:</h1>
                <h2>Cambiar Contraseña:</h2>
                <div className="password">  
                    <div className="column">
                        <label>
                            Contraseña Actual:
                        </label>
                        <div className="password-container">
                            <input type={showPassword ? "text" : "password"} 
                                value={passwordActual}
                                onChange={(e) => setPasswordActual(e.target.value)}/>
                            <span className="toggle-password" onClick={togglePassword}>
                            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </span>
                        </div>
                    </div>
                    <div className="column">
                        <label>
                            Contraseña Nueva:
                        </label>
                        <div className="password-container">
                            <input type={showPassword2 ? "text" : "password"} 
                            value={passwordNueva}
                            onChange={(e) => setPasswordNueva(e.target.value)}/>
                            <span className="toggle-password" onClick={togglePassword2}>
                            <FontAwesomeIcon icon={showPassword2 ? faEye : faEyeSlash} />
                            </span>
                        </div>
                    </div>
                    <div className="column">
                        <label>
                            Confirma Contraseña Nueva:
                        </label>
                        <div className="password-container">
                            <input type={showPassword2 ? "text" : "password"} 
                            value={passwordNueva2}
                            onChange={(e) => setPasswordNueva2(e.target.value)}/>
                            <span className="toggle-password" onClick={togglePassword2}>
                            <FontAwesomeIcon icon={showPassword2 ? faEye : faEyeSlash} />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="botones">
                    <button onClick={cambiarPassword}
                        disabled={isLoading}>
                        <img src={Save} alt="null"></img>
                        {isLoading ? "Guardando..." :"Guardar"}
                    </button>
                </div>
                <div>
                    <h1>
                        
                    </h1>
                </div>
            </div>
        </section>
    );
};

export default Docentes;