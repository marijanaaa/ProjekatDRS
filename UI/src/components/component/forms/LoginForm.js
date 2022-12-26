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
  const emailReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: action.val.includes('@') };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: state.value.includes('@') };
    }
    return { value: '', isValid: false };
  };
  
  const passwordReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: action.val.trim().length > 6 };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: state.value.trim().length > 6 };
    }
    return { value: '', isValid: false };
  };
  
  const LoginForm = (props) => {
    
    
    const { isLoading, sendRequest } = useHttp();
    
    const [infoData, setInfoData] = useState(null);//da ispise sta se desilo

    const [formIsValid, setFormIsValid] = useState(false);
  

    
    


   
     
  
    

    const [emailState, dispatchEmail] = useReducer(emailReducer, {
      value: '',
      isValid: null,
    });
    const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
      value: '',
      isValid: null,
    });
  
    const authCtx = useContext(AuthContext);
    const history = useHistory();

    const emailInputRef = useRef();
    const passwordInputRef = useRef();
  
    useEffect(() => {
      console.log('EFFECT RUNNING');
  
      return () => {
        console.log('EFFECT CLEANUP');
      };
    }, []);
  
    const { isValid: emailIsValid } = emailState;
    const { isValid: passwordIsValid } = passwordState;
  
    useEffect(() => {
      const identifier = setTimeout(() => {
        console.log('Checking form validity!');
        setFormIsValid(emailIsValid && passwordIsValid);
      }, 500);
  
      return () => {
        console.log('CLEANUP');
        clearTimeout(identifier);
      };
    }, [emailIsValid, passwordIsValid]);
  
    const emailChangeHandler = (event) => {
     // console.log(event.target.value);
      dispatchEmail({ type: 'USER_INPUT', val: event.target.value });
  
      // setFormIsValid(
      //   event.target.value.includes('@') && passwordState.isValid
      // );
    };
  
    const passwordChangeHandler = (event) => {
      dispatchPassword({ type: 'USER_INPUT', val: event.target.value });
  
      // setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
    };
  
    const validateEmailHandler = () => {
      dispatchEmail({ type: 'INPUT_BLUR' });
    };
  
    const validatePasswordHandler = () => {
      dispatchPassword({ type: 'INPUT_BLUR' });
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
      
     if(formIsValid){
     
      const requestConfig = {
        url: 'http://localhost:5000/login',
        method: "POST",
        body: JSON.stringify({
          email:emailState.value,
          password: passwordState.value,
         
          token: true,

        }
        ),
        headers: {
          "Content-Type": "application/json"
        },
       
        
      };

      //token:true-znaci da ocekuje da nam ga server napravi.

      const data = await sendRequest(requestConfig);
     
      //u data je ono sto server posalje kao odgovor(u firebase salje name)
  
    
    
      if(data.length === 0){//promeniti u skladu sa odg sa servera
       
        authCtx.login(null);//nije uspesno logovanje
        setInfoData({
          title:  "Error",
          message: "Error in login",
        });
         history.replace("/registration");
        
       
       
        }
        else{
       authCtx.login(data); //za sada ce to biti neki token, kasnije ce to biti 
       setInfoData({
        title:  "Success",
        message: "Succesfuly!",
      });

        }

       
      
    }

  
   
    else if (!emailIsValid) {
      emailInputRef.current.focus();
    }
    else if (!passwordIsValid) {
      passwordInputRef.current.focus();
    }
  }


  
    return (
      <Card className={classes.login}>
     {isLoading && <Modal/>}
       {infoData && (
        <InfModal
          title={infoData.title}
          message={infoData.message}
          onConfirm={infoData.title === "Error" ?  hideErrorModalHandler : hideSuccessModalHandler}
        />
      )}
        <form onSubmit={submitHandler}>
          <Input
            ref={emailInputRef}
            id="email"
            label="E-Mail"
            type="email"
            isValid={emailIsValid}
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
          <Input
            ref={passwordInputRef}
            id="password"
            label="Password"
            type="password"
            isValid={passwordIsValid}
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
          <div className={classes.actions}>
            <Button type="submit" className={classes.btn}>
              Login
            </Button>
          </div>
        </form>
      </Card>
    );
  };
  
  export default LoginForm;
  