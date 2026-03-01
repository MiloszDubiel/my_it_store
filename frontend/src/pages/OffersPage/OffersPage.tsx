import React, { useState } from "react";
import SidebarFilters from "../../components/layout/SidebarFilters";
import OfferCard from "../../components/ui/OffersCard";
import Pagination from "../../components/ui/Pagination";

interface Offer {
  id: number;
  title: string;
  category: string;
  price: number;
}

const offersData: Offer[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Oferta ${i + 1}`,
  category: ["Elektronika", "Moda", "Dom"][i % 3],
  price: Math.floor(Math.random() * 500),
}));

const OffersPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 9;


  const filteredOffers = selectedCategory
    ? offersData.filter((offer) => offer.category === selectedCategory)
    : offersData;

  const totalPages = Math.ceil(filteredOffers.length / offersPerPage);

  const displayedOffers = filteredOffers.slice(
    (currentPage - 1) * offersPerPage,
    currentPage * offersPerPage,
  );

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 top-0 border-r border-orange-400">
        <SidebarFilters
          categories={["Elektronika", "Moda", "Dom"]}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </aside>

      {/* Główna sekcja z ofertami */}
      <main className="flex-1 p-6 space-y-6">
        {displayedOffers.map((offer) => (
          <OfferCard
            key={offer.id}
            title={offer.title}
            category={offer.category}
            price={offer.price}
          />
        ))}

        {filteredOffers.length === 0 && (
          <p className="text-gray-500">Brak ofert w tej kategorii</p>
        )}

        {/* Paginacja */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
};

export default OffersPage;
