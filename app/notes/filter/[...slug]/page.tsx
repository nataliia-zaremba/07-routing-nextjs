import { notFound } from "next/navigation";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import type { FilterTagType } from "@/types/note";

const validTags: FilterTagType[] = [
  "All",
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

const isValidTag = (tag: string): tag is FilterTagType => {
  return validTags.includes(tag as FilterTagType);
};

type Props = {
  params: Promise<{ slug: string[] }>; // Зміна: params тепер Promise
};

const NotesByTags = async ({ params }: Props) => {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const tagFromUrl = slug?.[0];

    if (!tagFromUrl || !isValidTag(tagFromUrl)) {
      notFound();
    }

    const data = await fetchNotes({
      page: 1,
      perPage: 12,
      tag: tagFromUrl,
    });

    return <NotesClient initialData={data} initialTag={tagFromUrl} />;
  } catch (error) {
    console.error("Error in NotesByTags:", error);
    notFound();
  }
};

export default NotesByTags;
