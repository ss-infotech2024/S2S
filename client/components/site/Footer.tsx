import { Link } from "react-router-dom";

const linkClass = "text-slate-400 transition-colors hover:text-white";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#130d24] text-sm">
      <div className="container grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {/* The logo file has wide padding and a wordmark; crop to the round "S" mark */}
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white">
              <img src="/newlogo.png" alt="" className="absolute left-[-38px] top-[-30px] h-[120px] w-[120px] max-w-none" aria-hidden="true" />
            </span>
            <span className="text-base font-bold tracking-tight text-white">
              Skill Training Center
            </span>
          </div>
          <p className="max-w-xs leading-relaxed text-slate-400">
            Leading training institute for software courses. Modernized
            experience with animations and accessibility.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-200">Company</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className={linkClass}>About</Link></li>
            <li><Link to="/placements" className={linkClass}>Placements</Link></li>
            <li><Link to="/blog" className={linkClass}>Blog</Link></li>
            <li><Link to="/contact" className={linkClass}>Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-200">Training</h4>
          <ul className="space-y-2">
            <li><Link to="/online-training" className={linkClass}>Online</Link></li>
            <li><Link to="/classroom-training" className={linkClass}>Classroom</Link></li>
            <li><Link to="/corporate-training" className={linkClass}>Corporate</Link></li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-200">Address</h4>
          <p className="leading-relaxed text-slate-400">
            Plot No.26, Khandwekar Bunglow <br />
            2nd Floor, Near Lendra Park <br />
            Ramdaspeth, Nagpur-440010
          </p>
          <p className="text-slate-400">
            Phone: 9399345989, 8446691425
          </p>
        </div>
      </div>

      <div className="border-t border-white/5 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Skill Training Center. All rights reserved.
      </div>
    </footer>
  );
}
