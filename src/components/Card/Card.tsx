import { ReactNode } from "react";
import classes from "./Card.module.css";

interface Props {
  title: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  children: ReactNode;
}

function Card({ title, open, onOpen, onClose, children }: Props) {
  const handleHeaderClick = () => {
    open ? onClose() : onOpen();
  };

  return (
    <div
      className={[classes.card, open ? classes.open : null]
        .filter((v) => !!v)
        .join(" ")}
    >
      <div className={classes.header} onClick={handleHeaderClick}>
        <strong>{title}</strong>
        <span>{open ? "▲" : "▼"}</span>
      </div>
      <div className={classes.content}>{children}</div>
    </div>
  );
}

export default Card;
