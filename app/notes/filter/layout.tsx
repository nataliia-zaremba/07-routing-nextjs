import css from "./LayoutNotes.module.css";
import React from "react";

type Props = {
  children: React.ReactNode;

  sidebar: React.ReactNode;
};

const NotesLayout = ({ children, sidebar }: Props) => {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <main className={css.notesWrapper}>{children}</main>
      {children}
    </div>
  );
};

export default NotesLayout;
