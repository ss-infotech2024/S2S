// components/site/AboutSection.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrophyIcon, PlayCircleIcon } from "@heroicons/react/24/outline";

interface AboutSectionProps {
  videoSrc?: string;
  badgeText?: string;
  title?: string;
  mainDescription?: {
    heading: string;
    content: string;
  };
  sections?: Array<{
    title: string;
    content: string;
  }>;
  floatingBadges?: {
    left: string;
    right: string;
  };
}

export default function AboutSection({
  videoSrc = "/v1.mp4",
  badgeText = "About Skill Training Center",
  title = "Innovating Education with AI",
  mainDescription = {
    heading: "Where innovation meets excellence in the realm of IT solutions and education.",
    content: "Skill Training Center is a premier software organization with a strong presence in Pune and Nagpur. We specialize in cutting-edge IT solutions, digital marketing, and transformative education programs."
  },
  sections = [
    {
      title: "🎓 Education",
      content: "Education is key to personal and professional growth. We empower individuals to excel academically and professionally, opening doors to new opportunities and horizons through AI-powered learning."
    },
    {
      title: "💡 Belief",
      content: "We believe in nurturing talent and fostering careers. We connect top-tier talent with leading organizations, facilitating mutually beneficial partnerships and helping individuals navigate the complexities of the job market."
    },
    {
      title: "🚀 Solutions",
      content: "Our tailored solutions ensure that your projects are not only executed flawlessly but also meet your unique requirements and objectives. Driven by excellence, integrity, and client satisfaction."
    }
  ],
  floatingBadges = {
    left: "Live Classroom",
    right: "AI Powered"
  }
}: AboutSectionProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section id="about" className="container py-20 bg-white">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Left Column - Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <TrophyIcon className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">{badgeText}</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
              {title}
            </h2>
          </div>

          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="prose prose-lg"
            >
              <p className="text-xl font-semibold text-foreground">
                {mainDescription.heading}
              </p>
              <p>{mainDescription.content}</p>
            </motion.div>

            <div className="space-y-4">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="rounded-xl bg-background/50 border border-border/30 p-4 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
                >
                  <h3 className="font-bold text-lg mb-2">{section.title}</h3>
                  <p className="text-sm text-foreground/70">{section.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Video */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-purple-600/10 to-transparent border border-primary/20 p-2 backdrop-blur-sm">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-background/60">
              <video
                src={videoSrc}
                className="h-full w-full rounded-2xl object-cover"
                controls
                autoPlay
                muted
                loop
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              />

              <AnimatePresence>
                {!isVideoPlaying && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer"
                      onClick={() => {
                        const video = document.querySelector('video');
                        if (video) video.play();
                      }}
                    >
                      <PlayCircleIcon className="w-8 h-8 text-white" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Floating Badge - Left */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-4 -right-4 bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg"
          >
            {floatingBadges.left}
          </motion.div>

          {/* Floating Badge - Right */}
          <motion.div
            animate={{
              y: [0, -8, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-lg"
          >
            {floatingBadges.right}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}