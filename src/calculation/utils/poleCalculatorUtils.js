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
    cover.contentr2,
    cover.date,
  ].every((v) => v && v.trim() !== "");
};

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
      poleType: "Taper",
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
  if (sections.length > 1) {
    const newSections = sections.filter((s) => s.id !== id);
    setSections(newSections);

    // if deleted section was active, set first section active
    if (activeTab === id) {
      setActiveTab(newSections[0].id);
    }
  }
};

export const goToNextSection = (sections, activeTab, setActiveTab) => {
  const currentIndex = sections.findIndex((s) => s.id === activeTab);
  if (currentIndex < sections.length - 1) {
    setActiveTab(sections[currentIndex + 1].id);
  }
};
