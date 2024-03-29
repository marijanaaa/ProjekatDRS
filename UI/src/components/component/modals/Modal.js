
import Card from '../card/Card';
import React from 'react';

import classes from './Modal.module.css';
import {useHistory} from 'react-router-dom';

function Backdrop(props) {
    return <div className={classes.backdrop} onClick={props.onClick} />;
  }
  
  function ModalOverlay(props) {
    return (
      <Card className={classes.modal}>
        <div className={classes.spinner}></div>
      </Card>
    );
  }
 // <Backdrop  onClick={clickHandler}/>
  const Modal = (props) => {
    const history = useHistory();
    function clickHandler() {
      history.push('/');
    }
    return (
      <div>
     
      <ModalOverlay/>
 
      </div>
     );
  };

export default Modal;