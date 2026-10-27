// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Layout from "@/components/site/Layout";
// import {
//   SparklesIcon,
//   CalendarIcon,
//   ClockIcon,
//   UserIcon,
//   TagIcon,
//   ArrowRightIcon,
//   EyeIcon,
//   ShareIcon,
//   BookOpenIcon,
//   ChatBubbleLeftRightIcon
// } from "@heroicons/react/24/outline";

// // Blog posts data with more details
// const posts = [
//   {
//     id: 1,
//     title: "How to Prepare for Coding Interviews in 2025",
//     date: "2025-01-15",
//     readTime: "8 min read",
//     author: "Arjun Patel",
//     excerpt: "Master the art of technical interviews with our comprehensive guide covering data structures, system design, and behavioral questions.",
//     category: "Interview Prep",
//     tags: ["Coding", "Interview", "Career"],
//     image: "/blog/interview-prep.jpg",
//     content: `
//       <h2>Mastering Technical Interviews</h2>
//       <p>Technical interviews can be daunting, but with the right preparation, you can confidently tackle any challenge that comes your way.</p>
      
//       <h3>Data Structures & Algorithms</h3>
//       <p>Focus on mastering core data structures like arrays, linked lists, trees, and graphs. Practice common algorithm patterns including:</p>
//       <ul>
//         <li>Two-pointer technique</li>
//         <li>Sliding window</li>
//         <li>Depth-first search</li>
//         <li>Breadth-first search</li>
//         <li>Dynamic programming</li>
//       </ul>

//       <h3>System Design Fundamentals</h3>
//       <p>For senior roles, system design becomes crucial. Understand:</p>
//       <ul>
//         <li>Scalability principles</li>
//         <li>Database design</li>
//         <li>Caching strategies</li>
//         <li>Load balancing</li>
//       </ul>

//       <h3>Behavioral Questions</h3>
//       <p>Prepare STAR (Situation, Task, Action, Result) stories for common behavioral questions.</p>
//     `
//   },
//   {
//     id: 2,
//     title: "Top Frontend Tools and Libraries Shaping 2025",
//     date: "2025-02-10",
//     readTime: "6 min read",
//     author: "Priya Sharma",
//     excerpt: "Explore the cutting-edge tools and frameworks that are revolutionizing frontend development this year.",
//     category: "Frontend",
//     tags: ["React", "Tools", "Innovation"],
//     image: "/blog/frontend-tools.jpg",
//     content: `
//       <h2>The Future of Frontend Development</h2>
//       <p>Frontend development continues to evolve at a rapid pace. Here are the tools you need to master in 2025.</p>

//       <h3>Framework Innovations</h3>
//       <p><strong>React 19+</strong> brings concurrent features and improved server components.</p>
//       <p><strong>Vue 3.4</strong> offers better TypeScript support and performance optimizations.</p>
//       <p><strong>Svelte 5</strong> introduces runes for reactive state management.</p>

//       <h3>Build Tools Revolution</h3>
//       <p><strong>Vite 5</strong> continues to lead with lightning-fast builds and excellent developer experience.</p>
//       <p><strong>Turbopack</strong> from the Next.js team offers incremental bundling.</p>

//       <h3>Smart Developer Tooling</h3>
//       <p>Modern code-completion tools like GitHub Copilot and Amazon CodeWhisperer are becoming essential for productivity.</p>
//     `
//   },
//   {
//     id: 3,
//     title: "The Rise of Personalized Learning in Education",
//     date: "2025-01-28",
//     readTime: "10 min read",
//     author: "Dr. Rajesh Kumar",
//     excerpt: "Discover how personalized learning technology is transforming the education sector.",
//     category: "EdTech",
//     tags: ["EdTech", "Education", "Innovation"],
//     image: "/blog/personalized-learning.jpg",
//     content: `
//       <h2>The Personalized Learning Revolution</h2>
//       <p>Modern learning platforms are transforming how we teach, learn, and assess educational outcomes.</p>

