import React from 'react'
import './SymptomsTab.css'

export function SymptomsTab(props){
  return(
    <div className='tabBody'>
			<form>
      {//****** pacient ******
      }
				<div id='pacient'>
          
          <div id='p_leftDiv'>
					  <span htmlFor="rut">Rut: </span>
					  <input type="number" name="rut" id="rutInput" placeholder="12345678-9" className='p_input'/>
            <br/>
					  <span >Sexo:</span>
      		  <input className='p_input CB'type="checkbox" id='sexoF' name='sexoF' onClick={()=>clickOnCheckbox('sexoF')}/>
      		  <span > F </span>
      		  <input className='p_input CB'type="checkbox" id='sexoM' name='sexoM' onClick={()=>clickOnCheckbox('sexoM')}/>
      		  <span > M </span>
          </div>

          <div id='p_rightDiv'>
					  <span id='birthDateLabel'>Fecha de nacimiento: </span>
            <br/>
  					<span >Número de caso: </span>
	  				<span className='p_input'id='caseNumber'> 12345</span>

          </div>
					<input className='p_input'type="date" name="birthDate" id="birthDateInput" />
				</div>

       {//******* background *********
        }
        <div id='backgroundDiv'>
			  	<span id='bg_title' className='title'>
			  	Antecedentes
			  	</span>
			  		<MarkYesNoBG fieldId='otitis' fieldName='Otitis frecuente en infancia: ' type='bg'/>
			  		<MarkYesNoBG fieldId='earSurgery' fieldName='Cirugía en oído: ' type='bg'/>
            <div id='whichSurgDiv'>
              <span id='whichSurgLabel'> Indique cual: </span>
              <input type='text' name='wichSurg' id='whichSurg' />
              <input className='CB' type="checkbox" id='leftEar' value=""/>
              <span className=''> Oído Izq. </span>
              <input className='CB' type="checkbox" id='rightEar' value=""/>
              <span className=''>Oído Der. </span>
            </div>
			  		<MarkYesNoBG fieldId='family' fieldName='Familiares con hipoacusia: ' type='bg'/>
			  		<MarkYesNoBG fieldId='swabs' fieldName='Uso cotonitos o limpieza personal de oídos: ' type='bg'/>
			  		<MarkYesNoBG fieldId='earwax' fieldName='Tapones de cerumen o repetición: ' type='bg'/>
			  		<MarkYesNoBG fieldId='coldWater' fieldName='Baños en agua fróa, natación, deportes náuticos, surf o andinismo: ' type='bg'/>
				</div>

        {//******** Symptoms *********
       } 
       <div id='symptomsDiv'>
				<span id='sym_title' className='title'>
				Síntomas
				</span>
        <div id='symptomsLeftDiv'>
          <MarkYesNoSY fieldId='tinnitus' fieldName='Tinnitus: ' type='sy'/>
          <MarkYesNoSY fieldId='otalogia' fieldName='Otalogía: ' type='sy'/>
          <MarkYesNoSY fieldId='sepuracion' fieldName='Sepuración: ' type='sy'/>
        </div>
        <div id='symptomsRightDiv'>
          <MarkYesNoSY fieldId='prurito' fieldName='Prurito: ' type='sy'/>
          <MarkYesNoSY fieldId='hipoacusia' fieldName='Hipoacusia: ' type='sy'/>
          <MarkYesNoSY fieldId='fiebre' fieldName='Fiebre: ' type='sy'/>
        </div>
      </div>

    </form>
    
    <div className='button' id='infoReady' onClick={()=> props.infoReady()}> Listo </div>
    <div id='incompleteFormWarning'> Debe marcar una opción en cada categoría </div>
  </div>
  );
}


function MarkYesNoBG(props){
	let yesId = 'yes_' + props.fieldId;
	let noId = 'no_' + props.fieldId;
	return(
		<div className='bg_yesNo'>
      <span className='bg_fieldLabel'htmlFor={props.fieldId}> {props.fieldName} </span>
      <input className='CB' type="checkbox" id={yesId} name={yesId} onClick={()=>clickOnCheckbox(yesId)}/>
      <span className='bg_yesLabel' htmlFor={yesId}> Si </span>
      <input className='CB' type="checkbox" id={noId} name={noId} onClick={()=>clickOnCheckbox(noId)}/>
      <span className='bg_noLabel'htmlFor={noId}> No </span>
		</div>
	);
}
function MarkYesNoSY(props){
	let yesId = 'yes_' + props.fieldId;
	let noId = 'no_' + props.fieldId;
	return(
		<div className='sy_yesNo'>
      <span className='sy_fieldLabel'> {props.fieldName} </span>
      <input className='CB' type="checkbox" id={yesId} name={yesId} onClick={()=>clickOnCheckbox(yesId)}/>
      <span className='sy_yesLabel' htmlFor={yesId}> Si </span>
      <input className='CB' type="checkbox" id={noId} name={noId} onClick={()=>clickOnCheckbox(noId)}/>
      <span className='sy_noLabel'htmlFor={noId}> No </span>
      <SymptomsLevel fieldId={props.fieldId}/>
		</div>
	);
}

function clickOnCheckbox(id){
  if(id.split('_')[0].localeCompare('yes') === 0){
    let oppositeCB = 'no_' + id.split('_')[1];
    document.getElementById(oppositeCB).checked = false;
    if(document.getElementById(id.split('_')[1])){
      enableLevelSelector(id.split('_')[1]);
    }
    //enable whichSurgery
    if(id.localeCompare('yes_earSurgery') === 0){
      document.getElementById('whichSurgDiv').style.pointerEvents = 'auto';
      document.getElementById('whichSurgDiv').style.color= 'black';
    }
  }
  else if(id.split('_')[0].localeCompare('no') === 0){
    let oppositeCB = 'yes_' + id.split('_')[1];
    document.getElementById(oppositeCB).checked = false;
    if(document.getElementById(id.split('_')[1])){
      disableLevelSelector(id.split('_')[1]);
    }
    //disable whichSurgery
    if(id.localeCompare('no_earSurgery') === 0){
      document.getElementById('whichSurgDiv').style.pointerEvents = 'none';
      document.getElementById('whichSurgDiv').style.color= 'gray';
    }
  }
    //else sexoF or sexoM
  else if(id.charAt(4).localeCompare('M') === 0){
    document.getElementById(id.replace('M','F')).checked = false;
  }
  else if(id.charAt(4).localeCompare('F') === 0){
    document.getElementById(id.replace('F','M')).checked = false;
  }
}
function enableLevelSelector(id){
  document.getElementById(id).style.color = 'black';
  document.getElementById(id).style.pointerEvents = 'auto';
}
function disableLevelSelector(id){
  document.getElementById(id).style.color = 'gray';
  document.getElementById(id).style.pointerEvents = 'none';
}
function SymptomsLevel(props){
	return(
			<select name={props.fieldId} id={props.fieldId} className="symptomsLevel">
				<option value="Leve">Leve</option>
				<option value="Continuo">Continuo</option>
			</select>
	);
}
export default SymptomsTab
