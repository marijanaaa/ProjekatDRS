import React, {
    useState
} from "react";
import Card from '../components/component/card/Card';

function AccountBalancePage()
{
    //pozvati get zahtev i cuvati u promenljivoj
    const [stateInDolars, setStateInDolars] = useState(0);
    setStateInDolars(1000)
    return(
        <Card>
            <h1>Account Balance</h1>
            <div>Balance in dolars {stateInDolars}</div>

        </Card>
    );
}
export default AccountBalancePage;