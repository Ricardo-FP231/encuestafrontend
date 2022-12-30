import { FC, useEffect } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Plus, PlusCircle, PlusLg, Trash } from "react-bootstrap-icons";
import { usePollDispatch, usePollState } from "../../context/pollContext";
import { questionTypeOptions } from "../../utils/constants";
import Answer from "./Answer";
import ReactTooltip from "react-tooltip";

interface QuestionProps {
    index: number
}

const Question: FC<QuestionProps> = ({ index }) => {

    const poll = usePollState();
    const pollDispacth = usePollDispatch();
    const question = poll.questions[index];
    const errors: any = poll.errors;
    const errorKey = `questions[${index}]`;

    useEffect(() => {
        ReactTooltip.rebuild();

    }, [question.answers.length]);

    const renderAnswer = () => {
        return question.answers.map((answer, answerIndex) => (
            <Answer
                key={answer.id}
                questionIndex={index}
                answerIndex={answerIndex} />
        )
        )
    }

    return (
        <Card className="mt-3">
            <Card.Body>
                <Row>
                    <Col sm="12" md="6" className="mb-4">
                        <Form.Control
                            type="text"
                            placeholder="Pregunta"
                            onChange={(e: any) => pollDispacth({
                                type: "questioncontent",
                                payload: {
                                    content: e.target.value,
                                    index
                                }
                            })}
                            value={question.content}
                            isInvalid={!!errors[`${errorKey}.content`]}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors[`${errorKey}.content`]}
                        </Form.Control.Feedback>
                    </Col>

                    <Col sm="12" md="6" className="mb-4">
                        <Form.Control
                            as="select"
                            className="form-select"
                            value={question.type}
                            onChange={(e) => {
                                pollDispacth({
                                    type: "changequestiontype",
                                    payload: {
                                        index,
                                        value: e.target.value
                                    }
                                })
                            }}
                            isInvalid={!!errors[`${errorKey}.type`]}
                        >
                            <option>Tipo de pregunta</option>
                            {
                                questionTypeOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.name}
                                    </option>
                                ))
                            }
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {errors[`${errorKey}.type`]}
                        </Form.Control.Feedback>
                    </Col>
                </Row>
                <Container>
                    {renderAnswer()}
                    <Button size="sm" className="mt-2" variant="outline-primary" onClick={() => {
                        pollDispacth({
                            type: "newanswer",
                            index
                        })
                    }}>
                        <PlusLg /> Añadir Respuesta
                    </Button>
                </Container>
                <hr />
                <div className="d-flex justify-content-end">
                    <span data-tip="Nueva Pregunta" data-delay-hide='100'>
                        <PlusCircle className="option-question-icon ms-1"
                            onClick={() => {
                                pollDispacth({
                                    type: "newquestion",
                                    index
                                })
                            }}
                        ></PlusCircle>
                    </span>

                    <span data-tip="Eliminar Pregunta" data-delay-hide='100'>
                        <Trash className="option-question-icon ms-1"
                            onClick={() => {
                                pollDispacth({
                                    type: "removequestion",
                                    questionId: question.id
                                })
                            }}
                        ></Trash>
                    </span>
                </div>

                <ReactTooltip place="left" effect="solid" />

            </Card.Body>
        </Card>
    )
}


export default Question;