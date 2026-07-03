const StatsCard = ({ title, value, subtitle, color = "blue" }) => {
  const colors = {
    blue: "text-blue-400",
    green: "text-green-400",
    yellow: "text-yellow-400",
    red: "text-red-400",
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-sm">
      <p className="text-sm text-slate-400">{title}</p>

      <h2 className={`mt-3 text-3xl font-bold ${colors[color]}`}>{value}</h2>

      <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
};

export default StatsCard;
