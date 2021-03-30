export function listDevices(){
  navigator.mediaDevices.getUserMedia({video:true, audio:false});
  navigator.mediaDevices.enumerateDevices()
  .then(gotDevices).catch(handleError);
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}
//funcion duplicada! dejar solo una (otra en webcamstream.js)
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

export async function setGallery2(props){
  let mapKeys = Array.from(props.gallerySrc.keys());
  let mapValues = Array.from(props.gallerySrc.values());
  let mapArray= Array.from(props.gallerySrc);
  let mapLength = mapArray.length;
  let galleryIndxSh = props.currentState.GalleryIndexShowing;
  if(galleryIndxSh.includes(0)){
    for (let i=0; i < galleryIndxSh.length; i++){
      if(galleryIndxSh[i] === 0){
        props.setGalleryIndxShowing([mapKeys[mapLength-1]],[i], true, 'none');
        let name = 'img'.concat(i+1)
        document.getElementById(name).src = mapValues[mapLength-1];
				removeAllImgBorders();
				setOneImgBorder(i+1);
				
        break;
      }
    }
  }
  else{
    props.setGalleryIndxShowing([mapKeys[mapLength-3],mapKeys[mapLength-2], mapKeys[mapLength-1]],[0,1,2], true, 'none');
  }

}
//function sleep(ms) {  return new Promise(resolve => setTimeout(resolve, ms));}
export async function galleryNext(galleryIndxSh, gallerySrc, newPhoto, selectedPhoto){
  let img1 = document.getElementById('img1');
  let img2 = document.getElementById('img2');
  let img3 = document.getElementById('img3');
  let pos1 = 0;
  let pos2 = 14.4;
  let pos3 = 25.4;
  if(!galleryIndxSh.includes(selectedPhoto)){
		removeAllImgBorders();
	}
  var intv = setInterval(frame, 10)
  async function frame(){
    if(pos1 >  -10){
      pos1--;
      img1.style.objectPosition= pos1 + 'vw';
      pos2--;
      img2.style.left = pos2 + 'vw'; 
      pos3--;
      img3.style.left = pos3 + 'vw'; 
    }
    else{
      img1.src = gallerySrc.get(galleryIndxSh[0]);
      img2.src = gallerySrc.get(galleryIndxSh[1]);
      img3.src = gallerySrc.get(galleryIndxSh[2]);
      clearInterval(intv);
      img1.style.objectPosition=  '0vw';
      img2.style.left = '14.4vw'; 
      img3.style.left = '25.4vw'; 
      
      //if(galleryIndxSh[2] !== 0){
      if(newPhoto){
        img3.style.objectPosition=  '-10vw';
        pos3 = -10;
        intv = setInterval(frame2, 2)
        async function frame2(){
          if(pos3 <  0){
            pos3 ++;
            img3.style.objectPosition= pos3 + 'vw';
          }
          else{
            clearInterval(intv);
          }
        }
				removeAllImgBorders();
				setOneImgBorder(3);
      }
			else{
				removeAllImgBorders()
		 		if(galleryIndxSh.includes(selectedPhoto)){
		  		for (let i=0; i <= 2; i++){
						if(galleryIndxSh[i] === selectedPhoto){
							setOneImgBorder(i+1);
					}
				}	
			}

			}
    }
  } 
}

export async function galleryPrev(galleryIndxSh, gallerySrc, newPhoto, selectedPhoto){
  let img1 = document.getElementById('img1');
  let img2 = document.getElementById('img2');
  let img3 = document.getElementById('img3');
  let pos1 = 3.4;
  let pos2 = 14.4;
  let pos3 = 0;
  if(!galleryIndxSh.includes(selectedPhoto)){
		removeAllImgBorders();
	}
  var intv = setInterval(frame, 10)
  function frame(){
    if(pos1 <=  14){
      pos1++;
      img1.style.left= pos1 + 'vw';
      pos2++;
      img2.style.left = pos2 + 'vw'; 
      pos3++;
      img3.style.objectPosition = pos3 + 'vw'; 
      
    }
    else{
      img1.src = gallerySrc.get(galleryIndxSh[0]);
      img2.src = gallerySrc.get(galleryIndxSh[1]);
      img3.src = gallerySrc.get(galleryIndxSh[2]);
      clearInterval(intv);
      img1.style.left= '3.4vw';
      img2.style.left= '14.4vw';
      img3.style.objectPosition= '0vw';
      /*
      img1.style.objectPosition=  '14vw';
      pos1 = 14;
      intv = setInterval(frame2, 2)
      async function frame2(){
        if(pos1 >  0){
          pos1 --;
          img1.style.objectPosition= pos1 + 'vw';
        }
        else{
          clearInterval(intv);

        }
      }
      */
			removeAllImgBorders();
		  if(galleryIndxSh.includes(selectedPhoto)){
		  	for (let i=0; i <= 2; i++){
					if(galleryIndxSh[i] === selectedPhoto){
						setOneImgBorder(i+1);
					}
				}	
			}
    }
  }
}

