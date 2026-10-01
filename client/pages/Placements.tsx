import usePageMeta from "@/hooks/use-page-meta";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Building,
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  Star,
  TrendingUp,
  Award,
  Briefcase,
  GraduationCap,
  Target,
  FileText,
  ArrowRight,
  IndianRupee,
  Search,
  X,
  Phone,
  Mail,
} from "lucide-react";
import Header from "@/components/site/Header";
import { useMemo } from "react";
import Footer from "@/components/site/Footer";

// Professional testimonials data
const testimonials = [
  {
    id: 1,
    quote: "The instructors are top-notch and the curriculum is very practical. I landed a job just two months after completing the course!",
    author: "Niharika Sharma",

    rating: 5,
    avatar: "/Niharika.jpg",
    course: "Python + DSA",
    achievements: ["Got 3 job offers", "Salary increased by 200%", "Placed in 2 months"]
  },
  {
    id: 2,
    quote: "Skill Training Center's course gave me the skills and confidence I needed to switch my career. The projects were invaluable for my portfolio.",
    author: "Prateek Kumar",

    rating: 5,
    avatar: "/pratik.jpg",
    course: "Full Stack Development",
    achievements: ["Career switch successful", "Built 5+ real projects", "Mentorship support"]
  },
  {
    id: 3,
    quote: "Hands-on learning and personalized attention made all the difference. Highly recommend this course to anyone serious about data analysis.",
    author: "Raj Borkar",

    rating: 5,
    avatar: "/Borkar.jpg",
    course: "AI-Data Analytics",
    achievements: ["Mastered ML algorithms", "Real-world case studies", "Industry ready skills"]
  },
  {
    id: 4,
    quote: "The projects were hands-on and very practical. I gained confidence in real-world data analysis and visualization techniques.",
    author: "Saloni Patel",

    rating: 5,
    avatar: "/girl.jpg",
    course: "Data Science",
    achievements: ["Data visualization expert", "Business insights skills", "Client project experience"]
  },
  {
    id: 5,
    quote: "The mentorship and guidance from Skill Training Center helped me grow faster than I expected. The career support was exceptional.",
    author: "Ajay Singh",

    rating: 5,
    avatar: "/beard.jpg",
    course: "Machine Learning",
    achievements: ["Advanced ML concepts", "Model deployment", "Research opportunities"]
  },
  {
    id: 6,
    quote: "The projects and real-life case studies really boosted my confidence. The interview preparation sessions were incredibly helpful.",
    author: "Meenal Gupta",

    rating: 5,
    avatar: "/Meenal.jpg",
    course: "AI-Data Analytics",
    achievements: ["Multiple job offers", "Confident in interviews", "Practical experience"]
  }
];

// Job listings data with added fields for filters - including jobs from images
const jobs = [

  // Jobs from images
  {
    id: 5,
    title: "Associate Band U1",
    company: "Tech Mahindra",
    location: "Pune, India",
    salary: "₹3.0 - 3.5 LPA",
    type: "Full-Time",
    postedAt: "2025-10-10T09:00:00Z",
    requirements: ["BE/BTECH/BCA/MCA ONLY", "Excellent Communication Skills", "Low MTI Parameter", "Flexible for 24/7 shifts"],
    skills: ["Communication", "Flexibility", "Technical Knowledge"],
    category: "IT Services",
    description: "Blended process role requiring excellent communication and flexibility for rotational shifts.",
    experience: "0-1 years",
    urgent: true,
    contact: "7719927774, 7720846048",
    eligibility: "BE/BTECH/BCA/MCA ONLY",
    interview: "Monday (Virtual)",
    workMode: "Work From Office"
  },
  {
    id: 6,
    title: "Manufacturing Plant Roles",
    company: "Leading Manufacturing Plant",
    location: "Ahmednagar, Maharashtra",
    salary: "₹18,000 - 25,000",
    type: "Full-Time",
    postedAt: "2025-10-09T11:00:00Z",
    requirements: ["ITI, Diploma/Degree", "Mechanical/Electrical/Electronics/Automobile", "12 Hours/Day"],
    skills: ["Production", "Maintenance", "Quality", "Testing"],
    category: "Manufacturing",
    description: "Multiple vacancies in production, maintenance, quality and testing departments for a leading manufacturing plant.",
    experience: "0-2 years",
    urgent: true,
    contact: "9422129534, 7719927774, 7720846048",
    vacancies: "6000+",
    profiles: ["Production", "Maintenance", "Quality", "Testing"],
    workingHours: "12 Hours/Day",
    gender: "Male & Female"
  },
  {
    id: 7,
    title: "Data Sorter",
    company: "Data Management Solutions",
    location: "Nagpur, Maharashtra",
    salary: "₹16,000 CTC",
    type: "Full-Time",
    postedAt: "2025-10-10T08:00:00Z",
    requirements: ["Any Graduate", "Good English (speaking & writing)", "Basic computer Excel/Google Sheets"],
    skills: ["Data Organization", "Attention to Detail", "Excel", "Record Keeping"],
    category: "Data Entry",
    description: "Non-technical role involving sorting and organizing data, checking for mistakes, and maintaining records.",
    experience: "0 years",
    urgent: true,
    contact: "7720846048, 7719927774",
    mindset: "Hard-working, Eager to learn",
    employmentType: "Full-Time"
  }
];

