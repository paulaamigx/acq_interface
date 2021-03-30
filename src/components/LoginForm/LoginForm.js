import React, { Component } from 'react';
import Reaptcha from 'reaptcha';
import {Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';

import './LoginForm.css';
import { Redirect } from 'react-router-dom';

class LoginForm extends Component{
    
    constructor(props) {
        super(props);
        this.state = {
            verified: false,
            username: '',
            password: '',
            error: false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
          [name]: value,
          redirect: false
        });
    }

    handleSubmit() {
        if(this.state.username === 'admin' && this.state.password === 'admin'){
            this.setState({
                error: false,
                redirect: true
            });
            this.props.action();
        } else {
            this.setState({
                error: true
            });
        }
    }

    onVerify = recaptchaResponse => {
        this.setState({
            verified: true
        });
    };

    render() {
        return (
            <Container fluid>
                {this.state.redirect?<Redirect to='/' />:''}
                <Row>
                <Col sm="0" md="1">
                </Col>
                <Col sm="12" md="10">
                    <Form id="LoginForm">
                        <h3 className="text-center">Identifícate</h3>
                        <FormGroup>
                            <Label for="username">Usuario</Label>
                            <Input
                                type="text"
                                name="username"
                                id="username"
                                value={this.state.username}
                                onChange={this.handleInputChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="password">Contraseña</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="*********"
                                value={this.state.password}
                                onChange={this.handleInputChange}
                            />
                        </FormGroup>
                        
                        <FormGroup>
                            <Reaptcha sitekey="6Lf0J60ZAAAAALxJCFDbg4NiMEy8J0-uuZT6DzOE" onVerify={this.onVerify} />
                        </FormGroup>

                        <FormGroup>
                            <Button
                                outline
                                block size="lg"
                                disabled={!this.state.verified}
                                onClick={this.handleSubmit}
                            >
                                Enviar
                            </Button>
                        </FormGroup>
                        <p style={{color:'red'}}>{this.state.error?"Usuario/contraseña incorrrectos.":""}</p>
                    </Form>                    
                </Col>
                <Col sm="0" md="1">
                </Col>
                </Row>
            </Container>
        );
    }
}
export default LoginForm;