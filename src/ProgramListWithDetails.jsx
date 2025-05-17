import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { motion, AnimatePresence } from "framer-motion";

export default function ProgramListWithDetails({ programsData, isAdmin, onApply }) {
  const { t } = useTranslation();
  const [editableData, setEditableData] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [openProgram, setOpenProgram] = useState(null);
  const [compareList, setCompareList] = useState([]);

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

      {/* Modal جزئیات دانشگاه */}
      {selectedUniversity && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-xl w-full relative">
            <button
              onClick={() => setSelectedUniversity(null)}
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-3">{selectedUniversity.name}</h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">🎓 {t("universityPrograms")}</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {Object.entries(programsData)
                  .filter(([_, universities]) =>
                    universities.some((u) => u.name === selectedUniversity.name)
                  )
                  .map(([program, universities]) => {
                    const uni = universities.find((u) => u.name === selectedUniversity.name);
                    return (
                      <li key={program}>
                        <strong>{program}</strong>: ${uni.price}
                      </li>
                    );
                  })}
              </ul>
            </div>
            <p className="text-gray-600 text-sm mb-2">🏅 {t("ranking")}: {selectedUniversity.ranking}</p>
            <p className="text-gray-700 text-sm mb-4">
              {selectedUniversity.description || "No information available for this university."}
            </p>
            {selectedUniversity.website && (
              <a
                href={selectedUniversity.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                🔗 {t("visitUniversityWebsite")}
              </a>
            )}
          </div>
        </div>
      )}

      {/* لیست برنامه‌ها */}
      <div className="flex justify-center">
        <div className="w-full max-w-xl grid gap-6">
          {Object.entries(editableData).map(([program, universities]) => (
            <div
              key={program}
              className="border rounded-lg shadow"
            >
              <button
                onClick={() =>
                  setOpenProgram(openProgram === program ? null : program)
                }
                className="w-full text-left px-6 py-4 font-bold text-xl bg-gray-100 hover:bg-gray-200 transition"
              >
                {program}
              </button>

              <AnimatePresence initial={false}>
                {openProgram === program && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="overflow-hidden space-y-3 px-6 pb-4"
                  >
                    {universities.map((uni, index) => (
                      <div
                        key={uni.name}
                        className="border-b pb-2 px-2 transition-shadow hover:shadow-md rounded"
                      >
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => setSelectedUniversity(uni)}
                            className="font-medium text-blue-600 hover:underline"
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
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-sm text-gray-500">
                            Rank:{" "}
                            {isAdmin ? (
                              <input
                                type="number"
                                value={uni.ranking}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  const updated = { ...editableData };
                                  updated[program][index].ranking = newValue;
                                  setEditableData(updated);
                                }}
                                className="w-20 p-1 border rounded text-sm"
                              />
                            ) : (
                              uni.ranking
                            )}
                          </div>
                          <button
                            onClick={() => setSelectedVideo(uni.videoUrl)}
                            className="ml-2 px-3 py-0.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full flex items-center gap-2 hover:bg-blue-200 transition"
                          >
                            <span>🎬</span> Preview Video
                          </button>
                        </div>
                        <div className="flex justify-end mt-1">
                          <button
                            onClick={() => {
                              if (compareList.some(u => u.name === uni.name)) {
                                setCompareList(compareList.filter(u => u.name !== uni.name));
                              } else {
                                setCompareList([...compareList, uni]);
                              }
                            }}
                            className={`px-3 py-0.5 rounded-full text-xs font-medium transition ${
                              compareList.some(u => u.name === uni.name)
                                ? "bg-red-100 text-red-600 hover:bg-red-200"
                                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                            }`}
                          >
                            {compareList.some(u => u.name === uni.name) ? t("removeFromCompare") : t("addToCompare")}
                          </button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {compareList.length >= 2 && (
        <div className="mt-8 border p-4 rounded-lg shadow-md bg-white">
          <h3 className="text-xl font-bold mb-4 text-center">{t("comparison")}</h3>
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-2 text-left">{t("field")}</th>
                {compareList.map((u) => (
                  <th key={u.name} className="p-2 text-center">{u.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-medium">{t("tuition")}</td>
                {compareList.map((u) => (
                  <td key={u.name} className="p-2 text-center">${u.price}</td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-2 font-medium">{t("ranking")}</td>
                {compareList.map((u) => (
                  <td key={u.name} className="p-2 text-center">{u.ranking}</td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-2 font-medium">{t("description")}</td>
                {compareList.map((u) => (
                  <td key={u.name} className="p-2 text-center">{u.description || t("noInfo")}</td>
                ))}
              </tr>
              <tr>
                <td className="p-2 font-medium">{t("video")}</td>
                {compareList.map((u) => (
                  <td key={u.name} className="p-2 text-center">
                    <button
                      onClick={() => setSelectedVideo(u.videoUrl)}
                      className="text-blue-600 underline text-sm flex items-center justify-center gap-1"
                    >
                      <span className="text-lg">🎬</span> <span>{t("watch")}</span>
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* دکمه ذخیره برای ادمین */}
      {isAdmin && (
        <div className="mt-6 text-center">
          <button
            onClick={async () => {
              try {
                for (const [program, universities] of Object.entries(editableData)) {
                  for (const uni of universities) {
                    const docRef = doc(db, "prices", uni.id);
                    await updateDoc(docRef, {
                      price: Number(uni.price),
                      ranking: Number(uni.ranking)
                    });
                  }
                }
                onApply(editableData);
                toast.success("✅ تغییرات با موفقیت در Firebase ذخیره شد");
              } catch (error) {
                console.error("❌ خطا در ذخیره‌سازی:", error);
                toast.error("خطا در ذخیره‌سازی داده‌ها");
              }
            }}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Apply Changes
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