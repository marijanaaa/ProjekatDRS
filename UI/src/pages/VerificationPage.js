import VerificationForm from "../components/component/forms/VerificationForm";
import React, {useEffect, useContext, useState} from "react";
import { useHistory } from 'react-router-dom';
import AuthContext from '../store/auth-context';
import InfModal from '../components/component/modals/InfModal';
import Modal from "../components/component/modals/Modal";

function VerificationPage() {
  const [isLoad, setIsLoad] = useState(false);
  const [isVer, SetIsVer] = useState(false);
  const authCtx = useContext(AuthContext);
  const [infoData, setInfoData] = useState(null);
  const history = useHistory();

  useEffect(() => {
    console.log(authCtx.isLoading)

    if(authCtx.isLoading){
     
      setIsLoad(true)
      if(authCtx.data === "Verifikacija uspela"){
         
          authCtx.loading(false)
          setIsLoad(false)
          SetIsVer(true)
          
          
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
              message: "Card does not exist! Please try to verify again..",
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
 history.replace("/")

}

    return (
        <div>
            <div>
                <h1>Verification</h1>
                
             </div>
             {(isLoad) && <Modal />}
         {infoData &&  (
                    <InfModal
                        title={infoData.title}
                        message={infoData.message}
                        onConfirm={infoData.title === "Success" ? hideSuccessModalHandler : hideErrorModalHandler}
                    />
                )}
           <VerificationForm/>
        </div>
    
      );
}

export default VerificationPage;