import React, { useState } from "react";
import PropTypes from "prop-types";
import { FileText, FileSpreadsheet, CheckCircle2 } from "lucide-react";

export function ResultsTable({ results, onCoverInput }) {
  const [page] = useState(0);
  const r = results[page]; // current section

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d3b66] to-[#3399cc] px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white mb-0.5">Calculation Results</h2>
              <p className="text-white/70">
                Comprehensive structural analysis output
              </p>
            </div>
          </div>

          <button
            onClick={onCoverInput}
            className="flex items-center gap-2 px-5 py-2.5 
            bg-white text-[#0d3b66] rounded-xl 
            shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-transparent"
          >
            <FileText className="w-4 h-4" />
            Make Report
          </button>
        </div>
      </div>

      {/* ===================== 2 COLUMN TABLE ===================== */}
      {r && (
        <div className="px-6 py-6 space-y-10">
          {/* ---------- TABLE 1 : BASIC INFO & GEOMETRY ---------- */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-50 text-[#0d3b66] text-sm">
                  <th className="px-3 py-2 border border-gray-300 text-center font-semibold">
                    POLE
                  </th>

                  <th className="px-3 py-2 border border-gray-300 text-center font-semibold">
                    Description
                  </th>

                  <th className="px-3 py-2 border border-gray-300 text-center font-semibold">
                    Pole Type
                  </th>

                  <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                    <div className="font-semibold">Dia Upper</div>
                    <div className="text-[13px] pt-[4px] text-gray-500">
                      (mm)
                    </div>
                  </th>

                  <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                    <div className="font-semibold">Dia Lower</div>
                    <div className="text-[13px] pt-[4px] text-gray-500">
                      (mm)
                    </div>
                  </th>

                  <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                    <div className="font-semibold">Thick Upper</div>
                    <div className="text-[13px] pt-[4px] text-gray-500">
                      (mm)
                    </div>
                  </th>

                  <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                    <div className="font-semibold">Thick Lower</div>
                    <div className="text-[13px] pt-[4px] text-gray-500">
                      (mm)
                    </div>
                  </th>

                  <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                    <div className="font-semibold">Length</div>
                    <div className="text-[13px] pt-[4px] text-gray-500">
                      (mm)
                    </div>
                  </th>

                  <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                    <div className="font-semibold">Height (z)</div>
                    <div className="text-[13px] pt-[4px] text-gray-500">
                      (mm)
                    </div>
                  </th>

                  <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                    <div className="font-semibold whitespace-nowrap">
                      Center Point
                    </div>
                    <div className="text-[13px] pt-[4px] text-gray-500 whitespace-nowrap">
                      CP (mm)
                    </div>
                  </th>

                  <th className="px-3 py-2 border border-gray-300 text-center font-semibold">
                    Material
                  </th>
                </tr>
              </thead>

              <tbody>
                {results.map((r, i) => (
                  <tr
                    key={i}
                    className="hover:bg-[#3399cc]/10 transition-colors text-sm"
                  >
                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.pole}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.description}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.poleType}
                    </td>

                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.poleType === "Straight" ? r.diaLower : r.diaUpper}
                    </td>

                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.diaLower}
                    </td>

                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.poleType === "Straight" ? r.thickLower : r.thickUpper}
                    </td>

                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.thickLower}
                    </td>

                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.length}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.heightZ}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.centerPoint}
                    </td>

                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.material}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ---------- TABLE 2 : CALCULATED RESULTS ---------- */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                {/* ================== ROW 1 ================== */}
                <tr className="bg-blue-50 text-[#0d3b66] text-sm">
                  {/* Group Header */}
                  <th
                    className="px-3 py-2 border border-gray-300 text-center font-semibold"
                    colSpan={4}
                  >
                    Allowable (Stress)
                  </th>

                  {/* Other headers move down using rowSpan */}
                  <th
                    className="px-3 py-2 border border-gray-300 text-center leading-tight"
                    rowSpan={2}
                  >
                    <div className="font-semibold">Section Area</div>
                    <div className="text-[13px] pt-[4px] text-gray-500">
                      (cm<sup>2</sup>)
                    </div>
                  </th>

                  <th
                    className="px-3 py-2 border border-gray-300 text-center leading-tight"
                    rowSpan={2}
                  >
                    <div className="font-semibold">Section Modulus</div>
                    <div className="text-[13px] pt-[4px] text-gray-500">
                      (cm<sup>3</sup>)
                    </div>
                  </th>

                  <th
                    className="px-3 py-2 border border-gray-300 text-center leading-tight"
                    rowSpan={2}
                  >
                    <div className="font-semibold">Moment Inertia</div>
                    <div className="text-[13px] pt-[4px] text-gray-500">
                      (cm<sup>4</sup>)
                    </div>
                  </th>

                  <th
                    className="px-3 py-2 border border-gray-300 text-center leading-tight"
                    rowSpan={2}
                  >
                    <div className="font-semibold">Ip</div>
                    <div className="text-[13px] pt-[4px] text-gray-500">
                      (cm<sup>4</sup>)
                    </div>
                  </th>

                  <th
                    className="px-3 py-2 border border-gray-300 text-center leading-tight"
                    rowSpan={2}
                  >
                    <div className="font-semibold">Radius Gyration</div>
                    <div className="text-[13px] pt-[4px] text-gray-500">
                      (cm)
                    </div>
                  </th>

                  <th
                    className="px-3 py-2 border border-gray-300 text-center leading-tight"
                    rowSpan={2}
                  >
                    <div className="font-semibold">Taper Ratio</div>
                    <div className="text-[13px] pt-[4px] text-gray-500">
                      (mm)
                    </div>
                  </th>

                  <th
                    className="px-3 py-2 border border-gray-300 text-center font-semibold"
                    rowSpan={2}
                  >
                    Type of taper
                  </th>

                  <th
                    className="px-3 py-2 border border-gray-300 text-center leading-tight"
                    rowSpan={2}
                  >
                    <div className="font-semibold whitespace-nowrap">
                      HeightSection
                    </div>
                    <div className="text-[13px] pt-[4px] text-gray-500 whitespace-nowrap">
                      (mm)
                    </div>
                  </th>
                </tr>

                {/* ================== ROW 2 ================== */}
                <tr className="bg-blue-50 text-[#0d3b66] text-sm">
                  <th className="px-3 py-2 border border-gray-300 text-center font-semibold">
                    fb
                  </th>
                  <th className="px-3 py-2 border border-gray-300 text-center font-semibold">
                    stb
                  </th>
                  <th className="px-3 py-2 border border-gray-300 text-center font-semibold">
                    sts
                  </th>
                  <th className="px-3 py-2 border border-gray-300 text-center font-semibold">
                    stc
                  </th>
                </tr>
              </thead>

              <tbody>
                {results.map((r, i) => (
                  <tr
                    key={i}
                    className="hover:bg-[#3399cc]/10 transition-colors text-sm"
                  >
                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.fb}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.stb}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.sts}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.stc}
                    </td>

                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.sectionArea.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.sectionModulus.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.momentInertia.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.ip}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.radiusGyr.toFixed(2)}
                    </td>

                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.poleType === "Straight" ? "" : r.taperRatio}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center text-[12px]">
                      {r.poleType === "Straight" ? "" : r.typeofTaper}
                    </td>

                    <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center">
                      {r.heightSection}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== EMPTY STATE ===================== */}
      {results.length === 0 && (
        <div className="p-16 text-center">
          <FileSpreadsheet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">
            No calculation results yet. Please input pole data and click
            Calculate.
          </p>
        </div>
      )}
    </div>
  );
}

ResultsTable.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      pole: PropTypes.string,
      description: PropTypes.string,
      poleType: PropTypes.string,
      diaUpper: PropTypes.number,
      diaLower: PropTypes.number,
      thickUpper: PropTypes.number,
      thickLower: PropTypes.number,
      length: PropTypes.number,
      heightZ: PropTypes.number,
      centerPoint: PropTypes.number,
      fb: PropTypes.number,
      stb: PropTypes.number,
      sts: PropTypes.number,
      stc: PropTypes.number,
      sectionArea: PropTypes.number,
      sectionModulus: PropTypes.number,
      momentInertia: PropTypes.number,
      radiusGyr: PropTypes.number,
      taperRatio: PropTypes.number,
      material: PropTypes.string,
      ip: PropTypes.number,
      heightSection: PropTypes.number,
      typeofTaper: PropTypes.string,
    })
  ).isRequired,
};
