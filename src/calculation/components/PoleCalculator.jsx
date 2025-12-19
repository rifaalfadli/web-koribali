import React, { useState, useEffect, useRef } from "react";
import { PoleInput } from "./PoleInput";
import { ResultsTable } from "./ResultsTable";
import { useNavigate, useLocation } from "react-router-dom";
import { CoverInput } from "./CoverInput";
import { ConditionInput } from "./ConditionInput";
import { calculatePoleResults } from "../utils/calculationResults";
import {
  goToNextSection,
  updateCover,
  isCoverComplete,
  updateCondition,
  isConditionComplete,
  addSection,
} from "../utils/poleCalculatorUtils";
import {
  Plus,
  Calculator,
  Layout,
  X,
  CheckCircle,
  Circle,
  RotateCcw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function PoleCalculator() {
  const navigate = useNavigate();
  const location = useLocation();

  // STATE: Cover information
  const [cover, setCover] = useState(() => {
    const saved = sessionStorage.getItem("cover");
    return saved
      ? JSON.parse(saved)
      : {
          managementMark: "",
          calculationNumber: "",
          projectName: "",
          contentr2: "",
          contentr3: "",
          date: "",
        };
  });

  // STATE: Condition for calculation (wind, standard)
  const [condition, setCondition] = useState(() => {
    const saved = sessionStorage.getItem("condition");
    return saved ? JSON.parse(saved) : { designStandard: "", windSpeed: "" };
  });

  // STATE: Sections input, each section represents one pole
  const [sections, setSections] = useState(() => {
    const saved = sessionStorage.getItem("sections");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1", // unique section ID
            name: "", // pole name or description
            material: "STK400", // default material
            poleType: "Straight", // Taper or Straight
            diameterLower: "", // lower diameter
            diameterUpper: "", // upper diameter (Taper only)
            thicknessLower: "", // lower thickness
            thicknessUpper: "", // upper thickness (Taper only)
            height: "", // pole height
            quantity: "1", // number of poles
          },
        ];
  });

  // STATE: Results all calculation
  const [results, setResults] = useState(() => {
    const saved = sessionStorage.getItem("results");
    return saved ? JSON.parse(saved) : [];
  });

  // STATE: Results table
  const [showResults, setShowResults] = useState(() => {
    const saved = sessionStorage.getItem("showResults");
    return saved ? JSON.parse(saved) : false;
  });

  // ================= SESSION STORAGE EFFECT =================
  useEffect(() => {
    sessionStorage.setItem("cover", JSON.stringify(cover));
  }, [cover]);

  useEffect(() => {
    sessionStorage.setItem("condition", JSON.stringify(condition));
  }, [condition]);

  useEffect(() => {
    sessionStorage.setItem("sections", JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    sessionStorage.setItem("results", JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    sessionStorage.setItem("showResults", JSON.stringify(showResults));
  }, [showResults]);

  // STATE: UI control
  const [activeTab, setActiveTab] = useState("1"); // currently active section
  // const [showReport, setShowReport] = useState(false); // toggle report page
  const [toast, setToast] = useState(null); // toast notifications { message, type }
  const [confirmDelete, setConfirmDelete] = useState(null); // section deletion confirmation

  // STATE: Cover popup
  const [showCoverPopup, setShowCoverPopup] = useState(false);

  const [isExpandedPole, setIsExpandedPole] = useState(true); // expand/collapse pole input
  const [isExpandedCondition, setIsExpandedCondition] = useState(true); // expand/collapse condition input
  const [confirmResetAll, setConfirmResetAll] = useState(false); // reset all confirmation

  // Generates unique section IDs and syncs with sessionStorage on mount
  const sectionIdRef = useRef(1);
  useEffect(() => {
    const saved = sessionStorage.getItem("sections");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        sectionIdRef.current = Math.max(...parsed.map((s) => Number(s.id)));
      }
    }
  }, []);
  useEffect(() => {
    if (sections.length === 0) return;
    const isActiveValid = sections.some((s) => s.id === activeTab);
    if (!isActiveValid) {
      setActiveTab(sections[0].id);
    }
  }, [sections, activeTab]);

  // ========================= Function for CoverInput =========================
  // FUNCTION: Update cover data
  const handleCoverUpdate = (updates) => {
    updateCover(cover, updates, setCover);
  };

  // FUNCTION: Check if cover information form is complete
  const handleIsCoverComplete = () => {
    return isCoverComplete(cover);
  };

  // FUNCTION: Open Cover Input from ResultsTable
  const handleOpenCoverPopup = () => {
    setShowCoverPopup(true);
  };

  const handleCloseCoverPopup = () => {
    setShowCoverPopup(false);
  };

  // ======================= Function for ConditionInput ========================
  // FUNCTION: Update condition data
  const handleConditionUpdate = (updates) => {
    updateCondition(condition, updates, setCondition);
  };

  // FUNCTION: Check if condition information form is complete
  const handleIsConditionComplete = () => {
    return isConditionComplete(condition);
  };

  // FUNCTION: Go to Pole Input after Condition
  const handleConditionNext = () => {
    // Tutup section condition
    setIsExpandedCondition(false);

    // Buka section pole
    setIsExpandedPole(true);

    // Optional: scroll ke pole section
    setTimeout(() => {
      document
        .getElementById("pole-section-title")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  // ========================== Function for PoleInput ==========================
  // FUNCTION: Add a new section (max 4 section)
  const handleAddSection = () => {
    addSection(sections, setSections, setActiveTab, sectionIdRef);
  };

  // FUNCTION: Remove a section by ID
  const removeSection = (id) => {
    if (sections.length <= 1) return;

    const index = sections.findIndex((s) => s.id === id);
    const newSections = sections.filter((s) => s.id !== id);

    setSections(newSections);

    if (activeTab === id) {
      let newIndex;

      if (index > 0) {
        // ambil section sebelumnya
        newIndex = index - 1;
      } else {
        // kalau hapus index 0 → ambil yang sekarang di 0
        newIndex = 0;
      }

      setActiveTab(newSections[newIndex].id);
    }
  };

  // FUNCTION: Update a specific section's data
  const updateSection = (id, updates) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  // FUNCTION: Reset the active section to default values
  const resetCurrentSection = () => {
    setSections(
      sections.map((s) =>
        s.id === activeTab
          ? {
              ...s,
              name: "",
              diameterLower: "",
              diameterUpper: "",
              thicknessLower: "",
              thicknessUpper: "",
              height: "",
              quantity: "1",
            }
          : s
      )
    );
  };

  // FUNCTION: Go to the next section tab
  const handleNextSection = () => {
    goToNextSection(sections, activeTab, setActiveTab);
  };

  // FUNCTION: Check if a section pole is complete
  const isSectionComplete = (section) => {
    if (
      section.name.trim() === "" ||
      section.height.trim() === "" ||
      section.quantity.trim() === ""
    ) {
      return false; // fallback
    }
    if (section.poleType === "Taper") {
      // Taper: all lower + upper fields required
      return (
        section.diameterLower.trim() !== "" &&
        section.diameterUpper.trim() !== "" &&
        section.thicknessLower.trim() !== "" &&
        section.thicknessUpper.trim() !== ""
      );
    } else if (section.poleType === "Straight") {
      // Straight: only lower required
      return (
        section.diameterLower.trim() !== "" &&
        section.thicknessLower.trim() !== ""
      );
    }
    return false; // fallback
  };

  // ========================== Function for All Form ==========================
  // FUNCTION: Perform calculation for all form
  const calculateResults = () => {
    // VALIDATION: condition information
    if (!handleIsConditionComplete()) {
      showToast("Please complete all Condition Information fields!");
      return;
    }

    // VALIDATION: each section pole
    for (let section of sections) {
      if (!isSectionComplete(section)) {
        showToast("Please complete all Section Pole fields!");
        return;
      }
    }

    // FUNCTION: Calculate results for all pole sections
    const calculatedResults = calculatePoleResults(sections);

    setResults(calculatedResults);
    setShowResults(true);
    const target = document.getElementById("results-section");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // FUNCTION: Full validation before navigating to the report page.
  const handleMakeReport = () => {
    // CHECK 1: If there are no calculation results yet
    if (results.length === 0) {
      showToast("No calculation results to generate report!");
      return;
    }
    // CHECK 2: CoverInput is still incomplete
    if (!handleIsCoverComplete()) {
      showToast("Please complete all Cover Information before making report!");
      return;
    }
    // CHECK 3: ConditionInput is still incomplete
    if (!handleIsConditionComplete()) {
      showToast(
        "Please complete all Condition Information before making report!"
      );
      return;
    }
    // CHECK 4: Section (PoleInput) is still empty
    for (let section of sections) {
      if (!isSectionComplete(section)) {
        showToast(
          "Please complete all Section Pole fields before making report!"
        );
        return;
      }
    }

    sessionStorage.setItem("hasReport", "true");
    // If all OK => navigate to report
    navigate("/report", { state: { results, sections, cover, condition } });
  };

  // FUNCTION: Removes all calculation results and hides the results table.
  const handleDeleteReport = () => {
    // Hapus hasil kalkulasi
    setResults([]);
    setShowResults(false);

    // Reset Cover
    setCover({
      managementMark: "",
      calculationNumber: "",
      projectName: "",
      contentr2: "",
      contentr3: "",
      date: "",
    });

    // Reset Condition
    setCondition({
      designStandard: "",
      windSpeed: "",
    });

    // Reset Sections (1 section default)
    setSections([
      {
        id: "1",
        name: "",
        material: "STK400",
        poleType: "Straight",
        diameterLower: "",
        diameterUpper: "",
        thicknessLower: "",
        thicknessUpper: "",
        height: "",
        quantity: "1",
      },
    ]);

    // Reset active tab ke section 1
    setActiveTab("1");
    sectionIdRef.current = 1;

    // Reset UI control
    setIsExpandedCondition(true);
    setIsExpandedPole(true);

    // Hapus semua sessionStorage
    // sessionStorage.clear();
    sessionStorage.removeItem("cover");
    sessionStorage.removeItem("condition");
    sessionStorage.removeItem("sections");
    sessionStorage.removeItem("results");
  };

  // Render the Report Page component, and pass a prop named onDelete Report to that component.
  useEffect(() => {
    if (location.state?.deleteReport) {
      handleDeleteReport();

      // Hapus state navigate supaya tidak jalan dua kali
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, navigate, location.state?.deleteReport]);

  // FUNCTION: Show toast error.
  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  // Active section variable, check whether it is the last or the only one.
  const activeSection = sections.find((s) => s.id === activeTab);
  const isLastSection = sections[sections.length - 1]?.id === activeTab;
  const isOnlySection = sections.length === 1;

  return (
    <div className="min-h-screen">
      {/* ============================================================
        HEADER UTAMA CALCULATION PAGE (Judul + Subjudul + Icon)
      ============================================================ */}
      <div className="bg-[#0d3b66] py-[25px] px-[40px] shadow-lg sticky top-[70px]  z-40  flex justify-between">
        <div className="max-w-7xl">
          <div className="flex items-center gap-4">
            {/* ICON KIRI */}
            <div className="bg-[#3399cc] p-[8px] rounded-lg">
              <Layout className="w-[32px] h-[32px]  text-white" />
            </div>
            {/* TEKS HEADER */}
            <div>
              <h1 className="text-white mb-0.5 text-l font-semibold">
                Calculation System
              </h1>
              <p className="text-[#3399cc] text-sm">
                Professional structural analysis tool
              </p>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-4">
          {/* Reset All */}
          <button
            onClick={() => setConfirmResetAll(true)}
            className="flex items-center gap-2 bg-gray-200 text-[#0d3b66] px-7 py-2 rounded-lg font-medium shadow-sm
            hover:bg-gray-300 hover:shadow-md
            active:scale-95
            transition-all duration-200 ease-out"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* Reset All Confirmation Modal */}
      {confirmResetAll && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8">
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>

            {/* Title */}
            <h2 className="text-gray-900 text-center mb-2">Reset All Data?</h2>

            {/* Description */}
            <p className="text-gray-600 text-center mb-6">
              This will remove all form inputs and all calculation results. This
              action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmResetAll(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleDeleteReport();
                  setConfirmResetAll(false);
                }}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
        MAIN CONTENT AREA
      ============================================================ */}
      <div className="max-w-[84rem] mx-auto pt-1 pb-8">
        {/* ============================================================
          FORM CONDITION (Bagian kondisi perhitungan)
        ============================================================ */}
        <div
          className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-5 flex items-center justify-between cursor-pointer mt-8 transition-all duration-500 ease-in-out ${
            isExpandedCondition ? "rounded-t-2xl" : "rounded-2xl"
          }`}
          onClick={() => setIsExpandedCondition(!isExpandedCondition)}
        >
          {/* Judul cover */}
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
            <h2 className="text-white font-bold">
              Input Standard and Condition
            </h2>
          </div>

          {/* Icon toggle (up/down) */}
          <div className="p-2">
            {isExpandedCondition ? (
              <ChevronUp className="w-5 h-5 text-white" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white" />
            )}
          </div>
        </div>

        {/* Body form (collapsible) */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isExpandedCondition
              ? "max-h-[500px] rounded-b-2xl"
              : "max-h-0 rounded-b-2xl"
          }`}
        >
          <ConditionInput
            condition={condition}
            onUpdate={handleConditionUpdate}
            onNext={handleConditionNext}
          />
        </div>

        {/* ============================================================
          FORM POLE (Bagian input section tiang)
        ============================================================ */}
        <div
          className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-5 flex items-center justify-between cursor-pointer mt-8 transition-all duration-500 ease-in-out ${
            isExpandedPole ? "rounded-t-2xl" : "rounded-2xl"
          }`}
          onClick={() => setIsExpandedPole(!isExpandedPole)}
        >
          {/* Judul cover */}
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
            <h2 id="pole-section-title" className="text-white font-bold">
              Input Step Pole
            </h2>
          </div>

          {/* Icon toggle (up/down) */}
          <div className="p-2">
            {isExpandedPole ? (
              <ChevronUp className="w-5 h-5 text-white" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white" />
            )}
          </div>
        </div>

        {/* Body form (collapsible) */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isExpandedPole
              ? "max-h-[900px] rounded-b-2xl"
              : "max-h-0 rounded-b-2xl"
          }`}
        >
          <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-5">
              {/* HEADER ADD SECTION */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-[#0d3b66] font-medium">
                    Configure up to 4 pole step with detailed specifications
                  </h2>
                </div>
                {/* BUTTON ADD SECTION */}
                <button
                  onClick={handleAddSection}
                  disabled={sections.length >= 4}
                  className={`flex items-center gap-3 px-7 py-3 text-base rounded-xl transition-all shadow-md 
                  ${
                    sections.length >= 4
                      ? "bg-gray-300 text-black opacity-40 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105"
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  Add Step
                </button>
              </div>

              {/* TABS SECTION */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {sections.map((section, index) => {
                  const isComplete = isSectionComplete(section);
                  const isActive = activeTab === section.id;

                  return (
                    <div key={section.id} className="relative flex-shrink-0">
                      <button
                        onClick={() => setActiveTab(section.id)}
                        className={`flex items-center justify-between gap-3 px-5 py-3 rounded-xl border-2 transition-all w-[220px]
                      ${
                        isActive
                          ? "bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-100 shadow-md"
                          : isComplete
                          ? "bg-green-50 border-green-500 text-green-700 hover:bg-green-100"
                          : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                      >
                        <div className="flex items-center gap-3">
                          {isComplete ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                          <div className="text-left">
                            <div>Step {index + 1}</div>
                          </div>
                        </div>

                        {/* BUTTON X HAPUS SECTION */}
                        {sections.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDelete(section.id);
                            }}
                            className={`p-1 rounded-md transition ${
                              isActive
                                ? "bg-blue-100 hover:bg-blue-200 text-blue-700"
                                : isComplete
                                ? "bg-green-100 hover:bg-green-200 text-green-700"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                            }`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>

                  {/* Title */}
                  <h2 className="text-gray-900 text-center mb-2">
                    Delete Step?
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 text-center mb-6">
                    Are you sure you want to delete this step? This action
                    cannot be undone.
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        removeSection(confirmDelete);
                        setConfirmDelete(null);
                      }}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE SECTION INPUT */}
            {activeSection && (
              <div className="p-6">
                <PoleInput
                  section={activeSection}
                  sectionNumber={
                    sections.findIndex((s) => s.id === activeTab) + 1
                  }
                  onUpdate={(updates) => updateSection(activeTab, updates)}
                  hideHeader={true}
                />

                {/* FOOTER: RESET + CALCULATE / NEXT */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  {/* LEFT: RESET */}
                  <button
                    onClick={resetCurrentSection}
                    className="flex items-center gap-2 px-8 py-3 h-[48px] bg-[#eef2f6] text-[#0d3b66]
                    border-2 border-[#d0d7e2] rounded-xl hover:bg-[#e2e8f0] transition-colors font-medium"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset
                  </button>

                  {/* RIGHT: CALCULATE / NEXT SECTION */}
                  <div className="flex items-center gap-3">
                    {/* BACK BUTTON */}
                    {sections.findIndex((s) => s.id === activeTab) > 0 && (
                      <button
                        onClick={() => {
                          const currentIndex = sections.findIndex(
                            (s) => s.id === activeTab
                          );
                          setActiveTab(sections[currentIndex - 1].id);
                        }}
                        className="flex items-center gap-2 px-8 py-3 h-[48px] bg-[#eef2f6] text-[#0d3b66]
                        border-2 border-[#d0d7e2] rounded-xl hover:bg-[#e2e8f0] transition-colors font-medium"
                      >
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
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Back
                      </button>
                    )}

                    {/* CALCULATE / NEXT BUTTON */}
                    <div className="relative">
                      {/* CONDITIONAL BUTTON */}
                      {isOnlySection || isLastSection ? (
                        <button
                          onClick={calculateResults}
                          className="flex items-center gap-3 px-8 py-3 h-[48px] bg-gradient-to-r
                        from-[#0d3b66] to-[#3399cc] text-white rounded-xl hover:shadow-xl transition-transform duration-300 hover:scale-105
                        transition-all font-semibold shadow-md"
                        >
                          <Calculator className="w-5 h-5" />
                          Calculate Results
                        </button>
                      ) : (
                        <button
                          onClick={handleNextSection}
                          className="flex items-center gap-2 px-8 py-3 h-[48px] 
                        bg-gradient-to-r from-[#0d3b66] to-[#3399cc]
                        text-white rounded-xl 
                        hover:brightness-110 transition-all shadow-sm font-medium"
                        >
                          Next Section
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
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* TABEL HASIL KALKULASI */}
        <div id="results-section">
          {showResults && (
            <ResultsTable
              results={results}
              onCoverInput={handleOpenCoverPopup}
            />
          )}
        </div>
      </div>
      {showCoverPopup && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden animate-fadeIn">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-5 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">
                Input Cover Information
              </h2>

              <button
                onClick={handleCloseCoverPopup}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <CoverInput
                cover={cover}
                onUpdate={handleCoverUpdate}
                onMake={handleMakeReport}
              />
            </div>
          </div>
        </div>
      )}

      {/* TOAST MODAL */}
      {toast && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] max-w-fit mx-4 p-7 transform transition-all duration-300 ease-in-out scale-95 animate-fadeIn">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 text-red-500 border border-red-100 flex-shrink-0">
                <AlertCircle className="w-7 h-7" />
              </div>
              <p className="text-gray-700 text-[16px] font-medium whitespace-nowrap">
                {toast.message}
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setToast(null)}
                className="px-6 py-3 rounded-xl bg-blue-50 border border-blue-500 text-blue-700 
                hover:bg-blue-100 font-semibold text-sm transition-all shadow-sm active:scale-95"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
