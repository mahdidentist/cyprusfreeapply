import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useTranslation } from "react-i18next";

export default function ProgramListWithDetails({ programsData, isAdmin, onApply }) {
  const { t } = useTranslation();
  const [editableData, setEditableData] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  useEffect(() => {
    if (programsData) {
      setEditableData(programsData);
    }
  }, [programsData]);

  const handleChange = (e, program, index) => {
    const newValue = e.target.value;
    const updated = { ...editableData };
    updated[program][index].price = newValue;
    setEditableData(updated);
  };

  if (!editableData) return <p className="text-center text-gray-500">{t("loadingPrograms")}</p>;

  return (
    <div className="relative">
      {/* ویدیو پریویو */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl w-full relative">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-xl font-bold"
            >
              ✕
            </button>
            <video src={selectedVideo} controls className="w-full rounded-lg" />
          </div>
        </div>
      )}

      {/* اطلاعات دانشگاه */}
      {selectedUniversity && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full relative text-left">
            <button
              onClick={() => setSelectedUniversity(null)}
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-xl font-bold"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-2">{selectedUniversity.name}</h3>
            <p className="text-gray-600 mb-2">{t("ranking")}: {selectedUniversity.ranking}</p>
            <p className="text-gray-600 mb-2">{t("price")}: ${selectedUniversity.price}</p>
            <p className="text-gray-700">{selectedUniversity.description || t("noUniversityDescription")}</p>
          </div>
        </div>
      )}

      {/* لیست برنامه‌ها */}
      <div className="flex justify-center">
        <div className="w-full max-w-xl grid gap-6">
          {Object.entries(editableData).map(([program, universities]) => (
            <div
              key={program}
              className="relative group border p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h4 className="text-2xl font-semibold mb-2">{program}</h4>
              <div className="space-y-3">
                {universities.map((uni, index) => (
                  <div key={uni.name} className="border-b pb-2">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setSelectedUniversity(uni)}
                        className="text-blue-600 hover:underline text-left font-medium"
                      >
                        {uni.name}
                      </button>
                      {isAdmin ? (
                        <input
                          type="number"
                          value={uni.price}
                          onChange={(e) => handleChange(e, program, index)}
                          className="w-24 p-1 border rounded text-sm"
                        />
                      ) : (
                        <span className="text-sm text-gray-500">${uni.price}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{t("ranking")}: {uni.ranking}</div>
                    <button
                      onClick={() => setSelectedVideo(uni.videoUrl)}
                      className="mt-1 text-blue-600 hover:underline text-sm"
                    >
                      🎬 {t("previewVideo")}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* دکمه اپلای برای ادمین */}
      {isAdmin && (
        <div className="mt-6 text-center">
          <button
            onClick={async () => {
              try {
                for (const [program, universities] of Object.entries(editableData)) {
                  for (const uni of universities) {
                    const docRef = doc(db, "prices", uni.id);
                    await updateDoc(docRef, { price: Number(uni.price) });
                  }
                }
                onApply(editableData);
                toast.success(t("saveSuccess"));
              } catch (error) {
                console.error(t("saveErrorLog"), error);
                toast.error(t("saveError"));
              }
            }}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {t("applyChanges")}
          </button>
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}