//       <h3>Personalized Learning Paths</h3>
//       <p>Adaptive learning platforms analyze student performance to create customized learning journeys.</p>

//       <h3>Smart Tutoring Systems</h3>
//       <p>24/7 digital tutoring platforms provide instant feedback and guidance to students.</p>

//       <h3>Automated Assessment</h3>
//       <p>Data-driven evaluation tools can assess complex assignments and provide detailed feedback.</p>
//     `
//   },
//   {
//     id: 4,
//     title: "Mastering Python for Data Science",
//     date: "2025-01-20",
//     readTime: "12 min read",
//     author: "Neha Gupta",
//     excerpt: "Comprehensive guide to Python libraries and techniques for effective data analysis and machine learning.",
//     category: "Data Science",
//     tags: ["Python", "Data Science", "ML"],
//     image: "/blog/python-ds.jpg",
//     content: `
//       <h2>Python for Data Professionals</h2>
//       <p>Python remains the language of choice for data science. Here's how to master it.</p>

//       <h3>Essential Libraries</h3>
//       <p><strong>Pandas</strong> for data manipulation and analysis.</p>
//       <p><strong>NumPy</strong> for numerical computing.</p>
//       <p><strong>Matplotlib & Seaborn</strong> for data visualization.</p>

//       <h3>Machine Learning with Scikit-learn</h3>
//       <p>Comprehensive guide to implementing ML algorithms.</p>
//     `
//   }
// ];

// export default function Blog() {
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [activeCategory, setActiveCategory] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");

//   // Get unique categories
//   const categories = ["all", ...new Set(posts.map(post => post.category))];

//   // Filter posts based on category and search
//   const filteredPosts = posts.filter(post => {
//     const matchesCategory = activeCategory === "all" || post.category === activeCategory;
//     const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
//     return matchesCategory && matchesSearch;
//   });

//   return (
//     <Layout>
//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 -z-10 overflow-hidden">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 1 }}
//           className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-full blur-3xl"
//         />
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 1, delay: 0.2 }}
//           className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-600/20 to-primary/20 rounded-full blur-3xl"
//         />
//       </div>

//       <section className="container py-20 relative">
//         {/* Hero Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="mx-auto max-w-4xl text-center mb-16"
//         >
//           <motion.div
//             initial={{ opacity: 0, scale: 0.5 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.2, type: "spring" }}
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
//           >
//             <BookOpenIcon className="w-4 h-4 text-primary" />
//             <span className="text-sm font-semibold text-primary">Knowledge Hub</span>
//           </motion.div>

//           <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
//             Blog & Insights
//           </h1>
//           <p className="mt-6 text-xl text-foreground/70 max-w-2xl mx-auto">
//             Latest updates, tutorials, and industry insights from our expert team.
//             <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-semibold"> Stay ahead in your learning journey.</span>
//           </p>
//         </motion.div>

//         {/* Search and Filter Bar */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="max-w-4xl mx-auto mb-12"
//         >
//           <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
//             {/* Search Bar */}
//             <div className="relative flex-1 max-w-2xl w-full">
//               <input
//                 type="text"
//                 placeholder="Search articles, topics, or tags..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-12 pr-4 py-4 rounded-2xl bg-background/50 border border-border/30 backdrop-blur-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
//               />
//               {/* <SparklesIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" /> */}
//             </div>

//             {/* Category Filter */}
//             <div className="flex flex-wrap gap-2">
//               {categories.map((category) => (
//                 <motion.button
//                   key={category}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setActiveCategory(category)}
//                   className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${activeCategory === category
//                       ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/25"
//                       : "bg-background/50 border border-border/30 text-foreground/70 hover:border-primary/30"
//                     }`}
//                 >
//                   {category === "all" ? "All Topics" : category}
//                 </motion.button>
//               ))}
//             </div>
//           </div>
//         </motion.div>

