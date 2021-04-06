export var handleDataAvailable = function(el) {
  return function (event) {
    if (event.data && event.data.size > 0) {
      el.recordedChunks.push(event.data);
      var blob = new Blob(el.recordedChunks, {
        type: "video/webm;codecs=vp8"
      });
      el.videoRecorded = URL.createObjectURL(blob);
      setVideoRec(el);
      }
    else {
        console.log("no data available for recording");
      }
  }
}
async function setVideoRec(el){
  await sleep(250);
  var videoElement = document.getElementById("recordedVideoElement");
  videoElement.src = null;
  videoElement.srcObject = null;
  videoElement.src = el.videoRecorded;
}

export async function ctrlBtnFunction(el){
    switch(el.props.currentState.stateName){
      case 'Idle':
        if(!document.getElementById('c_rightEar').checked && !document.getElementById('c_leftEar').checked){
          document.getElementById('earUncheckedWarning').style.display = 'block';
        }
        else{
          let data = (document.getElementById('c_leftEar').checked)? 'izquierdo': 'derecho';
          el.props.setAcqInfo(data);
          el.props.stateHandler('Countdown');
          el.timeStartPressed = Date.now();
          el.props.setTabOn(3);
          setCountdownFrom(el);
          }
        break;
			case 'Countdown':
        el.props.stateHandler('Idle');
		    el.props.setTabOn(1);
				break
      case 'Examination':
        el.stopRecording();
        if(el.props.currentState.hideSidePanel){
		      el.props.setHideSidePanel(false);
        }
        if(el.props.currentState.fullScreen){
         fullScreen(el); 
        }
        await sleep(200);
        el.props.stateHandler('Review')
        el.props.setTabOn(4);
        //el.videoSrc = document.getElementById("videoSelectConf").value;
        // Enviar al servidor la solicitud de diagnóstico.
        let stream = el.videoTag.current.srcObject;
        let tracks = stream.getTracks();
        tracks.forEach(function(track) {
            track.stop();
        });
        el.videoTag.current.srcObject = null;
        break;
      case 'Review':
        el.props.stateHandler('Idle');
        el.setStream();
        el.props.setIsDiagnosisReady(false);
        el.props.gallerySrc.clear();
        el.props.setGalleryIndxShowing([0,0,0],[0,1,2],false,'reset');
        el.props.setTabOn(1);
        restartStateProps(el);
        break;
      default:
        console.log("Error: Boton apretado en estado que no correspondía.")
    }
  }
 function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms));}

  function restartStateProps(el){
    el.timeStartPressed = null;
    el.mediaRecorder = null;
    el.recordedChunks= [];
	  el.videoRecorded = null;
  }

  function setCountdownFrom(el){
    if (!el.props.currentState.fullScreen && !el.props.currentState.hideSidePanel){
      el.props.setCountdownFrom(parseInt(document.getElementById("countdownFromInput").value));
    }
  }

  export function countdown(canvas,el, countdown, countdownNext){
    //let context = canvas;	
    let cnvs = document.getElementById("canvasCountdown");
    let countdownFrom = el.props.countdownFrom;

    if(cnvs){
      let w =canvas.clientWidth*100/window.innerWidth;
      let h =canvas.clientHeight*100/window.innerWidth;
      cnvs.style.width =  w + "vw";
      cnvs.style.height=  h + "vw";
      cnvs.style.left = canvas.clientLeft;
      cnvs.style.top = canvas.clientTop;
      let context = cnvs.getContext("2d");
      context.font = cnvs.height/3 +"px RobotoThin"
             
      
      countdownNext = countdownFrom- Math.trunc((-el.timeStartPressed + Date.now())/1000);
      if(countdownNext !== countdown){
        context.clearRect(0, 0, canvas.clientWidth*2, canvas.clientHeight*2); 
      }
      countdown = countdownNext;
      context.beginPath();
      context.textAlign = "center";
      context.fillStyle = "white";
      if(countdown >= 10){
        context.fillText(countdown.toString(10),cnvs.width/2,cnvs.height/2+80);
      }else if(countdown >= 1){
        context.fillText(countdown.toString(10),cnvs.width/2 ,cnvs.height/2+80);
      }
    
      context.fill();
      if (countdown <  1){
            el.props.stateHandler("Examination");
            el.startRecording();
      }
      }
  }
  


  export function captureScreenshot(el){
    var canvas = el.props.canvasPreview.current; 
    var imgAsDataURL = canvas.toDataURL("image/jpeg",1);
  /*
    let newId = el.props.currentState.GallerySrc.length + 1;
    let newSlidesData = [{src: imgAsDataURL, 
                          id: newId
                        }];
    el.props.setScreenshots(newSlidesData); 
    */
//    let newId = el.props.currentState.GallerySrcLength + 1;
    el.props.setScreenshots(imgAsDataURL);
    }

