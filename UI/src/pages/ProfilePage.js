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
        if(authCtx.data){
           
            authCtx.loading(false)
            setIsLoad(false)
            setInfoData({
                title: "Success",
                message:" Transaction sucessed" ,
            });
           // authCtx.loading(false)
           
          
              
               // history.replace("/");
            
               authCtx.addData(false)
        }
        
     }
     
    
   

}, [infoData, authCtx.addData]);




    function hideErrorModalHandler() {//da se ukloni prozorcic
        setInfoData(null);
    }
    function hideSuccessModalHandler() { //isto da ukloni prozor sa obavestenjem
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