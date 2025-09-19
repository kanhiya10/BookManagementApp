export type BookPayload = {
  title: string;
  author: string;
  year: number;
  genre: string;
  status: "available" | "issued";
};


export type Book = {
  id?: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  status: "available" | "issued";
};