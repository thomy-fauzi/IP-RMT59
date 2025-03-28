import { useState, useEffect } from "react";
import BooksCard from "../components/booksCard";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

function HomePage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://server.thom.web.id/books", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      //   console.log(response.data);
      setBooks(response.data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response.data.message,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddBook = async (bookId) => {
    try {
      console.log(localStorage.getItem("access_token"));
      await axios.post(
        `https://server.thom.web.id/mybooks/${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      console.log(localStorage.getItem("access_token"));
      navigate("/mybooks");
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response.data.message,
      });
    }
  };
  return (
    <div className="container mt-4">
      <div className="row g-3">
        {books.length > 0 ? (
          books.map((book) => (
            <BooksCard key={book.id} book={book} onClick={handleAddBook} />
          ))
        ) : (
          <p className="text-center">No books found.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
