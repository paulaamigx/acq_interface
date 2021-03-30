import React from 'react';

import './DiagnosisTab.css'
import './../Report/Report.css'
import Report from './../Report/Report.js'

import logo from './logo.png'
import {Spinner} from 'reactstrap'

import {changeDiagnosisImgOnModal, makeReport} from './functions'

export function DiagnosisTab(props){
	return(
      <div className = "tabBody">
        {!props.superElement.props.currentState.isDiagnosisReady &&
          <DiagnosisLoading/>
        }

        {props.superElement.props.currentState.isDiagnosisReady &&
          <DiagnosisReady setShowDiagnosisImg     = {props.setShowDiagnosisImg}
                          showDiagnosisImg        = {props.showDiagnosisImg}
                          setPdfSrc               = {props.setPdfSrc}
                          diagnosisImgOnModal     = {props.diagnosisImgOnModal}
                          setDiagnosisImgOnModal  = {props.setDiagnosisImgOnModal}
                          diagnosisImgs           = {props.diagnosisImgs}
                          reportReady             = {props.reportReady}
                          diagnosisIndex          = {props.diagnosisIndex}
                          setDiagnosisIndex       = {props.setDiagnosisIndex}
          />
        }
        <Report diagnosisImgs = {props.diagnosisImgs}/>
      </div>
	);
}

function DiagnosisLoading(){
  return(
    <table className = "tableDefault fullSpace">
      <tbody className = 'fullSpace'>
        <tr style={{height: "10%"}}/>
        <tr style={{height: "30%"}}>
          <td colSpan="1"/>
          <td colSpan="2">
            <img src={logo} alt="logo" style={{width: "100%"}}/>
          </td>
          <td colSpan="1"/>
        </tr>
        <tr style={{height: "10%"}}>
          <td colSpan="1"/>
          <td colSpan="2" style={{textAlign: "center"}}>
            <div> Procesando... </div>
          </td>
          <td colSpan="1"/>
        </tr>
        <tr style={{height: "10%"}}>
          <td colSpan="1"/>
          <td colSpan="2" style={{textAlign: "center"}}>
  	        <Spinner color="info" style={{margin:'auto'}} size={'xl'}/>
          </td>
          <td colSpan="1"/>
        </tr>
        <tr style={{height: "40%"}}/>
      </tbody>  
    </table>
  );
}

