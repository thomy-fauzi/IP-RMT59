import "./booksCard.css";
import Button from "./button";

const MyBooksCard = ({ myBook, onUpdate, onDelete }) => {
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center">
      <div className="card w-90 shadow-sm mb-4 position-relative">
        <div className="image-container">
          <img
            src={myBook.Book.imageUrl}
            className="card-img-top"
            alt="image"
          />
          <div className="overlay">
            <h6 className="text-white text-center fw-bold">
              {myBook.Book.title}
            </h6>
          </div>
        </div>
        <div className="card-body d-flex flex-column px-3">
          <p
            className={`card-text text-center flex-grow-1 fw-bold ${
              myBook.status === "Uncompleted"
                ? "text-secondary"
                : "text-success"
            }`}
          >
            {myBook.status}
          </p>
          <p className="card-text text-muted text-center flex-grow-1">
            {myBook.Book.description
              ? myBook.Book.description.slice(0, 40) + "..."
              : "No description"}
          </p>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <Button
              variant="primary rounded-pill flex-grow-1"
              title="Finish"
              onClick={onUpdate}
            />
            <Button
              variant="danger rounded-pill flex-grow-1"
              title="Return"
              onClick={onDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBooksCard;
