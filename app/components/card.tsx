import cardStyles from "./cards.module.css";
import noImage from "~/assets/file-64.png";

type CardPros = {
  active: boolean;
  title: string;
  image?: React.ReactNode;
};

export function Card({ active, title, image }: CardPros) {
  const activeClass = active ? "" : cardStyles.cardInactive;
  if (active && !image) {
    image = (
      // eslint-disable-next-line jsx-a11y/img-redundant-alt
      <img src={noImage} alt="No image" />
    );
  }
  return (
    <div className={`${cardStyles.card} ` + activeClass}>
      <div className={cardStyles.cardImage}>{image}</div>
      <span>{title}</span>
    </div>
  );
}
