import { useState, useEffect, useRef } from "react";
import { useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import ProgramListWithDetails from "./ProgramListWithDetails";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import emailjs from "@emailjs/browser";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

function UniversityAdmin({ universities, setUniversities }) {
  const handleDelete = (index) => {
    const updated = [...universities];
    updated.splice(index, 1);
    setUniversities(updated);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <ul className="space-y-2">
        {universities.map((uni, index) => (
          <li key={index} className="border p-3 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{uni.name}</span>
              <button
                onClick={() => handleDelete(index)}
                className="px-3 py-1 border rounded text-sm"
              >
                Delete
              </button>
            </div>
            <p className="text-sm text-gray-700">{uni.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const [showWelcome, setShowWelcome] = useState(true);
  const [programsData, setProgramsData] = useState(null);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [flatUniversities, setFlatUniversities] = useState({});
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [comparisonList, setComparisonList] = useState([]);
  // Advanced filter states
  const [maxTuition, setMaxTuition] = useState(null);
  const [maxRanking, setMaxRanking] = useState(null);
  const [onlyWithVideo, setOnlyWithVideo] = useState(false);

  // Video Modal State
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);

  const handlePreviewVideo = (url) => {
    setCurrentVideoUrl(url);
    setShowVideoModal(true);
  };

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const langMenuRef = useRef();
  const [universities, setUniversities] = useState([
    { name: "Eastern Mediterranean University (EMU)", description: "" },
    { name: "Near East University (NEU)", description: "" },
    { name: "Cyprus International University (CIU)", description: "" },
    { name: "Bahçeşehir Cyprus University (BAU)", description: "" },
    { name: "Ada Kent University", description: "" },
    { name: "Final International University", description: "" },
  ]);

  const [userMessages, setUserMessages] = useState([]);
  useEffect(() => {
    const saved = localStorage.getItem("userMessages");
    if (saved) {
      setUserMessages(JSON.parse(saved));
    }
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  const [galleryImages, setGalleryImages] = useState([]);
  const userFormRef = useRef();

const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);
  const imageUrls = files.map((file) => URL.createObjectURL(file));
  setGalleryImages((prev) => [...prev, ...imageUrls]);
};

const handleUserFormSubmit = (e) => {
  e.preventDefault();

  const formData = {
    name: e.target.name.value,
    education: e.target.education.value,
    interest: e.target.interest.value,
    university: e.target.university.value,
    message: e.target.message.value,
    date: new Date().toLocaleString()
  };

  const existing = JSON.parse(localStorage.getItem("userMessages") || "[]");
  localStorage.setItem("userMessages", JSON.stringify([...existing, formData]));
  setUserMessages([...existing, formData]);

  // ارسال ایمیل با EmailJS
  emailjs
    .sendForm(
      "service_510wcrq",      // Service ID
      "template_c156hxm",     // Template ID
      userFormRef.current,    // ریفرنس فرم
      "Ax345AGzcsMSTkSru"     // Public key
    )
    .then(() => {
      toast.success("✅ فرم با موفقیت ارسال شد و در ایمیل ثبت شد");
      e.target.reset();
    })
    .catch((error) => {
      console.error("Email error:", error);
      toast.error("❌ خطا در ارسال ایمیل");
    });
};
  const fileInputRef = useRef();
  const defaultProgramsData = {    
    Medicine: [
      {
        name: "EMU",
        price: 6000,
        ranking: 501,
        videoUrl: "/videos/emu-intro.mp4"
      },
      {
        name: "Final",
        price: 4900,
        ranking: 760,
        videoUrl: "/videos/medicine-final.mp4"
      },
      {
        name: "NEU",
        price: 5500,
        ranking: 430,
        videoUrl: "/videos/neu-intro.mp4"
      },
      {
        name: "CIU",
        price: 5300,
        ranking: 610,
        videoUrl: "/videos/medicine-ciu.mp4"
      },
      {
        name: "Kyrenia",
        price: 5200,
        ranking: 690,
        videoUrl: "/videos/medicine-kyrenia.mp4"
      },
      {
        name: "Arucad",
        price: 5100,
        ranking: 710,
        videoUrl: "/videos/medicine-arucad.mp4"
      },
      {
        name: "Ada Kent",
        price: 5000,
        ranking: 730,
        videoUrl: "/videos/medicine-adakent.mp4"
      }
    ],
    Pharmacy: [
      {
        name: "EMU",
        price: 5400,
        ranking: 490,
        videoUrl: "/videos/pharmacy-emu.mp4"
      },
      {
        name: "CIU",
        price: 5200,
        ranking: 600,
        videoUrl: "/videos/pharmacy-ciu.mp4"
      },
      {
        name: "NEU",
        price: 5100,
        ranking: 450,
        videoUrl: "/videos/pharmacy-neu.mp4"
      },
      {
        name: "Final",
        price: 4950,
        ranking: 550,
        videoUrl: "/videos/pharmacy-final.mp4"
      },
      {
        name: "Kyrenia",
        price: 5050,
        ranking: 570,
        videoUrl: "/videos/pharmacy-kyrenia.mp4"
      },
      {
        name: "Arucad",
        price: 4900,
        ranking: 620,
        videoUrl: "/videos/pharmacy-arucad.mp4"
      },
      {
        name: "Ada Kent",
        price: 5000,
        ranking: 590,
        videoUrl: "/videos/pharmacy-adakent.mp4"
      }
    ],
    Dentistry: [
      {
        name: "EMU",
        price: 10000,
        ranking: 200,
        videoUrl: "/videos/dentistry-emu.mp4"
      },
      {
        name: "CIU",
        price: 13500,
        ranking: 120,
        videoUrl: "/videos/dentistry-ciu.mp4"
      },
      {
        name: "NEU",
        price: 14500,
        ranking: 85,
        videoUrl: "/videos/dentistry-neu.mp4"
      },
      {
        name: "Arucad",
        price: 6000,
        ranking: 700,
        videoUrl: "/videos/dentistry-arucad.mp4"
      },
      {
        name: "Adakent",
        price: 5000,
        ranking: 10000,
        videoUrl: "/videos/dentistry-adakent.mp4"
      },
      {
        name: "Final",
        price: 3200,
        ranking: 500,
        videoUrl: "/videos/dentistry-final.mp4"
      },
      {
        name: "Kyrenia",
        price: 4000,
        ranking: 400,
        videoUrl: "/videos/dentistry-kyrenia.mp4"
      }
    ],
    Engineering: [
      {
        name: "Final",
        price: 5100,
        ranking: 690,
        videoUrl: "/videos/engineering-final.mp4"
      },
      {
        name: "CIU",
        price: 5800,
        ranking: 300,
        videoUrl: "/videos/engineering-ciu.mp4"
      },
      {
        name: "NEU",
        price: 5500,
        ranking: 250,
        videoUrl: "/videos/engineering-neu.mp4"
      },
      {
        name: "EMU",
        price: 6000,
        ranking: 501,
        videoUrl: "/videos/engineering-emu.mp4"
      },
      {
        name: "Kyrenia",
        price: 5200,
        ranking: 690,
        videoUrl: "/videos/engineering-kyrenia.mp4"
      }
    ],
    "Computer Science": [
      {
        name: "CIU",
        price: 5000,
        ranking: 100,
        videoUrl: "/videos/cs-ciu.mp4"
      },
      {
        name: "NEU",
        price: 5000,
        ranking: 100,
        videoUrl: "/videos/cs-neu.mp4"
      },
      {
        name: "EMU",
        price: 5000,
        ranking: 200,
        videoUrl: "/videos/cs-emu.mp4"
      },
      {
        name: "Kyrenia",
        price: 5000,
        ranking: 100,
        videoUrl: "/videos/cs-kyrenia.mp4"
      },
      {
        name: "Adakent",
        price: 5000,
        ranking: 100,
        videoUrl: "/videos/cs-adakent.mp4"
      },
      {
        name: "Final",
        price: 5000,
        ranking: 100,
        videoUrl: "/videos/cs-final.mp4"
      }
    ],
    Law: [
      {
        name: "BAU",
        price: 4900,
        ranking: 700,
        videoUrl: "/videos/law-bau.mp4"
      }
    ],
    "Business Administration": [
      {
        name: "EMU",
        price: 3000,
        ranking: 100,
        videoUrl: "/videos/business-emu.mp4"
      },
      {
        name: "NEU",
        price: 3000,
        ranking: 200,
        videoUrl: "/videos/business-neu.mp4"
      },
      {
        name: "Kyrenia",
        price: 2000,
        ranking: 100,
        videoUrl: "/videos/business-kyrenia.mp4"
      },
      {
        name: "Adakent",
        price: 3000,
        ranking: 200,
        videoUrl: "/videos/business-adakent.mp4"
      },
      {
        name: "CIU",
        price: 3000,
        ranking: 100,
        videoUrl: "/videos/business-ciu.mp4"
      },
      {
        name: "Final",
        price: 3000,
        ranking: 80,
        videoUrl: "/videos/business-final.mp4"
      }
    ],
    Psychology: [
      {
        name: "Ada Kent",
        price: 4700,
        ranking: 720,
        videoUrl: "/videos/psychology-adakent.mp4"
      }
    ],
    Education: [
      {
        name: "Final",
        price: 4400,
        ranking: 780,
        videoUrl: "/videos/education-final.mp4"
      }
    ],
    Architecture: [
      {
        name: "EMU",
        price: 4800,
        ranking: 510,
        videoUrl: "/videos/architecture-emu.mp4"
      },
      {
        name: "NEU",
        price: 4700,
        ranking: 490,
        videoUrl: "/videos/architecture-neu.mp4"
      },
      {
        name: "CIU",
        price: 4600,
        ranking: 670,
        videoUrl: "/videos/architecture-ciu.mp4"
      },
      {
        name: "Final",
        price: 4500,
        ranking: 700,
        videoUrl: "/videos/architecture-final.mp4"
      },
      {
        name: "Kyrenia",
        price: 4400,
        ranking: 730,
        videoUrl: "/videos/architecture-kyrenia.mp4"
      },
      {
        name: "Ada Kent",
        price: 4300,
        ranking: 750,
        videoUrl: "/videos/architecture-adakent.mp4"
      },
      {
        name: "Arucad",
        price: 4200,
        ranking: 760,
        videoUrl: "/videos/architecture-arucad.mp4"
      }
    ],
    "International Relations": [
      {
        name: "NEU",
        price: 4800,
        ranking: 490,
        videoUrl: "/videos/ir-neu.mp4"
      }
    ]
  };
  const handleUniversityClick = (name) => {
    const uni = flatUniversities[name.toLowerCase()];
    if (uni) setSelectedUniversity(uni);
  };

// Load university descriptions from localStorage on mount
  useEffect(() => {
    const savedDescriptions = JSON.parse(localStorage.getItem("universityDescriptions") || "{}");
    setFlatUniversities(prev => {
      const updated = { ...prev };
      Object.entries(savedDescriptions).forEach(([key, value]) => {
        if (updated[key]) {
          updated[key].description = value.description;
        }
      });
      return updated;
    });
  }, []);

  // Fetch university descriptions from Firestore
  useEffect(() => {
    const fetchDescriptions = async () => {
      try {
        const snapshot = await getDocs(collection(db, "universityDescriptions"));
        const descriptions = {};
        snapshot.forEach((doc) => {
          const data = doc.data();
          descriptions[data.name.toLowerCase()] = data.description;
        });

        setFlatUniversities((prev) => {
          const updated = { ...prev };
          for (const key in descriptions) {
            if (updated[key]) {
              updated[key].description = descriptions[key];
            }
          }
          return updated;
        });
      } catch (err) {
        console.error("خطا در دریافت توضیحات دانشگاه:", err);
      }
    };

    fetchDescriptions();
  }, []);
useEffect(() => {
  const fetchPrograms = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "prices"));
      const structuredData = {};

      querySnapshot.forEach((docSnap) => {
        const item = docSnap.data();
        const id = docSnap.id;
        if (!structuredData[item.program]) structuredData[item.program] = [];
        structuredData[item.program].push({
          id,
          name: item.name,
          price: item.price,
          ranking: item.ranking,
          videoUrl: item.videoUrl
        });
      });

      setProgramsData(structuredData);
      const flat = {};
      Object.values(structuredData).flat().forEach((uni) => {
        flat[uni.name.toLowerCase()] = uni;
      });
      setFlatUniversities(flat);
      // Fetch and merge descriptions after flatUniversities are ready
      const savedDescriptions = JSON.parse(localStorage.getItem("universityDescriptions") || "{}");
      const updatedFlat = { ...flat };
      for (const key in savedDescriptions) {
        if (updatedFlat[key]) {
          updatedFlat[key].description = savedDescriptions[key].description || "";
        }
      }
      setFlatUniversities(updatedFlat);
    } catch (err) {
      console.error("❌ خطا در دریافت اطلاعات از Firebase:", err);
      toast.error("خطا در بارگذاری برنامه‌ها");
    } finally {
      setLoadingPrograms(false);
    }
  };

  fetchPrograms();
}, []);

  const filteredPrograms = useMemo(() => {
    if (!programsData) return null;
    const result = {};
    Object.entries(programsData).forEach(([program, unis]) => {
      let matches = unis.filter((uni) => {
        const textMatch = `${program} ${uni.name}`.toLowerCase().includes(searchTerm.toLowerCase());
        const tuitionOk = !maxTuition || uni.price <= maxTuition;
        const rankingOk = !maxRanking || uni.ranking <= maxRanking;
        const videoOk = !onlyWithVideo || !!uni.videoUrl;
        return textMatch && tuitionOk && rankingOk && videoOk;
      });
      if (matches.length) result[program] = matches;
    });
    return result;
  }, [searchTerm, programsData, maxTuition, maxRanking, onlyWithVideo]);
  // برای ذخیره قیمت‌ها
  const defaultPrices = {
    consultation: 50,
    application: 100,
    visa: 150,
    universitySelection: 200
  };

  const [prices, setPrices] = useState(() => {
    const saved = localStorage.getItem("pricesData");
    return saved ? JSON.parse(saved) : defaultPrices;
  });

  // --- Rankings state and handler ---
  const [rankings, setRankings] = useState(() => {
    const saved = localStorage.getItem("rankingsData");
    return saved ? JSON.parse(saved) : {};
  });

  const handleRankingChange = (e, key) => {
    const value = e.target.value;
    setRankings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePriceChange = (e, key) => {
    const value = e.target.value;
    setPrices((prevPrices) => ({
      ...prevPrices,
      [key]: value
    }));
  };

  return (
    <div className="bg-white text-gray-900 font-sans">
      <header className="flex justify-between items-center px-10 py-6 shadow-md sticky top-0 bg-white z-10 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="CyprusFreeApply Logo" className="h-10 w-auto shadow-md rounded" />
          <h1 className="text-3xl font-bold tracking-tight">CyprusFreeApply</h1>
        </div>
        <div className="flex items-center gap-6">
          <nav className="space-x-6 text-lg font-medium hidden md:flex">
            <a href="#about">About</a>
            <a href="#programs">Programs</a>
            <a href="#universities">Universities</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact Us</a>
          </nav>
          <div ref={langMenuRef} className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="text-xl p-2 rounded-full hover:bg-gray-100 transition"
              title="Change Language"
            >
              🌐
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-xl z-50 animate-fade-in">
                <button onClick={() => i18n.changeLanguage("en")} className="w-full text-left px-4 py-2 hover:bg-gray-100">🇬🇧 English</button>
                <button onClick={() => i18n.changeLanguage("fa")} className="w-full text-left px-4 py-2 hover:bg-gray-100">🇮🇷 فارسی</button>
                <button onClick={() => i18n.changeLanguage("tr")} className="w-full text-left px-4 py-2 hover:bg-gray-100">🇹🇷 Türkçe</button>
                <button onClick={() => i18n.changeLanguage("ru")} className="w-full text-left px-4 py-2 hover:bg-gray-100">🇷🇺 Русский</button>
                <button onClick={() => i18n.changeLanguage("ar")} className="w-full text-left px-4 py-2 hover:bg-gray-100" dir="rtl">🇸🇦 العربية</button>
              </div>
            )}
          </div>
        </div>
      </header>
      {selectedUniversity && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-xl w-full relative text-center">
      <button
        onClick={() => setSelectedUniversity(null)}
        className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-xl font-bold"
      >
        ✕
      </button>
      <h2 className="text-2xl font-bold mb-4">{selectedUniversity.name}</h2>
      <p className="mb-4">{selectedUniversity.description || "📘 توضیحاتی برای این دانشگاه ثبت نشده."}</p>
      <p className="text-gray-600 mb-2">🎓 رتبه: {selectedUniversity.ranking}</p>
      <p className="text-gray-600 mb-4">💵 شهریه: ${selectedUniversity.price}</p>
      {selectedUniversity.videoUrl && (
        <div className="mt-4">
          <video
            src={selectedUniversity.videoUrl}
            controls
            className="w-full max-w-md mx-auto rounded"
          />
        </div>
      )}
      {selectedUniversity.website && (
        <a
          href={selectedUniversity.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          🔗 سایت دانشگاه
        </a>
      )}
    </div>
  </div>
)}
      {/* لیست قیمت جدید */}
      <section id="pricing" className="py-24 text-center">
        <h3 className="text-4xl font-bold mb-10">{t("priceListTitle")}</h3>
        <table className="mx-auto table-auto border-collapse">
          
        {showAdminPanel && (
  <div className="mt-6 text-center">
    <button
      onClick={() => {
        localStorage.setItem("pricesData", JSON.stringify(prices));
        localStorage.setItem("rankingsData", JSON.stringify(rankings));
        toast.success("changes saved successfully");
      }}
      className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Apply Price Changes
    </button>
  </div>
)}
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-lg font-semibold">{t("service")}</th>
              <th className="px-6 py-3 text-lg font-semibold">{t("price")}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-6 py-3">{t("consultationFee")}</td>
              <td className="px-6 py-3">
                {showAdminPanel ? (
                  <input
                    type="number"
                    value={prices.consultation}
                    onChange={(e) => handlePriceChange(e, "consultation")}
                    className="w-24 p-2 border rounded"
                  />
                ) : (
                  t("free")
                )}
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-6 py-3">{t("applicationFee")}</td>
              <td className="px-6 py-3">
                {showAdminPanel ? (
                  <input
                    type="number"
                    value={prices.application}
                    onChange={(e) => handlePriceChange(e, "application")}
                    className="w-24 p-2 border rounded"
                  />
                ) : (
                  t("free")
                )}
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-6 py-3">{t("visaAssistance")}</td>
              <td className="px-6 py-3">
                {showAdminPanel ? (
                  <input
                    type="number"
                    value={prices.visa}
                    onChange={(e) => handlePriceChange(e, "visa")}
                    className="w-24 p-2 border rounded"
                  />
                ) : (
                  t("free")
                )}
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-6 py-3">{t("universitySelection")}</td>
              <td className="px-6 py-3">
                {showAdminPanel ? (
                  <input
                    type="number"
                    value={prices.universitySelection}
                    onChange={(e) => handlePriceChange(e, "universitySelection")}
                    className="w-24 p-2 border rounded"
                  />
                ) : (
                  t("free")
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="text-center py-32 bg-gradient-to-r from-white via-gray-50 to-white">
        <h2 className="text-5xl font-extrabold mb-6 tracking-tight">{t("hero_title")}</h2>
        <p className="text-xl mb-8 text-gray-600">{t("hero_subtitle")}</p>
        <a
          href="https://wa.me/905391118514"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-lg px-8 py-4 rounded-full shadow-lg bg-black hover:bg-gray-900 text-white"
        >
          {t("consult_btn")}
        </a>
      </section>

      {/* فقط برای ادمین */}
      {showAdminPanel && (
  <>
    <section id="gallery" className="py-24 max-w-6xl mx-auto text-center">
      <h3 className="text-4xl font-bold mb-8">Gallery</h3>
      <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 border rounded">Choose Images</button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {galleryImages.map((src, index) => (
          <img key={index} src={src} alt={`gallery-${index}`} className="w-full h-48 object-cover rounded-lg shadow-md" />
        ))}
      </div>
    </section>

    {/* 👇 بخش نمایش پیام‌ها */}
    <section className="py-16 max-w-4xl mx-auto text-left">
      <h4 className="text-3xl font-bold mb-6 text-center">📩 User Messages</h4>
      {userMessages.length === 0 ? (
        <p className="text-center text-gray-500">No messages submitted yet.</p>
      ) : (
        userMessages.map((msg, index) => (
          <div key={index} className="mb-6 p-4 border rounded shadow-sm bg-white">
            <p><strong>Name:</strong> {msg.name}</p>
            <p><strong>Education:</strong> {msg.education}</p>
            <p><strong>Interest:</strong> {msg.interest}</p>
            <p><strong>University:</strong> {msg.university}</p>
            <p><strong>Message:</strong> {msg.message}</p>
            <p className="text-sm text-gray-500 mt-2">{msg.date}</p>
          </div>
        ))
      )}
    </section>
  </>
)}

      <section className="py-24 text-center">
        <h3 className="text-4xl font-bold mb-6">Watch Our Introduction</h3>
        <video className="w-full max-w-3xl mx-auto rounded-lg shadow-lg" src="/intro.mp4" controls />
      </section>

      <section id="programs" className="py-24 max-w-6xl mx-auto text-center animate-fade-in">
        <h3 className="text-4xl font-bold mb-10">{t("ourPrograms")}</h3>
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border rounded-lg shadow-sm"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        <div className="flex justify-center gap-4 mb-8">
          <input
            type="number"
            placeholder={t("maxTuition")}
            className="p-2 border rounded w-40"
            onChange={(e) => setMaxTuition(+e.target.value)}
          />
          <input
            type="number"
            placeholder={t("maxRanking")}
            className="p-2 border rounded w-40"
            onChange={(e) => setMaxRanking(+e.target.value)}
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              onChange={(e) => setOnlyWithVideo(e.target.checked)}
            />
            <span>{t("onlyWithVideo")}</span>
          </label>
        </div>
        <div>
          {loadingPrograms ? (
            <p className="text-gray-500">در حال بارگذاری...</p>
          ) : programsData ? (
            <ProgramListWithDetails
              programsData={filteredPrograms}
              isAdmin={showAdminPanel}
              onApply={(updatedData) => {
                setProgramsData(updatedData);
                localStorage.setItem("programsData", JSON.stringify(updatedData));
              }}
              onPreviewVideo={handlePreviewVideo}
              onCompareSelect={(uniKey) => {
                setComparisonList((prev) => {
                  if (prev.includes(uniKey)) return prev;
                  if (prev.length >= 2) return prev;
                  return [...prev, uniKey];
                });
              }}
            />
          ) : (
            <p className="text-red-500">هیچ داده‌ای یافت نشد.</p>
          )}
        </div>
        {/* Video Modal */}
        {showVideoModal && currentVideoUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-3xl relative">
              <button
                onClick={() => {
                  setShowVideoModal(false);
                  setCurrentVideoUrl(null);
                }}
                className="absolute top-3 right-4 text-2xl text-gray-700 hover:text-red-600"
              >
                ✕
              </button>
              <video src={currentVideoUrl} controls autoPlay className="w-full h-auto" />
            </div>
          </div>
        )}
        {/* Comparison Section */}
        {comparisonList.length === 2 && (
          <section className="mt-12 max-w-4xl mx-auto text-center border p-6 rounded-lg shadow-lg bg-white">
            <h4 className="text-2xl font-bold mb-6">🏆 Compare Universities</h4>
            <div className="grid grid-cols-2 gap-6 text-left">
              {comparisonList.map((uniKey) => {
                const uni = flatUniversities[uniKey];
                return (
                  <div key={uniKey} className="border rounded-lg p-4 bg-gray-50">
                    <h5 className="text-xl font-semibold mb-2">{uni.name}</h5>
                    <p><strong>Ranking:</strong> {uni.ranking}</p>
                    <p><strong>Tuition:</strong> ${uni.price}</p>
                    <p className="mt-2 text-sm text-gray-600">{uni.description || "No description provided."}</p>
                    {uni.videoUrl && (
                      <button
                        onClick={() => handlePreviewVideo(uni.videoUrl)}
                        className="mt-4 px-4 py-2 text-sm bg-blue-500 text-white rounded"
                      >
                        Preview Video
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setComparisonList([])}
              className="mt-6 px-6 py-2 bg-red-500 text-white rounded"
            >
              Clear Comparison
            </button>
          </section>
        )}
      </section>

      <section id="universities" className="py-24 max-w-6xl mx-auto text-center">
        <h3 className="text-4xl font-bold mb-10">Top Universities</h3>
        <ul className="text-lg text-gray-700 space-y-4 flex flex-col items-center">
  <li><button onClick={() => handleUniversityClick("EMU")} className="flex items-center justify-center gap-2 hover:text-blue-600">🎓 EMU</button></li>
  <li><button onClick={() => handleUniversityClick("NEU")} className="flex items-center justify-center gap-2 hover:text-blue-600">🏫 NEU</button></li>
  <li><button onClick={() => handleUniversityClick("CIU")} className="flex items-center justify-center gap-2 hover:text-blue-600">🏫 CIU</button></li>
  <li><button onClick={() => handleUniversityClick("BAU")} className="flex items-center justify-center gap-2 hover:text-blue-600">🎯 BAU</button></li>
  <li><button onClick={() => handleUniversityClick("Ada Kent")} className="flex items-center justify-center gap-2 hover:text-blue-600">📚 Ada Kent</button></li>
  <li><button onClick={() => handleUniversityClick("Final")} className="flex items-center justify-center gap-2 hover:text-blue-600">🧠 Final</button></li>
</ul>
      </section>

      <section id="about" className="py-24 max-w-4xl mx-auto text-center">
        <h3 className="text-4xl font-bold mb-10">About Us</h3>
        <p className="text-xl leading-relaxed text-gray-700">
          At CyprusFreeApply, we help students apply to North Cyprus universities with zero fees and full support.
        </p>
      </section>

      <section id="contact" className="py-24 bg-gray-50 text-center">
        <h3 className="text-4xl font-bold mb-10">Contact Us</h3>
        <p className="mb-4">Email: cyprusfreeapply@gmail.com</p>
        <a
          href="https://wa.me/905391118514"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-lg px-6 py-3 rounded-full shadow-lg bg-green-600 hover:bg-green-700 text-white"
        >
          Chat on WhatsApp
        </a>
        <a
          href="https://wa.me/905428745631"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-lg px-6 py-3 rounded-full shadow-lg bg-green-600 hover:bg-green-700 text-white mt-4"
        >
          Chat on WhatsApp (New Number 2)
        </a>
      </section>

      <section id="admin" className="py-24 max-w-4xl mx-auto text-center">
        <h3 className="text-4xl font-bold mb-10">Admin Panel</h3>
        {!showAdminPanel ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const username = e.target.username.value;
              const password = e.target.password.value;
              if (username === "admin" && password === "1234") {
                setShowAdminPanel(true);
              } else {
                alert("Incorrect credentials");
              }
            }}
            className="space-y-4 max-w-sm mx-auto p-6 border rounded-lg shadow-md animate-fade-in"
          >
            <input name="username" placeholder="Username" className="w-full p-3 border rounded" />
            <input name="password" type="password" placeholder="Password" className="w-full p-3 border rounded" />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Login
            </button>
          </form>
        ) : (
          <>
            <UniversityAdmin universities={universities} setUniversities={setUniversities} />
            {/* University Descriptions Admin Form */}
            <section className="mt-10">
              <h4 className="text-2xl font-bold mb-4">📝 University Descriptions</h4>
              {Object.entries(flatUniversities).map(([key, uni]) => (
                <div key={key} className="mb-6 p-4 border rounded shadow-sm bg-white">
                  <h5 className="font-bold text-lg mb-2">{uni.name}</h5>
                  <textarea
                    className="w-full border p-2 rounded"
                    rows={3}
                    placeholder="Enter description..."
                    value={uni.description || ""}
                    onChange={(e) => {
                      const updated = { ...flatUniversities };
                      updated[key] = {
                        ...updated[key],
                        description: e.target.value,
                      };
                      setFlatUniversities(updated);
                    }}
                  />
                </div>
              ))}
              <button
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={async () => {
                  try {
                    // Save universityDescriptions to Firestore
                    for (const key in flatUniversities) {
                      const uni = flatUniversities[key];
                      await setDoc(doc(db, "universityDescriptions", key), {
                        name: uni.name,
                        description: uni.description || "",
                      });
                    }
                    // Save prices and rankings to Firestore under adminSettings/general
                    await setDoc(doc(db, "adminSettings", "general"), {
                      prices,
                      rankings,
                    });
                    // Save to localStorage as well
                    const localDescriptions = {};
                    for (const key in flatUniversities) {
                      localDescriptions[key] = { description: flatUniversities[key].description || "" };
                    }
                    localStorage.setItem("universityDescriptions", JSON.stringify(localDescriptions));
                    localStorage.setItem("pricesData", JSON.stringify(prices));
                    localStorage.setItem("rankingsData", JSON.stringify(rankings));
                    toast.success("✅ همه اطلاعات با موفقیت ذخیره شد!");
                  } catch (error) {
                    console.error("خطا در ذخیره اطلاعات:", error);
                    toast.error("❌ خطا در ذخیره اطلاعات");
                  }
                }}
              >
                Save All Descriptions
              </button>
            </section>
          </>
        )}
      </section>

      <section id="user-message-form" className="py-24 max-w-2xl mx-auto px-4">
  <h3 className="text-3xl font-bold mb-6 text-center">Leave us your info</h3>
  <form
    ref={userFormRef}
    onSubmit={handleUserFormSubmit}
    className="space-y-4 border p-6 rounded-lg shadow"
  >
    <input name="name" placeholder="Full Name" className="w-full p-3 border rounded" required />
    <input name="education" placeholder="Education Level" className="w-full p-3 border rounded" required />
    <input name="interest" placeholder="Interested Field" className="w-full p-3 border rounded" required />
    <input name="university" placeholder="Preferred University" className="w-full p-3 border rounded" />
    <textarea name="message" placeholder="Additional Notes" className="w-full p-3 border rounded h-32" />
    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
      Submit
    </button>
  </form>
</section>
      <footer className="bg-white text-center py-6 text-sm border-t border-gray-200 text-gray-500">
        © 2025 CyprusFreeApply | Designed with ❤️ |
        <a
          href="https://wa.me/905391118514"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline ml-1"
        >
          WhatsApp Support
        </a>
      </footer>
      <ToastContainer position="top-center" autoClose={3000} />
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="text-center"
            >
              <h2 className="text-4xl font-extrabold text-black">Welcome</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}