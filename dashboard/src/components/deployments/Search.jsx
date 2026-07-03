import { Search as SearchIcon, X } from "lucide-react";

const Search = ({ value, onChange, placeholder = "Search deployments..." }) => {
  return (
    <div className="relative flex items-center">
      <SearchIcon
        size={16}
        className="absolute left-3 text-slate-500 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-8 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 rounded p-0.5 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default Search;
