const Loader = ({
  size = 40,
  thickness = 4,
  colorClass = "border-t-teal-400",
  trackClass = "border-slate-600",
  speedClass = "animate-spin",
  className = "",
  spinnerClassName = "",
}) => {
  return (
    <div className={`flex justify-center items-center py-10 ${className}`}>
      <div
        className={`
          ${trackClass}
          ${colorClass}
          ${speedClass}
          rounded-full
          border-solid
          ${spinnerClassName}
        `}
        style={{
          width: size,
          height: size,
          borderWidth: thickness,
        }}
      />
    </div>
  );
};

export default Loader;
