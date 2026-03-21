import { ShoppingBag, Plus, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext.jsx";
import { useWallet } from "../../contexts/WalletContext.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import NotificationBell from "./NotificationBell.jsx";

const logoStyles = {
  STUDENT: "bg-gradient-to-br from-lime-400 to-cyan-400 text-slate-900",
  STAFF: "bg-gradient-to-br from-yellow-300 to-amber-500 text-slate-900",
  ADMIN: "bg-gradient-to-br from-red-400 to-rose-600 text-white",
};

const homeLinks = {
  STUDENT: "/",
  STAFF: "/staff",
  ADMIN: "/admin",
};

const Navbar = ({
  title = "Demeter",
  logoLetter = "D",

  showBalance = true,
  showCart = true,
  showNotifications = true,
  showProfile = true,
  showExit = true,

  profilePhoto = null,

  onProfileClick,
  onExitClick,

  height = "h-[70px]",
  className = "",
}) => {
  const { cart = [] } = useCart() || {};
  const { balance = 0 } = useWallet() || {};
  const { user } = useAuth();

  const role = user?.role || "STUDENT";
  const name = user?.username || "User";
  const initials = name
    .split(/[_\s]/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav
      className={`
        sticky top-0 z-40
        w-full ${height}
        bg-white/80 dark:bg-gray-900/60
        backdrop-blur-md
        border-b border-gray-200 dark:border-white/10
        flex justify-between items-center
        pl-3 pr-6 md:pl-4 md:pr-10
        text-gray-900 dark:text-white
        ${className}
      `}
    >
      {/* LEFT SIDE */}
      <Link to={homeLinks[role] || "/"} className="flex items-center gap-3 cursor-pointer">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold ${logoStyles[role] || logoStyles.STUDENT}`}>
          {logoLetter}
        </div>
        <h3 className="text-lg font-semibold tracking-wide hover:text-cyan-500 dark:hover:text-cyan-300 transition">
          {title}
        </h3>
      </Link>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 md:gap-5">
        {/* WALLET */}
        {showBalance && (
          <Link to="/wallet">
            <div
              className="
                bg-gray-100 dark:bg-slate-800
                h-10
                pl-4 pr-2
                rounded-full
                flex items-center
                text-yellow-600 dark:text-yellow-400 font-semibold
                hover:bg-gray-200 dark:hover:bg-slate-700
                cursor-pointer
                transition
              "
            >
              <span className="text-sm md:text-base leading-none">
                {Number(balance).toFixed(2)} GK
              </span>
              <div className="
                ml-3
                w-7 h-7
                rounded-full
                bg-teal-500 dark:bg-teal-400
                flex items-center justify-center
                text-white dark:text-slate-900
              ">
                <Plus size={16} />
              </div>
            </div>
          </Link>
        )}

        {/* NOTIFICATIONS */}
        {showNotifications && <NotificationBell />}

        {/* CART */}
        {showCart && (
          <Link to="/cart" aria-label="Shopping cart">
            <div className="relative w-6 h-6 flex items-center justify-center">
              <ShoppingBag
                size={20}
                className="text-gray-500 dark:text-slate-300 hover:text-gray-700 dark:hover:text-white transition"
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
                  border border-white dark:border-slate-900
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
            role="button"
            aria-label="User profile"
            className="w-8 h-8 rounded-full bg-gray-300 dark:bg-slate-600 flex items-center justify-center overflow-hidden cursor-pointer text-gray-700 dark:text-white text-xs font-semibold"
          >
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
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
            role="button"
            aria-label="Logout"
            className="cursor-pointer text-red-400 hover:text-red-500 transition"
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
