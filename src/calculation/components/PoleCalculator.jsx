import React, { useState, useEffect, useRef } from "react";
import { PoleInput } from "./PoleInput";
import { ResultsTable } from "./ResultsTable";
import { useNavigate, useLocation } from "react-router-dom";
import { ConditionInput } from "./ConditionInput";
import { HeaderCalculationPage } from "./PoleCalculatorHeader";
import {
  CoverInputModal,
  ToastModal,
  ConfirmResetAllModal,
  DeleteConfirmationModal,
} from "./PoleCalculatorModal";
import {
  goToNextSection,
  updateCover,
  isCoverComplete,
  updateCondition,
  isConditionComplete,
  addSection,
  removeSection,
  updateSection,
  conditionNext,
  resetCurrent,
  isSectionComplete,
  handleCalculateResults,
  makeReport,
  deleteReport,
  clearError,
  clearSectionError,
  getCoverErrors,
  getConditionErrors,
  getSectionsErrors,
} from "../utils/poleCalculatorUtils";
import {
  Plus,
  Calculator,
  X,
  CheckCircle,
  Circle,
  RotateCcw,
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
  const [coverErrors, setCoverErrors] = useState({});

  // STATE: Condition for calculation (wind, standard)
  const [condition, setCondition] = useState(() => {
    const saved = sessionStorage.getItem("condition");
    return saved ? JSON.parse(saved) : { designStandard: "", windSpeed: "" };
  });
  const [conditionErrors, setConditionErrors] = useState({});

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
  const [sectionsErrors, setSectionsErrors] = useState({});

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
  const [toast, setToast] = useState(null); // toast notifications { message, type }
  const [confirmDelete, setConfirmDelete] = useState(null); // section deletion confirmation
  const [showCoverPopup, setShowCoverPopup] = useState(false); // show cover popup
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

  // Ensure activeTab always points to an existing section
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
    clearError(updates, setCoverErrors);
  };

  // FUNCTION: Check if cover information form is complete
  const handleIsCoverComplete = () => {
    return isCoverComplete(cover);
  };

  // FUNCTION: Open Cover Input
  const handleOpenCoverPopup = () => {
    setShowCoverPopup(true);
  };

  // FUNCTION: Close Cover Input
  const handleCloseCoverPopup = () => {
    setShowCoverPopup(false);
  };

  // ======================= Function for ConditionInput ========================
  // FUNCTION: Update condition data
  const handleConditionUpdate = (updates) => {
    updateCondition(condition, updates, setCondition);
    clearError(updates, setConditionErrors);
  };

  // FUNCTION: Check if condition information form is complete
  const handleIsConditionComplete = () => {
    return isConditionComplete(condition);
  };

  // FUNCTION: Go to Pole Input after Condition
  const handleConditionNext = () => {
    conditionNext(setIsExpandedCondition, setIsExpandedPole);
  };

  // ========================== Function for PoleInput ==========================
  // FUNCTION: Add a new section (max 4 section)
  const handleAddSection = () => {
    addSection(sections, setSections, setActiveTab, sectionIdRef);
  };

  // FUNCTION: Remove a section by ID
  const handleRemoveSection = (id) => {
    removeSection(id, sections, setSections, activeTab, setActiveTab);
  };

  // FUNCTION: Update a specific section's data
  const handleUpdateSection = (id, updates) => {
    updateSection(id, updates, setSections, sections);
    clearSectionError(id, updates, setSectionsErrors);
  };

  // FUNCTION: Reset the active section to default values
  const resetCurrentSection = () => {
    resetCurrent(setSections, sections, activeTab);
  };

  // FUNCTION: Go to the next section tab
  const handleNextSection = () => {
    goToNextSection(sections, activeTab, setActiveTab);
  };

  // FUNCTION: Check if a section pole is complete
  const handleIsSectionComplete = (section) => {
    return isSectionComplete(section);
  };

  // ========================== Function for All Form ==========================
  // FUNCTION: Perform calculation for all form
  const calculateResults = () => {
    const { isValid, errors } = handleCalculateResults(
      handleIsConditionComplete,
      showToast,
      sections,
      handleIsSectionComplete,
      setResults,
      setShowResults
    );

    if (errors.condition) {
      setConditionErrors(getConditionErrors(condition));
    }

    if (errors.section) {
      setSectionsErrors(getSectionsErrors(sections));
    }

    if (!isValid) return;

    // go to results table
    const target = document.getElementById("results-section");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // FUNCTION: Full validation before navigating to the report page
  const handleMakeReport = () => {
    const { isValid, errors } = makeReport(
      results,
      showToast,
      handleIsCoverComplete,
      handleIsConditionComplete,
      sections,
      handleIsSectionComplete
    );

    if (errors.cover) setCoverErrors(getCoverErrors(cover));
    else setCoverErrors({});

    if (errors.condition) setConditionErrors(getConditionErrors(condition));
    else setConditionErrors({});

    if (errors.section) setSectionsErrors(getSectionsErrors(sections));
    else setSectionsErrors({});

    if (!isValid) return;

    sessionStorage.setItem("hasReport", "true");

    navigate("/report", {
      state: { results, sections, cover, condition },
    });
  };

  // FUNCTION: Removes all calculation results and hides the results table.
  const handleDeleteReport = () => {
    deleteReport(
      setResults,
      setShowResults,
      setCover,
      setCondition,
      setSections,
      setActiveTab,
      setIsExpandedCondition,
      setIsExpandedPole,
      sectionIdRef
    );
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
      <HeaderCalculationPage onResetAll={() => setConfirmResetAll(true)} />

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
            errors={conditionErrors}
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
                  const isComplete = handleIsSectionComplete(section);
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

            {/* ACTIVE SECTION INPUT */}
            {activeSection && (
              <div className="p-6">
                <PoleInput
                  section={activeSection}
                  sectionNumber={
                    sections.findIndex((s) => s.id === activeTab) + 1
                  }
                  onUpdate={(updates) =>
                    handleUpdateSection(activeTab, updates)
                  }
                  hideHeader={true}
                  errors={sectionsErrors[activeTab] || {}}
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

      {/* Cover Input Modal */}
      <CoverInputModal
        open={showCoverPopup}
        onClose={handleCloseCoverPopup}
        cover={cover}
        onUpdateCover={handleCoverUpdate}
        onMakeReport={handleMakeReport}
        coverErrors={coverErrors}
      />

      {/* Toast Modal */}
      <ToastModal toast={toast} onClose={() => setToast(null)} />

      {/* Reset Confirmation Modal */}
      <ConfirmResetAllModal
        confirmResetAll={confirmResetAll}
        onClose={() => setConfirmResetAll(false)}
        handleDeleteReport={handleDeleteReport}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        confirmDelete={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        handleRemoveSection={() => handleRemoveSection(confirmDelete)}
      />
    </div>
  );
}
