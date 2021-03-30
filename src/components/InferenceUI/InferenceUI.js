import './InferenceUI.css';
import React from 'react';
import WebcamStream from './WebcamStream/WebcamStream.js'
import SidePanel from './SidePanel/SidePanel.js'
import {manageStates} from './functions.js'

//import socketIOClient from "socket.io-client";
//import React, { useEffect, useState } from "react";
//import FileSaver from 'file-saver';
const ENDPOINT = "wss://aisgs0wem3.execute-api.sa-east-1.amazonaws.com/Dev";
const WebSocket = require('isomorphic-ws');

const zipName = 'p';
//tambien se debe configurar en WebcamStream.js
const packetsSentLimit = 10;

const alertWaitFor = 2000;  //miliseconds to wait for alerts
const alertsLimit = 3;     //how many alerts in alertWaiFor necessary to show the alert on screen
const alertTTL = 4000;      //miliseconds to keep alert on screen

class InferenceUI extends React.Component {
  
  constructor(props){
    super();
    this.state = {
      stateName: "Idle",

      // Render canvas or video
      renderCanvas: true,
      // Canvas Message
      canvasMessage: "",
      canvasAlert: false,

      // Progress Bar props
      showProgressBar: false,
      progress: 0,
      // Show Spinner
      showSpinner: false,
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
      
      blurAlert: false,
      domAlert: false
  	
    }
    this.gallerySrc = new Map();
    this.childWebcamStream = React.createRef();
    this.childDiagnosis = React.createRef();
    this.countdownFrom = 5;
    this.alertTimeout = null;
    this.videoThumbnail = null;
    this.canvasPreview = React.createRef();

    this.socketCon = null;
    this.pdfSrc = null;
		this.presignedURL = [];
    this.indexURL = 0;

    this.blurCnt = 0;
    this.blurTimeoutAlertOn= null;
    this.blurTimeoutAlertOff= null;

    this.domCnt = 0;
    this.domTimeoutAlertOn= null;
    this.domTimeoutAlertOff= null;
  }
  // En caso de que venga de review y vaya a idle, limpiar las variables.
  async stateHandler(nextState){
    await this.setState({stateName: nextState});
    console.log("Estado: " + this.state.stateName);
    if(nextState.localeCompare('Idle') === 0){
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
      let tabs = document.getElementsByClassName('tab');
      for(let i = 0; i <4; i++){
        if(!this.state.tabsEnabled[i])
          tabs[i].style.color = 'grey';
        else{
          if(i !== this.state.tabOn-1)
            tabs[i].style.color = 'white';
          else
            tabs[i].style.color = 'var(--main)';
        }
      }
    }

  
  }
  
