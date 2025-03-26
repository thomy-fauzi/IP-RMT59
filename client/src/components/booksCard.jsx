import "./booksCard.css";
import Button from "./button";

const BooksCard = ({ book, onClick }) => {
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center">
      <div className="card w-90 shadow-sm mb-4 position-relative">
        <div className="image-container">
          <img src={book.imageUrl} className="card-img-top" alt="image" />
          <div className="overlay">
            <h6 className="text-white text-center fw-bold">{book.title}</h6>
          </div>
        </div>
        <div className="card-body d-flex flex-column">
          <p
            className={`card-text text-center flex-grow-1 fw-bold ${
              book.status === "Borrowed" ? "text-danger" : "text-success"
            }`}
          >
            {book.status}
          </p>
          <p className="card-text text-muted text-center flex-grow-1">
            {book.description
              ? book.description.slice(0, 40) + "..."
              : "No description"}
          </p>

          <Button
            onClick={() => onClick(book.id)}
            variant="primary rounded-pill mt-auto w-100"
            title="Add"
          />
        </div>
      </div>
    </div>
  );
};

export default BooksCard;
