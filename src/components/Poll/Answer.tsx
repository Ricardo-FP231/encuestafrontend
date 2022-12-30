import { FC } from "react";
import { Form } from "react-bootstrap";
import { Circle, Square, Trash } from "react-bootstrap-icons";
import { usePollDispatch, usePollState } from "../../context/pollContext";

interface AnswerProps {
    questionIndex: number,
    answerIndex: number
}

const Answer: FC<AnswerProps> = ({ questionIndex, answerIndex }) => {

    const poll = usePollState();
    const pollDispacth = usePollDispatch();

    const answer = poll.questions[questionIndex].answers[answerIndex];
    const question = poll.questions[questionIndex];

    const errors: any = poll.errors;
    const errorKey = `questions[${questionIndex}].answers[${answerIndex}]`;

    const renderIcon = () => {
        switch (question.type) {
            case "CHECKBOX":
                return <Square className="me-1"></Square>
            case "SELECT":
                return <span className="me-1">{answerIndex + 1}. </span>
            case "RADIO":
                return <Circle className="me-1"></Circle>
        }
    }

    return (
        <>
            <div className="d-flex align-items-center mb-2 answer-item">
                {renderIcon()}
                <Form.Control
                    type="text"
                    value={answer.content}
                    placeholder="Respuesta"
                    onChange={(e:any) => {
                        pollDispacth({
                            type: "answercontent",
                            payload: {
                                answerIndex,
                                index: questionIndex,
                                content: e.target.value

                            }
                        })
                    }}
                    isValid={!!errors[`${errorKey}?.content`]}
                />
                <span data-tip="Eliminar Respuesta">
                    <Trash className="ms-1 delete-answer" onClick={() => {
                        pollDispacth({
                            type: "removeanswer",
                            payload: {
                                index: questionIndex,
                                answerId: answer.id
                            }
                        })
                    }}></Trash>
                </span>
            </div>
            <div className="invalid-feedback d-block mb-2">
                {errors[`${errorKey}.content`]}
            </div>

        </>
    )
}

export default Answer;