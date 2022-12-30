import React, { useContext } from "react";

import classes from "../components/component/forms/LoginForm.module.css";

import Card from "../components/component/card/Card";
import PayFromCardForm from "../components/component/forms/PayFromCardForm";

function ExchangeOffice() {

    return (
        <Card className={classes.account}>
            <PayFromCardForm></PayFromCardForm>
        </Card>
    );
}

export default ExchangeOffice;