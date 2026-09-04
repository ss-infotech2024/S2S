// pages/index.tsx (or wherever your Index component is located)
import { useState, useEffect, useRef } from "react";
import Layout from "@/components/site/Layout";
import Hero from "@/components/site/Hero";
import Stats from "@/components/site/Stats";
import ContactForm from "@/components/site/ContactForm";
import TopCourses from "@/components/site/TopCourses";
import AboutSection from "@/components/site/AboutSection"; // Import the new component
import { motion, AnimatePresence } from "framer-motion";
import {
  SparklesIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserGroupIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon
} from "@heroicons/react/24/outline";
import PosterTemplates from "../components/site/PosterTemplates";
import HorizontalSlider from "@/components/site/HorizontalSlider";

export default function Index() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Professional testimonials data
  const testimonials = [
    {
      id: 1,
      quote: "The instructors are top-notch and the curriculum is very practical. I landed a job just two months after completing the course!",
      author: "Niharika Sharma",
      role: "Software Developer",
      company: "Tech Solutions Inc.",
      rating: 5,
      avatar: "/Niharika.jpg",
      course: "Python + DSA",
      achievements: ["Got 3 job offers", "Salary increased by 200%", "Placed in 2 months"]
    },
    {
      id: 2,
      quote: "Skill Training Center's course gave me the skills and confidence I needed to switch my career. The projects were invaluable for my portfolio.",
      author: "Prateek Kumar",
      role: "Frontend Engineer",
      company: "Digital Innovations",
      rating: 5,
      avatar: "/pratik.jpg",
      course: "Full Stack Development",
      achievements: ["Career switch successful", "Built 5+ real projects", "Mentorship support"]
    },
    {
      id: 3,
      quote: "Hands-on learning and personalized attention made all the difference. Highly recommend this course to anyone serious about data analysis.",
      author: "Raj Borkar",
      role: "Data Analyst",
      company: "Analytics Pro",
      rating: 5,
      avatar: "/Borkar.jpg",
      course: "AI-Data Analytics",
      achievements: ["Mastered ML algorithms", "Real-world case studies", "Industry ready skills"]
    },
    {
      id: 4,
      quote: "The projects were hands-on and very practical. I gained confidence in real-world data analysis and visualization techniques.",
      author: "Saloni Patel",
      role: "Business Analyst",
      company: "Data Insights Ltd.",
      rating: 5,
      avatar: "/girl.jpg",
      course: "Data Science",
      achievements: ["Data visualization expert", "Business insights skills", "Client project experience"]
    },
    {
      id: 5,
      quote: "The mentorship and guidance from Skill Training Center helped me grow faster than I expected. The career support was exceptional.",
      author: "Ajay Singh",
      role: "ML Engineer",
      company: "AI Innovations",
      rating: 5,
      avatar: "/beard.jpg",
      course: "Machine Learning",
      achievements: ["Advanced ML concepts", "Model deployment", "Research opportunities"]
    },
    {
      id: 6,
      quote: "The projects and real-life case studies really boosted my confidence. The interview preparation sessions were incredibly helpful.",
      author: "Meenal Gupta",
      role: "Data Scientist",
      company: "Tech Analytics",
      rating: 5,
      avatar: "/Meenal.jpg",
      course: "AI-Data Analytics",
      achievements: ["Multiple job offers", "Confident in interviews", "Practical experience"]
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length, isPaused]);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setActiveTestimonial(index);
  };

  // Handle course click
  const handleCourseClick = (courseId: string) => {
    console.log(`Course clicked: ${courseId}`);
    // You can add navigation logic here if needed
    // navigate(`/courses/${courseId}`);
  };

  return (
    <Layout>
      <div className="bg-white">
        <Hero />
        {/* <PosterTemplates /> */}
        <HorizontalSlider />
        
        {/* Top Courses Component */}
        <TopCourses 
          onCourseClick={handleCourseClick}
          showViewAllButton={true}
          limit={3}
        />

        <Stats />

        {/* About Section Component - Now using the separate component */}
        <AboutSection />

        {/* Professional Testimonials Section */}
        <section id="testimonials" className="py-20 bg-white">
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

            <div
              className="relative max-w-6xl mx-auto"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                <div className="grid lg:grid-cols-2">
                  <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTestimonial}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                        className="h-full flex flex-col justify-center"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                          <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex gap-1 mb-6">
                          {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                            <StarIcon key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>

                        <blockquote className="text-xl md:text-2xl text-foreground/80 leading-relaxed mb-8 font-light italic">
                          "{testimonials[activeTestimonial].quote}"
                        </blockquote>

                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {testimonials[activeTestimonial].author.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-lg text-foreground">
                              {testimonials[activeTestimonial].author}
                            </div>
                            <div className="text-foreground/60">
                              {testimonials[activeTestimonial].role} at {testimonials[activeTestimonial].company}
                            </div>
                            <div className="text-primary font-semibold text-sm mt-1">
                              Completed: {testimonials[activeTestimonial].course}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-6">
                          {testimonials[activeTestimonial].achievements.map((achievement, index) => (
                            <motion.span
                              key={achievement}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                            >
                              {achievement}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="bg-gradient-to-br from-primary/5 to-purple-600/5 p-8 md:p-12 flex items-center justify-center">
                    <motion.div
                      key={activeTestimonial}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <div className="w-48 h-48 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-6xl font-bold shadow-2xl">
                        {testimonials[activeTestimonial].author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground mb-2">
                          {testimonials[activeTestimonial].author.split(' ')[0]}
                        </div>
                        <div className="text-foreground/60 text-sm">
                          Alumni Success Story
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8">
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeTestimonial === index
                          ? "bg-primary w-8"
                          : "bg-slate-300 hover:bg-primary/50"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevTestimonial}
                    className="p-3 rounded-2xl bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextTestimonial}
                    className="p-3 rounded-2xl bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              <div className="text-center mt-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                  <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
                  {isPaused ? 'Paused' : 'Auto-playing'}
                </div>
              </div>
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

        <section id="contact" className="container py-20 bg-white">
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
              <UserGroupIcon className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Get In Touch</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
              Start Your Journey Today
            </h2>
            <p className="mt-6 text-xl text-foreground/70 max-w-2xl mx-auto">
              Reach out to us for more information about our services and training programs.
              Let's build your success story together.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10"
          >
            <ContactForm />
          </motion.div>
        </section>
      </div>
    </Layout>
  );
}