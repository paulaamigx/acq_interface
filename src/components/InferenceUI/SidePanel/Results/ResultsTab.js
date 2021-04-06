import React from 'react'

import logoTrash from './trash.png'

import {deletePhoto, clickOnImage} from './functions.js'

import './ResultsTab.css'

export function ResultsTab(props){
  let galleryIndxSh = props.galleryIndxSh;
  let mapKeys = Array.from(props.gallerySrc.keys());
  let isEmpty = (galleryIndxSh[0] === 0)? true:false;
  return(
    <div className = 'tabBody'>
      <div id = 'galleryPrev' className='button' href='galleryPrev'
            onClick = {()=>{props.setGalleryIndxShowing(
                           [galleryIndxSh[0], galleryIndxSh[1], 
                           mapKeys[mapKeys.indexOf(galleryIndxSh[0])-1]],
                    [1,2,0], false,'prev');}} />
      <div id = 'galleryNext' className='button'
           onClick = {()=>{props.setGalleryIndxShowing(
                     [galleryIndxSh[1], galleryIndxSh[2], 
                      mapKeys[mapKeys.indexOf(galleryIndxSh[2])+1]],
                    [0,1,2], false,'next')}} />
      {!isEmpty &&
      <div >
        <div id='deletePhoto' className='button'>
          <img src={logoTrash} alt='' id='logoCtrlPhoto'
               onClick={()=>deletePhoto(props.gallerySrc, props.selectedGalleryPhoto, props.galleryIndxSh,props.setGalleryIndxShowing, props.setSelectedGalleryPhoto)}
          />
        </div>
      </div>
      }

      {isEmpty &&
        <div id='divNoPhoto'>
          <div id='divNoPhotoInside'>
            No se encuentran fotos disponibles.
          </div>
        </div>
      }
      <img  src='' id= 'img1' alt='' 
            onClick={()=>{clickOnImage(1);
                          props.setSelectedGalleryPhoto(galleryIndxSh[0]);
            }}/> 
      <img  src='' id='img2' alt='' 
            onClick={()=>{clickOnImage(2) 
                          props.setSelectedGalleryPhoto(galleryIndxSh[1]);
            }}/>
      <img  src='' id='img3' alt='' 
            onClick={()=>{clickOnImage(3) 
                          props.setSelectedGalleryPhoto(galleryIndxSh[2]);
            }}/>
      <img id='displayedImg' src={props.gallerySrc.get(props.selectedPhoto)} alt=''/>
    </div>
  );
}

export default ResultsTab;
