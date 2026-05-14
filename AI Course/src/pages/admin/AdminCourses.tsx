import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { fetchAllCourses, deleteCourse, updateCourse } from "@/services/courses";
import type { CourseDoc } from "@/types/course";

export default function AdminCourses() {
  const [items, setItems] = useState<CourseDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "course" | "bootcamp">("all");

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    setLoading(true);
    try {
      const data = await fetchAllCourses();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteCourse(id);
    setItems((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleTogglePublish(item: CourseDoc) {
    await updateCourse(item.id, { published: !item.published });
    setItems((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, published: !c.published } : c))
    );
  }

  const filtered = tab === "all" ? items : items.filter((i) => i.type === tab);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Courses & Bootcamps</h1>
          <p className="text-sm text-muted-foreground mt-1">{items.length} total programs</p>
        </div>
        <Link
          to="/admin/courses/new"
          className="flex items-center gap-2 bg-primary text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors no-underline"
        >
          <PlusCircle size={15} />
          New Program
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-[#F0F0F0] rounded-lg p-1 w-fit">
        {(["all", "bootcamp", "course"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === t ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t === "all" ? "All" : t === "bootcamp" ? "Bootcamps" : "Courses"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground py-12 text-center">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">No programs yet.</p>
          <Link
            to="/admin/courses/new"
            className="text-sm text-primary font-semibold mt-2 inline-block no-underline hover:underline"
          >
            Create your first one →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E0E0E0] bg-[#F7F7F7]">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Instructor</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Level</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`border-b border-[#F0F0F0] last:border-0 ${idx % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt=""
                          className="w-10 h-8 rounded object-cover shrink-0 bg-[#F0F0F0]"
                        />
                      )}
                      <div>
                        <p className="font-medium text-foreground line-clamp-1">{item.title}</p>
                        <p className="text-xs text-muted-foreground">₹{item.priceLow}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.type === "bootcamp"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {item.instructor}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {item.level}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        title={item.published ? "Unpublish" : "Publish"}
                        className="p-1.5 rounded-md hover:bg-[#F0F0F0] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.published ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <Link
                        to={`/admin/courses/${item.id}`}
                        className="p-1.5 rounded-md hover:bg-[#F0F0F0] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