//         {/* Blog Posts Grid */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.6 }}
//           className="max-w-6xl mx-auto"
//         >
//           {filteredPosts.length > 0 ? (
//             <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//               {filteredPosts.map((post, index) => (
//                 <motion.article
//                   key={post.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.8 + index * 0.1 }}
//                   whileHover={{ y: -8, scale: 1.02 }}
//                   className="group relative rounded-2xl bg-gradient-to-br from-background to-muted/20 p-6 border border-border/50 overflow-hidden backdrop-blur-sm cursor-pointer"
//                   onClick={() => setSelectedPost(post)}
//                 >
//                   {/* Animated Background Glow */}
//                   <motion.div
//                     whileHover={{ opacity: 1 }}
//                     className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-600/10 opacity-0 rounded-2xl pointer-events-none transition-all duration-500"
//                   />

//                   {/* Category Badge */}
//                   <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
//                     <TagIcon className="w-3 h-3" />
//                     {post.category}
//                   </div>

//                   {/* Post Image Placeholder */}
//                   <div className="w-full h-48 rounded-xl bg-gradient-to-br from-primary/20 to-purple-600/20 mb-4 flex items-center justify-center">
//                     <BookOpenIcon className="w-12 h-12 text-primary/40" />
//                   </div>

//                   <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:text-primary transition-colors duration-300">
//                     {post.title}
//                   </h3>

//                   <p className="mt-3 text-foreground/70 text-sm leading-relaxed">
//                     {post.excerpt}
//                   </p>

//                   {/* Meta Information */}
//                   <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
//                     <div className="flex items-center gap-4">
//                       <div className="flex items-center gap-1">
//                         <CalendarIcon className="w-3 h-3" />
//                         {new Date(post.date).toLocaleDateString()}
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <ClockIcon className="w-3 h-3" />
//                         {post.readTime}
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <UserIcon className="w-3 h-3" />
//                       {post.author}
//                     </div>
//                   </div>

//                   {/* Tags */}
//                   <div className="mt-4 flex flex-wrap gap-1">
//                     {post.tags.map((tag, tagIndex) => (
//                       <span
//                         key={tagIndex}
//                         className="px-2 py-1 bg-primary/5 text-primary rounded-full text-xs"
//                       >
//                         #{tag}
//                       </span>
//                     ))}
//                   </div>

//                   {/* Read More Arrow */}
//                   <motion.div
//                     whileHover={{ x: 4 }}
//                     className="mt-4 flex items-center gap-1 text-primary font-semibold text-sm"
//                   >
//                     <span>Read More</span>
//                     <ArrowRightIcon className="w-4 h-4" />
//                   </motion.div>
//                 </motion.article>
//               ))}
//             </div>
//           ) : (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-center py-16"
//             >
//               <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
//                 <BookOpenIcon className="w-10 h-10 text-muted-foreground" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">No articles found</h3>
//               <p className="text-muted-foreground mb-6">
//                 Try adjusting your search or filter to find what you're looking for.
//               </p>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => {
//                   setSearchTerm("");
//                   setActiveCategory("all");
//                 }}
//                 className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-semibold"
//               >
//                 Clear filters
//               </motion.button>
//             </motion.div>
//           )}
//         </motion.div>

//         {/* CTA Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ delay: 1 }}
//           className="text-center mt-20"
//         >
//           <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-purple-600/10 to-transparent border border-primary/20 p-12 backdrop-blur-sm">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               Stay Updated with Latest Trends
//             </h2>
//             <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
//               Subscribe to our newsletter and never miss an update on the latest in technology and education.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="flex-1 px-4 py-3 rounded-xl bg-background/50 border border-border/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
//               />
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-semibold shadow-lg shadow-primary/25"
//               >
//                 Subscribe
//               </motion.button>
//             </div>
//           </div>
//         </motion.div>
//       </section>

