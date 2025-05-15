import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ProgramListWithDetails from "./ProgramListWithDetails";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import emailjs from "@emailjs/browser";

function UniversityAdmin({ universities, setUniversities }) {
  const [newUni, setNewUni] = useState("");

  const handleAdd = () => {
    if (newUni.trim()) {
      setUniversities([...universities, newUni.trim()]);
      setNewUni("");
    }
  };

  const handleDelete = (index) => {
    const updated = [...universities];
    updated.splice(index, 1);
    setUniversities(updated);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex gap-4 justify-center">
        <input
          value={newUni}
          onChange={(e) => setNewUni(e.target.value)}
          placeholder="Add new university"
          className="border p-2 rounded-lg w-64"
        />
        <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded">
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {universities.map((uni, index) => (
          <li key={index} className="flex justify-between items-center border p-2 rounded-lg">
            <span>{uni}</span>
            <button onClick={() => handleDelete(index)} className="px-3 py-1 border rounded text-sm">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const langMenuRef = useRef();
  const [universities, setUniversities] = useState([
    "Eastern Mediterranean University (EMU)",
    "Near East University (NEU)",
    "Cyprus International University (CIU)",
    "Bahçeşehir Cyprus University (BAU)",
    "Ada Kent University",
    "Final International University"
  ]);

  const [userMessages, setUserMessages] = useState([]);
  useEffect(() => {
    const saved = localStorage.getItem("userMessages");
    if (saved) {
      setUserMessages(JSON.parse(saved));
    }
  }, []);
  const [galleryImages, setGalleryImages] = useState([]);
  const userFormRef = useRef();

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
        videoUrl: "/videos/medicine-emu.mp4"
      },
      {
        name: "NEU",
        price: 5500,
        ranking: 430,
        videoUrl: "/videos/medicine-neu.mp4"
      }
    ],
    Pharmacy: [
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
      }
    ],
    Dentistry: [
      {
        name: "EMU",
        price: 5800,
        ranking: 500,
        videoUrl: "/videos/dentistry-emu.mp4"
      }
    ],
    Engineering: [
      {
        name: "CIU",
        price: 4500,
        ranking: 650,
        videoUrl: "/videos/engineering-ciu.mp4"
      }
    ],
    "Computer Science": [
      {
        name: "NEU",
        price: 4700,
        ranking: 420,
        videoUrl: "/videos/cs-neu.mp4"
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
        price: 5000,
        ranking: 510,
        videoUrl: "/videos/business-emu.mp4"
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
        name: "CIU",
        price: 4600,
        ranking: 670,
        videoUrl: "/videos/architecture-ciu.mp4"
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

  const [programsData, setProgramsData] = useState(() => {
    const saved = localStorage.getItem("programsData");
    return saved ? JSON.parse(saved) : defaultProgramsData;
  });
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setGalleryImages((prev) => [...prev, ...imageUrls]);
  };

  useEffect(() => {
    return () => {
      galleryImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [galleryImages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              </div>
            )}
          </div>
        </div>
      </header>

      {/* لیست قیمت جدید */}
      <section id="pricing" className="py-24 text-center">
        <h3 className="text-4xl font-bold mb-10">Our Price List</h3>
        <table className="mx-auto table-auto border-collapse">
          
        {showAdminPanel && (
  <div className="mt-6 text-center">
    <button
      onClick={() => {
        localStorage.setItem("pricesData", JSON.stringify(prices));
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
              <th className="px-6 py-3 text-lg font-semibold">Service</th>
              <th className="px-6 py-3 text-lg font-semibold">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-6 py-3">Consultation Fee</td>
              <td className="px-6 py-3">
                {showAdminPanel ? (
                  <input
                    type="number"
                    value={prices.consultation}
                    onChange={(e) => handlePriceChange(e, "consultation")}
                    className="w-24 p-2 border rounded"
                  />
                ) : (
                  `$${prices.consultation}`
                )}
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-6 py-3">Application Fee</td>
              <td className="px-6 py-3">
                {showAdminPanel ? (
                  <input
                    type="number"
                    value={prices.application}
                    onChange={(e) => handlePriceChange(e, "application")}
                    className="w-24 p-2 border rounded"
                  />
                ) : (
                  `$${prices.application}`
                )}
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-6 py-3">Visa Assistance</td>
              <td className="px-6 py-3">
                {showAdminPanel ? (
                  <input
                    type="number"
                    value={prices.visa}
                    onChange={(e) => handlePriceChange(e, "visa")}
                    className="w-24 p-2 border rounded"
                  />
                ) : (
                  `$${prices.visa}`
                )}
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-6 py-3">University Selection</td>
              <td className="px-6 py-3">
                {showAdminPanel ? (
                  <input
                    type="number"
                    value={prices.universitySelection}
                    onChange={(e) => handlePriceChange(e, "universitySelection")}
                    className="w-24 p-2 border rounded"
                  />
                ) : (
                  `$${prices.universitySelection}`
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
  <h3 className="text-4xl font-bold mb-10">Our Programs</h3>

  <ProgramListWithDetails
    programsData={programsData}
    isAdmin={showAdminPanel}
    onApply={(updatedData) => {
      setProgramsData(updatedData);
      localStorage.setItem("programsData", JSON.stringify(updatedData));
    }}
  />
</section>

      <section id="universities" className="py-24 max-w-6xl mx-auto text-center">
        <h3 className="text-4xl font-bold mb-10">Top Universities</h3>
        <ul className="text-lg text-gray-700 space-y-4">
          <li><a href="https://www.emu.edu.tr" target="_blank" className="flex items-center justify-center gap-2 hover:text-blue-600">🎓 EMU</a></li>
          <li><a href="https://neu.edu.tr" target="_blank" className="flex items-center justify-center gap-2 hover:text-blue-600">🏫 NEU</a></li>
          <li><a href="https://www.ciu.edu.tr" target="_blank" className="flex items-center justify-center gap-2 hover:text-blue-600">🏫 CIU</a></li>
          <li><a href="https://baucyprus.edu.tr" target="_blank" className="flex items-center justify-center gap-2 hover:text-blue-600">🎯 BAU</a></li>
          <li><a href="https://adakent.edu.tr" target="_blank" className="flex items-center justify-center gap-2 hover:text-blue-600">📚 Ada Kent</a></li>
          <li><a href="https://www.final.edu.tr" target="_blank" className="flex items-center justify-center gap-2 hover:text-blue-600">🧠 Final</a></li>
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
          <UniversityAdmin universities={universities} setUniversities={setUniversities} />
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
    </div>
  );
}