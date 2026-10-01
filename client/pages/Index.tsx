// pages/index.tsx (or wherever your Index component is located)
import Layout from "@/components/site/Layout";
import Hero from "@/components/site/Hero";
import Stats from "@/components/site/Stats";
import ContactForm from "@/components/site/ContactForm";
import TopCourses from "@/components/site/TopCourses";
import AboutSection from "@/components/site/AboutSection"; // Import the new component
import TestimonialsMarquee from "@/components/site/TestimonialsMarquee";
import { motion } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import PosterTemplates from "../components/site/PosterTemplates";
import HorizontalSlider from "@/components/site/HorizontalSlider";
import PlacementsSection from "@/components/site/PlacementsSection";

export default function Index() {
  return (
    <Layout>
      <div className="bg-white">
        <Hero />
        {/* <PosterTemplates /> */}

        <HorizontalSlider />

        {/* Our Placements & Recruiters — exactly below the poster carousel */}
        <PlacementsSection />
        
        {/* Top Courses Component */}
        <TopCourses 
          showViewAllButton={true}
          limit={3}
        />

        <Stats />

        {/* About Section Component - Now using the separate component */}
        <AboutSection />

        {/* Professional Testimonials Section */}
        <section id="testimonials" className="bg-gradient-to-b from-brand-aqua/50 via-white to-brand-pink/25 py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-4xl text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Success Stories</span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                What Our Students Say
              </h2>
              <p className="mt-6 text-xl text-foreground/70 max-w-2xl mx-auto">
                Real stories from our alumni who transformed their careers with Skill Training Center
              </p>
            </motion.div>

            <div>
              <TestimonialsMarquee />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
            >
              {[
                { value: "10,000+", label: "Students Trained" },
                { value: "98%", label: "Success Rate" },
                { value: "500+", label: "Companies" },
                { value: "4.9/5", label: "Rating" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 rounded-2xl bg-white border border-slate-200 shadow-lg backdrop-blur-sm"
                >
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-foreground/60 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <ContactForm />
      </div>
    </Layout>
  );
}