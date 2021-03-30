import './NavBar.css';
import {Navbar, NavbarBrand} from 'reactstrap';
//import {Navbar, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap';
//import {Link} from 'react-router-dom';
import React from 'react';
import iconError from './error.png'

function NavBar() {
    return (
        <Navbar id="NavBar">
                <NavbarBrand>
                  <h1>
                  Simbiotica
                  </h1>
                  <div id='errorBtn' className='button' onClick={()=>document.getElementById('modalBtn').click()}>
                    <img id='iconError' src={iconError} alt=''/>
                  </div>
                </NavbarBrand>
                {/*
                <Nav>
                    <NavItem>
                        <NavLink tag={Link} to="/inferencia">Inferencia</NavLink>
                    </NavItem>
                    <NavItem>
                    <NavLink tag={Link} to="/etiquetado">Etiquetado</NavLink>
                    </NavItem>
                    <NavItem>
                    <NavLink tag={Link} to={"/logout"}>Logout</NavLink>
                    </NavItem>
                </Nav>
                */}
        </Navbar>
    );
}

export default NavBar;
