import { ChartData } from "chart.js";

export type User = {
    email: string,
    token: string,
    isAuthenticated: boolean
};

export type RouteType = "PRIVATE" | "PUBLIC" | "GUEST";

export type Route = {
    path: string,
    component: any,
    routeType: RouteType
};

export type Poll = {
    id: string,
    errors: {},
    content: string,
    opened: boolean,
    questions: Question[]
};

export type Question = {
    id: string,
    content: string,
    questionOrder: number,
    type: QuestionType,
    answers: Answer[]
}

export type Answer = {
    id: string,
    content: string
}

export type QuestionType = "RADIO" | "CHECKBOX" | "SELECT";

export type UserAnswer = {
    questionId: number,
    answer: number,
    type: QuestionType

}

export type PollReplyDetail = {
    questionId: number,
    answerId: number

}

export type PollReply = {
    pollReplies: PollReplyDetail[],
    user: string,
    poll: number
}

export type PollResultDatail = {
    answer: string,
    result: number
}

export type PollResult = {
    question: string,
    details: PollResultDatail[]
}

export type PollChartData = {
    data: ChartData,
    title: String,
    questionId: number
}