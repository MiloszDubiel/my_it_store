import { useState, useReducer, useMemo } from "react";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";
import { removeFromCart, clearCart } from "../../redux/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
type FromState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  postalCode: string;
  street: string;
};

type FormAction = {
  field: string;
  value: string;
  type: "SET_FIELD";
};

const formDataReducer = (state: FromState, action: FormAction) => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };

    default:
      return state;
  }
};

const CartPage = () => {
  const cart = useAppSelector((state) => state.cart.cart);
  const dispatch = useAppDispatch();

  const [formState, dispatchFormState] = useReducer(formDataReducer, {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    postalCode: "",
    street: "",
  });

  const totalPrice = useMemo(
    () =>
      cart
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2),

    [cart],
  );

  const [deliveryMethod, setDeliveryMethod] = useState<string>("courier");
  const [paymentMethod, setPaymentMethod] = useState<string>("blik");

  const deliveryPrice = deliveryMethod === "courier" ? 15 : 12;
  const finalPrice = totalPrice + deliveryPrice;

  const handleOrder = async () => {
    try {
      await axios.post("/api/orders", {
        cart,
        deliveryData: formState,
        deliveryMethod,
        paymentMethod,
        totalPrice: finalPrice,
      });

      clearCart();
      alert("Zamówienie złożone!");
    } catch (err) {
      console.error(err);
      alert("Błąd zamówienia");
    }
  };

  return (
    <>
      <Navbar />

      <section className="bg-orange-500 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Twój Koszyk</h1>
        <p className="text-lg">Sprawdź produkty i złóż zamówienie</p>
      </section>

      <main className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.length === 0 && (
            <p className="text-gray-500">Koszyk jest pusty</p>
          )}

          {cart.map((item: any) => (
            <div
              key={item.id}
              className="bg-white shadow-md p-4 flex gap-4 items-center"
            >
              <img
                src={item.product_data.images?.[0]?.url || "/no-image.png"}
                alt={item.product_data.name}
                className="w-20 h-20 object-cover"
              />

              <div className="flex-1">
                <h3 className="font-semibold line-clamp-2">
                  {item.product_data.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {item.quantity} x {item.price} zł
                </p>
              </div>

              <div className="text-right">
                <div className="font-bold text-orange-500">
                  {(item.price * item.quantity).toFixed(2)} zł
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white shadow-md p-6 space-y-6 h-fit">
          <h2 className="text-xl font-bold">Dane do dostawy</h2>

          <div className="space-y-3">
            <input
              name="firstName"
              placeholder="Imię"
              onChange={(e) => {
                dispatchFormState({
                  type: "SET_FIELD",
                  field: "firstName",
                  value: e.target.value,
                });
              }}
              className="w-full border p-2 border-gray-200"
            />

            <input
              name="lastName"
              placeholder="Nazwisko"
              onChange={(e) => {
                dispatchFormState({
                  type: "SET_FIELD",
                  field: "lastName",
                  value: e.target.value,
                });
              }}
              className="w-full border p-2 border-gray-200"
            />

            <input
              name="email"
              placeholder="Email"
              onChange={(e) => {
                dispatchFormState({
                  type: "SET_FIELD",
                  field: "email",
                  value: e.target.value,
                });
              }}
              className="w-full border p-2 border-gray-200"
            />

            <input
              name="phone"
              placeholder="Telefon"
              onChange={(e) => {
                dispatchFormState({
                  type: "SET_FIELD",
                  field: "phone",
                  value: e.target.value,
                });
              }}
              className="w-full border p-2 border-gray-200"
            />

            <input
              name="city"
              placeholder="Miasto"
              onChange={(e) => {
                dispatchFormState({
                  type: "SET_FIELD",
                  field: e.target.name,
                  value: e.target.value,
                });
              }}
              className="w-full border p-2 border-gray-200"
            />

            <input
              name="postalCode"
              placeholder="Kod pocztowy"
              onChange={(e) => {
                dispatchFormState({
                  type: "SET_FIELD",
                  field: e.target.name,
                  value: e.target.value,
                });
              }}
              className="w-full border p-2 border-gray-200"
            />

            <input
              name="street"
              placeholder="Ulica i numer"
              onChange={(e) => {
                dispatchFormState({
                  type: "SET_FIELD",
                  field: e.target.name,
                  value: e.target.value,
                });
              }}
              className="w-full border p-2 border-gray-200"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Dostawa</h3>

            <label className="flex justify-between border p-3 mb-2 cursor-pointer border-gray-200">
              <span>Kurier</span>
              <span>15 zł</span>

              <input
                type="radio"
                checked={deliveryMethod === "courier"}
                onChange={() => setDeliveryMethod("courier")}
              />
            </label>

            <label className="flex justify-between border p-3 cursor-pointer border-gray-200">
              <span>Paczkomat</span>
              <span>12 zł</span>

              <input
                type="radio"
                checked={deliveryMethod === "parcel"}
                onChange={() => setDeliveryMethod("parcel")}
              />
            </label>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Płatność</h3>

            <label className="flex border p-3 mb-2 cursor-pointer border-gray-200">
              <input
                type="radio"
                checked={paymentMethod === "blik"}
                onChange={() => setPaymentMethod("blik")}
              />
              <span className="ml-2">BLIK</span>
            </label>

            <label className="flex border p-3 mb-2 cursor-pointer border-gray-200">
              <input
                type="radio"
                checked={paymentMethod === "transfer"}
                onChange={() => setPaymentMethod("transfer")}
              />
              <span className="ml-2">Przelew</span>
            </label>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Produkty</span>
              <span>{totalPrice} zł</span>
            </div>

            <div className="flex justify-between">
              <span>Dostawa</span>
              <span>{deliveryPrice} zł</span>
            </div>

            <div className="flex justify-between text-lg font-bold">
              <span>Do zapłaty</span>
              <span className="text-orange-500">{finalPrice} zł</span>
            </div>

            <button
              onClick={handleOrder}
              className="w-full bg-orange-500 text-white py-3 mt-4 hover:bg-orange-600 transition"
            >
              Złóż zamówienie
            </button>

            <button
              onClick={() => () => dispatch(clearCart())}
              className="w-full text-sm text-red-500 hover:underline"
            >
              Wyczyść koszyk
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default CartPage;
