import React from 'react';
export function ReportTab(props){
  return(
    <div className='tabBody'>
      <embed id='pdf' src={props.pdfSrc}/>
    </div>
  );
}

export default ReportTab;
