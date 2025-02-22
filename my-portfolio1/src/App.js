import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Contact from "./pages/Contact";

export default function App() {
  const [section, setSection] = useState("home");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5 flex flex-col items-center">
      <motion.h1 className="text-4xl font-bold mb-6" animate={{ scale: 1.1 }}>
        My AI & Data Science Portfolio
      </motion.h1>
      <Navbar setSection={setSection} />
      <motion.div className="w-full max-w-4xl" animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
        {section === "home" && <Home />}
        {section === "projects" && <Projects />}
        {section === "skills" && <Skills />}
        {section === "contact" && <Contact />}
      </motion.div>
    </div>
  );
}