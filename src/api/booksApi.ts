// src/api/books.ts
import type { Book } from "../types/types";

const BASE_URL = import.meta.env.VITE_API_URL;

export const bookApi = {
  getAll: async (): Promise<Book[]> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch books");
    return res.json();
  },

  getById: async (id: string): Promise<Book> => {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch book");
    return res.json();
  },

  create: async (book: Partial<Book>) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });
    if (!res.ok) throw new Error("Failed to create book");
    return res.json();
  },

  update: async (id: string, book: Partial<Book>) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });
    if (!res.ok) throw new Error("Failed to update book");
    return res.json();
  },

  delete: async (id: string) => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete book");
  },
};
