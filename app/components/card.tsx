import cardStyles from "./cards.module.css";

type CardPros = {
  active: boolean;
  title: string;
  image?: React.ReactNode;
};

export function Card({ active, title, image }: CardPros) {
  const activeClass = active ? "" : cardStyles.cardInactive;
  return (
    <div className={`${cardStyles.card} ` + activeClass}>
      <div className={cardStyles.cardImage}>{image}</div>
      <span>{title}</span>
    </div>
  );
}
