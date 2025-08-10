import { type ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const originalOverflowRef = useRef<string>("");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      // Зберігаємо оригінальний overflow
      originalOverflowRef.current = document.body.style.overflow;

      // Додаємо event listener та блокуємо скрол
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    // Cleanup функція
    return () => {
      document.removeEventListener("keydown", handleEsc);
      if (isOpen) {
        // Відновлюємо оригінальний overflow
        document.body.style.overflow = originalOverflowRef.current;
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>{children}</div>
    </div>,
    document.body
  );
};

export default Modal;
