import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from "react-bootstrap"
import React, { useState } from "react";
import { loginUser } from "../services/UserService";
import { useAuthDispatch, useAuthState } from "../context/authContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [sendingData, setSendingData] = useState(false);

    const authDispatch = useAuthDispatch();
  
    const Login = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            setSendingData(true);
            setError("");
            const res = await loginUser(email,password);
            const token =res.data.token;
            authDispatch({
                type: 'login',
                token
            });
        } catch (errors: any) {
            if(errors.response){
                errors.response.status === 403 && setError("usuario o contraseña incorrectos");
            }
            console.log(errors.response);
            setSendingData(false);
        }

    }

    return (
        <Container>
            <Row>
                <Col lg="5" md="10" sm="10" className="mx-auto">
                    <Card className="mt-5">
                        <Card.Body>
                            <h4 className="text-center">Iniciar sesion</h4><hr />
                            <Form onSubmit={Login}>

                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Correo Electrónico</Form.Label>
                                    <Form.Control

                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        type="email" placeholder="ej. ricardo@gmail.com"></Form.Control>

                                </Form.Group>

                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control

                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        type="password" placeholder="*******"></Form.Control>

                                </Form.Group>

                                <Button type="submit">
                                    {sendingData ?
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" arial-hidden="true" />&nbsp;
                                            <span>Iniciando su sesion...</span>
                                        </> : <>Iniciar sesion</>}

                                </Button>
                            </Form>
                            <br></br>
                            <Alert show={!!error} variant="danger">{error}</Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
