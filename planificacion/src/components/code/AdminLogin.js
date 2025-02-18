import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/config';
import '../design/Login.css';
import { useAuth } from './ContextAuth.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from '../../assets/logo.png';
import Save from '../../assets/Save.png';
import Cancel from '../../assets/Cancel.png';
import Pass from '../../assets/Pass.png';
import Send from '../../assets/Send.png';
import Log from '../../assets/Log.png';
import Register from '../../assets/Register.png';

Modal.setAppElement('#root');

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [idUsuario, setIdUsuario] = useState('');
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [rol, setRol] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    
    const handleChangeRol = (e) => {setRol(e.target.value);};
    const [correoRecuperacion, setCorreoRecuperacion] = useState('');
    const [codigoRecuperacion, setCodigoRecuperacion] = useState('');

    const { login } = useAuth();
    const history = useNavigate();
    const [error] = useState(null);
    
    const [isOpenRegistroModal, setIsOpenRegistroModal] = useState(false);
    const openRegistroModal = () => setIsOpenRegistroModal(true);
    const closeRegistroModal = () => setIsOpenRegistroModal(false);

    const [isOpenRecuperacionModal, setIsOpenRecuperacionModal] = useState(false);
    const openRecuperacionModal = () => setIsOpenRecuperacionModal(true);
    const closeRecuperacionModal = () => setIsOpenRecuperacionModal(false);

    const [isEntring, setIsEntring] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsEntring(true)
        let endpoint = 'usuario/login/';
        let url = `${API_URL}/${endpoint}`;
    
        try {
            const response = await axios.post(url, { correo: email, password: password });
    
            if (response && response.data) {
                const { token, id_usuario, nombres, apellidos, rol } = response.data;
    
                localStorage.setItem('token', token);
                localStorage.setItem('id_usuario', id_usuario);
                localStorage.setItem('nombres', nombres);
                localStorage.setItem('apellidos', apellidos);
                localStorage.setItem('rol', rol);
                // Usar la función login para actualizar el estado de autenticación
                login(token);
                setIsEntring(false);
                history('/adminhome');
            } else {
                handleErrorMessage('Credenciales de administrador incorrectas.');
                setIsEntring(false);
            }
        } catch (err) {
            // Si hay un error en la respuesta del backend
            if (err.response && err.response.data && err.response.data.error) {
                handleErrorMessage(err.response.data.error);
            } else {
                handleErrorMessage('Error en la autenticación. Por favor, intenta de nuevo.');
            }
            setIsEntring(false);
        }
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

    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const [showPasswordRegistro, setShowPasswordRegistro] = useState(false);
    const togglePasswordRegistro = () => {
        setShowPasswordRegistro(!showPasswordRegistro);
    };

    const [isLoading, setIsLoading] = useState(false);
    const registrarUsuario = async () => {
        setIsLoading(true)

        if (!validarCampos()){
            setIsLoading(false);
            return;
        }

        try{
            const response = await axios.post(`${API_URL}/usuario`, {
                nombres: nombres,
                apellidos: apellidos,
                correo: correo,
                password: password1,
                rol: rol,
                telefono: telefono,
            });
            // console.log(response);
            handleSuccessMessage('Usuario registrado con éxito.');
            setIsLoading(false);
            resetRegistro();
            closeRegistroModal();
        } catch(error) {
            if (error.response && error.response.data && error.response.data.error) {
                handleErrorMessage(error.response.data.error);
            } else {
                handleErrorMessage(error.response.data.message);
            }
            setIsLoading(false);
        }
    }

    const validarCampos = () => {
        const camposObligatorios = [
            {valor: nombres, nombreCampo: 'Nombres'},
            {valor: apellidos, nombreCampo: 'Apellidos'},
            {valor: telefono, nombreCampo: 'Telefono'},
            {valor: correo, nombreCampo: 'Correo'},
            {valor: password1, nombreCampo: 'Contraseña'},
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

        if (!/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{5,}/.test(password1)) {
            handleErrorMessage('La contraseña debe contener al menos una mayúscula, un número, un símbolo y tener al menos 5 caracteres.');
            return false;
        }
      
        if (password1 !== password2) {
            handleErrorMessage('Las contraseñas no coinciden.');
            return false;
        }

        const correoRegex = /^[a-zA-Z0-9._%+-]{4,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!correoRegex.test(correo)) {
            handleErrorMessage('El correo debe tener al menos 4 caracteres antes del "@", seguir las normas para correos electrónicos y tener un dominio válido.');
            return false;
        }

        if (!/^[3-6]\d{7}$/.test(telefono)) {
            handleErrorMessage('El número de teléfono celular no es válido para Guatemala.');
            return false;
        }
        
        return true;
    }

    const resetRegistro = () => {
        setNombres('');
        setApellidos('');
        setTelefono('');
        setCorreo('');
        setPassword1('');
        setPassword2('');
    }

    const validarYRegistrar = async () => {
        setIsLoading(true);
        
        if (!correoRecuperacion || !codigoRecuperacion) {
          handleErrorMessage('Ambos campos (correo y código) deben estar llenos.');
          setIsLoading(false);
          return;
        }
    
        try {
          const response = await axios.post(`${API_URL}/usuarioresetPassword`, {
            correo: correoRecuperacion,
            codigo_verificacion: codigoRecuperacion,
          });
    
          if (response.status === 200) {
            handleSuccessMessage(response.data.message);
            setCorreoRecuperacion('');
            setCodigoRecuperacion('');
          }
        } catch (error) {
          if (error.response) {
            // El servidor respondió con un estado fuera del rango de 2xx
            // console.log(error.response.data);
            handleErrorMessage(error.response.data.error);
          } else if (error.request) {
            // La solicitud se hizo pero no se recibió ninguna respuesta
            // console.log(error.request);
            handleErrorMessage('No se recibió respuesta del servidor.');
          } else {
            // Algo sucedió en la configuración de la solicitud
            // console.log('Error', error.message);
            handleErrorMessage('Ocurrió un error al hacer la solicitud.');
          }
        //   console.log(error.config);
        }
         finally {
          setIsLoading(false);
        }
    };

    const resetRecuperacion = () => {
        setCorreoRecuperacion('');
        setCodigoRecuperacion('');
      }; 
    
    const enviarCodigoAEmail = async () => {
        
        try {
          setIsLoading(true);
          const response = await axios.post(`${API_URL}/usuariocodePassword`, { 
            correo:correoRecuperacion });
    
          // Si el correo se envía con éxito, mostrar el modal de éxito
          handleSuccessMessage('El código de recuperación del password de usuario ha sido enviado a tu correo.');
        } catch (error) {
          if (error.response && error.response.data && error.response.data.error) {
            // Si hay un error en la respuesta del servidor, muestra ese error
            handleErrorMessage(error.response.data.error);
          } 
          else {
            // Si hay un error desconocido, muestra un mensaje genérico
            handleErrorMessage('Hubo un error al enviar el código.');
          }
        } finally {
          setIsLoading(false);
        }
    };
    
    const recuperarContraseña = async () => {
        setIsLoading(true);
      
        if (!correoRecuperacion) {
          handleErrorMessage("Por favor, ingresa tu correo.");
          setIsLoading(false);
          return;
        }
      
        try {
          const response = await axios.post(`${API_URL}/usuarioresetPassword`, { correo: correoRecuperacion });
      
          if (response.status === 200) {
            handleSuccessMessage(response.data.message || "Tu nueva contraseña ha sido enviada a tu correo.");
            setCorreoRecuperacion("");
            closeRecuperacionModal();
          }
        } catch (error) {
          if (error.response && error.response.data && error.response.data.error) {
            // Mostrar el mensaje de error que viene del backend
            handleErrorMessage(error.response.data.error);
          } else {
            // Mostrar un mensaje genérico si no hay respuesta del backend
            handleErrorMessage("Hubo un error al procesar tu solicitud.");
          }
        } finally {
          setIsLoading(false);
        }
      };
            

    return (
        <>
        <section className="Login" id="Login">
            <ToastContainer />
            <div className="login-container">
                <h1>Inicio de Sesión</h1>
                <h1>Administrador</h1>
                <img src={logo} alt="null">
                </img>
                <div className="credenciales">
                    <label>Correo:</label>
                    <input 
                        placeholder="Ingresa tu correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        ></input>
                    <label>Contraseña:</label>
                    <div className="password">
                        <input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            ></input>
                        <span onClick={togglePassword}>
                            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                        </span>
                    </div>
                    <label className="password-link" onClick={openRecuperacionModal}>
                        Olvidé mi contraseña
                    </label>
                </div>
                <div className="botones">
                    <button onClick={handleSubmit}
                    disabled={isEntring}>
                        <img src={Log} alt="null"></img>
                        {isEntring ? "Iniciando Sesión..." : "Iniciar Sesión"}
                    </button>
                    <button onClick={openRegistroModal}>
                        <img src={Register} alt="null"></img>
                        Regístrate
                    </button>
                </div>
            </div>
        </section>
        <Modal isOpen={isOpenRegistroModal} onRequestClose={closeRegistroModal} className="login-modal-registro">
            <h1 style={{fontSize:'30px'}}>Registro de Administradores</h1>
            <div className="container">
            <h1>Datos Personales:</h1>
                <div className="datos">
                    <div className="column">
                            <label>
                                Nombres:
                            </label>
                            <input 
                                value={nombres}
                                onChange={(e) => setNombres(e.target.value)}
                                placeholder="Ingresa tus nombres"></input>
                    </div>
                    <div className="column">
                        <label>
                            Apellidos:
                        </label>
                        <input 
                            value={apellidos}
                            onChange={(e) => setApellidos(e.target.value)}
                            placeholder="Ingresa tus apellidos"></input>
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
                            placeholder="Ingresa tu correo"></input>
                    </div>
                </div>
                <h1>Datos del Usuario:</h1>
                <div className="password">  
                    <div className="column">
                        <label>
                            Contraseña:*
                        </label>
                        <div className="password-container">
                            <input type={showPasswordRegistro ? "text" : "password"}
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}/>
                            <span className="toggle-password" onClick={togglePasswordRegistro}>
                            <FontAwesomeIcon icon={showPasswordRegistro ? faEye : faEyeSlash} />
                            </span>
                        </div>
                    </div>
                    <div className="column">
                        <label>
                            Confirmar Contraseña:
                        </label>
                        <div className="password-container">
                            <input 
                                type={showPasswordRegistro ? "text" : "password"}
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}/>
                            <span className="toggle-password" onClick={togglePasswordRegistro}>
                            <FontAwesomeIcon icon={showPasswordRegistro ? faEye : faEyeSlash} />
                            </span>
                        </div>
                    </div>
                    <div className="column">
                        <h4>*Requisitos de la contraseña:</h4>
                        <h4>-Contener al menos 5 caracteres.</h4>
                        <h4>-Contener al menos una mayúscula.</h4>
                        <h4>-Incluir un número.</h4>
                        <h4>-Incluir algún símbolo especial #$%&/.</h4>
                    </div>
                </div>
                <div className="botones">
                    <button onClick={registrarUsuario}
                        disabled={isLoading}>
                        <img src={Save} alt="null"></img>
                        {isLoading ? "Guardando..." : "Guardar"}
                    </button>
                    <button onClick={closeRegistroModal}>
                        <img src={Cancel} alt="null"></img>
                        Cancelar
                    </button>
                </div>
            </div>
        </Modal>
        <Modal
            isOpen={isOpenRecuperacionModal}
            onRequestClose={closeRecuperacionModal}
            className="recuperacion-modal-suscripcion"
            >
            <h1 style={{ fontSize: "30px" }}>Recuperación de Contraseña</h1>
            <div className="container">
                <h2>Escribe tu correo electrónico:</h2>
                <input
                type="email"
                value={correoRecuperacion}
                onChange={(e) => setCorreoRecuperacion(e.target.value)}
                placeholder="Ingresa tu correo electrónico registrado"
                />
                <div className="botones">
                <button onClick={recuperarContraseña} disabled={isLoading}>
                    <img src={Pass} alt="null" />
                    {isLoading ? "Enviando..." : "Recuperar"}
                </button>
                <button onClick={closeRecuperacionModal}>
                    <img src={Cancel} alt="null" />
                    Cancelar
                </button>
                </div>
            </div>
        </Modal>
        </>
    );
};

export default Login;