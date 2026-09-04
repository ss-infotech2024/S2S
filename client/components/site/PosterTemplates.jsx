import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SparklesIcon, PlayCircleIcon, TrophyIcon, EyeIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import newposter6 from "../../../public/homeUpdates/newposter6.jpg";
import newposter5 from "../../../public/homeUpdates/newposter5.jpg";
import poster3 from "../../../public/homeUpdates/poster3.jpg"; 
import poster4 from "../../../public/homeUpdates/poster4.jpg";
import service from "../../../public/homeUpdates/service.jpeg";
import databricks from "../../../public/homeUpdates/databricks.jpeg";
import german from "../../../public/homeUpdates/german.jpeg";
// import germani from "../../../public/homeUpdates/germani.jpeg";
export default function PosterTemplates() {
  // Poster templates data
  const posterTemplates = [
    {
      title: "ServiceNow AI-Data Analytics",
      description: "Traning",
      icon: SparklesIcon,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-100/10 to-cyan-900/10",
      previewImage: service,
    },
    {
      title: "German Language",
      description: "Traning",
      icon: SparklesIcon,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-100/10 to-cyan-900/10",
      previewImage: germani,
    },
    {
      title: "DataBricks AI-Data Analytics",
      description: "Traning",
      icon: SparklesIcon,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-100/10 to-cyan-900/10",
      previewImage: databricks,
    },
    {
      title: "German",
      description: "Traning",
      icon: SparklesIcon,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-100/10 to-cyan-900/10",
      previewImage: german,
    },
    {
      title: "AI-Data Analytics",
      description: "Traning & Certification",
      icon: SparklesIcon,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      previewImage: newposter6,
    },
    {
      title: "AI-Data Analytics",
      description: "Traning & Certification",
      icon: PlayCircleIcon,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
      previewImage: newposter5,
    },
    {
      title: "AI  Data-Bricks Seminar",
      description: "AI Analytics Engineering On Data-Bricks Seminar",
      icon: TrophyIcon,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-500/10 to-red-500/10",
      previewImage: poster3,
    },
    {
      title: "Answercraft",
      description: "Professional traning On communication",
      icon: TrophyIcon,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-500/10 to-red-500/10",
      previewImage: poster4,
    },
  ];

  // Function to scroll to contact section
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="posters" className="container py-10 relative bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-lg text-center mb-8"
      >

        <h2 className="text-2xl md:text-5xl font-extrabold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
          Updates
        </h2>
        <p className="mt-4 text-base text-foreground/70 max-w-md mx-auto">
           courses, webinars, and success stories.
        </p>
      </motion.div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto px-4">
        {[...posterTemplates, ...posterTemplates].map((template, index) => {
          const IconComponent = template.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="relative w-full max-w-[250px] h-[200px] rounded-xl bg-white p-3 border border-border/50 overflow-hidden cursor-pointer mx-auto"
              whileHover={{ scale: 1.05 }}
              onClick={scrollToContact}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  scrollToContact();
                }
              }}
            >
              {/* Animated Background Glow */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${template.bgColor} opacity-10 rounded-xl pointer-events-none transition-all duration-500`}
              />

              {/* Border Glow Effect */}
              <motion.div
                className={`absolute inset-0 rounded-xl bg-gradient-to-r ${template.color} opacity-20 p-[1px] pointer-events-none transition-all duration-500`}
              >
                <div className="w-full h-full rounded-xl bg-white" />
              </motion.div>

              <div className="relative z-10 flex flex-col h-full">
                {/* Poster Icon */}
                <motion.div
                  className={`inline-flex p-1.5 rounded-md bg-gradient-to-r ${template.color} text-white mb-2 transition-all duration-300`}
                >
                  <IconComponent className="w-4 h-4" />
                </motion.div>

                {/* Poster Preview */}
                <div className="flex-grow rounded-md overflow-hidden mb-2 relative">
                  <img
                    src={template.previewImage}
                    alt={`${template.title} preview`}
                    className="w-full h-[80px] object-cover"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md"
                  >
                    <EyeIcon className="w-5 h-5 text-white" />
                  </motion.div>
                </div>

                <h3 className="text-xs font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent leading-tight">
                  {template.title}
                </h3>
                <p className="mt-1 text-xs text-foreground/70 leading-tight line-clamp-2">
                  {template.description}
                </p>

                {/* Optional Download Button - only show if downloadLink exists */}
                {template.downloadLink && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-2"
                  >
                    <a
                      href={template.downloadLink}
                      download
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-all duration-300 group text-xs"
                    >
                      <span>Download</span>
                      <DocumentArrowDownIcon className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View All Templates CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="text-center mt-8"
      >
      </motion.div>
    </section>
  );
}