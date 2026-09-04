import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import newposter6 from "../../../public/homeUpdates/newposter6.jpg";
import newposter5 from "../../../public/homeUpdates/newposter5.jpg";
import poster3 from "../../../public/homeUpdates/poster3.jpg"; 
import poster4 from "../../../public/homeUpdates/poster4.jpg";
import service from "../../../public/homeUpdates/service.jpeg";
import databricks from "../../../public/homeUpdates/databricks.jpeg";
import german from "../../../public/homeUpdates/german.jpeg";
import germani from "../../../public/homeUpdates/germani.jpeg";

// Card Data
const cardData = [
  {
    id: 1,
    title: "ServiceNow AI-Data Analytics",
    description: "Training",
    image: service,
  },
  {
    id: 2,
    title: "German Workshop",
    description: "German Language Workshop",
    image: germani,
  },
  {
    id: 3,
    title: "DataBricks AI-Data Analytics",
    description: "DataBricks Webinar, Industry Awareness Session",
    image: databricks,
  },
  {
    id: 4,
    title: "German Language 3 Days Workshop",
    description: "3-DAY GERMAN LANGUAGE POWER WORKSHOP",
    image: german,
  },
  {
    id: 5,
    title: "AI-Data Analytics",
    description: "Training & Certification",
    image: newposter6,
  },
  {
    id: 6,
    title: "AI-Data Analytics",
    description: "Training & Certification",
    image: newposter5,
  },
  {
    id: 7,
    title: "AI Data-Bricks Seminar",
    description: "AI Analytics Engineering On Data-Bricks Seminar",
    image: poster3,
  },
  {
    id: 8,
    title: "Answercraft",
    description: "Professional training On communication",
    image: poster4,
  },
];

const Card = ({ title, description, image, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative w-full max-w-[800px] mx-auto rounded-xl border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm shadow-lg overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row h-full">
        
        {/* Left Side - Image */}
        <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <EyeIcon className="h-10 w-10 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 p-6 md:p-7 flex flex-col justify-center">
          <h3 className="text-lg md:text-xl font-bold text-white leading-tight mb-3 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
            {description}
          </p>
          
          <div className="mt-4 text-xs uppercase tracking-widest text-blue-400 font-medium">
            Click to learn more →
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Modal Component (unchanged)
const Modal = ({ isOpen, onClose, card }) => {
  if (!card) return null;

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
            onClick={onClose}
          >
            <div 
              className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors group"
              >
                <XMarkIcon className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
              </button>
              
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 h-[300px] md:h-auto relative overflow-hidden">
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gray-900/20" />
                </div>
                
                <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto">
                  <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                      {card.title}
                    </h2>
                    <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                      {card.description}
                    </p>
                    
                    <div className="pt-6 mt-6 border-t border-white/10 space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <h3 className="text-white font-semibold mb-2 text-lg">Training Details</h3>
                          <ul className="space-y-2 text-gray-400">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>Duration: 8 Weeks</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>Mode: Online & Offline</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>Certificate: Yes</li>
                          </ul>
                        </div>
                        <div className="pt-4">
                          <h3 className="text-white font-semibold mb-2 text-lg">What You'll Learn</h3>
                          <ul className="space-y-2 text-gray-400">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>Fundamentals & Advanced Concepts</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>Hands-on Projects</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>Industry Best Practices</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="pt-6">
                        <button className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 transform hover:scale-105">
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const HorizontalSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto slide every 2 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cardData.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCard(null), 300);
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const currentCard = cardData[currentIndex];

  return (
    <>
      <div className="w-full py-12">
        <div 
          className="relative w-full flex justify-center items-center min-h-[380px]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}                    // Important for AnimatePresence
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Card
                title={currentCard.title}
                description={currentCard.description}
                image={currentCard.image}
                onClick={() => handleCardClick(currentCard)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Optional: Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {cardData.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsPaused(true);
                // Resume after 4 seconds of manual interaction
                setTimeout(() => setIsPaused(false), 4000);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-blue-500 scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        card={selectedCard} 
      />
    </>
  );
};

export default HorizontalSlider;