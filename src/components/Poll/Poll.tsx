import { usePollDispatch, usePollState } from "../../context/pollContext";
import { Form, Container, Row, Col, FloatingLabel, Button, Toast, ToastContainer, Spinner } from "react-bootstrap";
import Question from "./Question";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import { savePoll } from "../../services/PollService";
import { useState } from "react";

const Poll = () => {
    const [showToast, setShowToast] = useState(false);
    const [sendingData, setSendingData] = useState(false);

    const poll = usePollState();
    const pollDispacth = usePollDispatch();
    const errors: any = poll.errors;

    const rednderQuestions = () => {
        return poll.questions.map((question, index) => {
            return <Draggable key={question.id} draggableId={question.id} index={index}>
                {
                    (provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <Question index={index}></Question>
                        </div>
                    )
                }
            </Draggable>
        });
    };

    const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        if (result.source.index === result.destination.index) return;

        pollDispacth({
            type: "orderquestions",
            payload: {
                source: result.source.index,
                destination: result.destination.index
            }
        })
    }

    const createPoll = async () => {
        const data = {
            content: poll.content,
            opened: poll.opened,
            questions: poll.questions
        }

        try {
            setSendingData(true);
            await savePoll(data);
            pollDispacth({ type: "resetformall" });
            setShowToast(true);
            setSendingData(false);
        } catch (errors: any) {
            if (errors.response && errors.response.status === 400) {
                pollDispacth({
                    type: "seterrors",
                    errors: errors.response.data.errors
                })
            }
            setSendingData(false);
        }
    }

    return (
        <Container className="mt-5 mb-5">
            <Row>
                <Col className="mx-auto" sm="10" md="10" lg="8">
                    <FloatingLabel controlId="poll-content" label="Título de la encuesta">
                        <Form.Control
                            value={poll.content}
                            onChange={(e: any) => pollDispacth({
                                type: "pollcontent",
                                content: e.target.value
                            })}
                            size="lg"
                            type="text"
                            placeholder="Título de la encuesta"
                            isInvalid={!!errors?.content}
                        >
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {errors?.content}
                        </Form.Control.Feedback>
                    </FloatingLabel>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId={uuid()}>
                            {
                                (provided) => (
                                    <div{...provided.droppableProps} ref={provided.innerRef}>
                                        {rednderQuestions()}
                                        {provided.placeholder}
                                    </div>
                                )
                            }
                        </Droppable>
                    </DragDropContext>
                    <Button size="lg" variant="outline-primary" onClick={createPoll} className="mt-5">
                        {sendingData ?
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" arial-hidden="true" />&nbsp;
                                <span>Creando Encuesta...</span>
                            </> : <>Crear Encuesta</>}
                        
                    </Button>
                </Col>
            </Row>
            <ToastContainer position="top-end">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide>
                    <Toast.Header closeButton={false}>
                        <span>Encuesta creada con exito</span>
                    </Toast.Header>
                    <Toast.Body> Puedes copiar el enlace desde el panel</Toast.Body>
                </Toast>
            </ToastContainer>

        </Container>
    );
}

export default Poll;