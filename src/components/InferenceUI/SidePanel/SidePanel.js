import ConfigTab from './Conf/ConfTab.js'
import DiagnosisTab from './Diagnosis/DiagnosisTab.js'
import ResultsTab from './Results/ResultsTab.js'
import ReportTab from './Report/ReportTab.js'

import './SidePanelWrapper.css'
import { Button } from 'reactstrap';
import React, {useState} from 'react';
import {listDevices, setGallery2, galleryPrev, galleryNext, hideSidePanel, showSidePanel, changeTab} from './functions.js'
import {getSysDetails} from './getNavDetais.js'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import frame138 from './Diagnosis/MaterialDiagnostico/frame138.png'
import frame302 from './Diagnosis/MaterialDiagnostico/frame302.png'
import frame1282 from './Diagnosis/MaterialDiagnostico/frame1282.png'
import iconShowPanel from './showPanel.png'
import "jspdf/dist/polyfills.es.js";

class SidePanel extends React.Component{
	constructor(props){
		super(props);
		this.state = {
      showDiagnosisImg: false,
      diagnosisImgOnModal: 0,
      //should be initialized empty. Diagnosis and frames sent by server should be stored here in this format. Max 6 for report
      diagnosisImgs: [[frame138,'Diagnostico 1'],
                      [frame302,'Diagnostico 2'],
                      [frame1282,'Diagnostico 3'],
                      [frame302,'Diagnostico 4'],
                      [frame138,'Diagnostico 5']],
      //index of first image on left side diagnosis
      diagnosisIndex: 0

		}
    this.pdfSrc=null;

    this.setShowDiagnosisImg= this.setShowDiagnosisImg.bind(this);
    this.reportReady= this.reportReady.bind(this);
    this.setDiagnosisIndex= this.setDiagnosisIndex.bind(this);
  }

  
  downloadHandler(media){
    this.props.downloadHandler(media);
  }

  listDevices(){
    listDevices();
  }
  setGallery2(){
    setGallery2(this.props);
  }
  componentDidMount(){
    listDevices();
    document.getElementById("countdownFromInput").value="1";
    changeTab(1, this.props.setTabOn, this.props.currentState);
  }
  saveCanvasDim(w,h){
    this.props.saveCanvasDim(w,h);
  }
  getCanvasDim(){
    return this.props.getCanvasDim();
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
  setDiagnosisImgOnModal(value){
    this.setState({diagnosisImgOnModal: value});
  }
  setShowDiagnosisImg(value,indx){
    this.setState({showDiagnosisImg: value},()=>{
      if(value){
        document.getElementById('d_modalImg').src = document.getElementById('diagnosisImg'+indx).src;
        document.getElementById('d_modalImgTag').innerHTML = document.getElementById('d_ImgTag'+indx).innerHTML;
      }
    });
    this.setDiagnosisImgOnModal(indx);
  }
  setPdfSrc(pdf){
    console.log('setpdf');
    this.pdfSrc=pdf;
  }
  reportReady(){
    this.props.setTabOn(4);
  }
  setDiagnosisIndex(indx){
    if(this.state.diagnosisImgs.length >= indx+4 && indx >= 0 ){
      this.setState({diagnosisIndex: indx});
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
                 		downloadHandler={(media)=> this.downloadHandler(media)}
                 		currentState={this.props.currentState}
                    gallerySrc={this.props.gallerySrc}
                    setGalleryIndxShowing={this.props.setGalleryIndxShowing}
                    setSelectedGalleryPhoto={this.props.setSelectedGalleryPhoto}
                    selectedGalleryPhoto = {this.props.currentState.selectedGalleryPhoto}
										superElement={this}
                    showDiagnosisImg = {this.state.showDiagnosisImg}
                    setShowDiagnosisImg = {this.setShowDiagnosisImg}
                    pdfSrc={this.pdfSrc}
                    setPdfSrc={(pdf)=>this.setPdfSrc(pdf)}
                    diagnosisImgOnModal={this.state.diagnosisImgOnModal}
                    setDiagnosisImgOnModal={(value)=>this.setDiagnosisImgOnModal(value)}
                    diagnosisImgs={this.state.diagnosisImgs}
                    diagnosisIndex={this.state.diagnosisIndex}
                    setDiagnosisIndex={this.setDiagnosisIndex}
                    reportReady ={this.reportReady}
            />
						<ModalError className=''/>

            {/*!this.props.currentState.isVideoLoading  &&  this.props.currentState.renderCanvas &&
              <div id="hideSidePanel"  onClick={()=>this.hideSidePanel()}>
                <img id='iconHidePanel' src={iconHidePanel} alt=''/>
              </div>}
              */}
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

function TabsBody(props) {
  if(props.currentState.tabOn === 1){
    return(
			<ConfigTab superElement={props.superElement} className='tabBody'/>
    );
  }
  else if(props.currentState.tabOn === 2){
    return(
      <ResultsTab gallerySrc={props.gallerySrc} 
                  galleryIndxSh={props.currentState.GalleryIndexShowing}
                  setGalleryIndxShowing={props.setGalleryIndxShowing}
                  setSelectedGalleryPhoto={props.setSelectedGalleryPhoto}
                  selectedPhoto = {props.currentState.selectedGalleryPhoto}
                  downloadHandler = {props.downloadHandler}
                  selectedGalleryPhoto = {props.selectedGalleryPhoto}
                  currentStateName= {props.currentState.stateName}
                  />
    );
  }
  else if(props.currentState.tabOn === 3){
    return(
      <DiagnosisTab superElement={props.superElement} 
                    showDiagnosisImg = {props.showDiagnosisImg}
                    setShowDiagnosisImg = {props.setShowDiagnosisImg}
                    setPdfSrc = {props.setPdfSrc}
                    diagnosisImgOnModal={props.diagnosisImgOnModal}
                    setDiagnosisImgOnModal={props.setDiagnosisImgOnModal}
                    diagnosisImgs = {props.diagnosisImgs}
                    diagnosisIndex = {props.diagnosisIndex}
                    setDiagnosisIndex = {props.setDiagnosisIndex}
                    reportReady = {props.reportReady}
      />
    );
  }
  else if(props.currentState.tabOn === 4){
    return(
      <ReportTab className='tabBody' pdfSrc={props.pdfSrc} setPdfSrc={props.setPdfSrc}/>
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
      <div id='confTab' className='tab' 
           onClick={()=>changeTab(1, props.setTabOn, props.currentState)}>
        <i className="fas fa-cog"></i>
      </div>
      <div id='galleryTab' className='tab'
           onClick={()=>changeTab(2, props.setTabOn, props.currentState)}>
        Resultados de  Examinación  
      </div>
      <div id='resultsTab' className='tab'
           onClick={()=>changeTab(3, props.setTabOn, props.currentState)}>
        Diagnóstico
      </div>
      <div id='reportTab' className='tab'
           onClick={()=>changeTab(4, props.setTabOn, props.currentState)}>
        Informe Médico
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
