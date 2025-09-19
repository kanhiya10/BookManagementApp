// Books.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useToast } from "../context/toastNotification";
import { useFilter } from "../hooks/useFilter";
import { usePagination } from "../hooks/usePagination";
import type { Book } from "../types/types";
import { bookApi } from "../api/booksApi";
import BookCard from "../components/booksCard"; // <-- new import

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  // Filter config
  const filterConfig = {
    data: books,
    filterFunctions: {
      genre: (items: Book[], value: string) =>
        items.filter((book) => book.genre === value),
      status: (items: Book[], value: string) =>
        items.filter((book) => book.status === value),
    },
  };

  const {
    filterType,
    setFilterType,
    filterValues,
    setFilterValue,
    clearFilter,
    filteredData,
  } = useFilter(filterConfig);

  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    paginatedData,
    goToNextPage,
    goToPreviousPage,
  } = usePagination({
    data: filteredData,
    pageSize: 9,
  });

  
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookApi.getAll();
      console.log("Fetched books:", data);
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
      showToast("Failed to fetch books.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);


  const deleteBook = async (id: string | undefined) => {
    if (!id) return;
    try {
      await bookApi.delete(id);
      showToast("Book deleted successfully!", "success");
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      showToast("Failed to delete the book. Please try again.", "error");
    }
  };

  
  const uniqueGenres = Array.from(new Set(books.map((book) => book.genre)));

  const handleFilterTypeChange = (type: string) => {
    setFilterType(type);
    Object.keys(filterValues).forEach((key) => clearFilter(key));
  };

  return (
    <div className="min-h-screen min-w-screen bg-black flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">📚 Books List</h1>

      {/* Filter Type Selection */}
      <div className="w-full max-w-md mb-6">
        <label className="block text-white mb-2">Choose Filter Type</label>
        <select
          value={filterType}
          onChange={(e) => handleFilterTypeChange(e.target.value)}
          className="w-full p-3 rounded-lg bg-black border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select Filter --</option>
          <option value="genre">Filter by Genre</option>
          <option value="status">Filter by Status</option>
        </select>
      </div>

      
      {filterType === "genre" && (
        <div className="w-full max-w-md mb-6">
          {!filterValues.genre ? (
            <div>
              <label className="block text-white mb-2">Filter by Genre</label>
              <select
                value={filterValues.genre || ""}
                onChange={(e) => setFilterValue("genre", e.target.value)}
                className="w-full p-3 rounded-lg bg-black border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Genres</option>
                {uniqueGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-blue-100 text-blue-700 px-4 py-2 rounded-lg shadow">
              <span className="font-medium">Genre: {filterValues.genre}</span>
              <button
                onClick={() => clearFilter("genre")}
                className="ml-3 text-blue-700 hover:text-red-600"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
      )}

     
      {filterType === "status" && (
        <div className="w-full max-w-md mb-6">
          {!filterValues.status ? (
            <div>
              <label className="block text-white mb-2">Filter by Status</label>
              <select
                value={filterValues.status || ""}
                onChange={(e) => setFilterValue("status", e.target.value)}
                className="w-full p-3 rounded-lg bg-black border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="issued">Issued</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-blue-100 text-blue-700 px-4 py-2 rounded-lg shadow">
              <span className="font-medium">Status: {filterValues.status}</span>
              <button
                onClick={() => clearFilter("status")}
                className="ml-3 text-blue-700 hover:text-red-600"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
      )}

     
      <div className="relative w-full min-h-screen max-w-5xl flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-300">Loading books...</p>
          </div>
        ) : paginatedData.length === 0 ? (
          <p className="text-gray-400 text-center">No books found.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedData.map((book) => (
              <BookCard key={book.id} book={book} onDelete={deleteBook} />
            ))}
          </div>
        )}
      </div>


      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={!hasPreviousPage}
          onClick={goToPreviousPage}
          className="px-4 py-2 text-gray-100 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          disabled={!hasNextPage}
          onClick={goToNextPage}
          className="px-4 py-2 text-gray-100 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Add Book Button */}
      <button
        onClick={() => navigate("/books/new")}
        className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        ➕ Add Book
      </button>
    </div>
  );
}
