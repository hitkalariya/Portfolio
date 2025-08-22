
import React from "react";
import { BallCanvas } from "./canvas";
import { technologies } from "../constants";
import { styles } from "../styles";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AllTechnologies = () => {

   const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-primary px-4 sm:px-10 py-20">
      <motion.div className="w-full text-center mb-12">
        <p className={styles.sectionSubText}>All Skills</p>
        <h2 className={styles.sectionHeadText}>Technologies</h2>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-14">
        {technologies.map((tech) => (
          <div className="sm:w-36 w-28 h-28 sm:h-36 flex flex-col items-center" key={tech.name}>
            <img src={tech.icon} alt={tech.name} />
            <h1>{tech.name}</h1>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div
          onClick={() => navigate("/#skills")}
          className="inline-block mt-4 px-6 py-2 bg-[#915eff] text-white rounded-xl shadow-lg hover:bg-[#7d48f5] transition"
        >
          Back to Home
        </div>
      </div>
    </div>
  );
};

export default AllTechnologies;
