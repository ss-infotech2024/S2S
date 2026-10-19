import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Courses from "./pages/Courses";
import MyEnrollments from "./pages/MyEnrollments";
import CourseDetails from "./pages/CourseDetails";
import Enroll from "./pages/Enroll";
import OnlineTraining from "./pages/OnlineTraining";
import ClassroomTraining from "./pages/ClassroomTraining";
import CorporateTraining from "./pages/CorporateTraining";
import Placements from "./pages/Placements";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import PlaceholderPage from "./pages/PlaceholderPage";
import ScrollToTop from "./components/ScrollToTop"
import Overseas from "@/pages/Overseas";
import SetPassword from "./pages/SetPassword";
import ProtectedStudentRoute from "./components/ProtectedStudentRoute";
import StudentDashboard from "./pages/StudentDashboard";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>

    <TooltipProvider>

      <Toaster />
      <Sonner />

      <BrowserRouter>
        <ScrollToTop />
        
<Routes>
  {/* Login and Register must remain accessible without login */}
  <Route path="/login" element={<Auth />} />
  <Route path="/register" element={<Auth />} />

  {/* Student-facing pages require login */}
 <Route path="/" element={<Index />} />

  <Route
    path="/courses"
    element={
      <ProtectedStudentRoute>
        <Courses />
      </ProtectedStudentRoute>
    }
  />

  <Route
    path="/my-enrollments"
    element={
      <ProtectedStudentRoute>
        <MyEnrollments />
      </ProtectedStudentRoute>
    }
  />

  <Route
    path="/courses/:id"
    element={
      <ProtectedStudentRoute>
        <CourseDetails />
      </ProtectedStudentRoute>
    }
  />

  <Route
    path="/enroll/:id"
    element={
      <ProtectedStudentRoute>
        <Enroll />
      </ProtectedStudentRoute>
    }
  />

  <Route
    path="/online-training"
    element={
      <ProtectedStudentRoute>
        <OnlineTraining />
      </ProtectedStudentRoute>
    }
  />

  <Route
    path="/classroom-training"
    element={
      <ProtectedStudentRoute>
        <ClassroomTraining />
      </ProtectedStudentRoute>
    }
  />

  <Route
    path="/corporate-training"
    element={
      <ProtectedStudentRoute>
        <CorporateTraining />
      </ProtectedStudentRoute>
    }
  />

  <Route
    path="/overseas"
    element={
      <ProtectedStudentRoute>
        <Overseas />
      </ProtectedStudentRoute>
    }
  />

  <Route
    path="/placements"
    element={
      <ProtectedStudentRoute>
        <Placements />
      </ProtectedStudentRoute>
    }
  />

  <Route
    path="/blog"
    element={
      <ProtectedStudentRoute>
        <Blog />
      </ProtectedStudentRoute>
    }
  />

  <Route
    path="/about"
    element={
      <ProtectedStudentRoute>
        <About />
      </ProtectedStudentRoute>
    }
  />

  <Route
    path="/contact"
    element={
      <ProtectedStudentRoute>
        <Contact />
      </ProtectedStudentRoute>
    }
  />

  <Route
    path="/student-dashboard"
    element={
      <ProtectedStudentRoute>
        <StudentDashboard />
      </ProtectedStudentRoute>
    }
  />

  {/* Existing special routes */}
  <Route path="/portal" element={<Navigate to="/login" replace />} />

  <Route
    path="/admin"
    element={
      <PlaceholderPage
        title="Admin Dashboard"
        description="Manage courses, students, and enquiries."
      />
    }
  />

  <Route path="/set-password" element={<SetPassword />} />

  <Route path="*" element={<NotFound />} />
</Routes>

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
