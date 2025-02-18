import React, {useState, useEffect} from 'react';
import '../design/Informacion.css';
import axios from 'axios';
import {API_URL} from '../../config/config';

import Primero from '../../assets/n1.png';
import Segundo from '../../assets/n2.png';
import Tercero from '../../assets/n3.png';
import Cuarto from '../../assets/n4.png';
import Quinto from '../../assets/n5.png';
import Sexto from '../../assets/n6.png';

const Informacion = ({plataforma, setPlataformaVisible, userId}) =>{
    const [userData, setUserData] = useState({});
    const [userGrados, setUserGrados] = useState({});

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_URL}/informacion/${userId}`);
            setUserData(response.data);
            // console.log("Datos", response.data);
        } catch (error) {
            // console.log(error);
        }
    }

    const fetchGrados = async () => {
        try {
            const response = await axios.get(`${API_URL}/misgrados/${userId}`);
            setUserGrados(response.data);
            // console.log("Grados", response.data);
        } catch (error) {
            // console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
        fetchGrados();
    }, [userId])

    function getGradoImage(grado) {
        switch (grado.toLowerCase()) {
          case 'primero':
            return Primero;
          case 'segundo':
            return Segundo;
          case 'tercero':
            return Tercero;
          case 'cuarto':
            return Cuarto;
          case 'quinto':
            return Quinto;
          case 'sexto':
            return Sexto;
          default:
            return null;
        }
    }

    return (
        <section className="Informacion" id="Informacion">
            <div className = "header">
                <span className="material-icons-sharp header-span title-span">home</span>
                <h1>Bienvenido al Sistema de Planificación Escolar</h1>
            </div>
            {userData.informacion && userData.informacion.length > 0 ? (
                userData.informacion.map((informacion) => (
                    <div className="informacion-content">
                        <div className="column1">
                            <h2>Código:</h2>
                            <h2>Nombre:</h2>
                            <h2>Dirección:</h2>
                            <h2>Director:</h2>
                            <h2>CTAE:</h2>
                            <h2>Distrito:</h2>
                            <h2>Area:</h2>
                            <h2>Modalidad:</h2>
                        </div>

                        <div className ="column2">
                            <h2>{informacion.codigo}</h2>
                            <h2>{informacion.establecimiento}</h2>
                            <h2>{informacion.direccion}</h2>
                            <h2>{informacion.director}</h2>
                            <h2>{informacion.ctae}</h2>
                            <h2>{informacion.distrito}</h2>
                            <h2>{informacion.area}</h2>
                            <h2>{informacion.modalidad}</h2>
                        </div>
                        
                        <div className="column1">
                            <h2>Nivel:</h2>
                            <h2>Sector:</h2>
                            <h2>Jornada:</h2>
                            <h2>Plan:</h2>
                            <h2>Ciclo:</h2>
                            <h2>Teléfono:</h2>
                            <h2>Correo:</h2>
                            <h2>Docente:</h2>
                        </div>

                        <div className ="column2">
                            <h2>43-Primaria</h2>
                            <h2>{informacion.sector}</h2>
                            <h2>{informacion.jornada}</h2>
                            <h2>Diario</h2>
                            <h2>Anual</h2>
                            <h2>{informacion.telefono}</h2>
                            <h2>{informacion.correo}</h2>
                            <h2>{informacion.primer_nombre} {informacion.segundo_nombre} {informacion.otros_nombres} {informacion.primer_apellido} {informacion.segundo_apellido}</h2>
                        </div>
                    </div>  
                ))
            ) : (
                <p style={{fontSize:'18px', textAlign:'center', color:'black', marginTop:'1rem',
                                fontWeight:'600'}}
                    >No hay datos disponibles.</p>
            )}
            <div className="informacion-grados">
                <h1>Mis Grados Disponibles:</h1>
                <div className="container">
                    {userGrados.misgrados && userGrados.misgrados.length > 0 ? (
                        userGrados.misgrados.map((misgrados) => (
                            <div key={misgrados.grado + misgrados.seccion}>
                                <h2>{misgrados.grado}</h2>
                                <h2>Sección {misgrados.seccion}</h2>
                                <h2>Ciclo Escolar: {misgrados.ciclo}</h2>
                                <img src={getGradoImage(misgrados.grado)} className="numero-grado" alt="foto-grado" />
                            </div>
                        ))
                    ): (
                        <p style={{fontSize:'18px', textAlign:'center', color:'black', marginTop:'1rem',
                                fontWeight:'600'}}
                        >No hay grados disponibles.</p>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Informacion;