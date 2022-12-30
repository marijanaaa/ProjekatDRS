import React, {
    useState,
    useEffect,
    useReducer,
    useContext,
    useRef,
} from 'react';
import Card from '../card/Card';
import Button from '../button/Button';
import AuthContext from '../../../store/auth-context';
import Input from '../input/Input';
import classes from './LoginForm.module.css';
import Modal from "../modals/Modal";
import useHttp from "../../../hook/useHttp";
import { useHistory } from 'react-router-dom';
import InfModal from '../modals/InfModal';
const amountReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
        return { value: action.val, isValid: action.val.trim().length > 0 };
    }
    if (action.type === 'INPUT_BLUR') {
        return { value: state.value, isValid: state.value.trim().length > 0 };
    }
    return { value: '', isValid: false };
};

function PayFromCardForm() {

    const history = useHistory();
    const { isLoading, sendRequest } = useHttp(); //koristimo hook koji je odvojen
    const ctx = useContext(AuthContext);
    const [infoData, setInfoData] = useState(null);//da ispise sta se desilo

    const [formIsValid, setFormIsValid] = useState(false);

    const [amountState, dispatchAmount] = useReducer(amountReducer, {
        value: '',
        isValid: null,
    });

    const [currencyState, dispatchCurrency] = useReducer(currencyReducer, {
        value: '',
        isValid: null,
    });

    const authCtx = useContext(AuthContext);
    const amountInputRef = useRef();
    const currencyInputRef = useRef();

    const { isValid: amountIsValid } = amountState;
    const { isValid: currencyIsValid } = currencyState;

    useEffect(() => {
        const identifier = setTimeout(() => {
            console.log('Checking form validity!');
            setFormIsValid(amountIsValid);
        }, 500);

        return () => {
            console.log('CLEANUP');
            clearTimeout(identifier);
        };
    }, [amountIsValid, currencyIsValid]);

    const amountChangeHandler = (event) => {
        dispatchAmount({ type: 'USER_INPUT', val: event.target.value });
    };

    const currencyChangeHandler = (event) => {
        dispatchAmount({ type: 'USER_INPUT', val: event.target.value });
    };

    const validateCurrencyHandler = () => {
        dispatchCurrency({ type: 'INPUT_BLUR' });
    };

    const validateAmountHandler = () => {
        dispatchAmount({ type: 'INPUT_BLUR' });
    };

    function hideErrorModalHandler() {//da se ukloni prozorcic
        setInfoData(null);
    }

    function hideSuccessModalHandler() { //isto da ukloni prozor sa obavestenjem
        setInfoData(null);
        history.replace('/');
    }

    async function submitHandler(event) {
        event.preventDefault();

        if (formIsValid) {

            const requestConfig = {
                url: 'http://localhost:5000/cardTransaction',
                method: "POST",
                body: JSON.stringify({
                    email: authCtx.user.email,
                    dollars: amountState.value,
                    currency: currencyState.value,
                }
                ),
                headers: {
                    "Content-Type": "application/json"
                },
            };
            const data = await sendRequest(requestConfig);

            if (data.length === 0) {//promeniti u skladu sa odg sa servera
                setInfoData({
                    title: "Error",
                    message: "Error in transaction",
                });

            }
            else {
                setInfoData({
                    title: "Success",
                    message: "Succesfuly!",
                });

            }

        }
        else if (!amountIsValid) {
            amountInputRef.current.focus();
        }

        return (
            <Card className={classes.login}>
                {isLoading && <Modal />}
                {infoData && (
                    <InfModal
                        title={infoData.title}
                        message={infoData.message}
                        onConfirm={infoData.title === "Error" ? hideErrorModalHandler : hideSuccessModalHandler}
                    />
                )}
                <form onSubmit={submitHandler}>
                    <Input
                        ref={amountInputRef}
                        id="dollars"
                        label="Amount"
                        type="text"
                        isValid={amountIsValid}
                        value={amountState.value}
                        onChange={amountChangeHandler}
                        onBlur={validateAmountHandler}
                    />
                    <select id='currency' label='currency' isValid={currencyIsValid} value={currencyState.value} onBlur={validateAmountHandler}>
                        {
                            Object.entries(authCtx.user.cryptocurrencies)
                                .map(([key, value]) => <option value={key}>{key} : {value}</option>)
                        }
                    </select>

                    <div className={classes.actions}>
                        <Button type="submit" className={classes.btn}>
                            Pay
                        </Button>
                    </div>
                </form>
            </Card>
        );
    };
}

export default PayFromCardForm;