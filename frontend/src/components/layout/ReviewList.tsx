import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import SellerReply from "./../layout/SellerReply";

const ReviewsList = ({ productId }: { productId: string }) => {
  const { user } = useAuth();
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const res = await axios.get(`/api/reviews/product/${productId}`);
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  if (isLoading) return <div>Ładowanie opinii...</div>;

  return (
    <div className="space-y-4">
      {reviews?.map((review: any) => (
        <div key={review.id} className="border p-4 rounded">
          <div className="flex justify-between">
            <span className="font-bold">{review.name}</span>
            <span>⭐ {review.rating}/5</span>
          </div>

          <p className="mt-2">{review.comment}</p>

          {review.seller_reply && (
            <div className="mt-3 bg-gray-100 p-3 rounded">
              <b>Odpowiedź sprzedawcy:</b>
              <p>{review.seller_reply}</p>
            </div>
          )}

          {user?.role === "SELLER" && !review.seller_reply && (
            <SellerReply reviewId={review.id} />
          )}
        </div>
      ))}
    </div>
  );
};
export default ReviewsList;
