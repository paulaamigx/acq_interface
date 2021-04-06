import removeAllImgBorders from './../functions.js'

export async function deletePhoto(gallerySrc, selected, galleryIndxSh, setGalleryIndxSh, setSelectedPhoto){
  let newKeysArr = [0,0,0];
  for (let i = 0; i < galleryIndxSh.length; i++){
    if (galleryIndxSh[i] === selected){
      let mapKeys = Array.from(gallerySrc.keys());
      let indx = mapKeys.indexOf(selected);
      for(let j =0; j < galleryIndxSh.length-i; j++){
        if(mapKeys.length <= indx+1+j){
          newKeysArr[j+i] = 0;
        }
        else{
          newKeysArr[j+i] = mapKeys[indx+1+j];
        }
      }
      if(i === 0){
        if(newKeysArr[0] === 0){
          if(mapKeys[indx-1]){
            document.getElementById('galleryPrev').click();
            newKeysArr[0] = mapKeys[indx-1];
          }
          else{
          }
        }
        setSelectedPhoto(newKeysArr[0]);
        await sleep(200);
        clickOnImage(1);
      }
      else{
        setSelectedPhoto(newKeysArr[i-1]);
        clickOnImage(i);
      }
      break;
    }
    else{
     newKeysArr[i] = galleryIndxSh[i]; 
    }
  }
  if(newKeysArr[0] === 0)
    removeAllImgBorders();
  gallerySrc.delete(selected);
  setGalleryIndxSh(newKeysArr,[0,1,2],false,'delete');
}

export function clickOnImage(number){
  for (let i=1; i <= 3; i++){
    let name = 'img'.concat(i);
    if (i !== number){
      document.getElementById(name).style.borderStyle = 'none';
      document.getElementById(name).style.top = '4.8vw';
      document.getElementById(name).style.width = '10vw';
      document.getElementById(name).style.left = 5 + (i-1)*11 + 'vw';
    }
    else{
      document.getElementById(name).style.border= '0.5vw solid #021a40';
      document.getElementById(name).style.top = '4.3vw';
      document.getElementById(name).style.width = '11vw';
      document.getElementById(name).style.left = 5 + (i-1)*11 - 0.5 + 'vw';
       
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {clickOnImage, deletePhoto}
