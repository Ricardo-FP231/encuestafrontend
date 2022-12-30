import { FC, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { RouteComponentProps } from "react-router-dom";
import ResultsChart from "../components/Results/ResultsChart";
import { getPollResults } from "../services/PollService";
import { PollResult, PollChartData } from "../types";

interface RouteParams {
    id: string;
}

interface ResultProps extends RouteComponentProps<RouteParams> {

}

const Results: FC<ResultProps> = (props) => {

    const pollId = props.match.params.id;
    const [chartData, setChartData] = useState<PollChartData[]>([]);
    const [pollTitle, setPollTitle] = useState("");


    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const res: any = await getPollResults(pollId);
            const results: PollResult[] = res.data.results;
            formatData(results);
            setPollTitle(res.data.content);
        } catch (error) {

        }
    }

    const renderResultsChart =()=>{
        return chartData.map(data => 
            <ResultsChart chartData={data} key={data.questionId}></ResultsChart>
            );
    }

    const formatData = (results: PollResult[]) => {
        const pollChartData: PollChartData[] = [];
        try {
            for (let key in results) {
                let chartData: any = {
                    data: {
                        labels: [],
                        datasets: [{ data: [] }]
                    },
                    title: results[key].question,
                    questionId: key
                }
                results[key].details.forEach(detail => {
                    chartData.data.labels?.push(detail.answer)
                    chartData.data.datasets[0].data.push(detail.result);
                })
                pollChartData.push(chartData);
            }
        } catch (error) {
            console.log(error);
        }
        
        setChartData(pollChartData);
    }


    return (
        <Container>
            <Row>
                <Col lg="6" md="10" sm="10" className="mx-auto mt-5">
                    <div className="header">
                        <h4>{pollTitle}</h4>
                    </div>
                    {renderResultsChart()}
                </Col>
            </Row>
        </Container>

    )
}

export default Results;
