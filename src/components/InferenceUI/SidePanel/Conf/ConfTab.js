import React from 'react';

import './ConfTab.css'

import {listDevices} from './../functions.js'

import logoFlipH from './flipH_2.png'
import logoFlipV from './flipV_2.png'
import logoResetFlip from './reset_image.png'


export function ConfigTab(props){
  return(
		<div id="configTab" className='tabBody'>
      <table className = "tableDefault fullSpace">
        <tbody className ="fullSpace">
  
          <tr>
            <td colSpan="5" style={{}}>
              <div>Seleccione dispositivo:</div>
            </td>
            <td colSpan="5"> 
  		          <select id="videoSelectConf"/>
            </td>
            <td colSpan="2">
  			        <div onClick={()=>{props.superElement.props.setStreamFromConfig()}}
                     id="selectSrcBtn"
                     className='button'
                >Ok</div>
            </td>
            <td colSpan="1">
      	    <span id="RefreshBtn"
                    onClick={()=>listDevices()}
                    >
  				    <i className="fas fa-sync-alt"></i>
  			    </span>
  
            </td>
          </tr>
  
  
          <tr style={{height: "5%"}}/>
  
          <tr style={{height:"0.2vw"}} className='c_division'>
            <td colSpan="13"/> 
          </tr>
  
          <tr style={{height: "5%"}}/>
  
          <tr>
            <td colSpan="13">
              <div>Orientación de la imagen:</div>
            </td>
          </tr>
  
          <tr style={{height: "2%"}}/>
  
          <tr>
            <td colSpan="2"/>
            <td colSpan="2">
  				    <div id="mirrorHBtn" onClick={()=>{props.superElement.props.mirror("horizontal")}}>
                <img src={logoFlipH} alt="Video" style={{width: "100%"}}/>
              </div>
            </td>
            <td colSpan="9">
              <div>Reflejar horizontalmente</div>
            </td>
          </tr>
  
          <tr>
            <td colSpan="2"/>
            <td colSpan="2">
  				    <div id="mirrorVBtn" onClick={()=>{props.superElement.props.mirror("vertical")}}>
                <img src={logoFlipV} alt="Video" style={{width: "100%"}}/>
              </div>
            </td>
            <td colSpan="9">
              <div>Reflejar verticalmente</div>
            </td>
          </tr>
  
          <tr>
            <td colSpan="2"/>
            <td colSpan="2">
  				    <div id="mirrorRstBtn" onClick={()=>{props.superElement.props.mirror("reset")}}>
                <img src={logoResetFlip} alt="Video" style={{width: "100%"}}/>
              </div>
            </td>
            <td colSpan="9">
              <div>Restablecer</div>
            </td>
          </tr>
  
          <tr style={{height: "5%"}}/>
  
          <tr style={{height: "0.2vw"}} className='c_division'>
            <td colSpan="13"/> 
          </tr>
  
          <tr style={{height: "5%"}}/>
  
          <tr>
            <td colSpan="5">
              <div>Cuenta regresiva desde: </div>
            </td>
            <td colSpan="5">
              <input  type="number" id="countdownFromInput" min="1" max="20"/> 
            </td>
          </tr>
  
          <tr style={{height: "20%"}}> 
          </tr>
        </tbody>
      </table>
		</div>
    
  );
}
export default ConfigTab;
