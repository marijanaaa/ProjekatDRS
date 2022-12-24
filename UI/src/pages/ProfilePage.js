import AuthContext from "../store/auth-context";
import React, {useContext} from "react";
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
    const password = authCtx.user.password

    return(
        <>
    
      <h1>&nbsp;</h1>

      <Card className={classes.profile}>
        <div>
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
          <h2></h2>
          <label style={{ fontWeight: 'bold' }}>Password: </label>{password}
          
        </div>
      </Card>
    </>
    )
}
export default ProfilePage;