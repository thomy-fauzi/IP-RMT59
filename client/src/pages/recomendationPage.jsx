import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://server.thom.web.id/generateAi",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setRecommendations(response.data.result);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to generate recommendations!",
      });
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h2>AI Book Recommendations</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={fetchRecommendations}
        disabled={loading}
      >
        {loading ? "Generating..." : "Get AI Recommendations"}
      </button>
      {recommendations && (
        <div className="alert alert-info">
          <pre>{recommendations}</pre>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
