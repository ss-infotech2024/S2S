import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { LogIn, BookOpen, UserCircle, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/my-enrollments", label: "My Enrollments" },
  { to: "/online-training", label: "Online Training" },
  { to: "/classroom-training", label: "Classroom" },
  { to: "/corporate-training", label: "Corporate" },
  { to: "/overseas", label: "Overseas" },
  { to: "/placements", label: "Placements" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

type Student = {
  studentId?: string;
  name: string;
  email: string;
  course?: string;
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  
  const [authLoading, setAuthLoading] = useState(true);
  const lastScrollY = useRef(0);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const API = (import.meta.env.VITE_API_URL || "http://localhost:8787").replace(/\/$/, "");

  const loadStudent = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/student-auth/me`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        setStudent(null);
        return;
      }
      const result = await response.json();
      const profile = result.student ?? result;
      if (typeof profile?.name === "string" && typeof profile?.email === "string") {
        setStudent({
          studentId: profile.studentId,
          name: profile.name,
          email: profile.email,
          course: profile.course,
        });
      } else {
        setStudent(null);
      }
    } catch {
      setStudent(null);
    } finally {
      setAuthLoading(false);
    }
  }, [API]);

  useEffect(() => {
    void loadStudent();
  }, [loadStudent]);

  useEffect(() => {
    const refresh = () => void loadStudent();
    window.addEventListener("student-auth-changed", refresh);
    return () => window.removeEventListener("student-auth-changed", refresh);
  }, [loadStudent]);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      if (Math.abs(delta) < 6) return;
      if (currentY <= 80) setHidden(false);
      else if (delta > 0) {
        setHidden(true);
        setOpen(false);
        setProfileOpen(false);
      } else setHidden(false);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API}/api/student-auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
    } catch {
      // Still clear the local display if the server cannot be reached.
    } finally {
      setStudent(null);
      setProfileOpen(false);
      setOpen(false);
      window.dispatchEvent(new Event("student-auth-changed"));
      navigate("/", { replace: true });
    }
  };

  const studentName = student?.name?.trim() || "Student";
  const initials = studentName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  const profileAction = (mobile = false) => (
    <div className={cn("relative", mobile && "w-full")} ref={mobile ? undefined : profileRef}>
      <button
        type="button"
        onClick={() => setProfileOpen((value) => !value)}
        aria-expanded={profileOpen}
        className={cn(
          "flex items-center gap-2 rounded-xl border border-violet-100 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-800 shadow-sm transition hover:border-violet-300 hover:bg-violet-50",
          mobile && "w-full",
        )}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-800">
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block max-w-36 truncate">{studentName}</span>
          <span className="block text-xs font-normal text-slate-500">Student account</span>
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", profileOpen && "rotate-180")} />
      </button>
      {profileOpen && (
        <div className={cn(
          "z-[60] mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl",
          mobile ? "w-full" : "absolute right-0 top-full w-60",
        )}>
          <div className="border-b border-slate-100 px-3 py-3">
            <p className="truncate text-sm font-semibold text-slate-900">{studentName}</p>
            <p className="truncate text-xs text-slate-500">{student?.email}</p>
          </div>
          <Link to="/student-dashboard" onClick={() => { setProfileOpen(false); setOpen(false); }} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-800">
            <UserCircle className="h-4 w-4" /> My Profile
          </Link>
          <Link to="/my-enrollments" onClick={() => { setProfileOpen(false); setOpen(false); }} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-800">
            <BookOpen className="h-4 w-4" /> My Courses
          </Link>
          <button type="button" onClick={() => void handleLogout()} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );

  const authAction = (mobile = false) => {
    if (authLoading) return <div className={cn("h-10 animate-pulse rounded-lg bg-slate-100", mobile ? "w-full" : "w-36")} />;
    if (student) return profileAction(mobile);
    return (
      <Button asChild className={cn("bg-primary text-primary-foreground hover:bg-primary/90", mobile && "w-full")}>
        <Link to="/login" onClick={() => setOpen(false)}>
          <LogIn className="mr-2 h-4 w-4" />
          Login / Register
        </Link>
      </Button>
    );
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border/50 bg-white backdrop-blur transition-transform duration-300 ease-in-out will-change-transform",
      hidden ? "-translate-y-full" : "translate-y-0",
    )}>
      <div className="container flex h-24 items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="Skill Training Center home">
          <img src="/newlogo.png" alt="Skill Training Center Logo" className="relative z-20 h-20 w-[130px] object-contain opacity-100 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-28 lg:w-36 xl:h-28 xl:w-44" />
        </Link>
        <nav className="hidden items-center gap-6 min-[1150px]:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => cn("text-sm font-semibold transition-colors hover:text-primary", isActive ? "text-primary" : "text-foreground/70")}>
              {item.label}
            </NavLink>
          ))}
          {authAction()}
        </nav>
        <button type="button" className="inline-flex items-center justify-center rounded-md p-2 text-foreground min-[1150px]:hidden" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>
      </div>
      {open && (
        <div className="border-t border-border/50 bg-white min-[1150px]:hidden">
          <nav className="container grid gap-2 py-4">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => cn("rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground", isActive ? "text-primary" : "text-foreground/80")} onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            {authAction(true)}
          </nav>
        </div>
      )}
    </header>
  );
}
