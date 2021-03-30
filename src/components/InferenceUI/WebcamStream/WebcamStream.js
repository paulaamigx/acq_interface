import './WebcamStream.css'
import React from 'react';
//import {Alert} from 'reactstrap';

import "@fortawesome/fontawesome-free/css/all.css"

import JSZipUtils from 'jszip-utils';
import JSZip from 'jszip';
//import FileSaver from 'file-saver';
import {handleDataAvailable, ctrlBtnFunction, countdown, 
        downloadScreenshots, downloadVideo, downloadAll, captureScreenshot, mirror,
        fullScreen, organizeScreen} from './functions.js';
        
const framesPerZip = 20;
//tambien se debe configurar en Inference.js
const packetsSentLimit = 10;


// Agregar variable para almacenar la hora en que se apretó el start.
// Administrar el fullscreen desde acá ahora.
class WebcamStream extends React.Component {
  constructor(props) {
    super();
    this.state = {
    };

    this.videoTag = React.createRef();
    this.tick = this.tick.bind(this);

    this.timeStartPressed = null;

    this.mediaRecorder = null;
    this.recordedChunks= [];
	  this.videoRecorded = null;

    this.mirrorScale = [1,1];
    this.mirrorTranslate = [0,0];

    this.canvasHeight = 0;
    this.canvasWidth = 0;
    
    //Dummy mientras usamos setTimeout para pasar de gecon a exam
    this.timeout = null;
    this.timeout2 = null;
    this.videoSrc = null;
    
    this.changeFullScreenFrom = false;

    this.framesArray = [];
		this.socketCnt = 0;
    this.zip = null;
    this.packetsSent = 0;
    
    this.frameNumber = 0;

  }

