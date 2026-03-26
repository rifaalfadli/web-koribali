import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import axios from "axios";

export default function PoleMeasurementReport() {
  const reportRef = useRef();

  const [durations, setDurations] = useState({
    method1: null,
    method2: null,
    method3: null,
  });

  const isPrint =
    new URLSearchParams(window.location.search).get("print") === "true";

  // method 1, image to pdf
  const handleMethod1 = async () => {
    const start = performance.now();
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
      });

      const base64Image = canvas.toDataURL("image/png");

      const response = await axios.post(
        "http://localhost:5000/report/pdf",
        { image: base64Image },
        { responseType: "blob" },
      );

      downloadBlob(response.data, "report-method1.pdf");
      const end = performance.now();
      setDurations((prev) => ({
        ...prev,
        method1: (end - start).toFixed(0),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // method 2, template backend
  const handleMethod2 = async () => {
    const start = performance.now();
    const payload = {
      date: "2026-03-26",
      project_name: "Dummy Infrastructure Project",
      location: "West Java Area",
      inspector: "John Doe",
      notes: "All poles are in good condition.",
      measurements: [1, 2, 3, 4, 5].map((id) => ({
        id: `PL-${id.toString().padStart(3, "0")}`,
        height: (8 + id * 0.5).toFixed(1),
        diameter: (25 + id * 2).toFixed(1),
        condition: "Good",
      })),
    };

    const response = await axios.post(
      "http://localhost:5000/report/pdf-method2",
      payload,
      { responseType: "blob" },
    );

    downloadBlob(response.data, "report-method2.pdf");

    const end = performance.now();
    setDurations((prev) => ({
      ...prev,
      method2: (end - start).toFixed(0),
    }));
  };

  // headless browser
  const handleMethod3 = async () => {
    const start = performance.now();

    const response = await axios.post(
      "http://localhost:5000/report/pdf-method3",
      {
        url: "http://localhost:3000/report?print=true",
      },
      { responseType: "blob" },
    );

    downloadBlob(response.data, "report-method3.pdf");
    const end = performance.now();
    setDurations((prev) => ({
      ...prev,
      method3: (end - start).toFixed(0),
    }));
  };

  // helper download
  const downloadBlob = (data, filename) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };
  return (
    <div
      className={
        isPrint
          ? "bg-white"
          : "p-10 bg-gray-100 min-h-screen flex flex-col items-center gap-4"
      }
    >
      {!isPrint && (
        <div className="flex gap-3 flex-wrap justify-center">
          <div className="flex flex-col items-center">
            <button
              onClick={handleMethod1}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
            >
              Method 1 (Image to PDF)
            </button>
            {durations.method1 && (
              <span className="text-xs mt-1 text-gray-600">
                {durations.method1} ms
              </span>
            )}
          </div>
          <div className="flex flex-col items-center">
            <button
              onClick={handleMethod2}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600"
            >
              Method 2 (Template)
            </button>
            {durations.method2 && (
              <span className="text-xs mt-1 text-gray-600">
                {durations.method2} ms
              </span>
            )}
          </div>
          <div className="flex flex-col items-center">
            <button
              onClick={handleMethod3}
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
            >
              Method 3 (Headless Browser)
            </button>
            {durations.method3 && (
              <span className="text-xs mt-1 text-gray-600">
                {durations.method3} ms
              </span>
            )}
          </div>
        </div>
      )}

      <div
        ref={reportRef}
        className={`bg-white p-8 ${
          isPrint ? "w-full shadow-none" : "w-[800px] shadow-lg"
        }`}
        id="report"
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Pole Measurement Report</h1>
          <p className="text-sm text-gray-500">Generated Date: 2026-03-26</p>
        </div>

        {/* General Info */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">General Information</h2>
          <table className="w-full border border-gray-300 text-sm">
            <tbody>
              <tr>
                <td className="border p-2 font-medium">Project Name</td>
                <td className="border p-2">Dummy Infrastructure Project</td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">Location</td>
                <td className="border p-2">West Java Area</td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">Inspector</td>
                <td className="border p-2">John Doe</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Measurement Table */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Measurement Data</h2>
          <table className="w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Pole ID</th>
                <th className="border p-2">Height (m)</th>
                <th className="border p-2">Diameter (cm)</th>
                <th className="border p-2">Condition</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((id) => (
                <tr key={id}>
                  <td className="border p-2">
                    PL-{id.toString().padStart(3, "0")}
                  </td>
                  <td className="border p-2">{(8 + id * 0.5).toFixed(1)}</td>
                  <td className="border p-2">{(25 + id * 2).toFixed(1)}</td>
                  <td className="border p-2">Good</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Inspector Notes</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            The pole measurements were conducted under normal weather
            conditions. All poles inspected are in acceptable condition with no
            major structural damage observed. Minor surface wear is present but
            does not affect the integrity of the poles. Further monitoring is
            recommended within the next maintenance cycle.
          </p>
        </div>

        {/* Signature */}
        <div className="flex justify-between mt-10">
          <div>
            <p className="text-sm">Inspector Signature</p>
            <div className="mt-10 border-t w-48"></div>
          </div>
          <div>
            <p className="text-sm">Approved By</p>
            <div className="mt-10 border-t w-48"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