// Success stories data
const successStories = [
  {
    name: "Rahul Sharma",
    company: "Microsoft",
    package: "₹18.0 LPA",
    role: "Software Engineer",
    batch: "2023",
    program: "Full Stack Development",
    image: "/placeholder.svg",
    story: "SS Infotech's comprehensive training and mock interviews prepared me perfectly for Microsoft's rigorous interview process."
  },
  {
    name: "Priya Patel",
    company: "Google",
    package: "₹22.0 LPA",
    role: "Software Engineer",
    batch: "2023",
    program: "AI/ML",
    image: "/placeholder.svg",
    story: "The AI/ML program and placement guidance helped me crack Google's technical interviews and land my dream job."
  },
  {
    name: "Amit Kumar",
    company: "Amazon",
    package: "₹16.5 LPA",
    role: "Cloud Engineer",
    batch: "2023",
    program: "Cloud Computing",
    image: "/placeholder.svg",
    story: "The cloud computing specialization and industry projects made me stand out in Amazon's interview process."
  },
  {
    name: "Sneha Desai",
    company: "Flipkart",
    package: "₹12.0 LPA",
    role: "Frontend Developer",
    batch: "2024",
    program: "Web Development",
    image: "/placeholder.svg",
    story: "Excellent placement support and technical preparation helped me secure a great role at Flipkart."
  },
  {
    name: "Kiran Joshi",
    company: "Zomato",
    package: "₹10.5 LPA",
    role: "Full Stack Developer",
    batch: "2024",
    program: "Full Stack Development",
    image: "/placeholder.svg",
    story: "The comprehensive full-stack curriculum and placement training prepared me for success at Zomato."
  },
  {
    name: "Anita Singh",
    company: "Paytm",
    package: "₹11.0 LPA",
    role: "Data Scientist",
    batch: "2024",
    program: "AI/ML",
    image: "/placeholder.svg",
    story: "The practical approach to AI/ML and interview preparation helped me transition into a data science role."
  }
];

// Placed students (photo = 4:5 portrait). Add more entries here and cards appear automatically.
// NOTE: reviews are short placeholder messages — replace with each student's own words.
const placedStudents = [
  {
    name: "Manan Agrawal",
    company: "Mindcan Inc",
    package: "₹20 LPA",
    photo: "/img/students/manan-agrawal.jpg",
    rating: 5,
    review: "Practical training and real projects helped me crack my dream job.",
  },
  {
    name: "Shradha Alewar",
    company: "Tech Mahindra",
    package: "₹3.65 LPA",
    photo: "/img/students/shradha-alewar.jpg",
    rating: 5,
    review: "Great mentors and interview prep gave me the confidence to get placed.",
  },
];

const placementStats = [
  { label: "Placement Success Rate", value: "85%", icon: Target },
  { label: "Average Package", value: "₹6.2 LPA", icon: IndianRupee },
  { label: "Highest Package", value: "₹22.0 LPA", icon: TrendingUp },
  { label: "Partner Companies", value: "200+", icon: Building },
  { label: "Students Placed", value: "2500+", icon: Users },
  { label: "Average Hike", value: "150%", icon: Award }
];

