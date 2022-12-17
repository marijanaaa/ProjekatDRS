import React from "react";
import classes from "./InfModal.module.css";
import Card from "../card/Card";
import Button from "../button/Button";

function Backdrop(props) {
    return <div className={classes.backdrop} onClick={props.onClick} />;
  }
  
  function ModalOverlay(props) {
    return (
      <Card className={classes.modal}>
        <header className={classes.header}>
          <h2>{props.title}</h2>
        </header>
        <div className={classes.content}>
          <p>{props.message}</p>
        </div>
        <footer className={classes.actions}>
          <Button onClick={props.onConfirm} className={classes.button}>Okay</Button>
          {props.onClose !== undefined && <Button onClick={props.onClose} className={classes.button}>Close</Button>}
        </footer>
      </Card>
    );
  }
  
  const InfModal = (props) => {
    return (
      <div>
        <Backdrop onClick={props.onClose !== undefined ? props.onClose : props.onConfirm} />
     <ModalOverlay title={props.title} message={props.message} onConfirm={props.onConfirm} onClose={props.onClose}/>
     </div>
    );
  };

export default InfModal;