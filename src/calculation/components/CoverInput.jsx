import React, { useState, useEffect } from "react";
import { RotateCcw, Circle, CheckCircle } from "lucide-react";

export function CoverInput({ cover, onUpdate, onMake }) {
  // State to mark whether all mandatory fields have been filled in
  const [isComplete, setIsComplete] = useState(false);

  // Effect: check for any changes to `cover`, then set isComplete
  useEffect(() => {
    const fields = [
      cover.managementMark,
      cover.calculationNumber,
      cover.projectName,
      cover.contentr2,
      cover.date,
    ];

    // Check all fields are not empty => update state isComplete
    const complete = fields.every((v) => v && v.trim() !== "");
    setIsComplete(complete);
  }, [cover]);

  // Function to reset all inputs to default (empty)
  const handleReset = () => {
    onUpdate({
      managementMark: "",
      calculationNumber: "",
      projectName: "",
      contentr2: "",
      contentr3: "",
      date: "",
    });
  };

  return (
    <div>
      {/* FORM CARD WRAPPER */}
      <div className="bg-white border border-gray-200 p-6 rounded-b-xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
          {/* FIELD: Management Code */}
          <div>
            <label className="block text-gray-700 mb-2">Management Code</label>
            <input
              type="text"
              value={cover.managementMark}
              onChange={(e) => {
                // Take user input => convert it to capital letters
                const raw = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");

                // Only take a maximum of 3 letters
                const letters = raw.slice(0, 3);

                // Auto format: A ー B ー C
                const formatted = letters.split("").join(" ー ");

                onUpdate({ managementMark: formatted });
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-[#3399cc] focus:border-[#3399cc] 
              outline-none transition-all bg-white tracking-widest"
            />
          </div>

          {/* FIELD: Calculation Document Number */}
          <div>
            <label className="block text-gray-700 mb-2">
              Calculation Document Number
            </label>
            <input
              type="text"
              value={cover.calculationNumber}
              onChange={(e) => onUpdate({ calculationNumber: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3399cc] focus:border-[#3399cc] outline-none transition-all bg-white"
            />
          </div>

          {/* FIELD: Project Name */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">Line 1</label>
            <input
              type="text"
              value={cover.projectName}
              onChange={(e) => onUpdate({ projectName: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3399cc] focus:border-[#3399cc] outline-none transition-all bg-white"
            />
          </div>

          {/* FIELD: Content Row 2 */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">Line 2</label>
            <input
              type="text"
              value={cover.contentr2}
              onChange={(e) => onUpdate({ contentr2: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3399cc] focus:border-[#3399cc] outline-none transition-all bg-white"
            />
          </div>

          {/* FIELD: Content Row 3 (Optional) */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">
              Line 3 (Optional)
            </label>
            <input
              type="text"
              value={cover.contentr3}
              onChange={(e) => onUpdate({ contentr3: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3399cc] focus:border-[#3399cc] outline-none transition-all bg-white"
            />
          </div>

          {/* FIELD: Document Date */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">Document Date</label>
            <input
              type="date"
              value={cover.date}
              onChange={(e) => onUpdate({ date: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3399cc] focus:border-[#3399cc] outline-none transition-all bg-white"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-gray-200"></div>

        {/* FOOTER: LEFT (Reset) & RIGHT (Completion Status) */}
        <div className="flex justify-between items-center pt-6">
          {/* RESET BUTTON */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-8 py-3 h-[48px] bg-[#eef2f6] text-[#0d3b66]
            border-2 border-[#d0d7e2] rounded-xl hover:bg-[#e2e8f0] transition-colors font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          {/* COMPLETION STATUS BADGE */}
          <button
            onClick={onMake}
            className="flex items-center gap-2 px-8 py-3 h-[48px] 
            bg-gradient-to-r from-[#0d3b66] to-[#3399cc]
            text-white rounded-xl 
            hover:brightness-110 transition-all shadow-sm font-medium"
          >
            Make Report
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