function DiagnosisReady(props){
  let first = props.diagnosisIndex;
  return(
    <div id='diagnosisReady'>
      <div id= "diagnosisLeft">

        {props.diagnosisImgs.length >= 1 &&
          <div>
            <img  id='diagnosisImg1' className='diagnosisImg' 
                  src= {(props.diagnosisImgs[0])? props.diagnosisImgs[first][0] : ''} alt='frame'
                  onClick={()=>{props.setShowDiagnosisImg(true,1)}}
            /> 
            <div id='diagnosisImgTag1' className='diagnosisImgTag'>
              <span className='d_ImgTagSpan'> 
                <span id='d_ImgTag1'> {props.diagnosisImgs[first][1]} </span> 
                <div id='d_ImgTagUnderline1' className='d_ImgTagUnderline'/>
              </span>
            </div>
          </div>
        }
        {props.diagnosisImgs.length >= 2 &&
          <div>
            <img  id='diagnosisImg2' className='diagnosisImg' 
                  src= {(props.diagnosisImgs[1])? props.diagnosisImgs[first +1][0]  : ''} alt='frame'
                  onClick={()=>{props.setShowDiagnosisImg(true,2)}}
            />
            <div id='diagnosisImgTag2' className='diagnosisImgTag'>  
              <span className='d_ImgTagSpan'> 
                <span id='d_ImgTag2'> {props.diagnosisImgs[first+1][1]} </span> 
                <div id='d_ImgTagUnderline2' className='d_ImgTagUnderline'/>
              </span>
            </div>
          </div>
        }
        {props.diagnosisImgs.length >= 3 &&
          <div>
            <img  id='diagnosisImg3' className='diagnosisImg' 
                  src= {(props.diagnosisImgs[2])? props.diagnosisImgs[first +2][0]  : ''} alt='frame'
                  onClick={()=>{props.setShowDiagnosisImg(true,3)}}
            />
            <div id='diagnosisImgTag3' className='diagnosisImgTag'>  
              <span className='d_ImgTagSpan'> 
                <span id='d_ImgTag3'> {props.diagnosisImgs[first+2][1]} </span> 
                <div id='d_ImgTagUnderline3' className='d_ImgTagUnderline'/>
              </span>
            </div>
          </div>
        }
        {props.diagnosisImgs.length >= 4 &&
          <div>
            <img  id='diagnosisImg4' className='diagnosisImg' 
                  src= {(props.diagnosisImgs[3])? props.diagnosisImgs[first+3][0]  : ''} alt='frame'
                  onClick={()=>{props.setShowDiagnosisImg(true,4)}}
            />
            <div id='diagnosisImgTag4' className='diagnosisImgTag'> 
              <span className='d_ImgTagSpan'>
                <span id='d_ImgTag4'> {props.diagnosisImgs[first+3][1]} </span> 
                <div id='d_ImgTagUnderline4' className='d_ImgTagUnderline'/>
              </span>
            </div>
          </div>
        }


        {props.diagnosisImgs.length >= 5 &&
          <div>
            <div id= 'd_scrollImgsDown' className='d_scroll button' 
                 onClick={()=>{props.setDiagnosisIndex(first+1)}}/>
            <div id= 'd_scrollImgsUp' className='d_scroll button'
                 onClick={()=>{props.setDiagnosisIndex(first-1)}}/>
          </div>
        }
      </div>

      <div id='diagnosisBoxTag1' className='diagnosisBoxTag'> Diagnóstico AMIRA:</div>
      <div id='diagnosisBoxTag2' className='diagnosisBoxTag'> Diagnóstico final:</div>
      <div id='diagnosisBoxTag3' className='diagnosisBoxTag'> Observaciones:</div>

      <div id='diagnosisBox1' className = "diagnosisBox"  >
          <ul className = "listNoneItem">
            <li> Exostosis del conducto </li>
            <li> Tímpano normal </li>
            <li> Cera  </li>
         </ul>
      </div>

      <textarea id='diagnosisBox2' className= 'diagnosisBox' cols="20" rows="1"></textarea>
      <textarea id='diagnosisBox3' className= 'diagnosisBox' cols="20" rows="1"></textarea>
      <div id='btnMakeReport' onClick={()=>makeReport(props.setPdfSrc, props.reportReady)}>
        Generar Informe
      </div>
      {props.showDiagnosisImg &&
        <DiagnosisImgModal  diagnosisImgOnModal     = {props.diagnosisImgOnModal}
                            setShowDiagnosisImg     = {props.setShowDiagnosisImg}
                            setDiagnosisImgOnModal  = {props.setDiagnosisImgOnModal}
        />
      }
      </div>
  );
}

function DiagnosisImgModal(props){
  return(
    <div className='darkBackground'>
      <div id='d_modal' className='modalBasic'>
        <div className='closeModal' onClick={()=>props.setShowDiagnosisImg(false,null)}>
          x
        </div>
        <div className='arrowModal button' id='rightArrowModal'
             onClick={()=>{
             changeDiagnosisImgOnModal('right', props.diagnosisImgOnModal, props.setDiagnosisImgOnModal);
    
             }}>{'>'}
             </div>
        <div className='arrowModal button' id='leftArrowModal'
             onClick={()=>{
             changeDiagnosisImgOnModal('left', props.diagnosisImgOnModal, props.setDiagnosisImgOnModal);
    
             }}>{'<'}
             </div>
        <img id='d_modalImg' alt=''/>
        <legend id='d_modalImgTag'/>
      </div>
    </div>
  );
}
export default DiagnosisTab;
