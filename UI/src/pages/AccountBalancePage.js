import React from "react";
import classes from "../components/component/forms/LoginForm.module.css";
import Card from "../components/component/card/Card";

function AccountBalancePage() {
    //get
    //
    //let vr = data.ballanceInDollars
    //setAccountBalance(1000);
    //console.log(accountBalance)
    //lista sa map
    let accountBalance = 0
    return (
        <>
            <h1>&nbsp;</h1>
            <Card className={classes.account}>
                <div>
                    <h1>Account balance</h1>
                    <label>Dollars: {accountBalance}$</label>
                    <h1>&nbsp;</h1>
                    <label>Kripto valute:</label>
                    <ul>
                        <li>Valuta1:</li>
                    </ul>
                </div>
            </Card>
        </>
    );
}

export default AccountBalancePage;