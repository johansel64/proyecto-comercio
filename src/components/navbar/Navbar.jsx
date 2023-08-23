import React, {useState} from 'react';
import styled from 'styled-components';
import BurguerButton from './BurguerButton';
import { useAuth } from "../../context/AuthContext";
import { Logout } from '@mui/icons-material';


function Navbar(){
    const auth = useAuth();
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        setClicked(!clicked);
    }

    const handleLogout = async () => {
        await auth.logout(); 
        sessionStorage.removeItem('userData');
    }
    return (
        <>
            <NavbarContainer>
                <h2>CONTROL <span>ACTIVOS</span></h2>
                <div className={`links ${clicked ? 'active' : ''}`}>
                    <a onClick={handleClick} href="/departamentos">Departamentos</a>
                    <a onClick={handleClick} href="/departamentos/funcionarios">Funcionarios</a>
                    <a onClick={handleClick} href="/departamentos/activos">Activos</a>
                    <a onClick={ () => handleLogout() } href="/"><Logout style={{ height: '18px', color: 'red'}} /></a>

                </div>
                <div className="burguer">
                    <BurguerButton clicked={clicked} handleClick={handleClick} />
                </div>
                <BgDiv className={`initial ${clicked ? 'active' : ''}`}></BgDiv>
            </NavbarContainer>
        </>
    )
}

export default Navbar;
const NavbarContainer = styled.nav`
    h2{
        color: white;
        font-weight: 400;
        span{
            font-weight: bold;
        }
    }
    padding: .4rem;
    z-index: 3;
    background-color: #333;
    display: flex;
    align-items: center;
    justify-content: space-between;

    a{
        color: white;
        text-decoration: none;
        margin-right: 1rem;
    }
    
    .links{
        position: absolute;
        top: -700px;
        left: -2000px;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        transition: all 0.8s ease;
        a{
            color: white;
            font-size: 2rem;
            display: block;
        }
        @media (min-width: 768px){
            position: initial;
            z-index: 15;
            margin: 0;
            a{
                font-size: 1rem;
                color: white;
                display: inline;
            }
        }
    }
    .links.active{
        width: 100%;
        display: block;
        position: absolute;
        margin-left: auto;
        margin-right: auto;
        z-index: 15;
        top: 30%;
        left: 0;
        right: 0;
        text-align: center;
        a{
            font-size: 2rem;
            margin-top: 1rem;
            color: white;
        }
    }
    .burguer{
        @media (min-width: 768px){
            display: none;
        }
    }
`

const BgDiv = styled.div`
    background-color: #222;
    position: absolute;
    top: -1000px;
    left: -1000px;
    width: 100%;
    height: 100%;
    z-index: -1;
    transition: all 0.7s ease;
    &.active{
        border-radius: 0 0 30% 0;
        margin-top: 4.5rem; 
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index:2;
    }
`