import React, {useEffect, useState} from 'react';
import '../design/MisAreas.css';
import axios from 'axios';
import { API_URL } from '../../config/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import L1 from '../../assets/l1.png';
import L2 from '../../assets/l2.png';
import L3 from '../../assets/l3.png';
import Mt from '../../assets/mt.png';
import Cn from '../../assets/cn.png';
import Cs from '../../assets/cs.png';
import Ea from '../../assets/ea.png';
import Fc from '../../assets/fc.png';
import Ef from '../../assets/ef.png';
import Pd from '../../assets/pd.png';

const MisAreas=({plataforma, setPlataformaVisible, userId, seccion, setMisSecciones, setMiArea, setMiIdArea}) => {

    const [tituloSeleccionado, setTituloSeleccionado] = useState('');
    const [area, setArea] = useState('');
    const [idArea, setIdArea] = useState('');
    const [botonesVisibles, setBotonesVisibles] = useState(true);

    const fetchCiclo =() => {
        switch(seccion.grado.toLowerCase()){
            case 'primero' :
                return setBotonesVisibles(true);
            case 'segundo':
                return setBotonesVisibles(true);
            case 'tercero':
                return setBotonesVisibles(true);
            case 'cuarto':
                return setBotonesVisibles(false);
            case 'quinto':
                return setBotonesVisibles(false);
            case 'sexto':
                return setBotonesVisibles(false);
            default:
                return null;
        }
    }

    useEffect(() => {
        fetchCiclo();
    }, []);
        
    const seleccionarTitulo = (titulo) => {
        setTituloSeleccionado(titulo);
    }
      
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

    return (
        <section className="Areas" id="Areas">
            <ToastContainer />
            <div className ="header">
                <span className="material-icons-sharp header-span title-span">hive</span>
                <h1>Mis Areas y Subáreas</h1>
            </div>
            <div className="areas-titulo">
                <h1>{seccion.grado} {seccion.seccion}</h1>
            </div>
            <h1>Selecciona un Área o Subárea:</h1>
            <div className="areas-container">
                {botonesVisibles && (
                    <div className="areas">
                        <div onClick={() => {seleccionarTitulo('Comunicación y Lenguaje L1'); setArea('Comunicación y Lenguaje L1'); setIdArea(1)}}>
                            <img src={L1} alt="l1" className="areas-logo"></img>
                            Comunicación y Lenguaje L1
                        </div>
                        <div onClick={() => {seleccionarTitulo('Comunicación y Lenguaje L2'); setArea('Comunicación y Lenguaje L2'); setIdArea(2)}}>
                            <img src={L2} alt="l2" className="areas-logo"></img>
                            Comunicación y Lenguaje L2
                        </div>
                        <div onClick={() => {seleccionarTitulo('Comunicación y Lenguaje L3'); setArea('Comunicación y Lenguaje L3'); setIdArea(3)}}>
                            <img src={L3} alt="l3" className="areas-logo"></img>
                            Comunicación y Lenguaje L3
                        </div>
                        <div onClick={() => {seleccionarTitulo('Matemáticas'); setArea('Matemáticas'); setIdArea(4)}}>
                            <img src={Mt} alt="mt" className="areas-logo"></img>
                            Matemáticas
                        </div>
                        <div onClick={() => {seleccionarTitulo('Ciencias Naturales y Tecnología'); setArea('Ciencias Naturales y Tecnología'); setIdArea(5)}}>
                            <img src={Cn} alt="cn" className="areas-logo"></img>
                            Medio Social y Natural
                        </div>
                        <div onClick={() => {seleccionarTitulo('Expresión Artística'); setArea('Expresión Artística'); setIdArea(6)}}>
                            <img src={Ea} alt="ea" className="areas-logo"></img>
                            Epresión Artística
                        </div>
                        <div onClick={() => {seleccionarTitulo('Educación Física'); setArea('Educación Física'); setIdArea(7)}}>
                            <img src={Ef} alt="ef" className="areas-logo"></img>
                            Educación Física
                        </div>
                        <div onClick={() => {seleccionarTitulo('Formación Ciudadana'); setArea('Formación Ciudadana'); setIdArea(8)}}>
                            <img src={Fc} alt="fc" className="areas-logo"></img>
                            Formación Ciudadana
                        </div>
                    </div>
                )}

                {!botonesVisibles && (
                    <div className="areas">
                        <div onClick={() => {seleccionarTitulo('Comunicación y Lenguaje L1'); setArea('Comunicación y Lenguaje L1'); setIdArea(9)}}>
                            <img src={L1} alt="l1" className="areas-logo"></img>
                            Comunicación y Lenguaje L1
                        </div>
                        <div onClick={() => {seleccionarTitulo('Comunicación y Lenguaje L2'); setArea('Comunicación y Lenguaje L2'); setIdArea(10)}}>
                            <img src={L2} alt="l2" className="areas-logo"></img>
                            Comunicación y Lenguaje L2
                        </div>
                        <div onClick={() => {seleccionarTitulo('Comunicación y Lenguaje L3'); setArea('Comunicación y Lenguaje L3'); setIdArea(11)}}>
                            <img src={L3} alt="l3" className="areas-logo"></img>
                            Comunicación y Lenguaje L3
                        </div>
                        <div onClick={() => {seleccionarTitulo('Matemáticas'); setArea('Matemáticas'); setIdArea(12)}}>
                            <img src={Mt} alt="mt" className="areas-logo"></img>
                            Matemáticas
                        </div>
                        <div onClick={() => {seleccionarTitulo('Ciencias Naturales y Tecnología'); setArea('Ciencias Naturales y Tecnología'); setIdArea(13)}}>
                            <img src={Cn} alt="cn" className="areas-logo"></img>
                            Ciencias Naturales y Tecnología
                        </div>
                        <div onClick={() => {seleccionarTitulo('Ciencias Sociales'); setArea('Ciencias Sociales'); setIdArea(14)}}>
                            <img src={Cs} alt="cs" className="areas-logo"></img>
                            Ciencias Sociales
                        </div>
                        <div onClick={() => {seleccionarTitulo('Expresión Artística'); setArea('Expresión Artística'); setIdArea(15)}}>
                            <img src={Ea} alt="ea" className="areas-logo"></img>
                            Epresión Artística
                        </div>
                        <div onClick={() => {seleccionarTitulo('Educación Física'); setArea('Educación Física'); setIdArea(16)}}>
                            <img src={Ef} alt="ef" className="areas-logo"></img>
                            Educación Física
                        </div>
                        <div onClick={() => {seleccionarTitulo('Formación Ciudadana'); setArea('Formación Ciudadana'); setIdArea(17)}}>
                            <img src={Fc} alt="fc" className="areas-logo"></img>
                            Formación Ciudadana
                        </div>
                        <div onClick={() => {seleccionarTitulo('Productividad y Desarrollo'); setArea('Productividad y Desarrollo'); setIdArea(18)}}>
                            <img src={Pd} alt="pd" className="areas-logo"></img>
                            Productividad y Desarrollo
                        </div>
                    </div>
                )}
                
                <div className= "titulos">
                    <h1>{tituloSeleccionado}</h1>
                    <div className= "botones">
                    <button onClick={() => {
                        if (!area) {
                            handleErrorMessage('Selecciona un área o subárea antes de continuar.');
                            return;
                        }
                        setPlataformaVisible('plataformaMisTemas');
                        setMisSecciones(seccion);
                        setMiArea(area);
                        setMiIdArea(idArea);}}>
                        Temas
                    </button>
                    <button onClick={() => {
                        if (!area) {
                            handleErrorMessage('Selecciona un área o subárea antes de continuar.');
                            return;
                        }
                        setPlataformaVisible('plataformaUnidades');
                        setMisSecciones(seccion);
                        setMiArea(area);
                        setMiIdArea(idArea);}}>
                            Planificación
                    </button>
                    </div>
                </div>
            </div>
            <div className="areas-sub">
                <h1>Currículum Nacional Base</h1>
            </div>
        </section>
    );
};

export default MisAreas;