import './InferenceUI.css';
import React from 'react';
import WebcamStream from './WebcamStream/WebcamStream.js'
import SidePanel from './SidePanel/SidePanel.js'
import {manageStates} from './functions.js'


class InferenceUI extends React.Component {
  
  constructor(props){
    super();
    this.state = {
      stateName: "Idle",

      // Render canvas or video
      renderCanvas: true,

      // Button state
      textCtrlBtn: "Empezar",
      enableCtrlBtn: true,
      enableCaptureBtn: false,

      // Side Panel
      tabsEnabled: [1,0,0,0], //conf, results, diagnosis, report
      GallerySrcLength: 0,
      GalleryIndexShowing: [0,0,0],
      selectedGalleryPhoto: 0,
      isVideoLoading: true,
      hideSidePanel: false,

      tabOn: 1,
      fullScreen: false,

      isDiagnosisReady: false,
      
  	
    }
    this.gallerySrc = new Map();
    this.childWebcamStream = React.createRef();
    this.childDiagnosis = React.createRef();
    this.countdownFrom = 5;
    this.canvasPreview = React.createRef();

    this.acqInfo = []; 
    this.setAcqInfo = this.setAcqInfo.bind(this);
  }
  // En caso de que venga de review y vaya a idle, limpiar las variables.
  async stateHandler(nextState){
    await this.setState({stateName: nextState});
    console.log("Estado: " + this.state.stateName);
    if(nextState.localeCompare('Idle') === 0 && this.state.tabOn === 2){
      this.setState(manageStates(nextState), async()=>{
		  	this.childDiagnosis.current.listDevices();
        var selectObj = document.getElementById("videoSelectConf");
		  	for (var i = 0; i < selectObj.options.length; i++) {
          if (!selectObj.options[i].text.localeCompare(this.childWebcamStream.current.videoSrc)) {
              selectObj.options[i].selected = true;
              break;
          }
   	  	 }
        document.getElementById("countdownFromInput").value=this.countdownFrom;
      });
    }
    else{
      await this.setState(manageStates(nextState));
      if(nextState.localeCompare('Countdown') === 0 && this.state.fullScreen){
        let cnvs = document.getElementById('canvasCountdown');
        if(cnvs) cnvs.style.marginLeft = '12%';

      }
    }
    if(!this.state.hideSidePanel){
      setTabsColor(this.state.tabsEnabled, this.state.tabOn);
    }
      

  
  }
  

  async setGalleryIndxShowing(newIndxShowing, indx, newPhoto, dir){
    let auxArr =[];
    let mapKeys = Array.from(this.gallerySrc.keys());
    if((dir.localeCompare('prev') === 0 && this.state.GalleryIndexShowing[0] > mapKeys[0]) 
        || newPhoto || dir.localeCompare('reset') === 0 || dir.localeCompare('delete') === 0 ||
        (dir.localeCompare('next') === 0 && this.state.GalleryIndexShowing[2] < mapKeys[mapKeys.length-1] && this.state.GalleryIndexShowing[2] !== 0 ) ){
      auxArr[0] = this.state.GalleryIndexShowing[0];
      auxArr[1] = this.state.GalleryIndexShowing[1];
      auxArr[2] = this.state.GalleryIndexShowing[2];

      for (let i=0;i < newIndxShowing.length; i++){
        auxArr[indx[i]] = newIndxShowing[i];
      }

      if(dir){
        this.childDiagnosis.current.galleryCtrl(dir, auxArr, this.gallerySrc, false, this.state.selectedGalleryPhoto);
      }
      
      if(newPhoto){
        this.setSelectedGalleryPhoto(newIndxShowing[newIndxShowing.length-1]);
        if(this.state.GalleryIndexShowing[2] !== 0){
          this.childDiagnosis.current.galleryCtrl('next', auxArr, this.gallerySrc, true);
        }
      }
      if(dir.localeCompare('delete') === 0){
        document.getElementById('img1').src = this.gallerySrc.get((auxArr[0]));
        document.getElementById('img2').src = this.gallerySrc.get((auxArr[1]));
        document.getElementById('img3').src = this.gallerySrc.get((auxArr[2]));
      }
      this.setState(
        {GalleryIndexShowing: auxArr}
      );
    }
  }
      
