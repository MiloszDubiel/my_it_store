import axios from "axios";
import { useState } from "react";

const AddReview = ({ productId }: { productId: string }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const submit = async () => {
    const token = localStorage.getItem("token");
    await axios.post(
      "/api/reviews/",
      {
        product_id: productId,
        rating,
        comment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  };

  return (
    <div className="border p-4 border-gray-200 ">
      <h3 className="font-semibold mb-3">Dodaj opinię</h3>

      <div className="flex gap-1 mb-3" onMouseLeave={() => setHoverRating(0)}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hoverRating || rating);

          return (
            <svg
              key={star}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              onMouseEnter={() => setHoverRating(star)}
              onClick={() => setRating(star)}
              className={`w-8 h-8 cursor-pointer transition ${
                filled ? "fill-yellow-400" : "fill-gray-300"
              }`}
            >
              <path d="M12 17.3l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.76-1.64 7.03z" />
            </svg>
          );
        })}
      </div>

      <textarea
        className="w-full border mt-2 border-gray-200 p-2 "
        placeholder="Napisz swoją opinię..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        onClick={submit}
        className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 "
      >
        Dodaj opinię
      </button>
    </div>
  );
};
export default AddReview;