  downloadHandler(media){
    if(media.localeCompare("video")===0){
      this.childWebcamStream.current.downloadVideo();
    }
    else if(media.localeCompare("screenshots")===0){
      this.childWebcamStream.current.downloadScreenshots();
    }
    else if(media.localeCompare("all")===0){
      this.childWebcamStream.current.downloadAll();
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
          document.getElementById('img1').src = this.gallerySrc.get((this.state.GalleryIndexShowing[0]));
          document.getElementById('img2').src = this.gallerySrc.get((this.state.GalleryIndexShowing[1]));
          document.getElementById('img3').src = this.gallerySrc.get((this.state.GalleryIndexShowing[2]));
          if(this.state.stateName.localeCompare('Review') === 0){
            //enable all download buttons
            if(this.gallerySrc.size>0){
              for(let i=0; i <3; i++){
                document.getElementsByClassName('download')[i].style.color = "white";
                document.getElementsByClassName('downloadLogo')[i].style.filter = "invert(1)";
              }
            }
            //enable only video download
            else{
              document.getElementsByClassName('download')[2].style.color = "white";
              document.getElementsByClassName('downloadLogo')[2].style.filter = "invert(1)";
            }
          }
          //disable all downloads in any other state
          else{
            for(let i=0; i <3; i++){
              document.getElementsByClassName('download')[i].style.color = "rgba(0,0,0,0.3)";
              document.getElementsByClassName('downloadLogo')[i].style.filter = "opacity(0.3)";
            }
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

  setPdfSrc(pdf){
    this.pdfSrc = pdf;
  }
  setBlurAlertOn(){
    this.setState({blurAlert: true});
    let el = this;
    this.blurTimeoutAlertOff = setTimeout(function(){
      el.setBlurAlertOff();
      }, alertTTL);
  }
  setBlurAlertOff(){
    this.setState({blurAlert: false});
    this.blurTimeoutAlertOff= null;
  }
  setDomAlertOn(){
    this.setState({domAlert: true});
    let el = this;
    this.domTimeoutAlertOff = setTimeout(function(){
      el.setDomAlertOff();
      }, alertTTL);
  }
  setDomAlertOff(){
    this.setState({domAlert: false});
    this.domTimeoutAlertOff= null;
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
                       sendViaSocket={(content)=>sendFile(content,this.socketConi,this.presignedURL,this)}
                       getCon={()=>getCon(this)}
                       closeCon={()=>closeCon(this)}
                       pdfSrc={this.pdfSrc}
                       setPdfSrc={()=>this.setPdfSrc()}
                      
				 />
         <SidePanel    currentState={this.state}
                       setStreamFromConfig={()=>{this.childWebcamStream.current.setStream();}}
                       ref={this.childDiagnosis}
                       downloadHandler={(media)=>this.downloadHandler(media)}
                       setTabOn={(value)=>this.setTabOn(value)}
                       setHideSidePanel={(value)=>this.setHideSidePanel(value)}
                       mirror={(way)=>{this.childWebcamStream.current.mirror(way)}}
                       setCountdownFrom={(value)=>this.setCountdownFrom(value)}
                       countdownFrom={this.countdownFrom} 
                       setGalleryIndxShowing={(newIndxShowing, indx, newPhoto,dir)=>this.setGalleryIndxShowing(newIndxShowing,indx, newPhoto, dir)}
                       gallerySrc = {this.gallerySrc}
                       setSelectedGalleryPhoto = {(id) => this.setSelectedGalleryPhoto(id)}
                      
                       
         />
        <button onClick={()=>blurAlert(this)} style={{position: 'absolute', top: '50vw', left: '5vw'}}>B</button>
        <button onClick={()=>domAlert(this)} style={{position: 'absolute', top: '50vw', left: '10vw'}}>D</button>
    

      </div>
	
      );
        
    }
}

function closeCon(el){
  console.log('Disconnecting...');
  //el.socketCon.close();
  el.childWebcamStream.current.resetSocketVars();
}

function getCon(el){
  console.log('Connecting...');
  el.socketCon = new WebSocket(ENDPOINT);

  el.socketCon.onopen = function open() {
      console.log('connected');
      let fileNames = '"p1.zip"';
      for(let i=2; i <= packetsSentLimit; i++){
        fileNames+= ',"'+zipName+i+'.zip"';
      }
			let msg = '{"action":"getURL", "fileName":[' + fileNames + ']}';
			el.socketCon.send(msg);
  };
	el.socketCon.onclose = function close() {
	  console.log('disconnected');
	};
	
	el.socketCon.onmessage = function incoming(data) {
    console.log(JSON.parse(data.data));
    let dataJSON = JSON.parse(data.data); 

    if(dataJSON.response){
      console.log('Set presigned URLs');
		  el.presignedURL = dataJSON.response;
    }
    if(dataJSON.alert){
      //may not work to check
      //check format
      if(dataJSON.alert[0].localeCompare('blur') === 0){
        console.log('Blur');
        blurAlert(el);
      }
      if(dataJSON.alert[0].localeCompare('dom') === 0){
        console.log('Dom');
        domAlert();
          
      }
    }
		//el.socketCon.close();
	};
}
function sendFile(file,socketCon, presignedURL,el){
  console.log('Sending...');
	var xhr = new XMLHttpRequest();
  xhr.open('PUT', presignedURL[el.indexURL], true);
	xhr.onload = () => {
    if (xhr.status === 200) {
      console.log('Uploaded data successfully');
    }
  };
  xhr.onerror = () => {
    console.log('Nope')
  };
  xhr.send(file);  
  el.indexURL++;
}
//function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms));}
function blurAlert(el){
  console.log('blur');
  el.blurCnt++;
  if(el.blurTimeoutAlertOn === null){
    el.blurTimeoutAlertOn = setTimeout(function(){ 
      if(el.blurCnt > alertsLimit){
        //not currently showing alert
        if(el.blurTimeoutAlertOff === null){
          el.setBlurAlertOn(); 
        }
        else{
          clearTimeout(el.blurTimeoutAlertOff);
          el.blurTimeoutAlertOff = setTimeout(function(){
            el.setBlurAlertOff()
          }, alertTTL);
        }
      }
      else{
        el.blurTimeoutAlertOff = null;
      }
      el.blurCnt = 0;
      el.blurTimeoutAlertOn = null;
    }, alertWaitFor); 
  }
}

function domAlert(el){
  console.log('dom');
  el.domCnt++;
  if(el.domTimeoutAlertOn === null){
    el.domTimeoutAlertOn = setTimeout(function(){ 
      if(el.domCnt > alertsLimit){
        //not currently showing alert
        if(el.domTimeoutAlertOff === null){
          el.setDomAlertOn(); 
        }
        else{
          clearTimeout(el.domTimeoutAlertOff);
          el.domTimeoutAlertOff = setTimeout(function(){
            el.setDomAlertOff()
          }, alertTTL);
        }
      }
      else{
        el.domTimeoutAlertOff = null;
      }
      el.domCnt = 0;
      el.domTimeoutAlertOn = null;
    }, alertWaitFor); 
  }
}
export default InferenceUI;
