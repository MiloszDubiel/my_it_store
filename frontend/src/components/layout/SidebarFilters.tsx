import React from "react";

interface SidebarFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="p-4 borderspace-y-4">
      <h2 className="font-bold text-lg text-orange-600">Kategorie</h2>
      <ul className="space-y-2">
        <li
          className={`cursor-pointer px-2 py-1 ${!selectedCategory ? "font-bold bg-orange-500 text-white" : "hover:bg-orange-200"}`}
          onClick={() => onCategoryChange(null)}
        >
          Wszystkie
        </li>
        {categories.map((cat) => (
          <li
            key={cat}
            className={`cursor-pointer px-2 py-1 ${
              selectedCategory === cat
                ? "font-bold bg-orange-500 text-white"
                : "hover:bg-orange-200"
            }`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarFilters;