export function mirror(el,way){
  //revisar numeros
	if(way.localeCompare("horizontal") === 0){
    el.mirrorTranslate[0] += el.mirrorScale[0]*640;
    el.mirrorScale[0]*=-1;
  }
  else if(way.localeCompare("vertical") === 0){
    el.mirrorTranslate[1] += el.mirrorScale[1]*480;
    el.mirrorScale[1]*=-1;
  }
  else if(way.localeCompare("reset")===0){
    el.mirrorTranslate = [0,0];
    el.mirrorScale = [1,1];
  }
}

export function fullScreen(el){
    let div = document.getElementById("canvasDiv");
    let canvas = document.getElementById("canvasPreview");

    if(!el.props.currentState.fullScreen){
      el.canvasWidth = canvas.clientWidth*100/window.innerWidth;
      el.canvasHeight =canvas.clientHeight*100/window.innerWidth;
    	if(div.webkitRequestFullScreen) {
    		div.webkitRequestFullScreen();
    	}
    	else {
    		div.requestFullscreen();
    	} 
    }
    else{
      document.exitFullscreen();
    }
}

export async function organizeScreen(el){
  console.log('os');
  let div = document.getElementById("canvasDiv");
  let canvas = document.getElementById("canvasPreview");
  let btns= document.getElementById("buttons");

  let canvasCountdown = document.getElementById("canvasCountdown");
  if(div){
    /********** organize full screen ************/
    if (document.fullscreenElement) {
      console.log('os2');
	  	el.props.setFullScreen(true);
      if(!el.props.currentState.hideSidePanel && !el.props.currentState.stateName.localeCompare('Idle')){
        el.props.setCountdownFrom(parseInt(document.getElementById("countdownFromInput").value));
      }
      const width  = window.innerWidth || document.documentElement.clientWidth || 
      document.body.clientWidth;
      const height = window.innerHeight|| document.documentElement.clientHeight|| 
      document.body.clientHeight;

      console.log(width, height);
	  	canvas.style.height = height + "px";
	  	canvas.style.width = height*el.canvasWidth/el.canvasHeight + "px";
	  	canvas.style.marginLeft = "12%";

      if(canvasCountdown){
        canvasCountdown.style.marginLeft = "12%";
      }
	  	div.appendChild(btns);
	  	btns.style.width = getComputedStyle(canvas).width;
      btns.style.marginLeft = "12%"
	  	btns.style.top = height - btns.clientHeight  + "px";
      if(!el.props.currentState.hideSidePanel){
	  	  canvas.addEventListener("mouseover",showButtons, false);
	  	  btns.addEventListener("mouseover",showButtons, false);
	  	  canvas.addEventListener("mouseout",hideButtons,false);
        if(canvasCountdown){
    		  canvasCountdown.addEventListener("mouseover",showButtons, false);
	    	  canvasCountdown.addEventListener("mouseout",hideButtons,false);
        }
      }
	  }

    /********** organize regular screen ************/
	  else{
      div.style.width=  "50vw";
	  	canvas.style.width = el.canvasWidth + "vw";
	  	canvas.style.height = el.canvasHeight + "vw";
	  	el.props.setFullScreen(false);
	  	document.getElementById("WebcamStream_Wrapper").appendChild(btns);
      canvas.style.height = canvas.clientWidth*(100/window.innerWidth)*el.canvasHeight/el.canvasWidth + "vw";
	  	canvas.style.marginLeft = 0;
      if(canvasCountdown){
        canvasCountdown.style.marginLeft = 0;
      }
      if(!el.props.currentState.hideSidePanel){
	  	  btns.style.top = el.canvasHeight + "vw";
      }
      else{
	  	  btns.style.top = el.canvasHeight - btns.clientHeight*100/window.innerWidth+ "vw";
      }
	  	div.appendChild(btns);
      btns.style.marginLeft = 0;
      btns.style.width = el.canvasWidth + "vw";
      if(!el.props.currentState.hideSidePanel){
    		canvas.removeEventListener("mouseover",showButtons,false);
    		btns.removeEventListener("mouseover",showButtons,false);
    		canvas.removeEventListener("mouseout",hideButtons,false);
        if(canvasCountdown){
    		  canvasCountdown.addEventListener("mouseover",hideButtons, false);
	    	  canvasCountdown.addEventListener("mouseout",showButtons,false);
        }
      }
	  	btns.style.opacity = 1;
	  }
  }
  else{
    await sleep(10);
    organizeScreen(el);
  }
}
function showButtons(){
	var btns= document.getElementById("buttons");
	btns.style.opacity=0.7;
}

function hideButtons(){
	var btns= document.getElementById("buttons");
	btns.style.opacity=0;
}

  export default {handleDataAvailable, ctrlBtnFunction, countdown,
                 captureScreenshot, mirror, fullScreen, organizeScreen}

