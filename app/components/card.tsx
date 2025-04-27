import cardStyles from "./cards.module.css";
import noImage from "~/assets/file-64.png";

type CardAction = {
  title: string;
  onClick: () => void;
};

type CardPros = {
  active: boolean;
  title: string;
  image?: React.ReactNode;
  action?: CardAction;
};

export function Card({ active, title, image, action }: CardPros) {
  const activeClass = active ? "" : cardStyles.cardInactive;
  if (active && !image) {
    image = (
      // eslint-disable-next-line jsx-a11y/img-redundant-alt
      <img src={noImage} alt="No image" />
    );
  }
  const actions = action ? (
    <div className={cardStyles.actions}>
      <button onClick={() => action.onClick()}>{action.title}</button>
    </div>
  ) : null;
  return (
    <div className={`${cardStyles.card} ` + activeClass}>
      <div className={cardStyles.cardImage}>{image}</div>
      <span>{title}</span>
      {actions}
    </div>
  );
}
