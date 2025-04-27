import styles from "./library.module.css";
import { Link } from "react-router";

type Item = {
  id: string;
  name: string;
};

type LibraryListProps = {
  items: Item[];
  onItemClick?: (item: Item) => void;
};

export function LibraryList({ items, onItemClick }: LibraryListProps) {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <LibraryItem
          key={item.id}
          item={item}
          onClick={() => onItemClick && onItemClick(item)}
        />
      ))}
    </div>
  );
}

type LibraryItemProps = {
  item: {
    name: string;
    target: string;
  };
  onClick: () => void;
};

export function LibraryItem({ item, onClick }: LibraryItemProps) {
  return (
    <a className={styles.listItem} onClick={onClick}>
      {item.name}
    </a>
  );
}
