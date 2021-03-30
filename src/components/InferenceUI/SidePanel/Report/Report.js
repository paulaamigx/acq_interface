import React from 'react'
import logo from './images/logo_h.jpg'
import banner from './images/banner.png'
import './Report.css'

export function Report(props){
  let date = new Date();
  let month = date.getMonth() +1;
  let dateFormat = date.getDate() + '/'+ month + '/'+ date.getFullYear();
  console.log(props.diagnosisImgs.length);
  return(
    <div id='ReportDiv'>
      <div id='ReportPage'>
        <div id='r_logoDiv'>
          <img id='r_logoImg' src={logo} alt=''/>
        </div>
        <table id='r_table'>
          <tbody>
            <tr>
              <td> Fecha: </td>
              <td> {dateFormat}  </td>
            </tr>
            <tr>
              <td> Código Paciente: </td>
              <td> TBD  </td>
            </tr>
            <tr>
              <td> Estudio: </td>
              <td> Otoscopía  </td>
            </tr>
            <tr>
              <td> Médico Referente: </td>
              <td> TBD  </td>
            </tr>
            
          </tbody>
        </table>
        <div id='r_title'>
          INFORME
        </div>
        <div id='r_results'>
          <div className='r_subSection'> Resultados</div>
          {props.diagnosisImgs.length >= 1 &&
            <img id='r_img1' className='r_img' src={props.diagnosisImgs[0][0]} alt=''/>
          }
          {props.diagnosisImgs.length >= 2 &&
            <img id='r_img2' className='r_img' src={props.diagnosisImgs[1][0]} alt='ss'/>
          }
          {props.diagnosisImgs.length >= 3 &&
            <img id='r_img3' className='r_img' src={props.diagnosisImgs[2][0]} alt='ss'/>
          }
          {props.diagnosisImgs.length >= 4 &&
            <img id='r_img4' className='r_img' src={props.diagnosisImgs[3][0]} alt=''/>
          }
          {props.diagnosisImgs.length >= 5 &&
            <img id='r_img5' className='r_img' src={props.diagnosisImgs[4][0]} alt='ss'/>
          }
          {props.diagnosisImgs.length >= 6 &&
            <img id='r_img6' className='r_img' src={props.diagnosisImgs[5][0]} alt='ss'/>
          }
        </div>
        {props.diagnosisImgs.length <= 3 &&
          <div>
            <div id='r_obsPage1' >
              <div className='r_subSection'>Observaciones</div>
              <div id='r_obsBox' className='box'/>
            </div>
            <div id='r_diagnosisPage1'> 
              <div className='r_subSection'>Diagnóstico Recomendado</div>
              <div id='r_diagnosisBox' className='box'/>
            </div>
          </div>
        }
        {props.diagnosisImgs.length > 3 &&
          <div>
            <div id='r_obsPage2' >
              <div className='r_subSection'>Observaciones</div>
              <div id='r_obsBox' className='box'/>
            </div>
            <div id='r_diagnosisPage2'> 
              <div className='r_subSection'>Diagnóstico Recomendado</div>
              <div id='r_diagnosisBox' className='box'/>
            </div>
            <div id='r_infoPage2' className='r_info'>
              <img id='r_infoImg' src={banner} alt='info'/>          
            </div>
          </div>
        }
        <div id='r_infoPage1' className='r_info'>
          <img id='r_infoImg' src={banner} alt='info'/>          
        </div>
      </div>
    </div>

  );
}

export default Report;
