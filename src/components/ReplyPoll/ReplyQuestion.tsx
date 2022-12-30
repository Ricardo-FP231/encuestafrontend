import { FC } from "react";
import { Form } from "react-bootstrap";
import { Question, UserAnswer } from "../../types";

interface ReplyQuestionProps {
    question: Question;
    changeCallBack: Function
}

const ReplyQuestion: FC<ReplyQuestionProps> = ({ question, changeCallBack }) => {
    const renderAnswers = () => {
        switch(question.type){
            case "RADIO":   
            case "CHECKBOX":{
                return question.answers.map(answer =>{
                    return <div key={answer.id} className="mb-2">
                        <Form.Check
                            onChange={(e)=>{
                                const data : UserAnswer ={
                                    questionId : parseInt(question.id),
                                    answer: parseInt( e.target.value),
                                    type: question.type
                                }
                                changeCallBack(data)
                            }}
                            value={answer.id}
                            type={question.type === "RADIO" ? "radio" : "checkbox"}
                            name={question.id}
                            id={answer.id}
                            label={answer.content}
                        />
                    </div>
                });
            }
            case "SELECT":{
                return <div className="mb-2">
                    <Form.Control as= "select"
                    onChange={(e)=>{
                        const data : UserAnswer ={
                            questionId : parseInt(question.id),
                            answer: parseInt( e.target.value),
                            type: question.type
                        }
                        changeCallBack(data)
                    }}
                    className="form-select">
                        <option value="">Seleccione una opción</option>
                        {
                            question.answers.map(answer=> <option value={answer.id} key={answer.id}>{answer.content}</option>)
                        }
                    </Form.Control>
                </div>
            }
        }
    }

    return (
        <div className="mb-4">
            <h6>{question.content}</h6>
            {renderAnswers()}
        </div>
    )
}

export default ReplyQuestion;