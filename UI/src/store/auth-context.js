import React, { useState, useEffect, useCallback } from 'react';



const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  isVerify: false,
  setTr : () => {},
  login: (data) => {},
  logout: () => {},
  verify: () => {},
  update: (data) => {},
  user: {},
  isTransaction : false,
  transaction: {}, 
  getTransaction: () => {},
  isLoading: false,
  loading : (data) => {},
  data : "nije",
  addData : (data) => {},
  transactionType: "noTransaction",
  addType : (data) => {},

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
 const [istrans, setIsTran] = useState(false);
 const [isLoad, setIsLoading] = useState(false);
 const[dataNew, setDataNew] = useState("nije");
 const[type, setNewType] = useState("noTransaction")
  const userIsLoggedIn = !!token;
  const [userIsVerify, setUserVer] = useState(false);



  const transactions = (data) => {
    // console.log(token); taj token je prenesen iz LoginForme i ovde se cuva(za sad pisem name dok marijana ne generise token)
    
    
    
     setTransaction(data);
     
     

 
    
    
     localStorage.setItem("transaction", JSON.stringify(data));
     
      
     
 
     
   };
   const addDataNew =(data) => {
    setDataNew(data);
    
   }
   const addNewTypee=(data)=>{
  setNewType(data)
   }
 
const setLoad = (data)=>{
  setIsLoading(data)
}


const setingTr =() =>{
      setIsTran(true);  
      console.log(istrans)
}


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
   
    //  authCtx.setTr()
   // let verifySocket = new WebSocket("ws://localhost:5000/verifysocket");
   // console.log("soket");
     // verifySocket.onmessage=function(ev){
// console.log(authCtx.isTransaction)
        ///console.log(ev.data)
       // setIsTran(true)
   //}
     
     
   
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
    isTransaction : istrans,
    setTr : setingTr,
    loading : setLoad,
    isLoading : isLoad,
    data : dataNew,
    addData: addDataNew,
    transactionType : type,
    addType : addNewTypee,
    
   

    
    

  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
