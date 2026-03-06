import { Search } from "lucide-react";

const SearchBar = ({
  placeholder = "Search...",
  value,
  onChange,
  showIcon = true,

  containerClassName = "",
  inputClassName = "",
  iconClassName = "",
}) => {
  return (
    <div
      className={`relative w-full max-w-[1000px] my-5 ${containerClassName}`}
    >
      {showIcon && (
        <Search
          size={18}
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 ${iconClassName}`}
        />
      )}

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full
          ${showIcon ? "pl-11 pr-4" : "px-4"}
          py-3
          rounded-xl
          bg-slate-700
          text-white
          text-sm
          border border-black
          focus:border-teal-400
          focus:outline-none
          transition
          ${inputClassName}
        `}
      />
    </div>
  );
};

export default SearchBar;
