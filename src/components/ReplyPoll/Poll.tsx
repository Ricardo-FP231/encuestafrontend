import { FC, useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { Check2Circle } from "react-bootstrap-icons";
import { useHistory } from "react-router-dom";
import { createPollReply, getPollWithQuestions } from "../../services/PollService";
import { PollReplyDetail, Question, UserAnswer } from "../../types";
import ReplyQuestion from "./ReplyQuestion";

interface PollProps {
    id: String;
}

const Poll: FC<PollProps> = ({ id }) => {

    const [poll, setPoll] = useState<any>(null);
    const [user, setUser] = useState("");
    const [errors, setErrors] = useState<any>({});
    const [userAnswers, setUserAnswers] = useState<any>({});
    const [isPollAnswered, setIsPollAnswered] = useState(false);
    const [sendingData, setSendingData] = useState(false);
    const history = useHistory();

    useEffect(() => {
        fectPoll();
    }, []);

    const fectPoll = async () => {
        try {
            const res: any = await getPollWithQuestions(id);
            const data = res.data;
            data.questions = data.questions.sort((a: Question, b: Question) => a.questionOrder - b.questionOrder);
            setPoll(data);
        } catch (error: any) {
            if(error.response.status === 500){
                history.replace("/")
            }
        }
    }

    const handleQuestionChange = (answer: UserAnswer) => {
        const answers = { ...userAnswers };
        switch (answer.type) {
            case "RADIO":
            case "SELECT": {
                answers[answer.questionId] = { questionId: answer.questionId, answerId: answer.answer }
                break;
            }
            case "CHECKBOX": {
                if (answers[answer.questionId]) {
                    const arr = answers[answer.questionId].answers;
                    const index = arr.indexOf(answer.answer)
                    if (index === -1) {
                        arr.push(answer.answer)
                    } else {
                        arr.length < 2 ? delete answers[answer.questionId] : arr.splice(index, 1)
                    }
                } else {
                    answers[answer.questionId] = { questionId: answer.questionId, answers: [answer.answer] }
                }
                break;
            }
        }
        setUserAnswers(answers);
    }

    const renderQuestions = () => {
        return poll.questions.map((question: Question) => <ReplyQuestion changeCallBack={handleQuestionChange} question={question} key={question.id}></ReplyQuestion>);
    }

    const prepareForm = () => {
        setErrors({});

        if (Object.keys(userAnswers).length !== poll.questions.length) {
            setErrors((current: any) => {
                return { ...current, allQuestionsAnswered: "Porfavor responda todas las preguntas" }
            });
            return;
        }

        let replies: PollReplyDetail[] = [];

        for (let key in userAnswers) {
            if (userAnswers[key].answers) {
                userAnswers[key].answers.forEach((id: number) => replies.push({
                    questionId: userAnswers[key].questionId,
                    answerId: id
                }));
            } else {
                replies.push(userAnswers[key])
            }
        }

        sendForm(replies);
    }

    const sendForm = async (replies: PollReplyDetail[]) => {
        try {
            setSendingData(true);
            await createPollReply({
                pollReplies: replies,
                poll: poll.id,
                user: user
            });
            setSendingData(false);
            setIsPollAnswered(true);
        } catch (errors: any) {
            if (errors.response) {
                errors.response.status === 400 && setErrors(errors.response.data.errors)
            }

        }
    }

    return (
        <Container>
            <Row>
                <Col sm="10" md="10" lg="8" className="mx-auto mt-5 mb-5">
                    {
                        isPollAnswered &&
                        <div className="d-flex align-items-center flex-column poll-answered-container">
                            <Check2Circle className="success-icon"></Check2Circle>
                            <Alert show={isPollAnswered} variant="success">
                                Muchas gracias por responder la encuesta
                            </Alert>
                        </div>
                    }
                    {
                        poll && !isPollAnswered && <>
                            <h2>{poll.content}</h2>
                            <hr></hr>
                            <Form.Group className="mb-3" controlId="user">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    value={user}
                                    onChange={e => setUser(e.target.value)}
                                    type="text"
                                    placeholder="E.j. Cosme Fulanito"
                                    isInvalid={!!errors.user}>
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {errors.user}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <div>
                                {renderQuestions()}
                            </div>
                            <Button type="submit" onClick={prepareForm}>
                                {sendingData ?
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" arial-hidden="true" />&nbsp;
                                        <span>Enviando Respuestas...</span>
                                    </> : <>Enviar encuesta</>}
                            </Button>
                            {
                                errors.allQuestionsAnswered &&
                                <Alert className="mt-4" variant="danger">
                                    {errors.allQuestionsAnswered}
                                </Alert>
                            }
                        </>
                    }
                </Col>
            </Row>
        </Container>
    )
}
export default Poll;