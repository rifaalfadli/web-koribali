import React, { useState, useEffect } from "react";
import { RotateCcw, Circle, CheckCircle } from "lucide-react";

export function ConditionInput({ condition, onUpdate, onNext }) {
  // State to track whether all condition fields are filled
  const [isComplete, setIsComplete] = useState(false);

  // Check if the form is fully completed whenever condition changes
  useEffect(() => {
    const fields = [condition.designStandard, condition.windSpeed];
    const complete = fields.every((v) => v && v.trim() !== "");
    setIsComplete(complete);
  }, [condition]);

  // Reset all condition fields
  const handleReset = () => {
    onUpdate({
      designStandard: "",
      windSpeed: "",
    });
  };

  return (
    <div>
      {/* FORM CARD WRAPPER */}
      <div className="bg-white border border-gray-200 p-6 rounded-b-xl shadow-sm">
        {/* 2-Column Grid (Responsive) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
          {/* FIELD : Design Standard Dropdown */}
          <div>
            <label className="block text-gray-700 mb-2">Design Standard</label>
            <select
              value={condition.designStandard}
              onChange={(e) => onUpdate({ designStandard: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3399cc] focus:border-[#3399cc] outline-none transition-all bg-white"
            >
              <option value="" disabled selected>
                Select Design Standard
              </option>
              <option value="act">Standard Acts. (Law)</option>
              <option value="tower">Tower Standard</option>
              <option value="jil">JIL</option>
              <option value="haiden">Haiden</option>
            </select>
          </div>

          {/* FIELD : Design Wind Speed Input */}
          <div>
            <label className="block text-gray-700 mb-2">
              Design Wind Speed
            </label>
            <div className="relative">
              <input
                type="number"
                value={condition.windSpeed}
                onChange={(e) => onUpdate({ windSpeed: e.target.value })}
                className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-[#3399cc] focus:border-[#3399cc] outline-none transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black-400">
                m/s
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-gray-200"></div>

        {/* FOOTER: LEFT (Reset Button) & RIGHT (Status Indicator) */}
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

          {/* Status Icon */}
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-8 py-3 h-[48px] 
            bg-gradient-to-r from-[#0d3b66] to-[#3399cc]
            text-white rounded-xl 
            hover:brightness-110 transition-all shadow-sm font-medium"
          >
            Next Input
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
