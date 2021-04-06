import React from 'react';

import './DiagnosisTab.css'



export function DiagnosisTab(props){
	return(
      <div className = "tabBody">
          <DiagnosisReady  setAcqInfo = {props.setAcqInfo}    
          />
      </div>
	);
}

function DiagnosisReady(props){
  return(
    <div id='diagnosisReady'>
      <span id='d_title'> Diagnóstico </span>
      <br/>
      <input type='checkbox' id='d_normal' onClick={()=>diagnosisSelected('normal')}/>
      <span> Normal </span>
      <br/>
      <input type='checkbox' id='d_anormal' onClick={()=>diagnosisSelected('anormal')}/>
      <span> Anormal </span>
      <select id='selectDiagnosis'>
        <option> Otits media aguda</option>
      </select>
      <div id='diagnosisBoxTag' className='diagnosisBoxTag'> Observaciones:</div>
      <textarea id='diagnosisBox' className= 'diagnosisBox' cols="20" rows="1"></textarea>
      <div id='btnMakeReport' onClick={()=>uploadDiagnosis(props.setAcqInfo)} >
        Subir Diagnóstico
      </div>
      <div id='noDiagnosisWarning' style={{display: 'none', color: 'red'}}> Debe ingresar un diagnostico. </div>
    </div>
  );
}
function uploadDiagnosis(setAcqInfo){
  if( !document.getElementById('d_normal').checked &&!document.getElementById('d_anormal').checked){
    document.getElementById('noDiagnosisWarning').style.display = 'block';
  }
  else{
    let data = Array(3);
    data[0] = document.getElementById('d_normal').checked? 'normal':'anormal';
    data[1] = document.getElementById('d_normal').checked? 'N/A':document.getElementById('selectDiagnosis').value;
    data[2] = document.getElementById('diagnosisBox').value;
    setAcqInfo(data);
  }
}
function diagnosisSelected(diagnosis){
  if(diagnosis.localeCompare('normal') === 0){
    document.getElementById('d_anormal').checked = false;
    document.getElementById('selectDiagnosis').style.color = 'gray';
    document.getElementById('selectDiagnosis').style.pointerEvents = 'none';
  }
  else if(diagnosis.localeCompare('anormal') === 0){
    document.getElementById('d_normal').checked = false;
    document.getElementById('selectDiagnosis').style.color = 'black';
    document.getElementById('selectDiagnosis').style.pointerEvents = 'auto';
  }
}
export default DiagnosisTab;