export function removeAllImgBorders(){
	for (let i=1; i <= 3; i++){
    let name = 'img'.concat(i);
    document.getElementById(name).style.borderStyle = 'none';
    document.getElementById(name).style.top = '1.8vw';
    document.getElementById(name).style.width = '10vw';
    document.getElementById(name).style.left = 5 + (i-1)*11 + 'vw';
  }
}

function setOneImgBorder(i){
  console.log('uu');
	let name = 'img'.concat(i);
	document.getElementById(name).style.border= '0.5vw solid #021a40';
	document.getElementById(name).style.top = '1.3vw';
 	document.getElementById(name).style.width = '11vw';
 	document.getElementById(name).style.left = 5 + (i-1)*11 - 0.5 + 'vw';

}

export function hideSidePanel(el){
  el.props.setHideSidePanel(true);
  if(!el.props.currentState.stateName.localeCompare('Idle'))
    el.props.setCountdownFrom(parseInt(document.getElementById("countdownFromInput").value));
  let div = document.getElementById("canvasDiv");
  let btns = document.getElementById("buttons");
  let canvas = document.getElementById("canvasPreview");
  el.canvasHeight = div.clientHeight*100/window.innerWidth; //vw
  el.canvasWidth = div.clientWidth*100/window.innerWidth; //vw
  document.getElementById("WebcamStream_Wrapper").style.width = "100vw";
  if ((87*el.canvasWidth/el.canvasHeight)*window.innerHeight/100 < window.innerWidth){
    div.style.height = "87vh";
    div.style.width = 87*el.canvasWidth/el.canvasHeight+"vh";
  }
  else{
    div.style.width = "90vw";
    div.style.height = 90*el.canvasHeight/el.canvasWidth + "vw";
  }
 
  btns.style.width = div.clientWidth*100/window.innerWidth+"vw";
  btns.style.top = (div.clientHeight - btns.clientHeight)*100/window.innerHeight + "vh";
  div.style.marginLeft = (100-(div.clientWidth*100/window.innerWidth))/2 + "vw";
  canvas.style.height="100%";
  canvas.style.width="100%";
  btns.style.top = (div.clientHeight - btns.clientHeight)*100/window.innerHeight + "vh";
  btns.style.opacity = 0;
          
  canvas.addEventListener("mouseover",showButtons, false);
  btns.addEventListener("mouseover",showButtons, false);
  canvas.addEventListener("mouseout",hideButtons,false);

  document.getElementById("container").style.paddingTop = "2vh";

}

export function showSidePanel(el){
  el.props.setHideSidePanel(false);
  document.getElementById("WebcamStream_Wrapper").style.width = "55vw";
  let btns = document.getElementById("buttons");
  let div = document.getElementById("canvasDiv");
  let canvas = document.getElementById("canvasPreview");
  div.style.width = el.canvasWidth+ "vw";
  div.style.height = el.canvasHeight + "vw";
  canvas.style.width="100%";
  canvas.style.height="100%";
  div.style.marginLeft = "2.5vw";
  div.style.marginRight = "2.5vw";
  btns.style.width = "50vw";
  btns.style.top = el.canvasHeight + "vw";
  btns.style.opacity = 1;
  canvas.removeEventListener("mouseover",showButtons,false);
	btns.removeEventListener("mouseover",showButtons,false);
	canvas.removeEventListener("mouseout",hideButtons,false);
  setTimeout(function(){
  if(document.getElementById("countdownFromInput")){
    document.getElementById("countdownFromInput").value = el.props.countdownFrom;
    listDevices();
    }},100);
  document.getElementById("container").style.paddingTop = "4vh";
}

function showButtons(){
	var btns= document.getElementById("buttons");
  if(btns){	btns.style.opacity=0.7;}
}

function hideButtons(){
	var btns= document.getElementById("buttons");
  if(btns){btns.style.opacity=0;}
}


export function changeTab(n, setTabOn,state){
  if(state.tabsEnabled[n-1]){ 
    setTabOn(n);
    
  }
}


export default {listDevices, setGallery2, galleryPrev, galleryNext, removeAllImgBorders, hideSidePanel, showSidePanel, changeTab};

