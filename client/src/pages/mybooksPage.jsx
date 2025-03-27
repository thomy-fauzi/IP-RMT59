import { useEffect, useState } from "react";
import MyBooksCard from "../components/myBooksCard";
import axios from "axios";
import Swal from "sweetalert2";

function MyBook() {
  const [myBooks, setMyBooks] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/mybooks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log(response.data);
      setMyBooks(response.data);
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

  const handleUpdateStatus = async (bookId) => {
    try {
      await axios.patch(
        `http://localhost:3000/mybooks/${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      await fetchData();
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response.data.message,
      });
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, return it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:3000/mybooks/${bookId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        await fetchData();

        Swal.fire({
          title: "Returned!",
          text: "The book has been returned.",
          icon: "success",
        });
      }
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
        {myBooks.length > 0 ? (
          myBooks.map((myBook) => (
            <MyBooksCard
              key={myBook.id}
              myBook={myBook}
              onUpdate={() => handleUpdateStatus(myBook.BookId)}
              onDelete={() => handleDeleteBook(myBook.BookId)}
            />
          ))
        ) : (
          <p className="text-center">No books found.</p>
        )}
      </div>
    </div>
  );
}

export default MyBook;
