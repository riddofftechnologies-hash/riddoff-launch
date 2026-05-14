import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, BookOpen, Rocket, SlidersHorizontal, GraduationCap, Loader2 } from "lucide-react";
import { useBootcamps, toBootcamp } from "@/hooks/useBootcamps";
import { useCourses, toCourse } from "@/hooks/useCourses";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CourseCard from "@/components/CourseCard";
import HorizontalScrollRow from "@/components/HorizontalScrollRow";
import SidebarFilters from "@/components/SidebarFilters";
import WhySection from "@/components/WhySection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import type { ItemType, Bootcamp, Course } from "@/types/course";

const BOOTCAMP_SECTORS = [
  "All",
  "E-commerce & Retail",
  "Fintech & Banking",
  "Healthcare & Biotech",
  "Legal Tech",
  "Climate & Sustainability",
  "Manufacturing",
];

const COURSE_CATEGORIES = [
  "All",
  "Foundations",
  "LLM & RAG",
  "Agents & Orchestration",
  "Computer Vision",
  "MLOps & Deployment",
  "Industry Applications",
];

const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function CoursesSection() {
  const [activeTab, setActiveTab] = useState<"bootcamps" | "courses">("bootcamps");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeLevel, setActiveLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const bootcampsQuery = useBootcamps();
  const coursesQuery = useCourses();

  const bootcamps: Bootcamp[] = (bootcampsQuery.data ?? []).map(toBootcamp);
  const courses: Course[] = (coursesQuery.data ?? []).map(toCourse);

  const categories = activeTab === "bootcamps" ? BOOTCAMP_SECTORS : COURSE_CATEGORIES;
  const allItems = activeTab === "bootcamps" ? bootcamps : courses;
  const type: ItemType = activeTab === "bootcamps" ? "bootcamp" : "course";
  const isLoading =
    activeTab === "bootcamps" ? bootcampsQuery.isLoading : coursesQuery.isLoading;

  let filtered = allItems.filter((item) => {
    const catKey = activeTab === "bootcamps" ? "sector" : "category";
    const matchesCat =
      activeFilter === "All" || (item as Record<string, unknown>)[catKey] === activeFilter;
    const matchesLevel = activeLevel === "All Levels" || item.level === activeLevel;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(q) ||
      item.tagline.toLowerCase().includes(q);
    return matchesCat && matchesLevel && matchesSearch;
  });

  if (sortBy === "Price: Low to High") {
    filtered = [...filtered].sort((a, b) => a.priceLow - b.priceLow);
  } else if (sortBy === "Price: High to Low") {
    filtered = [...filtered].sort((a, b) => b.priceLow - a.priceLow);
  }

  function switchTab(tab: "bootcamps" | "courses") {
    setActiveTab(tab);
    setActiveFilter("All");
    setActiveLevel("All Levels");
    setShowMobileFilters(false);
  }

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <Hero onSearch={(q) => setSearchQuery(q)} />

      {/* Featured horizontal scroll rows */}
      <section className="py-10 sm:py-12 overflow-hidden">
        <HorizontalScrollRow title="Popular Live Bootcamps" items={bootcamps} type="bootcamp" fullBleed />
        <HorizontalScrollRow title="Top Self-Paced Courses" items={courses} type="course" fullBleed />
      </section>

      {/* Catalog */}
      <div id="catalog" className="border-t border-[#E0E0E0]">
        {/* Sticky tab bar */}
        <div className="sticky top-16 z-40 bg-white border-b border-[#E0E0E0]">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar">
              <a
                href="https://www.riddoff.com/masterclass"
                className="py-4 px-1 font-semibold text-sm border-b-2 border-transparent text-muted-foreground hover:text-foreground shrink-0 flex items-center gap-2 no-underline"
              >
                <Rocket size={16} />
                Masterclass
              </a>
              {(["bootcamps", "courses"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => switchTab(tab)}
                  className={`py-4 px-1 font-semibold text-sm border-b-2 shrink-0 flex items-center gap-2 transition-colors ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "bootcamps" ? (
                    <><Zap size={16} /> Live Bootcamps</>
                  ) : (
                    <><BookOpen size={16} /> Self-Paced Courses</>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Mobile filter bar */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="flex gap-2 overflow-x-auto flex-1 pb-1 hide-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                    activeFilter === cat
                      ? "bg-primary text-white"
                      : "bg-[#F0F0F0] text-foreground hover:bg-[#E8E8E8]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 border border-[#E0E0E0] rounded-full text-sm"
            >
              <SlidersHorizontal size={14} />
              Filter
            </button>
          </div>

          {/* Mobile filter panel */}
          {showMobileFilters && (
            <div className="lg:hidden mb-6 p-4 border border-[#E0E0E0] rounded-xl bg-white">
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Level
                </h4>
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setActiveLevel(lvl)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        activeLevel === lvl
                          ? "bg-primary text-white"
                          : "bg-[#F0F0F0] text-foreground"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Sort by
                </h4>
                <select
                  aria-label="Sort by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full text-sm border border-[#E0E0E0] rounded-md px-3 py-2 bg-white"
                >
                  <option>Most Popular</option>
                  <option>Highest Rated</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>
          )}

          {/* Desktop: sidebar + grid */}
          <div className="flex gap-8">
            <div className="hidden lg:block">
              <SidebarFilters
                categories={categories}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                levels={LEVELS}
                activeLevel={activeLevel}
                setActiveLevel={setActiveLevel}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </div>

            <div className="flex-1 min-w-0">
              {/* Results bar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{filtered.length}</span> results
                  {searchQuery && (
                    <span>
                      {" "}for "<span className="font-semibold">{searchQuery}</span>"
                    </span>
                  )}
                </p>
                <select
                  aria-label="Sort by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="hidden lg:block text-sm border border-[#E0E0E0] rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option>Most Popular</option>
                  <option>Highest Rated</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 size={32} className="animate-spin text-primary" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                  <GraduationCap size={40} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-lg font-semibold text-foreground mb-1">No programs found</p>
                  <p className="text-sm text-muted-foreground">
                    Try a different filter or search term.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <CourseCard item={item} type={type} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <WhySection type={type} />
      <Testimonials />
      <Footer />
    </div>
  );
}
