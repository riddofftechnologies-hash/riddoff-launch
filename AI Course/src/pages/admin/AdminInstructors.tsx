import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { fetchAllInstructors, deleteInstructor, type InstructorDoc } from "@/services/instructors";

export default function AdminInstructors() {
  const [instructors, setInstructors] = useState<InstructorDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      setInstructors(await fetchAllInstructors());
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete instructor "${name}"? This cannot be undone.`)) return;
    await deleteInstructor(id);
    setInstructors((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Instructors</h1>
          <p className="text-sm text-muted-foreground mt-1">{instructors.length} instructors</p>
        </div>
        <Link
          to="/admin/instructors/new"
          className="flex items-center gap-2 bg-primary text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors no-underline"
        >
          <PlusCircle size={15} /> Add Instructor
        </Link>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground py-12 text-center">Loading…</div>
      ) : instructors.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">No instructors yet.</p>
          <Link
            to="/admin/instructors/new"
            className="text-sm text-primary font-semibold mt-2 inline-block no-underline hover:underline"
          >
            Add your first instructor →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {instructors.map((ins) => (
            <div key={ins.id} className="bg-white rounded-xl border border-[#E0E0E0] p-5">
              <div className="flex items-start gap-3 mb-3">
                {ins.photoUrl ? (
                  <img
                    src={ins.photoUrl}
                    alt={ins.name}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-lg">
                      {ins.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm">{ins.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{ins.title}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-3 mb-4">{ins.bio}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <span>
                  <strong className="text-foreground">{ins.courses}</strong> courses
                </span>
                <span>
                  <strong className="text-foreground">{ins.learners.toLocaleString()}</strong>{" "}
                  learners
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/admin/instructors/${ins.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E0E0E0] text-xs font-medium text-foreground hover:bg-[#F7F7F7] transition-colors no-underline"
                >
                  <Pencil size={12} /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(ins.id, ins.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E0E0E0] text-xs font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
