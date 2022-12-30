import Poll from "../components/Poll/Poll";
import { PollProvider } from "../context/pollContext"

const CreatePoll = () => {
    return (
        <PollProvider>
            <Poll></Poll>
        </PollProvider>
    );
}

export default CreatePoll;