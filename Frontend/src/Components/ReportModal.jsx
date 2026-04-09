import React, { useState } from "react";
import { X, AlertOctagon } from "lucide-react";

const CATEGORIES = [
  "Abuse",
  "Harassment",
  "Spam",
  "Fake Profile",
  "Nudity",
  "Hate Speech",
  "Mental Health Concern",
  "Inappropriate Content",
  "Other"
];

export default function ReportModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [selectedType, setSelectedType] = useState("");
  const [content, setContent] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedType) {
      alert("Please select a report category.");
      return;
    }
    onSubmit(selectedType, content);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl relative"
        style={{ border: "1px solid rgba(139,92,246,0.2)" }}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-rose-100 text-rose-500">
                <AlertOctagon size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--c-ink)]">Submit a Report</h3>
                <p className="text-xs text-[var(--c-muted)]">Your identity remains completely anonymous.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-[var(--c-muted)]" />
            </button>
          </div>

          <div className="mb-5">
            <p className="text-xs font-semibold text-[var(--c-muted)] uppercase mb-3">Why are you reporting this?</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedType(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedType === cat 
                      ? "bg-rose-500 text-white shadow-md" 
                      : "bg-gray-50 text-[var(--c-muted)] hover:bg-rose-50 hover:text-rose-500"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs font-semibold text-[var(--c-muted)] uppercase mb-2">Additional context (optional)</p>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Help us understand exactly what's wrong..."
              className="field w-full min-h-24 resize-none border-0 bg-gray-50 rounded-xl focus:bg-white text-sm p-3"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t" style={{ borderColor: "rgba(139,92,246,0.08)" }}>
            <button 
              onClick={onClose} 
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-[var(--c-muted)] hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-opacity ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
              }`}
              style={{ background: "linear-gradient(135deg,#f43f5e,#e11d48)" }}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
