import React from "react";

interface OfferCardProps {
  title: string;
  category: string;
  price: number;
}

const OfferCard: React.FC<OfferCardProps> = ({ title, category, price }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{category}</p>
      <p className="mt-2 font-bold">${price}</p>
    </div>
  );
};

export default OfferCard;
