import { calculatePoleResults } from "./calculationResults";

// ========================= Global Helpers =========================
// FUNCTION: check if a value is empty
export const isEmpty = (value) => {
  return !value || value.trim() === "";
};

// FUNCTION: helper to clear errors per field
export const clearError = (updates, setErrors) => {
  setErrors((prev) => {
    const next = { ...prev };

    Object.entries(updates).forEach(([key, value]) => {
      // kalau sudah ada isi → error = false
      if (value && value.toString().trim() !== "") {
        next[key] = false;
      }
    });

    return next;
  });
};

// ========================= Function for CoverInput =========================
// FUNCTION: Update cover data
export const updateCover = (cover, updates, setCover) => {
  setCover({ ...cover, ...updates });
};

// FUNCTION: Check if cover information from is complete
export const isCoverComplete = (cover) => {
  return [
    cover.managementMark,
    cover.calculationNumber,
    cover.projectName,
    cover.date,
  ].every((v) => v && v.trim() !== "");
};

// FUNCTION: Create an error checker helper for the cover
export const getCoverErrors = (cover) => ({
  managementMark: isEmpty(cover.managementMark),
  calculationNumber: isEmpty(cover.calculationNumber),
  projectName: isEmpty(cover.projectName),
  date: isEmpty(cover.date),
});

// ======================= Function for ConditionInput ========================
// FUNCTION: Update condition data
export const updateCondition = (condition, updates, setCondition) => {
  setCondition({ ...condition, ...updates });
};

// FUNCTION: Check if condition information form is complete
export const isConditionComplete = (condition) => {
  return [condition.designStandard, condition.windSpeed].every(
    (v) => v && v.trim() !== ""
  );
};

// FUNCTIONS: Go to Pole Input after Condition
export const conditionNext = (setIsExpandedCondition, setIsExpandedPole) => {
  // Close section condition
  setIsExpandedCondition(false);

  // Open section pole
  setIsExpandedPole(true);
};

// FUNCTION: Create an error checker helper for the condition
export const getConditionErrors = (condition) => ({
  designStandard: isEmpty(condition.designStandard),
  windSpeed: isEmpty(condition.windSpeed),
});

// ========================== Function for PoleInput ==========================
// FUNCTION: Add a new section (max 4 section)
export const addSection = (
  sections,
  setSections,
  setActiveTab,
  sectionIdRef
) => {
  if (sections.length >= 4) return;

  sectionIdRef.current += 1;
  const newId = sectionIdRef.current.toString();

  setSections([
    ...sections,
    {
      id: newId,
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

  setActiveTab(newId); // set newly added section as active
};

// FUNCTION: Remove a section by ID
export const removeSection = (
  id,
  sections,
  setSections,
  activeTab,
  setActiveTab
) => {
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
export const updateSection = (id, updates, setSections, sections) => {
  setSections(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
};

// FUNCTION: Reset the active section to default values
export const resetCurrent = (setSections, sections, activeTab) => {
  setSections(
    sections.map((s) =>
      s.id === activeTab
        ? {
            ...s,
            name: "",
            diameterLower: "",
            diameterUpper: "",
            thicknessUpper: "",
            thicknessLower: "",
            height: "",
            quantity: "1",
          }
        : s
    )
  );
};

// FUNCTION: Go to the next section tab
export const goToNextSection = (sections, activeTab, setActiveTab) => {
  const currentIndex = sections.findIndex((s) => s.id === activeTab);
  if (currentIndex < sections.length - 1) {
    setActiveTab(sections[currentIndex + 1].id);
  }
};

// FUNCTION: Check if a section pole is complete
export const isSectionComplete = (section) => {
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

// FUNCTION: Create an error checker helper for the section
export const getSectionsErrors = (sections) => {
  const allErrors = {};

  sections.forEach((section) => {
    const e = {
      name: isEmpty(section.name),
      height: isEmpty(section.height),
      quantity: isEmpty(section.quantity),
      diameterLower: false,
      diameterUpper: false,
      thicknessLower: false,
      thicknessUpper: false,
    };

    if (section.poleType === "Taper") {
      e.diameterLower = isEmpty(section.diameterLower);
      e.diameterUpper = isEmpty(section.diameterUpper);
      e.thicknessLower = isEmpty(section.thicknessLower);
      e.thicknessUpper = isEmpty(section.thicknessUpper);
    } else {
      e.diameterLower = isEmpty(section.diameterLower);
      e.thicknessLower = isEmpty(section.thicknessLower);
    }

    if (Object.values(e).some(Boolean)) {
      allErrors[section.id] = e;
    }
  });

  return allErrors;
};

// FUNCTION: clear error for a specific section
export const clearSectionError = (sectionId, updates, setSectionsErrors) => {
  setSectionsErrors((prev) => {
    const next = { ...prev };
    const sectionError = { ...(next[sectionId] || {}) };

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.toString().trim() !== "") {
        sectionError[key] = false;
      }
    });

    // kalau semua error false → hapus object error section
    const hasError = Object.values(sectionError).some(Boolean);
    if (hasError) {
      next[sectionId] = sectionError;
    } else {
      delete next[sectionId];
    }

    return next;
  });
};

// ========================== Function for All Form ==========================
// FUNCTION: Perform calculation for all form
export const handleCalculateResults = (
  handleIsConditionComplete,
  showToast,
  sections,
  handleIsSectionComplete,
  setResults,
  setShowResults
) => {
  const errors = {
    condition: false,
    section: false,
  };

  // VALIDATION: condition information
  if (!handleIsConditionComplete()) {
    showToast("Please complete all Condition Information fields!");
    errors.condition = true;
  }

  // VALIDATION: each section pole
  for (let section of sections) {
    if (!handleIsSectionComplete(section)) {
      showToast("Please complete all Section Pole fields!");
      errors.section = true;
      break;
    }
  }

  const isValid = Object.values(errors).every((v) => v === false);

  // STOP kalau tidak valid
  if (!isValid) {
    return { isValid, errors };
  }

  // FUNCTION: Calculate results for all pole sections
  const calculatedResults = calculatePoleResults(sections);

  setResults(calculatedResults);
  setShowResults(true);

  // ALL CHECK PASSED
  return { isValid, errors };
};

// FUNCTION: Full validation before navigating to the report page
export const makeReport = (
  results,
  showToast,
  handleIsCoverComplete,
  handleIsConditionComplete,
  sections,
  handleIsSectionComplete
) => {
  const errors = {
    results: false,
    cover: false,
    condition: false,
    section: false,
  };

  // CHECK 1: Results
  if (results.length === 0) {
    showToast("No calculation results to generate report!");
    errors.results = true;
  }

  // CHECK 2: Cover
  if (!handleIsCoverComplete()) {
    showToast("Please complete all Cover Information before making report!");
    errors.cover = true;
  }

  // CHECK 3: Condition
  if (!handleIsConditionComplete()) {
    showToast(
      "Please complete all Condition Information before making report!"
    );
    errors.condition = true;
  }

  // CHECK 4: Sections
  for (let section of sections) {
    if (!handleIsSectionComplete(section)) {
      showToast(
        "Please complete all Section Pole fields before making report!"
      );
      errors.section = true;
      break;
    }
  }

  const isValid = Object.values(errors).every((v) => v === false);

  return { isValid, errors };
};

// FUNCTION: Full validation before navigating to the report page
export const deleteReport = (
  setResults,
  setShowResults,
  setCover,
  setCondition,
  setSections,
  setActiveTab,
  setIsExpandedCondition,
  setIsExpandedPole,
  sectionIdRef
) => {
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
