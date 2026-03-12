import { Sun, ShoppingBag, Plus, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useWallet } from "../../context/WalletContext.jsx";

const Navbar = ({
  title = "Demeter",
  logoLetter = "D",

  showBalance = true,
  showTheme = true,
  showCart = true,
  showProfile = true,
  showExit = true,

  profilePhoto = null,   // optional profile image

  onProfileClick,
  onExitClick,

  height = "h-[70px]",
  className = "",
  walletClassName = "",
  iconClassName = "",
  profileClassName = "",
  exitClassName = "",
}) => {
  // Get cart and wallet data safely
  const { cart = [] } = useCart() || {};
  const { balance = 0 } = useWallet() || {};

  // Get student name and initials
  const student = JSON.parse(localStorage.getItem("student"));
  const name = student?.fullName || "Student";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <nav
      className={`
        sticky top-0 z-50
        w-full ${height}
        bg-gray-900/60
        backdrop-blur-md
        border-b border-white/10
        flex justify-between items-center
        pl-3 pr-6 md:pl-4 md:pr-10
        text-white
        ${className}
      `}
    >
      {/* LEFT SIDE */}
      <Link to="/" className="flex items-center gap-3 cursor-pointer">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-lime-400 to-cyan-400 flex items-center justify-center font-bold text-slate-900">
          {logoLetter}
        </div>
        <h3 className="text-lg font-semibold tracking-wide hover:text-cyan-300 transition">
          {title}
        </h3>
      </Link>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 md:gap-5">
        {/* WALLET */}
        {showBalance && (
          <Link to="/wallet">
            <div
              className={`
                bg-slate-800
                h-10
                pl-4 pr-2
                rounded-full
                flex items-center
                text-yellow-400 font-semibold
                hover:bg-slate-700
                cursor-pointer
                transition
                ${walletClassName}
              `}
            >
              <span className="text-sm md:text-base leading-none">
                {balance.toFixed(2)} GK
              </span>
              <div className="
                ml-3
                w-7 h-7
                rounded-full
                bg-teal-400
                flex items-center justify-center
                text-slate-900
              ">
                <Plus size={16} />
              </div>
            </div>
          </Link>
        )}

        {/* THEME */}
        {showTheme && (
          <Sun
            size={20}
            className={`cursor-pointer text-slate-300 hover:text-white transition ${iconClassName}`}
          />
        )}

        {/* CART */}
        {showCart && (
          <Link to="/cart">
            <div className="relative w-6 h-6 flex items-center justify-center">
              <ShoppingBag
                size={20}
                className={`text-slate-300 hover:text-white transition ${iconClassName}`}
              />
              {cart.length > 0 && (
                <span className="
                  absolute -top-1 -right-1
                  bg-teal-400
                  text-black
                  text-[9px]
                  font-semibold
                  rounded-full
                  w-4 h-4
                  flex items-center justify-center
                  border border-slate-900
                ">
                  {cart.length}
                </span>
              )}
            </div>
          </Link>
        )}

        {/* PROFILE */}
        {showProfile && (
          <div
            onClick={onProfileClick}
            className={`w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center overflow-hidden cursor-pointer text-white text-xs font-semibold ${profileClassName}`}
          >
            {profilePhoto ? (
              <img src={profilePhoto} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
        )}

        {/* LOGOUT */}
        {showExit && (
          <LogOut
            size={20}
            onClick={onExitClick}
            className={`cursor-pointer text-red-400 hover:text-red-500 transition ${exitClassName}`}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