  setStream(){
    var selectVideoSrc = document.getElementById("videoSelectConf");
    if(this.videoSrc){
      try{
        selectVideoSrc.value = this.videoSrc;
        }
      catch(e){console.log(e)}
    }
    
    // Falta cerrar el stream anterior antes de abrir uno nuevo.
    navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: selectVideoSrc? {exact: selectVideoSrc.value}:undefined,
        facingMode: "enviroment"
      }
    }).then(stream => {
      this.videoTag.current.srcObject = stream;
      requestAnimationFrame(this.tick);
      window.stream = stream;
      
      return navigator.mediaDevices.enumerateDevices();
    }).then(gotDevices)
    .catch(function(e){
        console.log('guardar esto');
        console.log(e);
    });
  }

  tick() {
    const video = this.videoTag.current;
    let countdownCurrent;
    let countdownNext;
    const checkVideoState = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        clearInterval(checkVideoState);
        this.props.setIsVideoLoading(false);
        var canvasPreviewElement = this.props.canvasPreview.current;
        if(canvasPreviewElement){
          var canvasPreview = canvasPreviewElement.getContext("2d");
          canvasPreviewElement.height = video.videoHeight;
          canvasPreviewElement.width = video.videoWidth;
          canvasPreview.translate(this.mirrorTranslate[0],this.mirrorTranslate[1]);
          canvasPreview.scale(this.mirrorScale[0],this.mirrorScale[1]);

          canvasPreview.drawImage(
              video,
              0,
              0,
              canvasPreviewElement.width,
              canvasPreviewElement.height
          );
          if(this.props.currentState.stateName.localeCompare("Countdown")===0){
            countdown(canvasPreviewElement,this,countdownCurrent, countdownNext);
          }

          //Send each frame to server
          else if(this.props.currentState.stateName.localeCompare("Examination") === 0){
            let frame  = canvasPreviewElement.toDataURL("image/jpeg",0.5);
            if (this.socketCnt < framesPerZip && this.socketCnt >0){
                let name = 'f'+this.frameNumber+'.jpeg';
                this.zip.file(name, urlToPromise(frame),{binary:true});
            }
            else if(this.socketCnt === framesPerZip){
					  	let el = this;
              console.log('aca');
				      this.zip.generateAsync({type: "blob"}).then(
                function(content) {
                  console.log('zipfile');
                  var zipFile = new File([content], "test.zip");
                  sendto(zipFile,el);
                });
              this.packetsSent++;
              if(this.packetsSent < packetsSentLimit)
                this.socketCnt = 0;
            }
            if(this.socketCnt === 0){
              this.zip = new JSZip();
              let name = 'f'+this.frameNumber+'.jpeg';
              this.zip.file(name, urlToPromise(frame),{binary:true});
            }
            this.socketCnt++;
            this.frameNumber++;
          }
          requestAnimationFrame(this.tick);
        }
      }
    }, 50);
  }
  startRecording(){
      var options = { mimeType: "video/webm;codecs=vp8" };
      this.mediaRecorder = new MediaRecorder(this.props.canvasPreview.current.captureStream(), options);
      this.mediaRecorder.ondataavailable = handleDataAvailable(this);
      this.mediaRecorder.start();
  }

	stopRecording(){
    this.mediaRecorder.stop();
	}

	downloadVideo(){
		downloadVideo(this);	
	}
  downloadAll(){
    downloadAll(this);
  }
  
  captureScreenshot(){
    captureScreenshot(this);
    }

  downloadScreenshots(){
    downloadScreenshots(this);
  }
  
  mirror(way){
    mirror(this,way);
  }
  fullScreen(){
    fullScreen(this);
  }
  organizeScreen(){
    organizeScreen(this);
  }
  resetSocketVars(){
    this.socketCnt = 0;
    //this.framesArray = [];
  }
  render() {
    const isVideoLoading = this.props.currentState.isVideoLoading;
    const colorScreenshotBtn = (this.props.currentState.enableCaptureBtn)? "white" : "grey";

    if(!isVideoLoading && !this.props.currentState.hideSidePanel && !this.props.currentState.fullScreen){
      let btns= document.getElementById("buttons");
      if(btns){
        btns.style.top = 50*3/4+"vw";}
    }
    return (
      <div id="WebcamStream_Wrapper">

        <script src="adapter.js"></script>

        {/* Dummy video tag to recieve UserMedia stream.*/}
        <video
          ref={this.videoTag}
          autoPlay
          id = "video"
          style={{ display: "none"}}
        />

        {!isVideoLoading &&
          <div id="canvasDiv" className="canvasRendered">
            {this.props.currentState.canvasAlert &&
              <div className="w_divAlert" >
                Verifique
              </div>
            }

           {this.props.currentState.stateName.localeCompare("GetCon") === 0 &&
              <div className="w_divAlert" >
                Estableciendo conexión con el servidor.
              </div>
            }
            <div id='alertsFromServer'>
              {this.props.currentState.blurAlert &&
                 <div className="w_divAlert" style={{position: 'relative' }}>
                   Blurrrrrrrrrr
                 </div>
               }
              {this.props.currentState.domAlert &&
                 <div className="w_divAlert" style={{position: 'relative'}}>
                   doooooooooooooom
                 </div>
               }
            </div>
            
            {this.props.currentState.renderCanvas &&
              <div>
                <canvas ref={this.props.canvasPreview}
                        id="canvasPreview"/>
                {!this.props.currentState.hideSidePanel && !this.props.currentState.fullScreen &&
                  <div id='div_hideSP' onClick={()=>this.props.hideSidePanel()}>{'>'}</div>
                }
              </div>

            }
            {(this.props.currentState.stateName.localeCompare("Countdown") === 0) &&
              <canvas id="canvasCountdown" width="1000" height="750"/>
            }
            {this.props.currentState.renderCanvas &&
				      <div id="buttons">
                <span  id = "screenshotBtn"
                       onClick={() => {if(this.props.currentState.enableCaptureBtn){this.captureScreenshot()}}}
                       style={{color: colorScreenshotBtn}}>
                        <i className="fas fa-camera" style={{margin: "0px" }}></i>
                </span>
                {this.props.currentState.enableCtrlBtn &&
                  <div id="ctrlBtn"
                       onClick={()=>{ctrlBtnFunction(this);}}>
                       {this.props.currentState.textCtrlBtn}
                  </div>
                }
                {!this.props.currentState.enableCtrlBtn &&
                  <div id="ctrlBtnDisabled">
                       {this.props.currentState.textCtrlBtn}
                  </div>
                }
                <span  id = "fullScreenBtn" 
                       onClick={()=>fullScreen(this)}>
                       {!this.props.currentState.fullScreen &&
                          <i className="fas fa-expand" style={{margin: "0px"}}></i>}
                       {this.props.currentState.fullScreen && 
                          <i className="fas fa-compress" style={{margin: "0px"}}></i>}
                </span>
              </div>
            }
          </div>
        }
        
        {isVideoLoading &&
          <div>
            <canvas id="canvasMessage"
                    className="canvasRendered" width="1000" height="750"/>
          </div>
        }
        {!this.props.currentState.renderCanvas &&
          <div style={{width: '100%'}}>
            <video id = "recordedVideoElement"
                   controls
                   src={null}
                   className="canvasRendered"/>
            <div id= "ctrlStartOver" 
                    onClick={()=>{ctrlBtnFunction(this);}}
                    >
                    {this.props.currentState.textCtrlBtn}
                    </div>
          </div>
        }
      </div>
    );
  }
}
function urlToPromise(url) {
    return new Promise(function(resolve, reject) {
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if(err) {
          reject(err);
        }
        else {
          resolve(data);
        }
      });
    });
  }

function sendto(content,el){
	el.props.sendViaSocket(content);
	//FileSaver.saveAs(content, "download.zip");
}
function gotDevices(deviceInfos) {
  const videoSelect = document.getElementById("videoSelectConf");
  const selectors = [videoSelect];
  // Handles being called several times to update labels. Preserve values.
  const values = selectors.map(select => select.value);
  selectors.forEach(select => {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    }   
  }
  selectors.forEach((select, selectorIndex) => {
    if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
      select.value = values[selectorIndex];
    }
  });
}
export default WebcamStream;
