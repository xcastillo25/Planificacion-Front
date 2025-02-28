import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';
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
import { FaWhatsapp, FaBook, FaYoutube } from 'react-icons/fa';

import logo from '../../assets/logo.png';
import Save from '../../assets/Save.png';
import Cancel from '../../assets/Cancel.png';
import CuentaBI from '../../assets/cuentabi.jpeg';
import Check from '../../assets/Acept.png';
import Pass from '../../assets/Pass.png';
import Send from '../../assets/Send.png';
import Log from '../../assets/Log.png';
import Suscribe from '../../assets/Suscribe.png';
import Register from '../../assets/Register.png';

Modal.setAppElement('#root');

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [aceptoTerminos, setAceptoTerminos] = useState(false);

    const [primerNombre, setPrimerNombre] = useState('');
    const [segundoNombre, setSegundoNombre] = useState('');
    const [otrosNombres, setOtrosNombres] = useState('');
    const [primerApellido, setPrimerApellido] = useState('');
    const [segundoApellido, setSegundoApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [genero, setGenero] = useState('');
    const [director, setDirector] = useState('');
    const handleChangeGenero = (e) => {setGenero(e.target.value);};
    const handleChangeDirector = (e) => {setDirector(e.target.value);};
    const handleChangeTipoPago = (e) => {setTipoPago(e.target.value);};
    const [correoSuscripcion, setCorreoSuscripcion] = useState('');
    const [passwordSuscripcion, setPasswordSuscripcion] = useState('');
    const [tipoPago, setTipoPago] = useState('');
    const [boletaPago, setBoletaPago] = useState('');
    const [correoRecuperacion, setCorreoRecuperacion] = useState('');
    const [codigoRecuperacion, setCodigoRecuperacion] = useState('');

    const { login } = useAuth();
    const history = useNavigate();
    
    const [isOpenRegistroModal, setIsOpenRegistroModal] = useState(false);
    const openRegistroModal = () => setIsOpenRegistroModal(true);
    const closeRegistroModal = () => setIsOpenRegistroModal(false);

    const [isOpenSuscripcionModal, setIsOpenSuscripcionModal] = useState(false);
    const openSuscripcionModal = () => setIsOpenSuscripcionModal(true);
    const closeSuscripcionModal = () => setIsOpenSuscripcionModal(false);

    const [isOpenRecuperacionModal, setIsOpenRecuperacionModal] = useState(false);
    const openRecuperacionModal = () => setIsOpenRecuperacionModal(true);
    const closeRecuperacionModal = () => setIsOpenRecuperacionModal(false);

    const [isOpenTerminosModal, setIsOpenTerminosModal] = useState(false);

    const openTerminosModal = () => setIsOpenTerminosModal(true);
    const closeTerminosModal = () => setIsOpenTerminosModal(false);

    const [isEntring, setIsEntring] = useState(false);
    const handleSubmit = async (e) => {
        setIsEntring(true);
        e.preventDefault();
    
        let endpoint = 'docente/login/';
        let url = `${API_URL}/${endpoint}`;
    
        try {
            const response = await axios.post(url, { correo: email, password: password });
    
            if (response && response.data) {
                const { token, id_docente, primer_nombre, segundo_nombre, otros_nombres, primer_apellido, 
                        segundo_apellido, genero, fecha_prueba, licencia } = response.data;
    
                localStorage.setItem('token', token);
                localStorage.setItem('id_docente', id_docente);
                localStorage.setItem('primer_nombre', primer_nombre);
                localStorage.setItem('segundo_nombre', segundo_nombre);
                localStorage.setItem('otros_nombres', otros_nombres);
                localStorage.setItem('primer_apellido', primer_apellido);
                localStorage.setItem('segundo_apellido', segundo_apellido);
                localStorage.setItem('genero', genero);
                localStorage.setItem('fecha_prueba', fecha_prueba);
                localStorage.setItem('licencia', licencia);

                // Usar la función login para actualizar el estado de autenticación
                login(token);
                setIsEntring(false);
                history('/home');
            } else {
                handleErrorMessage('Credenciales incorrectas.');
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

    const [showPasswordSuscripcion, setShowPasswordSuscripcion] = useState(false);
    const togglePasswordSuscripcion = () => {
        setShowPasswordSuscripcion(!showPasswordSuscripcion);
    };

    const [isLoading, setIsLoading] = useState(false);
    const registrarDocente = async () => {
        setIsLoading(true)

        if (!validarCampos()){
            setIsLoading(false);
            return;
        }

        try{
            const response = await axios.post(`${API_URL}/docente`, {
                primer_nombre: primerNombre,
                segundo_nombre: segundoNombre,
                otros_nombres: otrosNombres,
                primer_apellido: primerApellido,
                segundo_apellido: segundoApellido,
                telefono: telefono,
                correo: correo,
                password: password1,
                genero: genero,
                director: director
            });
            // console.log(response);
            handleSuccessMessage('Docente registrado con éxito.');
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

    const registrarSuscripcion = async () => {
        setIsLoading(true)

        if (!validarCamposSuscripcion()){
            setIsLoading(false);
            return;
        }

        try{
            const response = await axios.post(`${API_URL}/suscripciones`, {
                correo: correoSuscripcion,
                password: passwordSuscripcion,
                tipo_pago: tipoPago,
                boleta_pago: boletaPago,
            });
            // console.log(response);
            handleSuccessMessage('Suscripción solicitada con éxito.');
            setIsLoading(false);
            resetSuscripcion();
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
            {valor: primerNombre, nombreCampo: 'Primer Nombre'},
            {valor: primerApellido, nombreCampo: 'Primer Apellido'},
            {valor: telefono, nombreCampo: 'Telefono'},
            {valor: correo, nombreCampo: 'Correo'},
            {valor: password1, nombreCampo: 'Contraseña'},
            {valor: genero, nombreCampo: 'Genero'},
            {valor: director, nombreCampo: 'Director'}
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

    const validarCamposSuscripcion = () => {
        const camposObligatorios = [
            {valor: correoSuscripcion, nombreCampo: 'Correo'},
            {valor: passwordSuscripcion, nombreCampo: 'Contraseña'},
            {valor: tipoPago, nombreCampo: 'Tipo de Pago'}
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

    const resetRegistro = () => {
        setPrimerNombre('');
        setSegundoNombre('');
        setOtrosNombres('');
        setPrimerApellido('');
        setSegundoApellido('');
        setTelefono('');
        setCorreo('');
        setPassword1('');
        setPassword2('');
        setGenero('');
        setDirector('');
    }

    const resetSuscripcion = () => {
        setTipoPago('');
        setBoletaPago('');
        setCorreoSuscripcion('');
        setPasswordSuscripcion('');
    }

    const validarYRegistrar = async () => {
        setIsLoading(true);
        
        if (!correoRecuperacion || !codigoRecuperacion) {
          handleErrorMessage('Ambos campos (correo y código) deben estar llenos.');
          setIsLoading(false);
          return;
        }
    
        try {
          const response = await axios.post(`${API_URL}/resetPassword`, {
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
    
    const [isLoading2, setIsLoading2] = useState(false);
    const enviarCodigoAEmail = async () => {
        
        try {
          setIsLoading2(true);
          const response = await axios.post(`${API_URL}/codePassword`, { 
            correo:correoRecuperacion });
    
          // Si el correo se envía con éxito, mostrar el modal de éxito
          handleSuccessMessage('El código de recuperación ha sido enviado a tu correo.');
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
          setIsLoading2(false);
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
          const response = await axios.post(`${API_URL}/resetPassword`, { correo: correoRecuperacion });
      
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
      
    const enviarYoutube = () => {
        window.open("https://www.youtube.com/watch?v=HIKmOeiYtCU", "_blank");
    };

    const enviarWhatsapp = () => {
        const numeroWhatsapp = '+50249643635'; // Reemplaza con el número deseado
        const mensaje = 'Hola, ¿Puedes darme información sobre el Sistema de Planificación Escolar?';

        const enlaceWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;

        window.open(enlaceWhatsapp, '_blank');
    };

    return (
        <>
        <section className="Login" id="Login">
            <ToastContainer />
            <div className="login-container">
                <h1>Inicio de Sesión</h1>
                <img src={logo} alt="null">
                </img>
                <div className="credenciales">
                    <label>Correo:</label>
                    <input 
                        placeholder="Ingresa tu correo"
                        type="email"
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
                    <button onClick={openSuscripcionModal}>
                        <img src={Suscribe} alt="null"></img>
                        Suscríbete
                    </button>
                    <div className="youtube-button" title="Guía Rápida de Inicio" onClick={enviarYoutube}>
                        <FaYoutube />
                    </div>
                    <div className="book-button" title="Guía Rápida de Inicio">
                        <FaBook />
                    </div>
                    <div className="whatsapp-button" title="Conversemos por whatsapp" onClick={enviarWhatsapp}>
                        <FaWhatsapp />
                    </div>
                </div>
            </div>
        </section>
        <Modal isOpen={isOpenRegistroModal} onRequestClose={closeRegistroModal} className="login-modal-registro">
            <h1 style={{fontSize:'30px'}}>Registro de Docentes</h1>
            <div className="container">
            <h1>Datos Personales:</h1>
                <div className="datos">
                    <div className="column">
                            <label>
                                Primer Nombre:
                            </label>
                            <input 
                                value={primerNombre}
                                onChange={(e) => setPrimerNombre(e.target.value)}
                                placeholder="Ingresa el primer nombre"></input>
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
                            placeholder="Ingresa el primer apellido"></input>
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
                            placeholder="Ingresa tu correo"></input>
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
                        <h4>-Contener al menos 5 letras.</h4>
                        <h4>-Contener al menos una mayúscula.</h4>
                        <h4>-Incluir un número.</h4>
                        <h4>-Incluir algún símbolo especial #$%&/.</h4>
                    </div>
                </div>
                <div className="terminos">
                    <input
                    type="checkbox"
                    id="aceptoTerminos"
                    checked={aceptoTerminos}
                    onChange={() => setAceptoTerminos(!aceptoTerminos)}
                    />
                    <label>Acepto los</label>
                    <a href="#enlaceTerminosCondiciones" onClick={openTerminosModal}>
                        Términos y Condiciones</a>
                    <label>del servicio.</label>
                </div>
                <div className="botones">
                    <button
                    onClick={registrarDocente}
                    disabled={!aceptoTerminos || isLoading}
                    >
                    <img src={Save} alt="null" />
                    {isLoading ? "Guardando..." : "Guardar"}
                    </button>
                    <button onClick={closeRegistroModal}>
                    <img src={Cancel} alt="null" />
                    Cancelar
                    </button>
      </div>
            </div>
        </Modal>
        <Modal isOpen={isOpenSuscripcionModal} onRequestClose={closeSuscripcionModal} className="login-modal-suscripcion">
            <h1 style={{fontSize:'30px'}}>Solicitud de Suscripción</h1>
            <div className="container">
                <h1>Información:</h1>
                <div className="informacion">
                    <h2>Primero crea un usuario, luego puedes adquirir tu suscripción realizando un depósito 
                        a la cuenta de Banco Industrial o comunicarte por 
                        medio de WatsApp al número 4964-3635 para recibir información.</h2>
                    
                    <h3>Cuenta a la que puedes realizar el depósito:</h3>
                    <img src={CuentaBI} alt="null"></img>
                </div>
                <h1>Datos:</h1>
                <div className="datos">
                    <div className="column">
                        <label>
                            Tipo de Pago:
                        </label>
                        <select value={tipoPago} onChange={handleChangeTipoPago}>
                            <option value="" disabled>Selecciona...</option>
                            <option value="Deposito">Depósito</option>
                            <option value="Efectivo">Efectivo</option>
                        </select>
                    </div>
                    <div className="column">
                        <label>
                            No. de Boleta: (Si el pago es por depósito)
                        </label>
                        <input 
                            value={boletaPago}
                            onChange={(e) => setBoletaPago(e.target.value)}
                            placeholder="Ingresa la Boleta de pago"></input>
                    </div>
                    <div className="column">
                        <label>
                            Correo:
                        </label>
                        <input
                            type = "email" 
                            value={correoSuscripcion}
                            onChange={(e) => setCorreoSuscripcion(e.target.value)}
                            placeholder="Ingresa el primer nombre"></input>
                    </div>
                    <div className="column">
                        <label>
                            Contraseña:
                        </label>
                        <div className="password-container">
                            <input 
                                type={showPasswordSuscripcion ? "text" : "password"}
                                value={passwordSuscripcion}
                                onChange={(e) => setPasswordSuscripcion(e.target.value)}/>
                            <span className="toggle-password" onClick={togglePasswordSuscripcion}>
                            <FontAwesomeIcon icon={showPasswordSuscripcion ? faEye : faEyeSlash} />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="botones">
                    <button 
                    onClick={registrarSuscripcion}
                    disabled={isLoading}>
                        <img src={Check} alt="null"></img>
                        {isLoading ? "Solicitando..." : "Solicitar"}
                    </button>
                    <button onClick={closeSuscripcionModal}>
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
        <Modal
            isOpen={isOpenTerminosModal}
            onRequestClose={closeTerminosModal}
            className="login-modal-terminos"
            >
            <h1>Términos y Condiciones de Uso</h1>
            <p><strong>Fecha de entrada en vigor:</strong> Febrero de 2025.</p>
            
            <h2>1. Información General</h2>
            <p>
            Bienvenido a www.planificacionescolar.com, una herramienta diseñada para docentes 
            que permite la elaboración de planificaciones escolares basadas en el 
            Currículum Nacional Base de Guatemala. Este servicio es proporcionado por 
            TonyGames, con sede en Guatemala. Al acceder y utilizar esta plataforma, el 
            usuario acepta los presentes términos y condiciones.
            </p>
            
            <h2>2. Suscripción y Pagos</h2>

            <p>-La suscripción anual tiene un costo de Q.250.00.</p>
            <p>-Solo se ofrece una suscripción anual en la actualidad.</p>
            <p>-La renovación de la suscripción debe realizarse manualmente.</p>
            <p>-Se ofrece un mes de prueba gratuito para nuevos usuarios.</p>
            <p>-Métodos de pago aceptados: transferencia bancaria, depósito y efectivo.</p>
            <p>-No se ofrecen reembolsos bajo ninguna circunstancia.</p>
            <p>
            -Los precios pueden cambiar en futuras renovaciones, notificándose 
            previamente a los usuarios.
                </p>
       
            <h2>3. Uso de la Plataforma</h2>
         
                <p>
                Aunque la plataforma está diseñada para docentes, puede ser utilizada por 
                otras personas con fines educativos.
                </p>
                <p>
                La funcionalidad principal es la creación de planificaciones educativas 
                en formato PDF.
                </p>
                <p>
                Los usuarios pueden compartir sus contenidos con otros dentro de la 
                plataforma, pero cada usuario es responsable de sus creaciones.
                </p>
                <p>
                Los documentos generados en PDF pertenecen al usuario, pero las 
                planificaciones almacenadas en la base de datos pueden ser utilizadas como 
                sugerencias para otros.
                </p>
                <p>Se permite la descarga e impresión de los contenidos generados.</p>
                <p>
                La suscripción permite su uso en un solo establecimiento educativo, aunque 
                el docente puede gestionar varios grados y secciones.
                </p>
  
            
            <h2>4. Responsabilidades y Garantías</h2>
            
                <p>
                Se garantiza el acceso continuo a la plataforma, salvo interrupciones por 
                mantenimiento o fallos del proveedor de hosting (smarterasp.net).
                </p>
                <p>
                No se ofrecen compensaciones por caídas del sistema, pero se proporcionará 
                soporte técnico en caso de problemas.
                </p>
                <p>
                Se prohíbe compartir credenciales o realizar un uso fraudulento de la 
                plataforma. En caso de incumplimiento, la cuenta será cancelada sin 
                derecho a reembolso ni recuperación de material almacenado.
                </p>
            
            <h2>5. Propiedad Intelectual</h2>
            
                <p>
                El contenido generado por los usuarios en formato PDF les pertenece, 
                pero la plataforma puede utilizar las planificaciones almacenadas en su 
                base de datos como referencia.
                </p>
                <p>
                El código, diseño y estructura de la plataforma son propiedad de 
                TonyGames y están protegidos por derechos de autor.
                </p>
                <p>No se permite la reproducción ni venta del material generado.</p>
                <p>Los docentes no pueden compartir el contenido fuera de la plataforma.</p>
            
            
            <h2>6. Privacidad y Protección de Datos</h2>
            
                <p>
                Se recopilan datos personales no sensibles, como nombre, apellidos, 
                teléfono y correo electrónico, y datos laborales como nombre del 
                establecimiento y dirección.
                </p>
                <p>No se solicitan datos bancarios ni información de menores de edad.</p>
                <p>
                Los datos se almacenan en smarterasp.net bajo sus estándares de seguridad.
                </p>
                <p>No se comparte información con terceros.</p>
                <p>Los usuarios pueden solicitar la eliminación de sus datos y cuenta en cualquier momento.</p>
            
            
            <h2>7. Restricciones y Sanciones</h2>
            
                <p>
                Está prohibido el uso indebido de la plataforma, como spam, intentos de 
                hacking o compartir credenciales.
                </p>
                <p>
                Si un usuario infringe las reglas, su cuenta puede ser eliminada de forma 
                permanente sin derecho a reembolso.
                </p>
                <p>
                En caso de suspensión de cuenta, el usuario deberá resolver la situación 
                para recuperar el acceso.
                </p>
            
            <h2>8. Modificaciones a los Términos y Condiciones</h2>
            
                <p>
                Cualquier cambio en estos términos será notificado a los usuarios 
                mediante correo electrónico.
                </p>
                <p>No se requiere aceptar nuevamente los términos para continuar utilizando la plataforma.</p>
            
            
            <p>
                Para cualquier duda o consulta, contáctenos al correo: <strong>tonygames25000@gmail.com</strong> y/o al 
                Whatsapp: <strong>49643635</strong>.<br />
            </p>
            <p>
            <strong>TonyGames</strong>
            </p>
            <p><strong>www.planificacionescolar.com</strong>
            </p>

            <button 
                style={{ 
                margin: "1rem", 
                padding: "0.5rem 1rem", 
                fontSize: "16px", 
                cursor: "pointer",
                background: "linear-gradient(to right, #3fe715, #befa79)",
                border: "1px solid black",
                borderRadius: "6px"
                }}
                onClick={closeTerminosModal}
            >
                Cerrar
            </button>
            </Modal>

        </>
    );
};

export default Login;