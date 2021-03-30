import { jsPDF } from "jspdf";

export function changeDiagnosisImgOnModal(dir,indx, setIndx){
  if(dir.localeCompare('right')===0){
    if(indx < 4){
      indx++;
      document.getElementById('d_modalImg').src = document.getElementById('diagnosisImg'+indx).src;
      document.getElementById('d_modalImgTag').innerHTML = document.getElementById('d_ImgTag'+indx).innerHTML;
      setIndx(indx);
    }
  }
  else if(dir.localeCompare('left')===0){
    if(indx > 1){
      indx--;
      document.getElementById('d_modalImg').src = document.getElementById('diagnosisImg'+indx).src;
      document.getElementById('d_modalImgTag').innerHTML = document.getElementById('d_ImgTag'+indx).innerHTML;
      setIndx(indx);
    }
  }
}

export async function makeReport(setPdfSrc, reportReady){
  document.body.style.cursor = 'wait';
  document.getElementById('btnMakeReport').innerHTML = 'Generando...';
  var pdf = new jsPDF('p', 'pt', 'a4');
  let report = document.getElementById('ReportPage');
  document.getElementById('r_obsBox').innerHTML = document.getElementById('diagnosisBox3').value;
  document.getElementById('r_diagnosisBox').innerHTML = document.getElementById('diagnosisBox2').value;
  pdf.html(report,{
             callback: function(pdf){
              setPdfSrc(pdf.output('datauristring'));
              console.log(reportReady);
              reportReady();
              document.body.style.cursor = 'default';
             }
           });
}


export default {changeDiagnosisImgOnModal, makeReport};
