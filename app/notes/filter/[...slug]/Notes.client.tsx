"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteModal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";
import type { FilterTagType } from "@/types/note";
import css from "./NotesPage.module.css";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

interface NotesClientProps {
  initialData: FetchNotesResponse;
  initialTag: FilterTagType;
}

const NotesClient: React.FC<NotesClientProps> = ({
  initialData,
  initialTag,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const perPage = 12;

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    data: notesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notes", currentPage, debouncedSearchTerm, initialTag],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage,
        search: debouncedSearchTerm,
        tag: initialTag !== "All" ? initialTag : undefined,
      }),
    initialData:
      currentPage === 1 && debouncedSearchTerm === "" ? initialData : undefined,
    placeholderData: (prev) => prev,
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading notes</div>;

  const notes = notesData?.data || [];
  const totalPages = notesData?.total_pages || 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button onClick={() => setIsModalOpen(true)} className={css.button}>
          Create note +
        </button>
      </header>

      {notes.length > 0 && <NoteList notes={notes} />}

      {isModalOpen && (
        <NoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </NoteModal>
      )}
    </div>
  );
};

export default NotesClient;
