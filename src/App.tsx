import { BrowserRouter, Routes, Route } from "react-router-dom";
import Books from "./app/home";
import BookForm from "./app/bookForm";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/books/new" element={<BookForm />} />
        <Route path="/books/:id/edit" element={<BookForm />} />
      </Routes>
    </BrowserRouter>
  );
}