//       {/* Blog Post Modal */}
//       <AnimatePresence>
//         {selectedPost && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setSelectedPost(null)}
//           >
//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               className="relative max-w-4xl max-h-[90vh] bg-background rounded-3xl overflow-hidden"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Modal Header */}
//               <div className="relative p-8 border-b border-border/30">
//                 <button
//                   onClick={() => setSelectedPost(null)}
//                   className="absolute top-6 right-6 p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
//                 >
//                   <ArrowRightIcon className="w-5 h-5 rotate-45" />
//                 </button>

//                 <div className="flex items-center gap-2 mb-4">
//                   <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
//                     {selectedPost.category}
//                   </span>
//                   <span className="text-sm text-muted-foreground">{selectedPost.date}</span>
//                 </div>

//                 <h2 className="text-3xl font-bold text-foreground mb-4">
//                   {selectedPost.title}
//                 </h2>

//                 <div className="flex items-center gap-6 text-sm text-muted-foreground">
//                   <div className="flex items-center gap-2">
//                     <UserIcon className="w-4 h-4" />
//                     {selectedPost.author}
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <ClockIcon className="w-4 h-4" />
//                     {selectedPost.readTime}
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <EyeIcon className="w-4 h-4" />
//                     1.2k views
//                   </div>
//                 </div>
//               </div>

//               {/* Modal Content */}
//               <div className="p-8 overflow-y-auto max-h-[60vh]">
//                 <div
//                   className="prose prose-lg max-w-none"
//                   dangerouslySetInnerHTML={{ __html: selectedPost.content }}
//                 />
//               </div>

