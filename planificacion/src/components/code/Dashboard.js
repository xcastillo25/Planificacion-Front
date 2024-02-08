import React, { useState, useRef, useEffect } from 'react';
import '../design/Dashboard.css'; // Asegúrate de importar el archivo de estilos correspondiente

import logo from '../../assets/logo.png';
import axios from 'axios';
import Informacion from '../code/Informacion';
import Grados from '../code/Grados';
import Secciones from '../code/Secciones';
import MisSecciones from '../code/MisSecciones';
import Establecimientos from '../code/Establecimientos';
import MisAreas from '../code/MisAreas';
import MisTemas from '../code/MisTemas';
import Unidades from '../code/Unidades';
import Planificaciones from '../code/Planificaciones';
import Docentes from '../code/Docentes';

import AdminEstablecimientos from '../code/AdminEstablecimientos';
import AdminDocentes from '../code/AdminDocentes';
import AdminTemas from '../code/AdminTemas';
import AdminGrados from '../code/AdminGrados';
import AdminAreas from '../code/AdminAreas';

import { API_URL } from '../../config/config';

import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [cicloEscolar, setCicloEscolar] = useState(null);
    const [misSecciones, setMisSecciones] = useState(null);
    const [miArea, setMiArea] = useState('');
    const [miIdArea, setMiIdArea] = useState('');
    const [idArea, setIdArea] = useState('');
    const [idMiUnidad, setIdMiUnidad] = useState('');
    const id = localStorage.getItem('id_docente');
    const primerNombre = localStorage.getItem('primer_nombre');
    const primerApellido = localStorage.getItem('primer_apellido');
    const [userData, setUserData] = useState({});
    const [expiracion, setExpiracion] = useState('');
    const [restantes, setRestantes] = useState('');
    const [idGrado, setIdGrado] = useState('');

    const [plataformaVisible, setPlataformaVisible] = useState('plataformaInformacion');
    const [botonActivo, setBotonActivo] = useState('plataformaInformacion');
    
    const [asideVisible, setAsideVisible] = useState(true);
    const asideRef = useRef(null);

    const mostrarPlataforma = (plataforma) => {
        setPlataformaVisible(plataforma);
        setBotonActivo(plataforma);
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (asideRef.current && !asideRef.current.contains(event.target)) {
            setAsideVisible(false);
        }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navigate = useNavigate();

    const logout = () => {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local
    navigate('/session'); // Redirige al usuario a la página de inicio de sesión
    }

    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
      // Actualizar la fecha y la hora cada segundo
      const intervalId = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000);
  
      // Limpiar el intervalo cuando el componente se desmonta
      return () => clearInterval(intervalId);
    }, []);
  
    // Obtener partes de la fecha y la hora
    const day = String(currentDateTime.getDate()).padStart(2, '0');
    const month = String(currentDateTime.getMonth() + 1).padStart(2, '0');
    const year = currentDateTime.getFullYear();
    const hours = String(currentDateTime.getHours()).padStart(2, '0');
    const minutes = String(currentDateTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentDateTime.getSeconds()).padStart(2, '0');
  
    const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  
    const fetchPrueba = async () => {
        try {
            const response = await axios.get(`${API_URL}/calcularFechaExpiracion/${id}`);
            setUserData = response.data;
            
            console.log('Datos de prueba:', userData);
            
            // O asignarlos a variables si es necesario
            const { fechaExpiracion, diasRestantes } = userData;
            
            setExpiracion(fechaExpiracion);
            setRestantes(diasRestantes);
            
        } catch (error) {
            console.error('Error al obtener datos de prueba:', error);
        }
    };
    
       
  return (
    <div lang="en">
    <>
        <meta charSet="UTF-8"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Responsive Admin Dashboard using HTML, CSS & JavaScript</title>
        {/* <!-- MATERIAL ICONS CDN--> */}
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp"
          rel="stylesheet"/>
          {/* <!-- GOOGLE FONTS (POPPINS)--> */}
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet"/> 
        {/* <!-- STYLESHEET --> */}
    </>
    <div className="dashboard">
        <div className = "logo-container">
                <img src={logo} className="logo" alt="logo"
                title="Si no puedes cerrar sesión, presiona doble clic en la foto de perfil."/>
                <h2 className="titulo-logo">SISTEMA DE PLANIFICACIÓN ESCOLAR</h2>
                <span className="material-icons-sharp" id="menu-btn" onClick={() => setAsideVisible(!asideVisible)}
                style={{color:'gray', cursor:'pointer', marginRight:'1rem'}}>menu</span>
        </div>
        <nav>
            <div className="container">
                <div className="bienvenido">
                    <h2>Bienvenido {primerNombre} {primerApellido}</h2>
                </div>
                <div className="date">
                    <p>{formattedDateTime}</p>
                </div>
                <div className="icon-bar">
                    <span className="material-icons-sharp">notifications</span>
                    <span className="material-icons-sharp">email</span>
                </div>
            </div>
        </nav>
    
        <main>
            <aside ref={asideRef} className={asideVisible ? 'aside-visible' : 'aside-hidden'}>
                
                <div className="sidebar">
                    
                    <a href="#Información"
                        className={botonActivo === 'plataformaInformacion' ? 'active' : ''} 
                        onClick={() => mostrarPlataforma('plataformaInformacion')}>
                        <span className="material-icons-sharp">home</span>
                        <h4>Información</h4>
                    </a>

                    <a href="#Docentes"
                        className={botonActivo === 'plataformaDocentes' ? 'active' : ''} 
                        onClick={() => mostrarPlataforma('plataformaDocentes')}>
                        <span className="material-icons-sharp">person</span>
                        <h4>Mis Datos</h4>
                    </a>

                    <a href="#Establecimiento"
                        className={botonActivo === 'plataformaEstablecimiento' ? 'active' : ''} 
                        onClick={() => mostrarPlataforma('plataformaEstablecimiento')}>
                        <span className="material-icons-sharp">flag</span>
                        <h4>Establecimiento</h4>
                    </a>

                    <a href="#Grados"
                        className={botonActivo === 'plataformaGrados' ? 'active' : ''} 
                        onClick={() => mostrarPlataforma('plataformaGrados')}>
                        <span className="material-icons-sharp">filter_6</span>
                        <h4>Ciclo Escolar</h4>
                    </a>

                    <a href="#Secciones"
                        className={botonActivo === 'plataformaMisSecciones' ? 'active' : ''} 
                        onClick={() => mostrarPlataforma('plataformaMisSecciones')}>
                        <span className="material-icons-sharp">bookmarks</span>
                        <h4>Mis Secciones</h4>
                    </a>

                </div>
                {/* <!-- END OF SIDEBAR --> */}
                
                <div className="updates">
                    <a href="#Logout"id="btnlogout" onClick={logout}>
                        <span className="material-icons-sharp">logout</span>
                        <h4>Salir</h4>
                    </a>
                </div>
                
            </aside>
            
            <section className='middle'>
                {plataformaVisible === 'plataformaInformacion' && <Informacion setPlataformaVisible={setPlataformaVisible} userId={id}/>}
                {plataformaVisible === 'plataformaGrados' && <Grados userId={id}
                    setPlataformaVisible={setPlataformaVisible}
                    setCicloEscolar={setCicloEscolar}/>}
                {plataformaVisible === 'plataformaSecciones' && <Secciones userId={id} ciclo={cicloEscolar}/>}
                {plataformaVisible === 'plataformaMisSecciones' && <MisSecciones setPlataformaVisible={setPlataformaVisible}  
                    userId={id} setMisSecciones={setMisSecciones}/>}
                {plataformaVisible === 'plataformaEstablecimiento' && <Establecimientos userId={id}/>}
                {plataformaVisible === 'plataformaMisAreas' && <MisAreas setPlataformaVisible={setPlataformaVisible} userId={id}
                    seccion={misSecciones} setMisSecciones={setMisSecciones} setMiArea={setMiArea} setMiIdArea={setMiIdArea}/>}
                {plataformaVisible === 'plataformaMisTemas' && <MisTemas setPlataformaVisible={setPlataformaVisible} 
                    seccion={misSecciones} area={miArea} idArea={miIdArea} userId={id}/>}
                {plataformaVisible === 'plataformaUnidades' && <Unidades setPlataformaVisible={setPlataformaVisible} 
                    seccion={misSecciones} area={miArea} idArea={miIdArea} userId={id} setIdMiUnidad={setIdMiUnidad}/>}
                {plataformaVisible === 'plataformaPlanificaciones' && <Planificaciones setPlataformaVisible={setPlataformaVisible} 
                    seccion={misSecciones} area={miArea} idArea={miIdArea} userId={id} idMiUnidad={idMiUnidad} setIdMiunidad={setIdMiUnidad}/>}
                {plataformaVisible === 'plataformaDocentes' && <Docentes setPlataformaVisible={setPlataformaVisible} userId={id}/>}
                {plataformaVisible === 'plataformaAdminEstablecimientos' && <AdminEstablecimientos setPlataformaVisible={setPlataformaVisible}/>}
                {plataformaVisible === 'plataformaAdminDocentes' && <AdminDocentes setPlataformaVisible={setPlataformaVisible}/>}
                {plataformaVisible === 'plataformaAdminGrados' && <AdminGrados setPlataformaVisible={setPlataformaVisible} setIdGrado={setIdGrado}/>}
                {plataformaVisible === 'plataformaAdminAreas' && <AdminAreas setPlataformaVisible={setPlataformaVisible} idGrado={idGrado} setIdArea={setIdArea} setIdGrado={setIdGrado} setArea={setMiArea}/>}
                {plataformaVisible === 'plataformaAdminTemas' && <AdminTemas setPlataformaVisible={setPlataformaVisible} idGrado={idGrado} idArea={idArea} area={miArea}/>}
            </section>
    
        </main>
    
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.6.0/chart.min.js" integrity="sha512-GMGzUEevhWh8Tc/njS0bDpwgxdCJLQBWG3Z2Ct+JGOpVnEmjvNx6ts4v6A2XJf1HOrtOsfhv3hBKpK9kE5z8AQ==" crossOrigin="anonymous" referrerPolicy="no-referrer"></script>
    
        <script src="./main.js"></script>
    </div>
    </div>
  );
};

export default Dashboard;
