import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Enroll from "./pages/Enroll";
import OnlineTraining from "./pages/OnlineTraining";
import ClassroomTraining from "./pages/ClassroomTraining";
import CorporateTraining from "./pages/CorporateTraining";
import Placements from "./pages/Placements";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PlaceholderPage from "./pages/PlaceholderPage";
import ScrollToTop from "./components/ScrollToTop"
import Overseas from "@/pages/Overseas";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>

    <TooltipProvider>

      <Toaster />
      <Sonner />

      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/enroll/:id" element={<Enroll />} />
          <Route path="/online-training" element={<OnlineTraining />} />
          <Route path="/classroom-training" element={<ClassroomTraining />} />
          <Route path="/corporate-training" element={<CorporateTraining />} />
          <Route path="/overseas" element={<Overseas />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/portal" element={<PlaceholderPage title="Student Portal" description="Login and access your dashboard." />} />
          <Route path="/admin" element={<PlaceholderPage title="Admin Dashboard" description="Manage courses, students, and enquiries." />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