//               {/* Modal Footer */}
//               <div className="p-8 border-t border-border/30">
//                 <div className="flex items-center justify-between">
//                   <div className="flex flex-wrap gap-2">
//                     {selectedPost.tags.map((tag, index) => (
//                       <span
//                         key={index}
//                         className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
//                       >
//                         #{tag}
//                       </span>
//                     ))}
//                   </div>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-semibold"
//                   >
//                     <ShareIcon className="w-4 h-4" />
//                     Share
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </Layout>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/site/Layout";
import {
  ArrowRightIcon,
  BookOpenIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  ShareIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

type Post = {
  id: number;
  title: string;
  date: string;
  readTime: string;
  author: string;
  excerpt: string;
  category: string;
  tags: string[];
  image: string;
  content: string;
};

// Royalty-free photos (Unsplash). For production, download them into
// /public/blog and point `image` at the local file for faster, safer loading.
const photo = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const posts: Post[] = [
  {
    id: 1,
    title: "How to Prepare for Coding Interviews in 2025",
    date: "2025-01-15",
    readTime: "8 min read",
    author: "Arjun Patel",
    excerpt:
      "Master the art of technical interviews with our comprehensive guide covering data structures, system design, and behavioral questions.",
    category: "Interview Prep",
    tags: ["Coding", "Interview", "Career"],
    image: photo("1573496359142-b8d87734a5a2"),
    content: `
      <h2>Mastering Technical Interviews</h2>
      <p>Technical interviews can be daunting, but with the right preparation, you can confidently tackle any challenge that comes your way.</p>

      <h3>Data Structures & Algorithms</h3>
      <p>Focus on mastering core data structures like arrays, linked lists, trees, and graphs. Practice common algorithm patterns including:</p>
      <ul>
        <li>Two-pointer technique</li>
        <li>Sliding window</li>
        <li>Depth-first search</li>
        <li>Breadth-first search</li>
        <li>Dynamic programming</li>
      </ul>

      <h3>System Design Fundamentals</h3>
      <p>For senior roles, system design becomes crucial. Understand:</p>
      <ul>
        <li>Scalability principles</li>
        <li>Database design</li>
        <li>Caching strategies</li>
        <li>Load balancing</li>
      </ul>

      <h3>Behavioral Questions</h3>
      <p>Prepare STAR (Situation, Task, Action, Result) stories for common behavioral questions.</p>
    `,
  },
  {
    id: 2,
    title: "Top Frontend Tools and Libraries Shaping 2025",
    date: "2025-02-10",
    readTime: "6 min read",
    author: "Priya Sharma",
    excerpt:
      "Explore the cutting-edge tools and frameworks that are revolutionizing frontend development this year.",
    category: "Frontend",
    tags: ["React", "Tools", "Innovation"],
    image: photo("1498050108023-c5249f4df085"),
    content: `
      <h2>The Future of Frontend Development</h2>
      <p>Frontend development continues to evolve at a rapid pace. Here are the tools you need to master in 2025.</p>

      <h3>Framework Innovations</h3>
      <p><strong>React 19+</strong> brings concurrent features and improved server components.</p>
      <p><strong>Vue 3.4</strong> offers better TypeScript support and performance optimizations.</p>
      <p><strong>Svelte 5</strong> introduces runes for reactive state management.</p>

      <h3>Build Tools Revolution</h3>
      <p><strong>Vite 5</strong> continues to lead with lightning-fast builds and excellent developer experience.</p>
      <p><strong>Turbopack</strong> from the Next.js team offers incremental bundling.</p>

      <h3>Smart Developer Tooling</h3>
      <p>Modern code-completion tools like GitHub Copilot and Amazon CodeWhisperer are becoming essential for productivity.</p>
    `,
  },
  {
    id: 3,
    title: "The Rise of Personalized Learning in Education",
    date: "2025-01-28",
    readTime: "10 min read",
    author: "Dr. Rajesh Kumar",
    excerpt:
      "Discover how personalized learning technology is transforming the education sector.",
    category: "EdTech",
    tags: ["EdTech", "Education", "Innovation"],
    image: photo("1522202176988-66273c2fd55f"),
    content: `
      <h2>The Personalized Learning Revolution</h2>
      <p>Modern learning platforms are transforming how we teach, learn, and assess educational outcomes.</p>

      <h3>Personalized Learning Paths</h3>
      <p>Adaptive learning platforms analyze student performance to create customized learning journeys.</p>

      <h3>Smart Tutoring Systems</h3>
      <p>24/7 digital tutoring platforms provide instant feedback and guidance to students.</p>

      <h3>Automated Assessment</h3>
      <p>Data-driven evaluation tools can assess complex assignments and provide detailed feedback.</p>
    `,
  },
  {
    id: 4,
    title: "Mastering Python for Data Science",
    date: "2025-01-20",
    readTime: "12 min read",
    author: "Neha Gupta",
    excerpt:
      "Comprehensive guide to Python libraries and techniques for effective data analysis and machine learning.",
    category: "Data Science",
    tags: ["Python", "Data Science", "ML"],
    image: photo("1551288049-bebda4e38f71"),
    content: `
      <h2>Python for Data Professionals</h2>
      <p>Python remains the language of choice for data science. Here's how to master it.</p>

      <h3>Essential Libraries</h3>
      <p><strong>Pandas</strong> for data manipulation and analysis.</p>
      <p><strong>NumPy</strong> for numerical computing.</p>
      <p><strong>Matplotlib & Seaborn</strong> for data visualization.</p>

      <h3>Machine Learning with Scikit-learn</h3>
      <p>Comprehensive guide to implementing ML algorithms.</p>
    `,
  },
  {
    id: 5,
    title: "Building a Portfolio That Gets You Hired",
    date: "2025-03-05",
    readTime: "7 min read",
    author: "Priya Sharma",
    excerpt:
      "Learn which projects to showcase, how to present them, and what recruiters actually look for in a fresher's portfolio.",
    category: "Career Growth",
    tags: ["Portfolio", "Projects", "Career"],
    image: photo("1488190211105-8b0e65b80b4e"),
    content: `
      <h2>Show Your Work, Not Just Your Resume</h2>
      <p>A strong portfolio proves you can build real things. Recruiters spend seconds scanning it, so make every project count.</p>

      <h3>Pick Quality Over Quantity</h3>
      <ul>
        <li>3–4 polished projects beat 10 half-finished ones</li>
        <li>Solve a real problem, even a small one</li>
        <li>Include at least one full-stack or end-to-end project</li>
      </ul>

      <h3>Present Each Project Well</h3>
      <p>Add a short problem statement, the tech stack, your role, a live demo link and the source code. Screenshots help a lot.</p>

      <h3>Keep It Alive</h3>
      <p>Update your portfolio regularly and write short case studies about what you learned.</p>
    `,
  },
  {
    id: 6,
    title: "Cloud Computing Roadmap for Beginners",
    date: "2025-02-24",
    readTime: "9 min read",
    author: "Arjun Patel",
    excerpt:
      "A practical, step-by-step path from cloud fundamentals to deploying your first scalable application.",
    category: "Cloud",
    tags: ["Cloud", "DevOps", "Deployment"],
    image: photo("1558494949-ef010cbdcc31"),
    content: `
      <h2>Start Your Cloud Journey</h2>
      <p>Cloud skills are among the most in-demand in the industry. Here is a simple order to learn them in.</p>

      <h3>1. Fundamentals</h3>
      <p>Understand servers, networking, storage and the difference between IaaS, PaaS and SaaS.</p>

      <h3>2. Pick One Provider</h3>
      <p>Start with AWS, Azure or Google Cloud and learn its core compute, storage and database services.</p>

      <h3>3. Deploy Something Real</h3>
      <p>Host a small web app, add a database and set up a simple CI/CD pipeline.</p>
    `,
  },
  {
    id: 7,
    title: "7 Habits to Learn Programming Faster",
    date: "2025-03-18",
    readTime: "5 min read",
    author: "Neha Gupta",
    excerpt:
      "Small, consistent habits that help beginners move from tutorials to writing confident, working code.",
    category: "Programming",
    tags: ["Learning", "Habits", "Beginners"],
    image: photo("1461749280684-dccba630e2f6"),
    content: `
      <h2>Learn Smarter, Not Just Longer</h2>
      <p>Consistency beats intensity. These habits make every hour of practice count.</p>

      <h3>The Habits</h3>
      <ul>
        <li>Code a little every day</li>
        <li>Build projects instead of only watching tutorials</li>
        <li>Read other people's code</li>
        <li>Debug patiently and learn to read error messages</li>
        <li>Explain concepts out loud or in writing</li>
        <li>Use version control from day one</li>
        <li>Ask questions and join a learning community</li>
      </ul>
    `,
  },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const initials = (name: string) =>
  name
    .replace(/^Dr\.?\s+/i, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const fallbackGradients = [
  "from-blue-200 to-indigo-300",
  "from-indigo-200 to-violet-300",
  "from-violet-200 to-purple-300",
  "from-sky-200 to-indigo-300",
];

/** Photo with graceful gradient fallback if the image fails to load. */
function BlogImage({
  src,
  alt,
  seed,
  className = "",
}: {
  src: string;
  alt: string;
  seed: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br ${
          fallbackGradients[seed % fallbackGradients.length]
        } ${className}`}
      >
        <BookOpenIcon className="h-10 w-10 text-white/80" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-[11px] font-bold text-white shadow-sm"
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [],
  );

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(sortedPosts.map((p) => p.category)))],
    [sortedPosts],
  );

  const countFor = (cat: string) =>
    cat === "all"
      ? sortedPosts.length
      : sortedPosts.filter((p) => p.category === cat).length;

  const filteredPosts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return sortedPosts.filter((post) => {
      const matchesCategory =
        activeCategory === "all" || post.category === activeCategory;
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [sortedPosts, activeCategory, searchTerm]);

  // Spotlight the newest article only when browsing everything
  const isBrowsingAll = activeCategory === "all" && !searchTerm.trim();
  const featured = isBrowsingAll ? filteredPosts[0] : undefined;
  const gridPosts = featured ? filteredPosts.slice(1) : filteredPosts;

  // Modal: lock page scroll + close on Escape
  useEffect(() => {
    if (!selectedPost) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPost(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedPost]);

  const clearFilters = () => {
    setSearchTerm("");
    setActiveCategory("all");
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: connect to your newsletter / backend endpoint
    setSubscribed(true);
    setEmail("");
  };

  const handleShare = async (post: Post) => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.excerpt, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* share cancelled – nothing to do */
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-b from-[#eef2ff] via-[#f5f3ff] to-white">
        {/* ============================ HERO ============================ */}
        <section
          aria-labelledby="blog-hero-heading"
          className="relative overflow-hidden"
        >
          <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
          <div className="pointer-events-none absolute -top-16 right-0 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-96 -translate-x-1/2 rounded-full bg-pink-200/30 blur-3xl" />

          <div className="container relative pt-14 pb-20 text-center md:pt-20 md:pb-24">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 shadow-sm backdrop-blur"
            >
              <BookOpenIcon className="h-4 w-4" aria-hidden="true" />
              Knowledge Hub
            </motion.span>

            <motion.h1
              id="blog-hero-heading"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              Insights to power your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                learning journey
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg"
            >
              Tutorials, career guides and industry trends from our trainers —
              everything you need to learn, build and grow.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mx-auto mt-8 max-w-2xl"
            >
              <label htmlFor="blog-search" className="sr-only">
                Search articles
              </label>
              <div className="group relative">
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500"
                  aria-hidden="true"
                />
                <input
                  id="blog-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles, topics, authors or tags…"
                  className="w-full rounded-2xl border border-indigo-100 bg-white py-4 pl-14 pr-12 text-sm text-slate-800 shadow-lg shadow-indigo-500/10 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 sm:text-base"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="mt-3 text-xs font-medium text-slate-500">
                {posts.length} articles · {categories.length - 1} topics · new
                reads every week
              </p>
            </motion.div>
          </div>
        </section>

        {/* ========================= FILTERS + POSTS ========================= */}
        <section className="container -mt-8 pb-16 md:pb-20">
          {/* Category filters */}
          <div
            role="group"
            aria-label="Filter articles by category"
            className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2"
          >
            {categories.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-indigo-500/25"
                      : "border border-indigo-100 bg-white text-slate-600 shadow-sm hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
                >
                  {category === "all" ? "All Topics" : category}
                  <span
                    className={`rounded-full px-1.5 text-[11px] font-bold ${
                      active
                        ? "bg-white/25 text-white"
                        : "bg-indigo-50 text-indigo-500"
                    }`}
                  >
                    {countFor(category)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mx-auto mt-10 max-w-6xl">
            {filteredPosts.length > 0 ? (
              <>
                <div className="mb-5 flex items-end justify-between">
                  <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
                    {isBrowsingAll ? "Latest articles" : "Results"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {filteredPosts.length}{" "}
                    {filteredPosts.length === 1 ? "article" : "articles"}
                  </p>
                </div>

                {/* Featured article */}
                {featured && (
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => setSelectedPost(featured)}
                    className="group mb-8 grid cursor-pointer overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 lg:grid-cols-[1.05fr_1fr]"
                  >
                    <div className="relative h-56 overflow-hidden sm:h-72 lg:h-auto lg:min-h-[320px]">
                      <BlogImage
                        src={featured.image}
                        alt={featured.title}
                        seed={featured.id}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/30 to-transparent" />
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-indigo-600 shadow">
                        <SparklesIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        Featured
                      </span>
                    </div>

                    <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                      <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
                        {featured.category}
                      </span>
                      <h3 className="mt-4 text-2xl font-extrabold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-indigo-700 sm:text-3xl">
                        {featured.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                        {featured.excerpt}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Avatar name={featured.author} />
                          {featured.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          {formatDate(featured.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          {featured.readTime}
                        </span>
                      </div>

                      <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/30">
                        Read article
                        <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </motion.article>
                )}

                {/* Article grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {gridPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: Math.min(index, 5) * 0.06 }}
                      onClick={() => setSelectedPost(post)}
                      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <BlogImage
                          src={post.image}
                          alt={post.title}
                          seed={post.id}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/25 via-transparent to-transparent" />
                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-indigo-600 shadow-sm">
                          {post.category}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-3.5 w-3.5" aria-hidden="true" />
                            {formatDate(post.date)}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span className="flex items-center gap-1">
                            <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
                            {post.readTime}
                          </span>
                        </div>

                        <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-indigo-700">
                          {post.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                          {post.excerpt}
                        </p>

                        <div className="mt-auto pt-5">
                          <div className="flex items-center justify-between border-t border-indigo-50 pt-4">
                            <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                              <Avatar name={post.author} />
                              {post.author}
                            </span>
                            <span className="flex items-center gap-1 text-sm font-bold text-indigo-600">
                              Read
                              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-dashed border-indigo-200 bg-white/70 px-6 py-16 text-center"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
                  <MagnifyingGlassIcon className="h-7 w-7 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No articles found</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
                  Try a different keyword or pick another topic to find what
                  you're looking for.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition-shadow hover:shadow-lg"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </div>

          {/* ========================= NEWSLETTER CTA ========================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto mt-14 max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-6 py-8 text-white shadow-xl shadow-indigo-500/20 md:px-10 md:py-9"
          >
            <div className="pointer-events-none absolute -right-10 -top-16 h-52 w-52 rounded-full bg-pink-400/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 left-10 h-44 w-44 rounded-full bg-blue-300/25 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:flex">
                  <EnvelopeIcon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-xl font-extrabold md:text-2xl">
                    Get fresh insights in your inbox
                  </h2>
                  <p className="mt-1 text-sm text-indigo-100">
                    One short email a week. No spam — unsubscribe anytime.
                  </p>
                </div>
              </div>

              {subscribed ? (
                <div
                  role="status"
                  className="flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold"
                >
                  <CheckCircleIcon className="h-5 w-5 text-green-300" aria-hidden="true" />
                  You're subscribed — thank you!
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-md"
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/95 px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:ring-4 focus:ring-white/30"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </section>
      </div>

      {/* =========================== ARTICLE MODAL =========================== */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={() => setSelectedPost(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selectedPost.title}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
            >
              <div className="relative h-44 shrink-0 sm:h-60">
                <BlogImage
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  seed={selectedPost.id}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/60 via-indigo-950/10 to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  aria-label="Close article"
                  className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-slate-700 shadow transition-all hover:scale-105 hover:bg-white"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
                <span className="absolute bottom-4 left-5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-indigo-600">
                  {selectedPost.category}
                </span>
              </div>

              <div className="overflow-y-auto p-6 sm:p-8">
                <h2 className="text-2xl font-extrabold leading-snug text-slate-900 sm:text-3xl">
                  {selectedPost.title}
                </h2>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                  <span className="flex items-center gap-2 font-semibold text-slate-700">
                    <Avatar name={selectedPost.author} />
                    {selectedPost.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="h-4 w-4" aria-hidden="true" />
                    {formatDate(selectedPost.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ClockIcon className="h-4 w-4" aria-hidden="true" />
                    {selectedPost.readTime}
                  </span>
                </div>

                <div
                  className="mt-6 text-[15px] leading-relaxed text-slate-600
                    [&_h2]:mb-3 [&_h2]:mt-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900
                    [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-indigo-700
                    [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-slate-800
                    [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_li]:marker:text-indigo-400"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-indigo-50 pt-5">
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleShare(selectedPost)}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 transition-colors hover:bg-indigo-100"
                  >
                    <ShareIcon className="h-4 w-4" aria-hidden="true" />
                    {copied ? "Link copied!" : "Share"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}