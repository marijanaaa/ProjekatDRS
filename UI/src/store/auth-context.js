import React, { useState, useEffect, useCallback } from 'react';



const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (data) => {},
  logout: () => {},
  update: (data) => {},
  user: {},
});



const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  

  return {
    token: storedToken,
    
  };
};

const initialUser = localStorage.getItem("user");


export const AuthContextProvider = (props) => {
  const [user, setUser] = useState(
    initialUser !== null && JSON.parse(initialUser)
  );
  const tokenData = retrieveStoredToken();
  
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;


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
           balanceInDollars: user.balanceInDollars,
           cryptocurrencies : user.cryptocurrencies,};
           setUser(newUser);
           console.log()
      localStorage.setItem("user", JSON.stringify(newUser));
    
     
    
  }


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
      balanceInDollars: data.balanceInDollars,
      cryptocurrencies : data.cryptocurrencies,
         
    };
    setUser(newUser);
    
    console.log()
    localStorage.setItem("user", JSON.stringify(newUser));
    
     
    

    
  };


  
  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
     
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    update: updateHandler,
    user: user,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
