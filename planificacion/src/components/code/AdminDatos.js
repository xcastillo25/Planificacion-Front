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

const AdminDocentes = ({plataforma, setPlataformaVisible, userId}) => {

    const [idUsuario, setIdUsuario] = useState('');
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [rol, setRol] = useState('');
    const [passwordActual, setPasswordActual] = useState('');
    const [passwordNueva, setPasswordNueva] = useState('');
    const [passwordNueva2, setPasswordNueva2] = useState('');
    const [director, setDirector] = useState('');
    const handleChangeRol = (e) => {setRol(e.target.value);};
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
          const response = await axios.get(`${API_URL}/usuario/${userId}`);
          const userData = response.data;
    
          console.log("Mi Data:", userData);
    
          if (Array.isArray(userData.usuario) && userData.usuario.length > 0) {
            const usuarioData = userData.usuario[0];
            setUserData(usuarioData);
            setNombres(usuarioData.nombres);
            setApellidos(usuarioData.apellidos);
            setTelefono(usuarioData.telefono);
            setCorreo(usuarioData.correo);
            setRol(usuarioData.rol);
            resetPassword();
          } else {
            console.error("Error: No se encontró ningún usuario en la respuesta.");
          }
        } catch (error) {
          console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    const actualizarDocente = async () => {
        setIsLoading(true);

        try {
            const response = await axios.put(`${API_URL}/usuario/${userId}`, {
                nombres: nombres,
                apellidos: apellidos,
                coreo: correo,
                password: passwordActual,
                rol: rol,
                telefono: telefono,
            });

            console.log(response);
            handleSuccessMessage('Usuario modificado con éxito.')
            setIsLoading(false);
            resetPassword();
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

    const resetPassword = () =>{
        setPasswordActual('');
        setPasswordNueva('');
        setPasswordNueva2(''); 
    }

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
          const response = await axios.post(`${API_URL}/cambiarpassword-usuario`, {
            id_usuario: userId,
            passwordActual: passwordActual,
            nuevoPassword: passwordNueva,
          });
      
          console.log(response.data);
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
                <h1>Datos del Usuario</h1>
                <h1>{userId}</h1>
            </div>

            <div className="docentes-container">
                <h1>Datos Personales:</h1>
                <div className="contenido">
                    <div className="column">
                        <label>
                            Nombres:
                        </label>
                        <input 
                            value={nombres}
                            onChange={(e) => setNombres(e.target.value)}
                            placeholder="Ingresa tus nombres"
                            ></input>
                    </div>
                    <div className="column">
                        <label>
                            Apellidos:
                        </label>
                        <input 
                            value={apellidos}
                            onChange={(e) => setApellidos(e.target.value)}
                            placeholder="Ingresa los apellidos"></input>
                    </div>
                    <div className="column">
                        <label>
                            Rol:
                        </label>
                        <select value={rol} onChange={handleChangeRol}>
                            <option value="" disabled>Selecciona...</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Revisor">Revisor</option>
                        </select>
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
                            ></input>
                    </div>
                </div>
                <div className="botones">
                    <button onClick={actualizarDocente} 
                        disabled={isLoading}>
                        <img src={Edit} alt="null"></img>
                        {isLoading ? "Actualizando..." :"Actualizar"}
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

export default AdminDocentes;