  setFullScreen(value){
    this.setState({fullScreen: value});
  }
  setTabOn(value){
    if(!this.state.hideSidePanel){
  	  let tabs = document.getElementsByClassName('tab');
  	  tabs[this.state.tabOn-1].style.backgroundColor = 'var(--main)';
  	  tabs[this.state.tabOn-1].style.color= 'white';
  	  tabs[this.state.tabOn-1].style.borderBottom = 'black';
  	  tabs[value-1].style.backgroundColor = 'white';
  	  tabs[value-1].style.color = 'var(--main)';
  	  tabs[value-1].style.borderBottom = 'none';
      this.setState({tabOn: value},()=>{
        if(value === 2){
          this.setState({tabsEnabled: [0,1,0,0]},()=>{
            document.getElementById("countdownFromInput").value="1";
            setTabsColor(this.state.tabsEnabled, this.state.tabOn);
          });
        }
        else if(value === 3){
          document.getElementById('img1').src = this.gallerySrc.get((this.state.GalleryIndexShowing[0]));
          document.getElementById('img2').src = this.gallerySrc.get((this.state.GalleryIndexShowing[1]));
          document.getElementById('img3').src = this.gallerySrc.get((this.state.GalleryIndexShowing[2]));
          if(this.state.stateName.localeCompare('Review') === 0){
          }
        }
      });
    }
    else{
      this.setState({tabOn: value});
    }
  }
  setHideSidePanel(value){
    this.setState({hideSidePanel: value},()=>{if (!value) this.setTabOn(this.state.tabOn)});
  }
  setIsVideoLoading(value){
    this.setState({isVideoLoading: value});
  }
  setCountdownFrom(value){
    this.countdownFrom = value;
  }
  setIsDiagnosisReady(value){
    this.setState({isDiagnosisReady: value});
  }
  setSelectedGalleryPhoto(id){
    this.setState({selectedGalleryPhoto: id});
  }
  async setScreenshots(data){
    let newId =    this.state.GallerySrcLength+1;
    await this.gallerySrc.set(newId, data);
    this.setState(
      {GallerySrcLength: this.state.GallerySrcLength +1 },
      ()=>{this.childDiagnosis.current.setGallery2()}
    );
  }

  layout(){
    this.childWebcamStream.current.organizeScreen(this.childWebcamStream.current);
  }


  async setAcqInfo(value){
    this.acqInfo = this.acqInfo.concat(value);
    if(this.acqInfo.length === 31){
      this.generateSheet(this.acqInfo);
      this.stateHandler('Idle');
      this.setTabOn(1);
    }
  }
  generateSheet(data){
    /*not uploaded anywhere yet. 
    Data is array 0f 31 elements. 
    First 27 are in the same order as Database.xls
    28: which ears is being examinated
    29: diagnosis normal or anormal
    30: which condition is selected in anormal
    31: obs in diagnosis tab
    */
    console.log(data);
  }
  componentDidMount(){
    this.childDiagnosis.current.listDevices();
    document.addEventListener('fullscreenchange', (event => {
      this.layout();
    }));
    document.addEventListener("webkitfullscreenchange", (event => {
      this.layout();
    }));
  }

  render() {
    return (
			<div id="container">
         <WebcamStream currentState={this.state} 
                       gallerySrc = {this.gallerySrc}
                       canvasPreview={this.canvasPreview}
                       stateHandler={(nextState)=>this.stateHandler(nextState)} 
                       countdownFrom={this.countdownFrom} 
                       ref={this.childWebcamStream}
                       setScreenshots={(data)=>{this.setScreenshots(data)}}
                       setFullScreen={(value)=>this.setFullScreen(value)}
                       setTabOn={(value)=>this.setTabOn(value)}
                       setHideSidePanel={(value)=>this.setHideSidePanel(value)}
                       setIsDiagnosisReady ={(value)=>this.setIsDiagnosisReady(value)}
                       setIsVideoLoading={(value)=>this.setIsVideoLoading(value)}
                       setCountdownFrom={(value)=>this.setCountdownFrom(value)}
                       setGallery={()=>this.setGallery()}
                       setGalleryIndxShowing={(newIndxShowing, indx, newPhoto,dir)=>this.setGalleryIndxShowing(newIndxShowing,indx, newPhoto, dir)}
                       hideSidePanel={()=>this.childDiagnosis.current.hideSidePanel()}
                       setAcqInfo = {this.setAcqInfo}    
                      
				 />
         <SidePanel    currentState={this.state}
                       setStreamFromConfig={()=>{this.childWebcamStream.current.setStream();}}
                       ref={this.childDiagnosis}
                       setTabOn={(value)=>this.setTabOn(value)}
                       setHideSidePanel={(value)=>this.setHideSidePanel(value)}
                       mirror={(way)=>{this.childWebcamStream.current.mirror(way)}}
                       setCountdownFrom={(value)=>this.setCountdownFrom(value)}
                       countdownFrom={this.countdownFrom} 
                       setGalleryIndxShowing={(newIndxShowing, indx, newPhoto,dir)=>this.setGalleryIndxShowing(newIndxShowing,indx, newPhoto, dir)}
                       gallerySrc = {this.gallerySrc}
                       setSelectedGalleryPhoto = {(id) => this.setSelectedGalleryPhoto(id)}
                       setAcqInfo = {this.setAcqInfo}    
                       
         />
      </div>
      );
    }
}

//function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms));}
function setTabsColor(tabsEnabled, tabOn){
  let tabs = document.getElementsByClassName('tab');
  for(let i = 0; i <4; i++){
    if(!tabsEnabled[i])
      tabs[i].style.color = 'grey';
    else{
      if(i !== tabOn-1)
        tabs[i].style.color = 'white';
      else
        tabs[i].style.color = 'var(--main)';
    }
  }
}
export default InferenceUI;
