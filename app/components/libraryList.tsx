import styles from "./library.module.css";
import { Link } from "react-router";

type Item = {
  id: string;
  name: string;
  target: string;
};

type LibraryListProps = {
  items: Item[];
};

export function LibraryList({ items }: LibraryListProps) {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <LibraryItem key={item.id} item={item} />
      ))}
    </div>
  );
}

type LibraryItemProps = {
  item: {
    name: string;
    target: string;
  };
};

export function LibraryItem({ item }: LibraryItemProps) {
  return (
    <Link className={styles.listItem} to={item.target}>
      {item.name}
    </Link>
  );
}
