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

const MisSecciones =({plataforma, setPlataformaVisible, userId, setMisSecciones}) => {
    const [userGrados, setUserGrados] = useState({});

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
        <section className = "MisSecciones" id = "MisSecciones">
            <div className ="header">
                <span className="material-icons-sharp header-span title-span">bookmarks</span>
                <h1>Mis Secciones Activas</h1>
            </div>
            <div className="secciones-container">
                <h1>Mis Grados y Secciones:</h1>
                <div className="secciones-grados">
                    {userGrados.misgrados && userGrados.misgrados.length > 0 ? (
                        userGrados.misgrados.map((misgrados) => (
                            <div key={misgrados.id_grado} className='grado'>
                                <h2>{misgrados.grado}</h2>
                                <h2>Sección {misgrados.seccion}</h2>
                                <h2>Ciclo Escolar: {misgrados.ciclo}</h2>
                                <img src={getGradoImage(misgrados.grado)} className="numero-grado" alt="foto-grado" />
                                <div>
                                    <button className = "boton1"
                                    type = "button"
                                    onClick={() => {
                                        setPlataformaVisible('plataformaMisAreas');
                                        setMisSecciones(misgrados);
                                    }}>
                                        Planificar
                                    </button>
                                </div>
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
};
export default MisSecciones;