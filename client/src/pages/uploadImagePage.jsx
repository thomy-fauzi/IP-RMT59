import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import Button from "../components/button";

function UpdateImage() {
  const params = useParams();
  const navigate = useNavigate();
  const [coverImage, setCoverImage] = useState(null);

  const fetchImageById = async () => {
    try {
      const { data } = await axios.get(
        `https://server.thom.web.id/books/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setCoverImage(data.imageUrl);
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response.data.message,
      });
    }
  };
  useEffect(() => {
    fetchImageById();
  }, [params.id]);

  const formData = new FormData();
  formData.append("coverImage", coverImage);

  const handleUpload = async (event) => {
    event.preventDefault();
    try {
      await axios.patch(
        `https://server.thom.web.id/books/${params.id}/cover-url`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Image Update successfully",
      });
      navigate("/");
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
    <div className="d-flex flex-column justify-content-center align-items-center text-center">
      <h1>Upload File</h1>
      <img
        src={coverImage}
        className="img-fluid"
        style={{ width: 250, height: "auto" }}
        alt="Book Cover"
      />
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
        onSubmit={handleUpload}
      >
        <label htmlFor="formFile">Select file:</label>
        <input onChange={(e) => setCoverImage(e.target.files[0])} type="file" />

        <div className="d-flex justify-content-center w-100 gap-3">
          <Button
            onClick={() => navigate(-1)}
            variant="secondary"
            title="Back"
          />
          <Button type="submit" variant="primary" title="Upload" />
        </div>
      </form>
    </div>
  );
}

export default UpdateImage;
