import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/online-training", label: "Online Training" },
  { to: "/classroom-training", label: "Classroom" },
  { to: "/corporate-training", label: "Corporate" },
  { to: "/overseas", label: "Overseas" },
  { to: "/placements", label: "Placements" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white backdrop-blur ">
      <div className="container flex h-24 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
      <img
  src="/newlogo.png"
  alt="Skill Training Center Logo"
  className="
    w-[130px] h-30
    sm:w-24 sm:h-24
    md:w-28 md:h-28
    lg:w-36 lg:h-36
    xl:w-44 xl:h-44 
    object-contain
    relative
    z-20
    opacity-100   /* full opacity */
  "
  aria-hidden="true"
/>



        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-semibold transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground/70",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/portal">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Student Portal</Button>
          </Link>
        </nav>
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="border-t border-border/50 bg-white md:hidden">
          <nav className="container grid gap-2 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive ? "text-primary" : "text-foreground/80",
                  )
                }
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/portal" onClick={() => setOpen(false)}>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Student Portal</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}