"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import css from "./TagsMenu.module.css";

const TagsMenu = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

  const handleTagClick = (tag: string) => {
    router.push(`/notes/filter/${tag}`);
    setOpen(false);
  };

  return (
    <div className={css.menuContainer}>
      <button
        className={css.menuButton}
        onClick={() => setOpen((prev) => !prev)}
      >
        Notes ▾
      </button>

      {open && (
        <ul className={css.menuList}>
          {tags.map((tag) => (
            <li key={tag} className={css.menuItem}>
              <button
                onClick={() => handleTagClick(tag)}
                className={css.menuLink}
              >
                {tag}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagsMenu;
