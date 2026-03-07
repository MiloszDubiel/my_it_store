import axios from "axios";
import { useState } from "react";

const AddReview = ({ productId }: { productId: string }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

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
    <div className="border p-4 rounded">
      <h3>Dodaj opinię</h3>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        <option value={5}>5 ⭐</option>
        <option value={4}>4 ⭐</option>
        <option value={3}>3 ⭐</option>
        <option value={2}>2 ⭐</option>
        <option value={1}>1 ⭐</option>
      </select>

      <textarea
        className="w-full border mt-2"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button onClick={submit} className="mt-2 bg-blue-500 text-white p-2">
        Dodaj opinię
      </button>
    </div>
  );
};
export default AddReview;
