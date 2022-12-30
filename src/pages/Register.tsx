import { Container, Row, Col, Form, Button, Card, Spinner } from "react-bootstrap"
import React, { useState } from "react";
import { loginUser, registerUser } from "../services/UserService";
import { useAuthDispatch } from "../context/authContext";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<any>({});
    const [sendingData, setSendingData] = useState(false);
    const authDispatch = useAuthDispatch();

    const register = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            setSendingData(true);
            await registerUser(name, email, password);
            const res = await loginUser(email, password);
            const token = res.data.token;
            authDispatch({
                type: 'login',
                token
            })
        } catch (errors: any) {
            if (errors.response) {
                errors.response.status === 400 && setErrors(errors.response.data.errors);
            }
            setSendingData(false);
            
        }

    }

    return (
        <Container>
            <Row>
                <Col lg="5" md="10" sm="10" className="mx-auto">
                    <Card className="mt-5">
                        <Card.Body>
                            <h4 className="text-center">Registro de Cuenta</h4><hr />
                            <Form onSubmit={register}>

                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        isInvalid={!!errors?.name}
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        type="text" placeholder="ej. Ricardo Fuentes"></Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors?.name}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Correo Electrónico</Form.Label>
                                    <Form.Control
                                        isInvalid={!!errors?.email}
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        type="email" placeholder="ej. ricardo@gmail.com"></Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors?.email}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control
                                        isInvalid={!!errors?.password}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        type="password" placeholder="*******"></Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors?.password}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button type="submit">
                                    {sendingData ?
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" arial-hidden="true" />&nbsp;
                                            <span>Creando usuario...</span>
                                        </> : <>Crear Cuenta</>}

                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Register;
