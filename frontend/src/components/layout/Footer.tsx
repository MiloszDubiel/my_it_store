
const Footer: React.FC = () => {
    return (
      <footer className="bg-gray-900 text-gray-300 py-10 ">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">
              IT-Shop
            </h4>
            <p className="text-sm">
              Najlepszy sklep z elektroniką i sprzętem IT.
              Szybka wysyłka i gwarancja jakości.
            </p>
          </div>

          <div>
            <h4 className="text-white text-lg font-semibold mb-4">
              Informacje
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-orange-500 cursor-pointer">O nas</li>
              <li className="hover:text-orange-500 cursor-pointer">Regulamin</li>
              <li className="hover:text-orange-500 cursor-pointer">Polityka prywatności</li>
              <li className="hover:text-orange-500 cursor-pointer">Kontakt</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-lg font-semibold mb-4">
              Kontakt
            </h4>
            <p className="text-sm">Email: kontakt@myitstore.pl</p>
            <p className="text-sm">Tel: +48 123 456 789</p>
          </div>

        </div>

        <div className="text-center text-sm text-gray-500 mt-8 border-t border-gray-700 pt-4">
          © {new Date().getFullYear()} My IT Store. Wszelkie prawa zastrzeżone.
        </div>
      </footer>
    )
}
export default Footer