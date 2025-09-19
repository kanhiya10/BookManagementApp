import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useToast } from "../../context/toastNotification";
import { bookApi } from "../../api/booksApi";
import { bookSchema as validationSchema } from "../../utils/validattionSchema";

export default function BookForm() {

  const [loading, setLoading] = React.useState(false);       // for fetching existing book
  const [submitting, setSubmitting] = React.useState(false); // for form submit

  const { id } = useParams(); // id is undefined when creating
  console.log('id', id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Initial form values
  const initialValues = {
    title: "",
    author: "",
    year: new Date().getFullYear(),
    genre: "",
    status: "available",
  };

  // Fetch book if editing
  const fetchBook = async (setValues: any) => {
    if (id) {
      try {
        setLoading(true);
        const data = await bookApi.getById(id);
        setValues({
          title: data.title || "",
          author: data.author || "",
          year: data.year || new Date().getFullYear(),
          genre: data.genre || "",
          status: data.status || "available",
        });
      } catch (err) {
        console.error("Error fetching book:", err);
        showToast("Failed to load book details.", "error");
      } finally {
        setLoading(false);
      }
    }
  };


  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setSubmitting(true);
      if (id) {
        await bookApi.update(id, { ...values, status: values.status as "available" | "issued" });
      } else {
        await bookApi.create({ ...values, status: values.status as "available" | "issued" });
      }
      showToast(`Book ${id ? "updated" : "added"} successfully!`, "success");
      navigate("/");
    } catch (error) {
      console.error("Error saving book:", error);
      showToast("Failed to save book.", "error");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center bg-black py-10 px-4">
      <h1 className="text-2xl font-bold text-white mb-6">
        {id ? "✏️ Edit Book" : "➕ Add Book"}
      </h1>

      <div className="shadow-md rounded-lg p-6 w-full max-w-md">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-300">Loading book details...</p>
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ setValues }) => {
              useEffect(() => {
                fetchBook(setValues);
              }, [id]);

              return (
                <Form>
                <div className="mb-3">
                  <Field
                    name="title"
                    type="text"
                    placeholder="Title"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-3">
                  <Field
                    name="author"
                    type="text"
                    placeholder="Author"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="author"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-3">
                  <Field
                    name="year"
                    type="number"
                    placeholder="Year"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="year"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-3">
                  <Field
                    as="select"
                    name="genre"
                    className="w-full bg-black p-2 border rounded"
                  >
                    <option value="">Select Genre</option>
                    <option value="thriller">Thriller</option>
                    <option value="action">Action</option>
                    <option value="adventure">Adventure</option>
                    <option value="romantic">Romantic</option>
                    <option value="comedy">Comedy</option>
                  </Field>
                  <ErrorMessage
                    name="genre"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-3">
                  <Field
                    as="select"
                    name="status"
                    className="w-full bg-black p-2 border rounded"
                  >
                    <option value="available">Available</option>
                    <option value="issued">Issued</option>
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {id ? "Updating..." : "Adding..."}
                      </span>
                    ) : (
                      id ? "Update Book" : "Add Book"
                    )}
                  </button>
                </Form>
              );
            }}
          </Formik>
        )}
      </div>

    </div>
  );
}