const placementProcess = [
  {
    step: "1",
    title: "Pre-Placement Training",
    description: "Comprehensive training on aptitude, technical skills, and soft skills",
    duration: "2 weeks"
  },
  {
    step: "2",
    title: "Resume Building",
    description: "Professional resume creation and review by industry experts",
    duration: "3 days"
  },
  {
    step: "3",
    title: "Mock Interviews",
    description: "Practice sessions with HR, technical, and group discussion rounds",
    duration: "1 week"
  },
  {
    step: "4",
    title: "Company Registration",
    description: "Registration for placement drives based on eligibility and interest",
    duration: "Ongoing"
  },
  {
    step: "5",
    title: "Interview Process",
    description: "Actual company interviews with our support and guidance",
    duration: "As scheduled"
  },
  {
    step: "6",
    title: "Offer & Onboarding",
    description: "Offer negotiation support and onboarding assistance",
    duration: "Post-selection"
  }
];

// Time ago utility
function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;
  return "just now";
}

function JobApplicationModal({ job, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    education: "",
    specialization: "",
    aggregate: "",
    passoutYear: "",
    skills: "",
    experience: "",
    resume: null,
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleInputChange = (e) => {
    const { id, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [id]: files ? files[0] : value }));
    setSubmissionStatus(null);
  };

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.resume) {
      setSubmissionStatus("Please fill all required fields and upload a resume.");
      return;
    }

    if (formData.resume && (formData.resume.type !== "application/pdf" || formData.resume.size > 5 * 1024 * 1024)) {
      setSubmissionStatus("Please upload a PDF file smaller than 5MB.");
      return;
    }

    const message = `
*Job Application*
*Job Title*: ${job ? job.title : "Not specified"}
*Company*: ${job ? job.company : "Not specified"}
*Name*: ${formData.firstName} ${formData.lastName}
*Email*: ${formData.email}
*Phone*: ${formData.phone}
*Education*: ${formData.education || "Not provided"}
*Specialization*: ${formData.specialization || "Not provided"}
*Aggregate*: ${formData.aggregate || "Not provided"}
*Passout Year*: ${formData.passoutYear || "Not provided"}
*Skills*: ${formData.skills || "Not provided"}
*Experience*: ${formData.experience || "Not provided"}
*Note*: Please find my resume attached in this chat.
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "+917720846048";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");

    setSubmissionStatus("Redirected to WhatsApp. Please attach your resume and send the message.");

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      education: "",
      specialization: "",
      aggregate: "",
      passoutYear: "",
      skills: "",
      experience: "",
      resume: null,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
            {job ? `Apply for ${job.title} at ${job.company}` : "Job Application"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-700 font-semibold">First Name *</Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-blue-500 rounded-xl py-2.5 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-700 font-semibold">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-blue-500 rounded-xl py-2.5 transition-colors"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-semibold">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-blue-500 rounded-xl py-2.5 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 font-semibold">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 xxxxx xxxxx"
                value={formData.phone}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-blue-500 rounded-xl py-2.5 transition-colors"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="education" className="text-gray-700 font-semibold">Education</Label>
              <Select onValueChange={(value) => handleSelectChange("education", value)}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500 rounded-xl py-2.5 transition-colors">
                  <SelectValue placeholder="Select your education" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="btech">B.Tech/B.E</SelectItem>
                  <SelectItem value="bca">BCA</SelectItem>
                  <SelectItem value="mca">MCA</SelectItem>
                  <SelectItem value="mtech">M.Tech</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-gray-700 font-semibold">Specialization</Label>
              <Select onValueChange={(value) => handleSelectChange("specialization", value)}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500 rounded-xl py-2.5 transition-colors">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cse">Computer Science</SelectItem>
                  <SelectItem value="it">Information Technology</SelectItem>
                  <SelectItem value="ece">Electronics & Communication</SelectItem>
                  <SelectItem value="mechanical">Mechanical</SelectItem>
                  <SelectItem value="civil">Civil</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="aggregate" className="text-gray-700 font-semibold">Aggregate Percentage</Label>
              <Input
                id="aggregate"
                type="number"
                placeholder="Enter percentage"
                value={formData.aggregate}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-blue-500 rounded-xl py-2.5 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passoutYear" className="text-gray-700 font-semibold">Passout Year</Label>
              <Select onValueChange={(value) => handleSelectChange("passoutYear", value)}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500 rounded-xl py-2.5 transition-colors">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2020">2020</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2027">2027</SelectItem>
                  <SelectItem value="2028">2028</SelectItem>
                  <SelectItem value="2029">2029</SelectItem>
                  <SelectItem value="2030">2030</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills" className="text-gray-700 font-semibold">Technical Skills</Label>
            <Textarea
              id="skills"
              placeholder="List your technical skills (e.g., Java, Python, React, etc.)"
              rows={3}
              value={formData.skills}
              onChange={handleInputChange}
              className="border-gray-300 focus:border-blue-500 rounded-xl resize-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience" className="text-gray-700 font-semibold">Work/Internship Experience</Label>
            <Textarea
              id="experience"
              placeholder="Describe any work experience or internships (if any)"
              rows={3}
              value={formData.experience}
              onChange={handleInputChange}
              className="border-gray-300 focus:border-blue-500 rounded-xl resize-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume" className="text-gray-700 font-semibold">Upload Resume (PDF, max 5MB) *</Label>
            <Input
              id="resume"
              type="file"
              accept="application/pdf"
              onChange={handleInputChange}
              className="border-gray-300 focus:border-blue-500 rounded-xl py-2.5 transition-colors"
            />
          </div>
          {submissionStatus && (
            <p className={`text-sm text-center ${submissionStatus.includes("WhatsApp") ? "text-green-600" : "text-red-600"}`}>
              {submissionStatus}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Submit via WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Placements() {
  usePageMeta("Placements", "Meet our placed students, explore current job openings and read reviews from our alumni.");
  const registrationRef = useRef(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Job search states
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState(undefined);
  const [jobType, setJobType] = useState(undefined);
  const [category, setCategory] = useState(undefined);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [salaryRange, setSalaryRange] = useState(undefined);
  const [postedWithin, setPostedWithin] = useState(undefined);
  const [visible, setVisible] = useState(4);
  const [saved, setSaved] = useState({});

  // Memoized filter options
  const locations = useMemo(() => Array.from(new Set(jobs.map((j) => j.location))), []);
  const experiences = ["0-1 years", "1-3 years", "2-4 years", "4+ years"];
  const types = useMemo(() => Array.from(new Set(jobs.map((j) => j.type))), []);
  const skills = useMemo(() => Array.from(new Set(jobs.flatMap((j) => j.skills))), []);
  const categories = useMemo(() => Array.from(new Set(jobs.map((j) => j.category))), []);
  const salaryRanges = ["₹5-10 LPA", "₹10-15 LPA", "₹15-20 LPA", "₹20+ LPA"];
  const postedWithinOptions = ["Any", "Last 24 hours", "Last 7 days", "Last 30 days"];

  // Client-side filtering
  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const matchesExperience = experience ? job.experience === experience : true;
      const matchesType = jobType ? job.type === jobType : true;
      const matchesSkills = selectedSkills.length > 0 ? selectedSkills.every((skill) => job.skills.includes(skill)) : true;
      const matchesQuery = !query || job.title.toLowerCase().includes(query.toLowerCase()) || job.company.toLowerCase().includes(query.toLowerCase()) || job.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()));
      const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
      const matchesCategory = !category || job.category === category;
      const matchesSalary = !salaryRange || job.salary.startsWith(salaryRange.split("-")[0]);
      const matchesPostedWithin = !postedWithin || (postedWithin === "Any" || timeAgo(job.postedAt).includes(postedWithin.toLowerCase()));
      return matchesExperience && matchesType && matchesSkills && matchesQuery && matchesLocation && matchesCategory && matchesSalary && matchesPostedWithin;
    });
  }, [query, location, experience, jobType, category, selectedSkills, salaryRange, postedWithin]);

  // Toggle save job
  const toggleSave = (jobId) => {
    setSaved((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  // Toggle skill selection
  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Handle View & Apply button click
  const handleViewApply = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const scrollToRegistration = (job = null) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-4">
            <span className="inline-block rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur">
              Placements
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Launch Your Career
            </h1>
            <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Join 2500+ students who transformed their careers with our placement program
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <a href="#placed-students" className="inline-flex h-10 items-center rounded-lg bg-white px-5 text-sm font-semibold text-blue-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
                Meet Our Placed Students
              </a>
              <a href="#student-voices" className="inline-flex h-10 items-center rounded-lg border border-white/40 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20">
                Read Reviews
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Placement Statistics */}
      <section className="py-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-1.5 mb-6">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-0.5 text-xs font-semibold rounded-full">
              Placement Excellence
            </Badge>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Proven Track Record</h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Our results speak volumes about our commitment to student success
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {placementStats.map((stat, index) => (
              <Card key={index} className="text-center border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-xl">
                <CardContent className="p-3 space-y-1.5">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 w-8 h-8 rounded-lg flex items-center justify-center mx-auto">
                    <stat.icon className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-gray-900">{stat.value}</div>
                    <div className="text-[11px] text-gray-600 font-medium leading-tight">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Placed Students with photo + review */}
      <section id="placed-students" className="py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-1.5 mb-6">
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-3 py-0.5 text-xs font-semibold rounded-full">
              Success Stories
            </Badge>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Our Placed Students</h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Real students, real offers — meet some of the learners who landed their dream jobs
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {placedStudents.map((st) => (
              <article
                key={st.name}
                className="group w-[140px] sm:w-[160px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                  <img
                    src={st.photo}
                    alt={`${st.name}, placed at ${st.company}`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 shadow-sm">
                    <CheckCircle className="h-3 w-3" /> Placed
                  </span>
                  <span className="absolute bottom-2 right-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-2.5 py-0.5 text-xs font-bold text-white shadow">
                    {st.package}
                  </span>
                </div>
                <div className="space-y-1 p-2.5">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < st.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <p className="text-[11px] italic leading-snug text-gray-600 line-clamp-3 min-h-[3.1em]">“{st.review}”</p>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{st.name}</h3>
                    <p className="flex items-center gap-1 text-[11px] text-gray-500 line-clamp-1">
                      <Briefcase className="h-3 w-3 shrink-0" /> {st.company}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Section with Integrated JobSearch Functionality */}
      <section className="py-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-1.5 mb-6">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-0.5 text-xs font-semibold rounded-full">
              Current Openings
            </Badge>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Explore Job Opportunities</h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Discover the latest job openings and take the next step in your career
            </p>
          </div>

          {/* Search and Location Filter */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <div className="lg:col-span-2 flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by job title, company, or skills"
                  className="pl-10 border-gray-300 focus:border-blue-500 rounded-xl py-2.5 transition-colors"
                />
              </div>
              <Button
                onClick={() => {
                  setQuery("");
                  setLocation("");
                  setExperience(undefined);
                  setJobType(undefined);
                  setCategory(undefined);
                  setSelectedSkills([]);
                  setSalaryRange(undefined);
                  setPostedWithin(undefined);
                }}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Reset
              </Button>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location (e.g., Pune, India)"
                className="pl-10 border-gray-300 focus:border-blue-500 rounded-xl py-2.5 transition-colors"
              />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {/* Sidebar with Filters */}
            <aside className="space-y-4">
              <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base font-bold text-gray-900">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4 pt-0">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">Category</Label>
                    <Select onValueChange={(e) => setCategory(e === "__any" ? undefined : e)}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 rounded-xl py-2.5 transition-colors">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__any">Any</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">Experience</Label>
                    <Select onValueChange={(e) => setExperience(e === "__any" ? undefined : e)}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 rounded-xl py-2.5 transition-colors">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__any">Any</SelectItem>
                        {experiences.map((exp) => (
                          <SelectItem key={exp} value={exp}>
                            {exp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">Job Type</Label>
                    <Select onValueChange={(e) => setJobType(e === "__any" ? undefined : e)}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 rounded-xl py-2.5 transition-colors">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__any">Any</SelectItem>
                        {types.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">Skills</Label>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                      {skills.map((skill) => (
                        <label key={skill} className="flex items-center space-x-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedSkills.includes(skill)}
                            onChange={() => toggleSkill(skill)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span>{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">Salary Range</Label>
                    <Select onValueChange={(e) => setSalaryRange(e === "__any" ? undefined : e)}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 rounded-xl py-2.5 transition-colors">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__any">Any</SelectItem>
                        {salaryRanges.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">Posted Within</Label>
                    <Select onValueChange={(e) => setPostedWithin(e === "__any" ? undefined : e)}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 rounded-xl py-2.5 transition-colors">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__any">Any</SelectItem>
                        {postedWithinOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Saved <strong>{Object.keys(saved).filter((k) => saved[k]).length}</strong> jobs
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base font-bold text-gray-900">Tips</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1.5">
                    <li>Use specific keywords (e.g., nurse, accountant) to narrow results.</li>
                    <li>Apply quickly to new listings — save them for later review.</li>
                    <li>Filter by category and salary to find the best fit.</li>
                  </ul>
                </CardContent>
              </Card>
            </aside>

            {/* Job Listings */}
            <section className="lg:col-span-3 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Job Opportunities</h3>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-500">
                    Showing <strong>{filtered.length}</strong> results
                  </p>
                  <div className="text-sm text-gray-500">
                    Sorted by <strong>Relevance</strong>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filtered.slice(0, visible).map((job) => (
                    <Card
                      key={job.id}
                      className={`border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden rounded-lg ${job.urgent ? 'ring-1 ring-red-400' : ''}`}
                    >
                      <CardContent className="p-3 space-y-2">
                        {job.urgent && (
                          <div className="flex justify-between items-center mb-2">
                            <Badge className="bg-red-500 text-white hover:bg-red-600 text-[10px] px-2 py-0">
                              Urgent Hiring
                            </Badge>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>{timeAgo(job.postedAt)}</span>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col gap-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="bg-blue-100 rounded-lg p-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="text-[13px] font-semibold text-gray-800 leading-tight">{job.title}</h3>
                                <p className="text-xs text-gray-500">
                                  {job.company} • {job.location}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap [&>div]:text-[10px] [&>div]:px-2 [&>div]:py-0">
                              <Badge variant="outline" className="border-gray-300 text-gray-600">
                                {job.experience}
                              </Badge>
                              <Badge variant="outline" className="border-gray-300 text-gray-600">
                                {job.type}
                              </Badge>
                              <Badge className="bg-blue-50 text-blue-700 border-blue-300">
                                {job.category}
                              </Badge>
                              {job.skills.slice(0, 3).map((s) => (
                                <Badge key={s} variant="secondary" className="bg-gray-100 text-gray-800">
                                  {s}
                                </Badge>
                              ))}
                            </div>
                            <div className="mt-2.5 text-xs text-gray-500 flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {timeAgo(job.postedAt)}
                              </span>
                              {job.salary && (
                                <span className="flex items-center gap-1">
                                  <IndianRupee className="h-4 w-4" />
                                  {job.salary}
                                </span>
                              )}
                            </div>
                            <div className="mt-2">
                              <p className="text-xs text-gray-600 line-clamp-2">{job.description}</p>
                            </div>

                            {/* Additional job details for urgent jobs */}
                            {job.urgent && (
                              <div className="mt-2 space-y-1 [&_div]:text-xs">
                                {job.contact && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <Phone className="h-4 w-4 text-green-600" />
                                    <span className="text-gray-700 font-medium">Contact: {job.contact}</span>
                                  </div>
                                )}
                                {job.eligibility && (
                                  <div className="text-sm text-gray-700">
                                    <strong>Eligibility:</strong> {job.eligibility}
                                  </div>
                                )}
                                {job.interview && (
                                  <div className="text-sm text-gray-700">
                                    <strong>Interview:</strong> {job.interview}
                                  </div>
                                )}
                                {job.vacancies && (
                                  <div className="text-sm text-gray-700">
                                    <strong>Vacancies:</strong> {job.vacancies}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleViewApply(job)}
                              className="h-8 px-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg font-medium text-xs shadow-sm transition-all duration-300"
                            >
                              View & Apply
                            </Button>
                            <Button
                              onClick={() => toggleSave(job.id)}
                              variant="ghost"
                              className="h-8 px-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-xs transition-colors"
                            >
                              {saved[job.id] ? "Saved" : "Save"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {filtered.length === 0 && (
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm text-center rounded-2xl">
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-500">
                        No jobs matched your search. Try adjusting filters or keywords.
                      </p>
                    </CardContent>
                  </Card>
                )}
                {visible < filtered.length && (
                  <div className="text-center mt-4">
                    <Button
                      onClick={() => setVisible((v) => v + 4)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Load more
                    </Button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* Success Stories and Placement Process */}
      {/* <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="success-stories" className="space-y-12">
            <div className="text-center">
              <TabsList className="bg-gradient-to-r from-blue-50 to-indigo-50 p-1 rounded-2xl border border-blue-200">
                <TabsTrigger
                  value="success-stories"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-700 rounded-xl font-semibold px-8 py-3 transition-all duration-300"
                >
                  Success Stories
                </TabsTrigger>
                <TabsTrigger
                  value="placement-process"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-700 rounded-xl font-semibold px-8 py-3 transition-all duration-300"
                >
                  Placement Process
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="success-stories" className="space-y-12">
              <div className="text-center space-y-4">
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-4 py-1 text-sm font-semibold mb-4 rounded-full">
                  Our Alumni
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900">Success Stories</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Discover how our students achieved their dream careers with SS Infotech
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {successStories.map((story, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm rounded-2xl">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {story.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{story.name}</h3>
                          <p className="text-sm text-gray-600">{story.role} @ {story.company}</p>
                          <p className="text-sm text-green-600 font-medium">{story.package}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{story.story}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-blue-100 text-blue-800 rounded-full">{story.program}</Badge>
                        <Badge className="bg-gray-100 text-gray-800 rounded-full">{story.batch}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="placement-process" className="space-y-12">
              <div className="text-center space-y-4">
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-4 py-1 text-sm font-semibold mb-4 rounded-full">
                  Our Process
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900">Our Placement Process</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Step-by-step guidance from training to placement - your journey to success
                </p>
              </div>
              <div className="relative">
                <div className="absolute left-8 top-12 bottom-12 w-1 bg-gradient-to-b from-blue-200 via-indigo-300 to-purple-200 rounded-full shadow-inner"></div>
                <div className="space-y-8">
                  {placementProcess.map((step, index) => (
                    <div key={index} className="relative flex items-start space-x-8 group">
                      <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {step.step}
                      </div>
                      <Card className="flex-1 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 bg-gradient-to-r from-white to-blue-50/50 rounded-2xl">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                              {step.title}
                            </h3>
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 font-semibold rounded-full">
                              {step.duration}
                            </Badge>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{step.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section> */}

      {/* Testimonials Section */}
      <section id="student-voices" className="py-10 bg-gradient-to-br from-slate-50 via-white to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-1.5 mb-6">
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 px-3 py-0.5 text-xs font-semibold rounded-full">
              Student Voices
            </Badge>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">What Our Students Say</h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Hear from our successful alumni about their transformative learning experiences
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden rounded-lg">
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-9 h-9 shrink-0 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow ring-2 ring-white">
                      <span>{testimonial.author.split(' ').map(n => n[0]).join('')}</span>
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-[13px] leading-tight">{testimonial.author}</h3>
                      {/* <p className="text-sm text-gray-600">{testimonial.role}  {testimonial.company}</p> */}
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-600 italic leading-relaxed border-l-2 border-blue-400 pl-3 py-1 bg-blue-50/50 rounded-r-md line-clamp-4">
                    "{testimonial.quote}"
                  </p>
                  <div className="space-y-1.5">
                    <p className="text-xs text-gray-700 font-medium">Course: {testimonial.course}</p>
                    <div className="flex flex-wrap gap-1">
                      {testimonial.achievements.map((achievement, idx) => (
                        <Badge key={idx} className="bg-green-100 text-green-800 hover:bg-green-200 font-medium rounded-full text-[10px] px-2 py-0">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <JobApplicationModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}