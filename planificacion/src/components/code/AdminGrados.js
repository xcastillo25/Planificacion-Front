import React, {useState, useEffect} from 'react';
import '../design/AdminGrados.css';
import axios from 'axios';
import { API_URL } from '../../config/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Search from '../../assets/Search.png';
import Modal from 'react-modal';
import Edit from '../../assets/Pencil.png';
import Cancel from '../../assets/Cancel.png';

import Primero from '../../assets/n1.png';
import Segundo from '../../assets/n2.png';
import Tercero from '../../assets/n3.png';
import Cuarto from '../../assets/n4.png';
import Quinto from '../../assets/n5.png';
import Sexto from '../../assets/n6.png';

Modal.setAppElement('#root');

const AdminGrados = ({plataforma, setPlataformaVisible, setIdGrado}) => {
    
    const [userGrados, setUserGrados] = useState([]);

    const fetchGrados = async () => {
        try {
            const response = await axios.get(`${API_URL}/grados`);
            setUserGrados(response.data);
            console.log("Grados", response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchGrados();
    }, [])

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
        <>
        <section className="AdminEstablecimientos" id="AdminEstablecimientos">
            <ToastContainer />
            <div className = "header">
                <span className="material-icons-sharp header-span title-span">book</span>
                <h1>Administración de Grados</h1>
            </div>
            <div className="admin-grados-container">
                <div className="grados">
                {userGrados.grados && userGrados.grados.length > 0 ? (
                        userGrados.grados.map((grados) => (
                            <div key={grados.id_grado} className='grado'>
                                <h1>{grados.grado}</h1>
                                <img src={getGradoImage(grados.grado)} className="numero-grado" alt="foto-grado" />
                                <div>
                                    <button className = "boton1"
                                    type = "button"
                                    onClick={() => { setIdGrado(grados.id_grado)
                                        setPlataformaVisible('plataformaAdminAreas');
                                    }}>
                                        Administrar
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
        </>
    );
}

export default AdminGrados;