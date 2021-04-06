import ConfigTab from './Conf/ConfTab.js'
import DiagnosisTab from './Diagnosis/DiagnosisTab.js'
import ResultsTab from './Results/ResultsTab.js'
import SymptomsTab from './Symptoms/SymptomsTab.js'

import './SidePanelWrapper.css'
import { Button } from 'reactstrap';
import React, {useState} from 'react';
import {listDevices, setGallery2, galleryPrev, galleryNext, hideSidePanel, showSidePanel, changeTab} from './functions.js'
import {getSysDetails} from './getNavDetais.js'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import iconShowPanel from './showPanel.png'

class SidePanel extends React.Component{
	constructor(props){
		super(props);
		this.state = {
		}

    this.infoReady= this.infoReady.bind(this);

  }

  

  listDevices(){
    listDevices();
  }
  setGallery2(){
    setGallery2(this.props);
  }
  componentDidMount(){
    listDevices();
    changeTab(1, this.props.setTabOn, this.props.currentState);
  }
  
  galleryCtrl(dir, galleryIndxSh, gallerySrc, newPhoto, selectedPhoto){
    if(dir.localeCompare('prev') === 0){
      galleryPrev(galleryIndxSh, gallerySrc, newPhoto, selectedPhoto);
    }
    else if(dir.localeCompare('next') === 0){
      galleryNext(galleryIndxSh, gallerySrc, newPhoto, selectedPhoto);
    }
  }
  hideSidePanel(){
    hideSidePanel(this);
  }
  infoReady(){
    //to test without requirements, comment line 62 (formIsFull=false) anda change line 70 from 'else if(-)' to if(-)
    let checkboxes = document.getElementsByClassName('CB');
    let formIsFull = true;
    //check in pairs
    for (let i=0; i< checkboxes.length; i+=2){
      //either in the pair is checked
      if(!(checkboxes[i].checked || checkboxes[i+1].checked)){
        //if the one not checked doesnt need to be ecause disabled
        if(!(checkboxes[i].id.localeCompare('leftEar') === 0 && document.getElementById('no_earSurgery').checked)){
          formIsFull = false;
        }
      }
    }
    if(!formIsFull ||
        (document.getElementById('yes_earSurgery').checked && !document.getElementById('whichSurg').value) ||
        !document.getElementById('birthDateInput').value ||
        document.getElementById('rutInput').value.length !== 9){
      document.getElementById('incompleteFormWarning').style.display = 'block';
     
    }
		else if(formIsFull){
			let data = new Array(26);
			let date = new Date();
      let month = date.getMonth() +1;
      data[0] = date.getFullYear() + '-' + month + '-' +date.getDate();
      data[1] = document.getElementById('caseNumber').innerHTML;
      data[2] = '';
      data[3] = document.getElementById('rutInput').value;
      data[4] = document.getElementById('birthDateInput').value;
      data[5] = (document.getElementById('sexoF').checked)? 'femenino': (document.getElementById('sexoM').checked)? 'masculino': 'none';
			let index = 6;
			let checkboxes = document.getElementsByClassName('CB');
			for(let i=2; i<28; i +=2){
				if(checkboxes[i].checked){
					data[index] = 'Si';
				}
				else{
					data[index] = 'No';	
				}
				if(i === 4){
					data[8] = (document.getElementById('whichSurg').value)? document.getElementById('whichSurg').value : 'N/A'; 
					data[9] = (document.getElementById('leftEar').checked)? 'izquierdo' : 
	  								(document.getElementById('rightEar').checked)? 'derecho' : 'N/A';
					index= 10;
				}
				else if(i > 13 ){
					index += 2;
				}
				else{
					index++;
				}
			}
			let levels = document.getElementsByClassName('symptomsLevel');
			index = 15;
			for(let i = 0; i < 6; i++){
				data[index] = (data[index-1].localeCompare('No') === 0)? 'N/A': levels[i].value;
				index+=2;
			}
			this.props.setAcqInfo(data);
      this.props.setTabOn(2);
      listDevices();
    }
  }
  render(){
		return(
			<div>
        {!this.props.currentState.hideSidePanel && 
			    <div id="sidePanel_Wrapper">
            <Tabs tabOn={this.props.currentState.tabOn}
                 	currentState={this.props.currentState}
                  setTabOn={this.props.setTabOn}
            />
				    <TabsBody
										superElement={this}
                 		currentState={this.props.currentState}
                    gallerySrc={this.props.gallerySrc}
                    setGalleryIndxShowing={this.props.setGalleryIndxShowing}
                    setSelectedGalleryPhoto={this.props.setSelectedGalleryPhoto}
                    selectedGalleryPhoto = {this.props.currentState.selectedGalleryPhoto}
                    infoReady={this.infoReady}
                    setAcqInfo = {this.props.setAcqInfo} 
            />
						<ModalError className=''/>
					</div>}

        {this.props.currentState.hideSidePanel && 
          <div id="showSidePanel"  onClick={()=>{showSidePanel(this)}}>
            <img id='iconShowPanel' src={iconShowPanel} alt=''/>
          </div>
        }
			</div>
		);
	}
}
//function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms));}
function TabsBody(props) {
  if(props.currentState.tabOn === 1){
    return(
      <SymptomsTab  infoReady={props.infoReady}
                    />
    );
  }
  else if(props.currentState.tabOn === 2){
    return(
			<ConfigTab superElement={props.superElement} className='tabBody'/>
    );
  }
  else if(props.currentState.tabOn === 3){
    return(
      <ResultsTab gallerySrc={props.gallerySrc} 
                  galleryIndxSh={props.currentState.GalleryIndexShowing}
                  setGalleryIndxShowing={props.setGalleryIndxShowing}
                  setSelectedGalleryPhoto={props.setSelectedGalleryPhoto}
                  selectedPhoto = {props.currentState.selectedGalleryPhoto}
                  selectedGalleryPhoto = {props.selectedGalleryPhoto}
                  currentStateName= {props.currentState.stateName}
                  />
    );
  }
  else if(props.currentState.tabOn === 4){
    return(
      <DiagnosisTab superElement={props.superElement} 
                    setAcqInfo = {props.setAcqInfo} 
      />
    );
  }
  else{
    return(
      <div>
      <p>Error</p>
      </div>
    );
  }
}
function Tabs(props){
  return(
    <div id='tabs'>
      <div id='symptomsTab' className='tab'
           onClick={()=>changeTab(1, props.setTabOn, props.currentState)}>
          Síntomas
      </div>
      <div id='confTab' className='tab' 
           onClick={()=>changeTab(2, props.setTabOn, props.currentState)}>
          Configuraciones
      </div>
      <div id='resultsTab' className='tab'
           onClick={()=>changeTab(3, props.setTabOn, props.currentState)}>
        Resultados de  Examinación  
      </div>
      <div id='diagnosisTab' className='tab'
           onClick={()=>changeTab(4, props.setTabOn, props.currentState)}>
        Diagnóstico
      </div>
    </div>
  );
}

const ModalError = (props) => {
  const {
    className
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <div id='modalBtn' className='button' onClick={toggle}>Error</div>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Reporte de errores</ModalHeader>
        <ModalBody>
					<p>¿Qué pasó?</p>
        	<textarea id='ErrorBox' cols="40" rows="3"></textarea>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={getSysDetails}>Descargar</Button>
          <Button color="secondary" onClick={toggle}>Cerrar</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
export default SidePanel;
