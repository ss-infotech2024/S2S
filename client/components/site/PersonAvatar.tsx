// components/site/PersonAvatar.tsx
//
// Default profile picture for people who don't have a real photo (reviews / testimonials).
// Shows a girl or boy illustration based on the first name, and always picks the SAME
// look for the same name (so "Saloni Patel" never changes between renders or pages).
//
// Usage:   <PersonAvatar name="Saloni Patel" className="h-11 w-11" />
// Wrong guess for some name?  Pass gender explicitly:  <PersonAvatar name="Kiran" gender="female" />
// Or add the first name to FEMALE_NAMES / MALE_NAMES below.

export type Gender = "male" | "female";

const FEMALE_NAMES = new Set([
  "niharika", "saloni", "meenal", "shradha", "zeba", "nitisha", "prajakta", "vaishnavi", "mrunal",
  "priya", "pooja", "neha", "anjali", "sneha", "kavya", "riya", "isha", "divya", "shreya", "simran",
  "aditi", "ananya", "komal", "megha", "nikita", "payal", "rutuja", "sakshi", "tanvi", "swati",
  "vidya", "ritu", "sonal", "shruti", "pallavi", "mansi", "kajal", "jyoti", "deepa", "bhavna",
  "ayesha", "fatima", "sana", "sara", "nisha", "rekha", "sunita", "anita", "kiran", "preeti",
]);

const MALE_NAMES = new Set([
  "prateek", "raj", "ajay", "manthan", "tanmay", "shiv", "asit", "manan", "rahul", "rohit", "amit",
  "vikas", "sachin", "suraj", "aditya", "arjun", "karan", "nikhil", "pratik", "yash", "harsh",
  "ankit", "aman", "ravi", "sanjay", "vijay", "mohit", "gaurav", "saurabh", "tushar", "omkar",
  "krishna", "shubham", "abhishek", "akash", "deepak", "mayur", "piyush", "sumit", "vishal",
  "rushikesh", "chaitanya", "ashish", "kunal", "varun", "mohammad", "imran", "faizan", "arman",
]);

// Names that end in a/i/ee (which usually means female in India) but are male
const MALE_EXCEPTIONS = new Set(["aditya", "surya", "krishna", "shiva", "rana", "raja", "ravindra", "harshvardhan", "mithilesh"]);

export function guessGender(fullName: string): Gender {
  const first = (fullName || "")
    .replace(/^(dr|mr|mrs|ms|miss)\.?\s+/i, "")
    .trim()
    .split(/\s+/)[0]
    ?.toLowerCase() ?? "";
  if (FEMALE_NAMES.has(first)) return "female";
  if (MALE_NAMES.has(first) || MALE_EXCEPTIONS.has(first)) return "male";
  // Fallback for names not in the lists: Indian female names usually end in a / i / ee / ya
  return /(a|i|ee|ya|ika|ita|ini)$/.test(first) ? "female" : "male";
}

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

const SKIN = ["#f3cfae", "#e6b48c", "#d29a6e", "#b97f55"];
const HAIR = ["#1c1613", "#2a1b12", "#3b281b", "#4a3425"];
const BG = ["#dbeafe", "#ede9fe", "#ccfbf1", "#fce7f3", "#fef3c7", "#e0f2fe"];
const CLOTHES = ["#2563eb", "#7c3aed", "#0f766e", "#be185d", "#475569", "#b45309"];

export default function PersonAvatar({
  name,
  gender,
  className = "h-full w-full",
}: {
  name: string;
  gender?: Gender;
  className?: string;
}) {
  const g = gender ?? guessGender(name);
  const h = hash(name || "?");
  const skin = SKIN[h % SKIN.length];
  const hair = HAIR[(h >>> 3) % HAIR.length];
  const bg = BG[(h >>> 5) % BG.length];
  const clothes = CLOTHES[(h >>> 7) % CLOTHES.length];
  const style = (h >>> 9) % 3; // 3 hairstyles per gender

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={`${name} profile picture`}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="64" height="64" fill={bg} />

      {/* Hair behind the head */}
      {g === "female" && style === 0 && (
        <path d="M17 29C17 12 47 12 47 29L49 54H15Z" fill={hair} />
      )}
      {g === "female" && style === 1 && (
        <path d="M17.5 28C17.5 13 46.5 13 46.5 28L47 41C47 43 43 43 43 41L21 41C21 43 17 43 17 41Z" fill={hair} />
      )}
      {g === "female" && style === 2 && <circle cx="32" cy="10.5" r="6.5" fill={hair} />}

      {/* Shoulders / clothes */}
      <path d="M8 64C8 51 19 46 32 46S56 51 56 64Z" fill={clothes} />
      <path d="M26 46L32 53L38 46Z" fill={skin} />

      {/* Neck + head */}
      <rect x="28" y="38" width="8" height="10" rx="3" fill={skin} />
      <rect x="28" y="38" width="8" height="4" fill="#000" opacity=".1" />
      <ellipse cx="32" cy="27" rx="11" ry="12.5" fill={skin} />
      {/* Ears */}
      <circle cx="20.8" cy="28.5" r="2" fill={skin} />
      <circle cx="43.2" cy="28.5" r="2" fill={skin} />

      {/* Face */}
      <circle cx="27.5" cy="28" r="1.3" fill="#1f2937" />
      <circle cx="36.5" cy="28" r="1.3" fill="#1f2937" />
      <path d="M28.5 33.5Q32 36.8 35.5 33.5" fill="none" stroke="#9a3412" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="24.5" cy="32" r="2" fill="#f43f5e" opacity=".14" />
      <circle cx="39.5" cy="32" r="2" fill="#f43f5e" opacity=".14" />

      {/* Girl: fringe + bindi-free clean look */}
      {g === "female" && (
        <path d="M20 27C19 13 45 12 44 27C41 21 34 19 27 20.5C23.5 21.3 21.5 23.5 20 27Z" fill={hair} />
      )}

      {/* Boy hair */}
      {g === "male" && style === 0 && (
        <path d="M20.5 26C19.5 12.5 44.5 12.5 43.5 26C42 21 37 18.8 32 18.8S22 21 20.5 26Z" fill={hair} />
      )}
      {g === "male" && style === 1 && (
        <path d="M20.5 26C19 11 45 11 43.5 26C42.5 20.5 37 17 30 18C26 18.6 22 21 20.5 26Z M20.5 26C21 23 22 21 24 19.5C22 21 20.5 23.5 20.5 26Z" fill={hair} />
      )}
      {g === "male" && style === 2 && (
        <>
          <path d="M20.5 26C19.5 12.5 44.5 12.5 43.5 26C42 21 37 18.8 32 18.8S22 21 20.5 26Z" fill={hair} />
          <g fill="none" stroke="#1f2937" strokeWidth="1.1">
            <circle cx="27.5" cy="28" r="3.6" />
            <circle cx="36.5" cy="28" r="3.6" />
            <path d="M31.1 28H32.9" />
          </g>
        </>
      )}
    </svg>
  );
}