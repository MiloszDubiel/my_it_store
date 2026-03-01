import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface Offer {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
}

const OfferPage = () => {
  const { id } = useParams<{ id: string }>();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/offers/${id}`);
        setOffer(response.data);
      } catch (err) {
        setError("Nie udało się pobrać oferty.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOffer();
  }, [id]);

  const handleAddToCart = () => {
    console.log("Dodano do koszyka:", offer);
  };

  const handleBuyNow = () => {
    console.log("Kup teraz:", offer);
  };

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>{error}</p>;
  if (!offer) return <p>Brak oferty</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{offer.name}</h1>
      <p className="text-2xl font-semibold mb-4">{offer.price} PLN</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {offer.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={offer.name}
            className="w-full h-64 object-cover rounded-lg"
          />
        ))}
      </div>
      <p className="mb-6">{offer.description}</p>

      <div className="flex gap-4">
        <button
          onClick={handleAddToCart}
          className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition"
        >
          Dodaj do koszyka
        </button>
        <button
          onClick={handleBuyNow}
          className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition"
        >
          Kup teraz
        </button>
      </div>
    </div>
  );
};

export default OfferPage;
