import React, {useContext, useState, useEffect} from "react";
import AuthContext from '../store/auth-context';
import InfModal from '../components/component/modals/InfModal';
import Modal from "../components/component/modals/Modal";
import { useHistory } from 'react-router-dom';

import Card from "../components/component/card/Card";
import classes from "../components/component/forms/LoginForm.module.css";
function ProfilePage(){
    const authCtx = useContext(AuthContext);
    const name = authCtx.user.name;
    const lastname = authCtx.user.lastname;
    const address = authCtx.user.address;
    const city = authCtx.user.city;
    const country = authCtx.user.country;
    const number = authCtx.user.number;
    const email = authCtx.user.email;
    const [isLoad, setIsLoad] = useState(false);
   
    const [infoData, setInfoData] = useState(null);
    const history = useHistory();



    useEffect(() => {
      console.log(authCtx.isLoading)

      if(authCtx.isLoading){
         
        setIsLoad(true)
        if(authCtx.data === "Prenos para uspeo"){
           
            authCtx.loading(false)
            setIsLoad(false)
            setInfoData({
                title: "Success",
                message:" Transaction sucessed" ,
            });
               authCtx.addData("nije")
        }
        if(authCtx.data === "Prenos para nije uspeo") {
            authCtx.loading(false)
            setIsLoad(false)
            setInfoData({
                title: "Error",
                message:" Transaction denied" ,
            });
            authCtx.addData("nije")
        }
        if(authCtx.data === "Verifikacija uspela"){
           
            authCtx.loading(false)
            setIsLoad(false)      
         setInfoData({
        title:  "Success",
        message: "1$ has been successfully deducted from your card!",
      });
            authCtx.addData("nije")
           
        }
        if(authCtx.data === "Verifikacija nije uspela"){
           
            authCtx.loading(false)
            setIsLoad(false)
            setInfoData({
                title:  "Error",
                message: "Card does not exist! ",
              });
            authCtx.addData("nije")
        }
       
        if(authCtx.data === "Uplata dolara na svoj racun"){
           
          authCtx.loading(false)
          setIsLoad(false)  
       setInfoData({
      title:  "Success",
      message: "Money successfully paid into the account!",
    });
          authCtx.addData("nije")
         
      }
      if(authCtx.data === "Uplata na svoj racun nije uspela"){
           
          authCtx.loading(false)
          setIsLoad(false) 
       setInfoData({
      title:  "Error",
      message: "Money successfully paid into the account!",
    });
          authCtx.addData("nije")
         
      }
      if(authCtx.data === "Uspesno ste kupili dolare"){
           
          authCtx.loading(false)
          setIsLoad(false)
         
          setInfoData({
              title: "Success",
              message: "You buy criptocurrencies!",
          });
         
             authCtx.addData("nije")
      }
      if(authCtx.data === "Neuspesno ste kupili dolare") {
          authCtx.loading(false)
          setIsLoad(false)
        
              setInfoData({
                  title: "Success",
                  message: "Payment error!",
              });
             

          authCtx.addData("nije")
      }
      if(authCtx.data === "Uspesno ste zamenili valute"){
           
          authCtx.loading(false)
          setIsLoad(false)
         
          setInfoData({
              title: "Success",
              message: "You change criptocurrencies!",
          });
         
             authCtx.addData("nije")
      }
      if(authCtx.data === "Neuspesno ste zamenili valute") {
          authCtx.loading(false)
          setIsLoad(false)
        
              setInfoData({
                  title: "Success",
                  message: "Error in exchange criptocurrencies!",
              });
             

          authCtx.addData("nije")
      }
     }
     
    
   

}, [infoData, authCtx.addData]);




    function hideErrorModalHandler() {//da se ukloni prozorcic
        setInfoData(null);
    }
    function hideSuccessModalHandler() { //isto da ukloni prozor sa obavestenjem
        authCtx.verify();
        setInfoData(null);
       history.replace("/profile")
    
    }
    return(
        <>
    
      <h1>&nbsp;</h1>

      <Card className={classes.profile}>
        <div>
        {infoData &&  (
                    <InfModal
                        title={infoData.title}
                        message={infoData.message}
                        onConfirm={infoData.title === "Success" ? hideSuccessModalHandler : hideErrorModalHandler}
                    />
                )}
          <h1 style={{ textAlign : 'center' } }  > {name} {lastname}</h1>

          
       
          <h2></h2>
         
          <label style={{ fontWeight: 'bold' }}>Address: </label>{address}
          <h2></h2>
          <label style={{ fontWeight: 'bold' }}>City: </label>{city}
          <h2></h2>
          <label style={{ fontWeight: 'bold' }}>Country: </label>{country}
          <h2></h2>
          <label style={{ fontWeight: 'bold' }}>Number: </label>{number}
          <h2></h2>
          <label style={{ fontWeight: 'bold' }}>Email: </label>{email}
         
        </div>
      </Card>
    </>
    )
}
export default ProfilePage;