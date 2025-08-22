// Tech.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { useNavigate } from "react-router-dom";

const Tech = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleTechs = isMobile ? technologies.slice(0, 5) : technologies;

  return (
    <>
      <motion.div className="w-full text-center py-10">
        <p className={styles.sectionSubText}>What I Use to Build</p>
        <h2 className={styles.sectionHeadText}>Technologies</h2>
      </motion.div>

      <div className="flex flex-row flex-wrap justify-center gap-10">
        {visibleTechs.map((tech) => (
          <div className="sm:w-36 w-28 h-28 sm:h-36" key={tech.name}>
            <BallCanvas icon={tech.icon} />
          </div>
        ))}

        {isMobile && (
          <div
            onClick={() => navigate("/all-technologies")}
            className="sm:w-36 w-28 h-28 sm:h-36 rounded-full border border-dashed border-[#915eff] flex items-center justify-center cursor-pointer hover:bg-[#915eff]/10 text-[#915eff] text-sm font-medium transition"
          >
            + More
          </div>
        )}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "skills");
