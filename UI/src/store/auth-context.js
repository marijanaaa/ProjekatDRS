import React, { useState, useEffect, useCallback } from 'react';



const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});



const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  console.log(storedToken);

  return {
    token: storedToken,
    
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;


  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
  

    
  }, []);

  const loginHandler = (token) => {
   // console.log(token); taj token je prenesen iz LoginForme i ovde se cuva
    setToken(token);
    localStorage.setItem('token', token);
    
     
    

    
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
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
