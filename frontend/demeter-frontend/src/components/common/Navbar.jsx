import { Sun, ShoppingBag, Plus, LogOut } from "lucide-react";

const Navbar = ({
  title = "Demeter",
  logoLetter = "D",

  showBalance = true,
  showTheme = true,
  showCart = true,
  showProfile = true,
  showExit = true,

  balance = "450 GK",

  onAddBalance,
  onCartClick,
  onProfileClick,
  onExitClick,

  height = "h-[60px]",
  className = "",
  walletClassName = "",
  iconClassName = "",
  profileClassName = "",
  exitClassName = "",
}) => {
  return (
    <nav
      className={`
        w-full ${height}
        bg-gradient-to-r from-slate-900 to-slate-800
        flex justify-between items-center
        px-6 md:px-10
        text-white
        ${className}
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-lime-400 to-cyan-400 flex items-center justify-center font-bold text-slate-900">
          {logoLetter}
        </div>
        <h3 className="text-lg font-semibold tracking-wide">
          {title}
        </h3>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 md:gap-5">

        {showBalance && (
          <div
            className={`
              bg-slate-800
              px-4 py-1.5
              rounded-full
              flex items-center gap-3
              text-yellow-400 font-semibold
              ${walletClassName}
            `}
          >
            <span className="text-sm md:text-base">
              {balance}
            </span>

            <button
              type="button"
              onClick={onAddBalance}
              className="
                w-7 h-7
                rounded-full
                bg-teal-400
                flex items-center justify-center
                text-slate-900
                hover:bg-teal-500
                active:scale-95
                transition
              "
            >
              <Plus size={16} />
            </button>
          </div>
        )}

        {showTheme && (
          <Sun
            size={20}
            className={`cursor-pointer text-slate-300 hover:text-white transition ${iconClassName}`}
          />
        )}

        {showCart && (
          <ShoppingBag
            size={20}
            onClick={onCartClick}
            className={`cursor-pointer text-slate-300 hover:text-white transition ${iconClassName}`}
          />
        )}

        {showProfile && (
          <div
            onClick={onProfileClick}
            className={`w-8 h-8 rounded-full bg-slate-600 cursor-pointer hover:bg-slate-500 transition ${profileClassName}`}
          />
        )}

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
