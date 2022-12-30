import axios from "axios";
import { CREATE_POLL_ENDPOINT, CREATE_POLL_REPLY_ENDPOINT, DELETE_POLL_ENDPOINT, GET_POLL_RESULTS_ENDPOINT, GET_POLL_WITH_QUESTIONS_ENDPOINT, GET_USER_POLLS_ENDPOINT, TOGGLE_POLL_OPENED_ENDPOINT } from "../utils/endpoints";
import { PollReply } from "../types"

export const savePoll = (data: any) => {
    return axios.post(CREATE_POLL_ENDPOINT, data);
}

export const getPollWithQuestions = (uuid: String) => {
    return axios.get(GET_POLL_WITH_QUESTIONS_ENDPOINT(uuid));
}

export const createPollReply = (pollreply: PollReply) => {
    return axios.post(CREATE_POLL_REPLY_ENDPOINT, pollreply);
}

export const getUserPolls = (page: number) => {
    return axios.get(GET_USER_POLLS_ENDPOINT(page));
}

export const togglePollOpened = (id:string) => {
    return axios.patch(TOGGLE_POLL_OPENED_ENDPOINT(id));
}

export const deletePoll = (pollId:string) => {
    return axios.delete(DELETE_POLL_ENDPOINT(pollId));
}

export const getPollResults=(id:string)=>{
return axios.get(GET_POLL_RESULTS_ENDPOINT(id));
}