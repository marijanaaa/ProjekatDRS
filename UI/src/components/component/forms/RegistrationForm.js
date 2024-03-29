import React, {
    useState,
    useReducer,
    useRef,
    useEffect,
    useContext,
  } from 'react';
  import { useHistory } from 'react-router-dom';
  import Card from '../card/Card';
  import Button from '../button/Button';
  import AuthContext from '../../../store/auth-context';
  import Input from '../input/Input';
  import classes from './RegistrationForm.module.css';
  import useHttp from "../../../hook/useHttp";
  
  
  import Modal from "../modals/Modal";
  import InfModal from "../modals/InfModal";


  const nameReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: action.val.trim().length > 0 };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: state.value.trim().length > 0 };
    }
    return { value: '', isValid: false };
   
  };

  const lastNameReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: action.val.trim().length > 0 };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: state.value.trim().length > 0 };
    }
    return { value: '', isValid: false };
   
  };

  const addressReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: action.val.trim().length > 0 };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: state.value.trim().length > 0 };
    }
    return { value: '', isValid: false };
   
  };

  const cityReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: action.val.trim().length > 0 };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: state.value.trim().length > 0 };
    }
    return { value: '', isValid: false };
   
  };


  const countryReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: action.val.trim().length > 0 };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: state.value.trim().length > 0 };
    }
    return { value: '', isValid: false };
   
  };

  const numberReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.val, isValid: action.val.trim().length > 0 };
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: state.value.trim().length > 0 };
    }
    return { value: '', isValid: false };
   
  };

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

  
  function RegistrationForm() {
    const history = useHistory();
    const { isLoading, sendRequest } = useHttp(); 
    const ctx = useContext(AuthContext);
    const [infoData, setInfoData] = useState(null);
    

    


    const [formIsValid, setFormIsValid] = useState(false);
  
    const [nameState, dispatchName] = useReducer(nameReducer, {
      value: '',
      isValid: null,
    });
    const [lastNameState, dispatchLastName] = useReducer(lastNameReducer, {
      value: '',
      isValid: null,
    });

    const [addressState, dispatchAddress] = useReducer(addressReducer, {
      value: '',
      isValid: null,
    });

    const [cityState, dispatchCity] = useReducer(cityReducer, {
      value: '',
      isValid: null,
    });

    const [countryState, dispatchCountry] = useReducer(countryReducer, {
      value: '',
      isValid: null,
    });

    const [numberState, dispatchNumber] = useReducer(numberReducer, {
      value: '',
      isValid: null,
    });


    const [emailState, dispatchEmail] = useReducer(emailReducer, {
      value: '',
      isValid: null,
    });

    const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
      value: '',
      isValid: null,
    });


    
    const nameRef = useRef();
    const lastNameRef = useRef();
    const addressRef = useRef();
    const cityRef = useRef();
    const countryRef = useRef();
    const numberRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();



   
    const { isValid: nameIsValid } = nameState;
    const { isValid: lastNameIsValid } = lastNameState;
    const { isValid: addressIsValid } = addressState;
    const { isValid: cityIsValid } = cityState;
    const { isValid: countryIsValid } = countryState;
    const { isValid: numberIsValid } = numberState;
    const { isValid: emailIsValid } = emailState;
    const { isValid: passwordIsValid } = passwordState;

    

    useEffect(() => {
      const identifier = setTimeout(() => {
        console.log('Checking form validity!');
     

        setFormIsValid(nameIsValid && lastNameIsValid && addressIsValid && cityIsValid && countryIsValid && numberIsValid && emailIsValid && passwordIsValid)
        ;
      }, 500);
  
      return () => {
        console.log('CLEANUP');
        clearTimeout(identifier);
      };
    }, [nameIsValid,lastNameIsValid, addressIsValid, cityIsValid, countryIsValid, numberIsValid, emailIsValid, passwordIsValid ]);
  

    const nameChangeHandler = (event) => {
    
      dispatchName({ type: 'USER_INPUT', val: event.target.value });
  
     
    };
  

    const validateNameHandler = () => {
      dispatchName({ type: 'INPUT_BLUR' });
    };
  
    const lastNameChangeHandler = (event) => {
     
      dispatchLastName({ type: 'USER_INPUT', val: event.target.value });
  
    
    };
  

    const validateLastNameHandler = () => {
      dispatchLastName({ type: 'INPUT_BLUR' });
    };
  
   

    const addressChangeHandler = (event) => {
      dispatchAddress({ type: 'USER_INPUT', val: event.target.value });
  
     
    };
  

    const validateAddressHandler = () => {
      dispatchAddress({ type: 'INPUT_BLUR' });
    };
   

    const cityChangeHandler = (event) => {
      dispatchCity({ type: 'USER_INPUT', val: event.target.value });
  
    
    };
  

    const validateCityHandler = () => {
      dispatchCity({ type: 'INPUT_BLUR' });
    };




    const countryChangeHandler = (event) => {
      dispatchCountry({ type: 'USER_INPUT', val: event.target.value });
  
    };
  

    const validateCountryHandler = () => {
      dispatchCountry({ type: 'INPUT_BLUR' });
    };


    const numberChangeHandler = (event) => {
      console.log(event.target.value );
      dispatchNumber({ type: 'USER_INPUT', val: event.target.value });
  
    };
  

    const validateNumberHandler = () => {
      dispatchNumber({ type: 'INPUT_BLUR' });
    };

    const emailChangeHandler = (event) => {
      dispatchEmail({ type: 'USER_INPUT', val: event.target.value });
  
    
    };
  

    const validateEmailHandler = () => {
      dispatchEmail({ type: 'INPUT_BLUR' });
    };

    const passwordChangeHandler = (event) => {
      dispatchPassword({ type: 'USER_INPUT', val: event.target.value });
  
     
    };
  

    const validatePasswordHandler = () => {
      dispatchPassword({ type: 'INPUT_BLUR' });
    };

   function hideErrorModalHandler() {
      setInfoData(null);
   }
  
   function hideSuccessModalHandler() { 
    setInfoData(null);
    history.replace('/');
  }
  
  
    async function submitHandler(event) {
      event.preventDefault();
      
     if(formIsValid){
     
      const requestConfig = {
        url: 'http://localhost:5000/registration',
        method: "POST",
        body: JSON.stringify({
          name:nameState.value ,
          lastname: lastNameState.value,
          address: addressState.value,
          city: cityState.value,

          country:countryState.value,
          number:numberState.value,
          email:emailState.value,
          password: passwordState.value,
         
         
         
        }
        ),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + ctx.token,
        },
       
        
      };
      const data = await sendRequest(requestConfig);
     
     if(data.result === 'OK'){
      setInfoData({
        title: "Success",
        message: "User successfully registered",
      });
     
     }
    else if(data.result === 'Email already exists'){
      setInfoData({
        title: "Error",
        message: "Email already exists!",
      });
    }
    else{
      setInfoData({
        title: "Error",
        message: "User don't registered!",
      });
    }
      
    }
    else if (!nameIsValid) {
      nameRef.current.focus();
    }
    else if (!lastNameIsValid) {
      lastNameRef.current.focus();
    }
    else if (!addressIsValid) {
      addressRef.current.focus();
    }
    else if (!cityIsValid) {
      cityRef.current.focus();
    }
    else if (!countryIsValid) {
      countryRef.current.focus();
    }
    else if (!numberIsValid) {
      numberRef.current.focus();
    }
    else if (!emailIsValid) {
      emailRef.current.focus();
    }
    else if (!passwordIsValid) {
      passwordRef.current.focus();
    }
  }
  
  
    return (
      <React.Fragment>
       {isLoading && <Modal/>}
       {infoData && (
        <InfModal
          title={infoData.title}
          message={infoData.message}
          onConfirm={infoData.title === "Error" ?  hideErrorModalHandler : hideSuccessModalHandler}
        />
      )}
        <Card className={classes.register}>
          <section className={classes.title}>
            <h1>REGISTRATION</h1>
          </section>
          <form onSubmit={submitHandler}>
            
            <Input
              ref={nameRef}
              type="text"
              id="name"
              label="Name:"
              isValid={nameIsValid}
              value={nameState.value}
              onChange={nameChangeHandler}
              onBlur={validateNameHandler}
            />
            <Input
              ref={lastNameRef}
              type="text"
              id="lastName"
              label="Last Name:"
              isValid={lastNameIsValid}
              value={lastNameState.value}
              onChange={lastNameChangeHandler}
              onBlur={validateLastNameHandler}
            />

          <Input
              ref={addressRef}
              type="address"
              id="address"
              label="Address:"
              isValid={addressIsValid}
              value={addressState.value}
              onChange={addressChangeHandler}
              onBlur={validateAddressHandler}
            />

           <Input
              ref={cityRef}
              type="text"
              id="city"
              label="City:"
              isValid={cityIsValid}
              value={cityState.value}
              onChange={cityChangeHandler}
              onBlur={validateCityHandler}
            />


           <Input
              ref={countryRef}
              type="text"
              id="country"
              label="Country:"
              isValid={countryIsValid}
              value={countryState.value}
              onChange={countryChangeHandler}
              onBlur={validateCountryHandler}
            />
            
            <Input
              ref={numberRef}
              type="number"
              id="number"
              label="Phone number:"
              isValid={numberIsValid}
              value={numberState.value}
              onChange={numberChangeHandler}
              onBlur={validateNumberHandler}
            />

         <Input
              ref={emailRef}
              type="email"
              id="email"
              label="Email:"
              isValid={emailIsValid}
              value={emailState.value}
              onChange={emailChangeHandler}
              onBlur={validateEmailHandler}
            />


            <Input
              ref={passwordRef}
              type="password"
              id="password"
              label="Password:"
              isValid={passwordIsValid}
              value={passwordState.value}
              onChange={passwordChangeHandler}
              onBlur={validatePasswordHandler}
            />
           
            
            
            <Button type="submit">
              Submit
            </Button>
          </form>
        </Card>
      </React.Fragment>
    );
  }
  
  export default RegistrationForm;
  