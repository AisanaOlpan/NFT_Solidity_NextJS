import classes from "./Card.module.css";
import * as React from "react";

function CardNFT(props) {
  return (
    <div>
      <div className={classes.card_img} id={props.id}>
        <img src={props.img_src}></img>
      </div>
      <div className={classes.card_info}>
        <p>{props.name}</p>
      </div>
    </div>
  );
}

export default CardNFT;
