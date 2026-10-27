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
    EyeIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon
} from "@heroicons/react/24/outline";
import PosterTemplates from "../components/site/PosterTemplates";
import HorizontalSlider from "@/components/site/HorizontalSlider";
import InternshipPoster from "@/components/site/InternshipPoster";

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
        <InternshipPoster />
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
        <section id="testimonials" className="py-14 bg-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-3xl text-center mb-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
                className="eyebrow mb-4"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Success Stories</span>
              </motion.div>

              <h2 className="section-title">
                What Our Students Say
              </h2>
              <p className="section-lead max-w-2xl mx-auto">
                Real stories from our alumni who transformed their careers with Skill Training Center
              </p>
            </motion.div>

            <div
              className="relative max-w-5xl mx-auto"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden border border-border">
                <div className="grid lg:grid-cols-[1.4fr_1fr]">
                  <div className="p-6 md:p-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTestimonial}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                        className="h-full flex flex-col justify-center"
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                          <ChatBubbleLeftRightIcon className="w-5 h-5 text-primary" />
                        </div>

                        <div className="flex gap-0.5 mb-4">
                          {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                            <StarIcon key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>

                        <blockquote className="text-base md:text-lg text-foreground/80 leading-relaxed mb-6">
                          "{testimonials[activeTestimonial].quote}"
                        </blockquote>

                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 shrink-0 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
                            {testimonials[activeTestimonial].author.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">
                              {testimonials[activeTestimonial].author}
                            </div>
                            <div className="text-sm text-foreground/60">
                              {testimonials[activeTestimonial].role} at {testimonials[activeTestimonial].company}
                            </div>
                            <div className="text-primary font-medium text-xs mt-0.5">
                              Completed: {testimonials[activeTestimonial].course}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-5">
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

                  <div className="hidden lg:flex bg-gradient-to-br from-primary/5 to-fuchsia-500/5 p-8 items-center justify-center border-l border-border">
                    <motion.div
                      key={activeTestimonial}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <div className="w-28 h-28 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-fuchsia-600 flex items-center justify-center text-white text-4xl font-bold shadow-md">
                        {testimonials[activeTestimonial].author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-foreground mb-1">
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

              <div className="flex items-center justify-between mt-5">
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToTestimonial(index)}
                      aria-label={`Show testimonial ${index + 1}`}
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        activeTestimonial === index
                          ? "bg-primary w-6"
                          : "bg-slate-300 hover:bg-primary/50"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevTestimonial}
                    aria-label="Previous testimonial"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-border shadow-sm hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextTestimonial}
                    aria-label="Next testimonial"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-border shadow-sm hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="text-center mt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs">
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
              className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto"
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
                  className="text-center px-4 py-4 rounded-xl bg-white border border-border"
                >
                  <div className="text-xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-xs text-foreground/60 mt-0.5">{stat.label}</div>
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