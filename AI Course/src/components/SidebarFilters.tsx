interface SidebarFiltersProps {
  categories: string[];
  activeFilter: string;
  setActiveFilter: (c: string) => void;
  levels: string[];
  activeLevel: string;
  setActiveLevel: (l: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
}

export default function SidebarFilters({
  categories,
  activeFilter,
  setActiveFilter,
  levels,
  activeLevel,
  setActiveLevel,
  sortBy,
  setSortBy,
}: SidebarFiltersProps) {
  return (
    <aside className="w-52 shrink-0">
      <div className="sticky top-[120px]">
        {/* Category */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Category
          </h3>
          <ul className="space-y-0.5">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setActiveFilter(cat)}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${
                    activeFilter === cat
                      ? "text-primary font-semibold bg-accent"
                      : "text-foreground hover:bg-[#F0F0F0]"
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Level */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Level
          </h3>
          <ul className="space-y-1">
            {levels.map((lvl) => (
              <li key={lvl}>
                <label className="flex items-center gap-2 text-sm cursor-pointer py-1 px-2 rounded hover:bg-[#F0F0F0]">
                  <input
                    type="radio"
                    name="level"
                    checked={activeLevel === lvl}
                    onChange={() => setActiveLevel(lvl)}
                    className="accent-primary"
                  />
                  <span
                    className={
                      activeLevel === lvl
                        ? "text-primary font-semibold"
                        : "text-foreground"
                    }
                  >
                    {lvl}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Sort */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Sort by
          </h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full text-sm border border-[#E0E0E0] rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option>Most Popular</option>
            <option>Highest Rated</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
