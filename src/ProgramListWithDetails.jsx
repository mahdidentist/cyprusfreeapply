import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProgramListWithDetails({ programsData, isAdmin, onApply }) {
  const [editableData, setEditableData] = useState(programsData);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleChange = (e, program, index) => {
    const newValue = e.target.value;
    const updated = { ...editableData };
    updated[program][index].price = newValue;
    setEditableData(updated);
  };

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
                      <span className="font-medium">{uni.name}</span>
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
                    <div className="text-sm text-gray-500">Rank: {uni.ranking}</div>
                    <button
                      onClick={() => setSelectedVideo(uni.videoUrl)}
                      className="mt-1 text-blue-600 hover:underline text-sm"
                    >
                      🎬 Preview Video
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
            onClick={() => {
              onApply(editableData);
              toast.success("changes saved successfully");
            }}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Apply Changes
          </button>
        </div>
      )}

      {/* Toast notification container */}
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