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
        <div key={review.id} className="border p-4 border-gray-200">
          <div className="flex justify-between">
            <span className="font-bold">{review.email}</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={`w-5 h-5 ${
                    review.rating ? "fill-yellow-400" : "fill-gray-300"
                  }`}
                >
                  <path d="M12 17.3l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.76-1.64 7.03z" />
                </svg>
              ))}
            </div>
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
