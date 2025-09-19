import React from "react";
import { useNavigate } from "react-router-dom";
import type { Book } from "../types/types";

interface BookCardProps {
  book: Book;
  onDelete: (id: string | undefined) => void;
}

export default function BookCard({ book, onDelete }: BookCardProps) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = React.useState(false);

  return (
    <div className="bg-white p-4 shadow rounded-lg flex flex-col justify-between">
      <div>
        <p className="text-lg text-gray-700 font-semibold">{book.title}</p>
        <p className="text-gray-700">{book.author} • {book.year}</p>
        <p className="text-gray-600">Genre: {book.genre}</p>
        <p
          className={`text-sm font-medium mt-1 ${
            book.status === "available" ? "text-green-600" : "text-red-600"
          }`}
        >
          Status: {book.status}
        </p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/books/${book.id}/edit`)}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
          >
            Edit
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-bold">{book.title}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(book.id);
                  setShowConfirm(false);
                }}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
