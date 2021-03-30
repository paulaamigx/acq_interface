import './LabelingUI.css';
import {Container} from 'reactstrap';
import React from 'react';

class LabelingUI extends React.Component {

    constructor(props){
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <Container fluid>
                <h1>Etiquetado</h1>
            </Container>
        );
    }
}

export default LabelingUI;