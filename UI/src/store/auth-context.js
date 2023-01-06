import React, { useState, useEffect, useCallback } from 'react';



const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  isVerify: false,
  login: (data) => {},
  logout: () => {},
  verify: () => {},
  update: (data) => {},
  user: {},
  transaction: {}, 
  getTransaction: () => {},
});




const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  

  return {
    token: storedToken,
    
  };
};

const initialUser = localStorage.getItem("user");

const initialTransaction = localStorage.getItem("transaction");


export const AuthContextProvider = (props) => {
  const [user, setUser] = useState(
    initialUser !== null && JSON.parse(initialUser)
  );

  const [transaction, setTransaction] = useState(
    initialTransaction !== null && JSON.parse(initialTransaction)
  );
  const tokenData = retrieveStoredToken();
  
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;
  const [userIsVerify, setUserVer] = useState(false);



  const transactions = (data) => {
    // console.log(token); taj token je prenesen iz LoginForme i ovde se cuva(za sad pisem name dok marijana ne generise token)
    
    
     const newTransaction = {
       _id: data._id,
       sender: data.sender,
       receiver: data.receiver,
       criptocurrency: data.criptocurrency,
       amount: data.amount,
 
       date: data.date,
       
          
     };
     setTransaction(newTransaction);
     
     console.log()
     localStorage.setItem("transaction", JSON.stringify(newTransaction));
     
      
     
 
     
   };
 






  const updateHandler = (data) => {
    console.log(data.password)
    console.log(data.name)
      const newUser = { _id: user._id,
         name: data.name,
         lastname: data.lastname, 
         address: data.address, 
         city: data.city,
          country: data.country, 
          number: data.number, 
          email: data.email,
           password: data.password ,
          };
           setUser(newUser);
           console.log()
      localStorage.setItem("user", JSON.stringify(newUser));
    
     
    
  }

  const verifyHandler = useCallback(() => {
  setUserVer(true);

    
  }, []);
  

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
   
    setUser(null);
    
    localStorage.removeItem("user");

    
  }, []);

  const loginHandler = (data) => {
   // console.log(token); taj token je prenesen iz LoginForme i ovde se cuva(za sad pisem name dok marijana ne generise token)
    setToken(data.token);
    localStorage.setItem('token', data.token);
    console.log(data.password)
    console.log(data.name)
    const newUser = {
      _id: data._id,
      name: data.name,
      lastname: data.lastname,
      address: data.address,
      city: data.city,

      country: data.country,
      number: data.number,
      email: data.email,
      password: data.password,
     
         
    };
    setUser(newUser);
    
    console.log()
    localStorage.setItem("user", JSON.stringify(newUser));
    
     
    

    
  };


  
  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
     
    }
    let verifySocket = new WebSocket("ws://localhost:5000/verifysocket");
    console.log("soket");
    verifySocket.onmessage=function(ev){
      alert(ev.data)
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    isVerify : userIsVerify, 
    login: loginHandler,
    logout: logoutHandler,
    update: updateHandler,
    verify : verifyHandler,
    user: user,
    transaction:transaction,
    getTransaction : transactions,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
