import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";
import { useQuery } from "@tanstack/react-query";

const OfferDetails = () => {
  const { slug, id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchOffer = async () => {
    try {
      const response = await axios.get(`/api/products/products/${slug}/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const { data: product = [], isLoading } = useQuery({
    queryKey: ["product", id, slug],
    queryFn: fetchOffer,
    staleTime: 1000 * 5 * 60,
  });

  if (isLoading)
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto p-10 text-center text-lg">
          Ładowanie produktu...
        </div>
      </>
    );

  if (!product)
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto p-10 text-center text-lg">
          Nie znaleziono oferty
        </div>
      </>
    );

  const productData = product.product_data;

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <img
              src={productData?.images?.[selectedImage]?.url || "/no-image.png"}
              alt={productData?.name}
              className="h-137.5 rounded-xl shadow-lg object-cover mb-4"
            />

            {productData?.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {productData?.images?.map((img: any, index: number) => (
                  <img
                    key={index}
                    src={img?.url}
                    alt=""
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                      selectedImage === index
                        ? "border-orange-500"
                        : "border-gray-200"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              {productData?.name || "Brak nazwy produktu"}
            </h1>

            <p className="text-3xl text-orange-600 font-semibold mt-4">
              {product?.price ?? "—"} zł
            </p>

            <p className="mt-2 text-gray-500">
              Dostępne: {product?.stock ?? 0} szt.
            </p>

            <button
              disabled={!product?.stock}
              className="mt-6 w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-3 rounded-xl transition text-lg font-semibold"
            >
              {product?.stock ? "Dodaj do koszyka" : "Brak w magazynie"}
            </button>

            {productData?.parameters?.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-semibold mb-4">Specyfikacja</h2>

                <div className="space-y-2">
                  {productData.parameters.map((param: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between border-b pb-2 text-sm"
                    >
                      <span className="text-gray-600">{param?.name}</span>
                      <span className="font-medium text-right">
                        {param?.valuesLabels?.join(", ") || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {productData?.productSafety?.safetyInformation?.description && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">
              Informacje o bezpieczeństwie
            </h2>

            <p className="text-gray-700 whitespace-pre-line">
              {productData.productSafety.safetyInformation.description}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default OfferDetails;
