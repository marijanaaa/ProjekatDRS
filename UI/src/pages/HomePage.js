
import React, {useContext, useState, useEffect} from "react";
import AuthContext from '../store/auth-context';
import InfModal from '../components/component/modals/InfModal';
import Modal from "../components/component/modals/Modal";
import { useHistory } from 'react-router-dom';

import StartingPageContent from "../components/StartingPageContent/StartingPageContent";

function HomePage() {


  
    const authCtx = useContext(AuthContext);
    const [infoData, setInfoData] = useState(null);
    const history = useHistory();
    const [isEnd, setIsEnd] = useState(false)

    useEffect(() => {
      console.log(authCtx.isLoading)

     if(authCtx.isLoading){
       
       
        if(authCtx.data){
           
            authCtx.loading(false)
          
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
       history.replace("/")
    
    }

  return (
    <div>
       {infoData &&  (
                    <InfModal
                        title={infoData.title}
                        message={infoData.message}
                        onConfirm={infoData.title === "Success" ? hideSuccessModalHandler : hideErrorModalHandler}
                    />
                )}
<StartingPageContent />
    </div>
    
  );
}

export default HomePage;