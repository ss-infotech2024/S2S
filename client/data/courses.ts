
export interface Module {
  title: string;
  topics: string[];
}

export interface Course {
  id: string;
  title: string;
  short: string;
  description: string;
  duration: string;
  fees: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  syllabus: string[];
  modules?: Module[];
  projects?: string[];
  outcomes: string[];
  prerequisites?: string[];
  schedule?: string;
  image?: string;
  certificate?: string;
  demoVideo?: string;
  color?: string;
  bgColor?: string;
}

export const courses: Course[] = [
  {
    id: "fullstack-java",
    title: "Full-Stack Java Developer",
    short: "Enterprise Java, Spring Boot & Microservices",
    description:
      "Become a backend & full-stack Java developer with hands-on projects, REST APIs, Microservices, and deployment workflows.",
    duration: "5 Months",
    fees: "",
    level: "Advanced",
    category: "Fullstack",
    syllabus: [
      "Core Java & OOPs",
      "Collections & Generics",
      "Spring & Spring Boot",
      "REST APIs & Microservices",
      "Hibernate/JPA",
      "SQL & NoSQL Databases",
      "Testing & CI/CD",
      "Cloud Basics (AWS/GCP)",
    ],
    modules: [
      { title: "Java Core", topics: ["OOPs", "Collections", "Concurrency"] },
      { title: "Spring Ecosystem", topics: ["Spring Core", "Spring Boot", "Spring Security"] },
      { title: "Data & Persistence", topics: ["JPA/Hibernate", "SQL", "MongoDB"] },
      { title: "Microservices", topics: ["Design", "Gateway", "Service Discovery"] },
    ],
    projects: [
      "E-commerce REST API with Spring Boot",
      "Microservice-based Order Processing System",
    ],
    outcomes: [
      "Build production-ready backend services",
      "Understand microservice architecture",
      "Prepare for interviews and placements",
    ],
    prerequisites: ["Basic programming knowledge", "Familiarity with Linux/CLI"],
    schedule: "Weekday / Weekend batches available",
    image: "https://tse3.mm.bing.net/th/id/OIP.IkSoB9ESfIus0n79LuW1GwHaE7?r=0&pid=Api&h=220&P=0",
    certificate: "Certificate of Completion: Full-Stack Java Developer",
    demoVideo: "/videos/fullstack-java-demo.mp4",
    color: "from-blue-500 to-blue-700",
    bgColor: "from-blue-500/10 to-blue-700/10",
  },
  {
    id: "python-dsa",
    title: "Python & DSA",
    short: "Master Data Structures & Algorithms with Python",
    description:
      "Learn problem-solving and coding fundamentals through Python, focusing on Data Structures & Algorithms (DSA). Build strong foundations for interviews, competitive programming, and real-world applications.",
    duration: "3 Months",
    fees: "",
    level: "Beginner",
    category: "Programming",
    syllabus: [
      "Python Basics & OOP",
      "Arrays & Strings",
      "Linked Lists",
      "Stacks & Queues",
      "Recursion & Backtracking",
      "Trees & Graphs",
      "Sorting & Searching Algorithms",
      "Dynamic Programming",
      "Problem-Solving & Interview Prep",
    ],
    modules: [
      { title: "Python Foundations", topics: ["Syntax", "Loops", "Functions", "OOP"] },
      { title: "Core DSA", topics: ["Arrays", "Strings", "Linked Lists", "Stacks", "Queues"] },
      { title: "Advanced DSA", topics: ["Trees", "Graphs", "Dynamic Programming", "Greedy Algorithms"] },
    ],
    projects: ["Mini Coding Challenges", "Algorithm Visualizer", "Problem-Solving Portfolio"],
    outcomes: [
      "Write efficient algorithms",
      "Crack coding interviews",
      "Build strong problem-solving mindset",
    ],
    prerequisites: ["Basic knowledge of Python programming"],
    schedule: "Weekday & Weekend batches",
    image: "https://www.vagdevitechnologies.com/wp-content/uploads/2026/03/DSA-with-python-images.webp",
    certificate: "Certificate of Completion: Python & DSA",
    demoVideo: "/videos/python-dsa-demo.mp4",
    color: "from-green-500 to-green-700",
    bgColor: "from-green-500/10 to-green-700/10",
  },
  {
    id: "cyber-security",
    title: "Cyber Security",
    short: "Cutting-edge Cybersecurity Training",
    description:
      "Enroll in our cutting-edge cybersecurity training program, expertly crafted to combat the ever-changing landscape of digital threats. No matter your level of experience, our all-inclusive curriculum empowers you with the most current techniques and information to safeguard against cyber attacks. Don't lag behind – take part in our program and remain ahead of the game in the world of cybersecurity!",
    duration: "3 Months",
    fees: "",
    level: "Intermediate",
    category: "Cybersecurity",
    syllabus: [
      "Network Security Fundamentals",
      "Cryptography Techniques",
      "Threat Detection & Prevention",
      "Incident Response & Recovery",
      "Ethical Hacking Basics",
      "Security Compliance & Standards",
    ],
    modules: [
      { title: "Network Security", topics: ["Fundamentals", "Firewalls", "VPNs"] },
      { title: "Cryptography", topics: ["Encryption", "Key Management"] },
      { title: "Threat Management", topics: ["Detection", "Prevention", "Response"] },
    ],
    projects: ["Network Security Audit", "Simulated Cyber Attack Defense"],
    outcomes: [
      "Protect systems from digital threats",
      "Apply current cybersecurity techniques",
      "Stay ahead in the cybersecurity field",
    ],
    prerequisites: ["Basic IT knowledge", "Interest in security"],
    schedule: "Weekday / Weekend batches available",
    image: "https://img.freepik.com/premium-vector/abstract-cyber-security-logo-line-blue-light-shield_740796-861.jpg",
    certificate: "Certificate of Completion: Cyber Security",
    demoVideo: "/videos/cyber-security-demo.mp4",
    color: "from-red-500 to-red-700",
    bgColor: "from-red-500/10 to-red-700/10",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    short: "Expert-Led Digital Marketing Training",
    description:
      "Join our expert-led training program covering vital topics like SEO, PPC advertising, social media strategies, email campaigns, and web analytics. Gain actionable knowledge through practical exercises and real-world examples to excel in the digital landscape. Whether you're a beginner or experienced marketer, our program equips you to thrive in the digital world. Enroll today!",
    duration: "2.5 Months",
    fees: "",
    level: "Beginner",
    category: "Digital Marketing",
    syllabus: [
      "Search Engine Optimization (SEO)",
      "Pay-Per-Click (PPC) Advertising",
      "Social Media Strategies",
      "Email Campaign Management",
      "Web Analytics & Reporting",
    ],
    modules: [
      { title: "SEO & PPC", topics: ["SEO Basics", "PPC Campaigns"] },
      { title: "Social Media", topics: ["Strategy", "Advertising"] },
      { title: "Email & Analytics", topics: ["Campaigns", "Web Analytics"] },
    ],
    projects: ["SEO Optimization Project", "Social Media Marketing Campaign"],
    outcomes: [
      "Master digital marketing techniques",
      "Apply skills in real-world scenarios",
      "Thrive in the digital marketing field",
    ],
    prerequisites: ["Basic computer skills"],
    schedule: "Evening & Weekend batches",
    image: "https://seamerk.com/wp-content/uploads/2026/02/Training-Center-Digital-Marketing-In-Mumbai-1024x683.webp",
    certificate: "Certificate of Completion: Digital Marketing",
    demoVideo: "/videos/digital-marketing-demo.mp4",
    color: "from-purple-500 to-purple-700",
    bgColor: "from-purple-500/10 to-purple-700/10",
  },
  {
    id: "microsoft-azure",
    title: "Microsoft Azure",
    short: "Mastery in Microsoft Azure",
    description:
      "Gain mastery of Microsoft Azure through our dynamic training program. Our experienced instructors will guide you through key services such as cloud computing, virtual machines, and storage, allowing you to apply your knowledge through hands-on projects. Take your career in cloud solutions to the next level - enroll with us now!",
    duration: "3 Months",
    fees: "",
    level: "Intermediate",
    category: "Cloud Computing",
    syllabus: [
      "Cloud Computing Basics",
      "Virtual Machines",
      "Storage Solutions",
    ],
    modules: [
      { title: "Cloud Fundamentals", topics: ["Basics", "Services"] },
      { title: "Virtual Machines", topics: ["Setup", "Management"] },
      { title: "Storage", topics: ["Blob", "File Storage"] },
    ],
    projects: ["Azure Virtual Machine Setup", "Cloud Storage Solution"],
    outcomes: [
      "Master Azure cloud services",
      "Apply skills in hands-on projects",
      "Elevate your cloud career",
    ],
    prerequisites: ["Basic IT knowledge", "Interest in cloud"],
    schedule: "Evening batches",
    image: "https://www.stationx.net/wp-content/uploads/2025/03/Introduction-to-Microsoft-Azure-Security-Training-1500x844.jpg",
    certificate: "Certificate of Completion: Microsoft Azure",
    demoVideo: "/videos/microsoft-azure-demo.mp4",
    color: "from-blue-600 to-blue-800",
    bgColor: "from-blue-600/10 to-blue-800/10",
  },
  {
    id: "salesforce",
    title: "Salesforce",
    short: "Comprehensive Salesforce Training",
    description:
      "Embrace the full potential of Salesforce with our all-inclusive training program. From administration and customization to automation, our program covers it all. Put your skills into action and elevate your career with hands-on experience. Don't wait, unleash the power of Salesforce by joining us today!",
    duration: "3 Months",
    fees: "",
    level: "Intermediate",
    category: "CRM",
    syllabus: [
      "Salesforce Administration",
      "Customization",
      "Automation",
    ],
    modules: [
      { title: "Administration", topics: ["Setup", "Users"] },
      { title: "Customization", topics: ["Fields", "Page Layouts"] },
      { title: "Automation", topics: ["Workflows", "Process Builder"] },
    ],
    projects: ["Salesforce CRM Customization", "Automation Workflow"],
    outcomes: [
      "Master Salesforce administration",
      "Implement customizations and automation",
      "Elevate your career with hands-on skills",
    ],
    prerequisites: ["Basic CRM knowledge"],
    schedule: "Weekend batches",
    image: "https://wallpapers.com/images/hd/salesforce-background-fbkrxqtfk2eu67b4.jpg",
    certificate: "Certificate of Completion: Salesforce",
    demoVideo: "/videos/salesforce-demo.mp4",
    color: "from-teal-500 to-teal-700",
    bgColor: "from-teal-500/10 to-teal-700/10",
  },
  {
    id: "itil",
    title: "ITIL",
    short: "Mastery in ITIL Training",
    description:
      "Unlock your mastery of ITIL through our immersive training program. Immerse yourself in key concepts and best practices of IT service management. Develop practical skills for streamlined service delivery that aligns with business goals. Enroll now and elevate your understanding and application of ITIL!",
    duration: "2.5 Months",
    fees: "",
    level: "Intermediate",
    category: "IT Service Management",
    syllabus: [
      "ITIL Foundations",
      "Service Strategy",
      "Service Design",
      "Service Transition",
      "Service Operation",
      "Continual Service Improvement",
    ],
    modules: [
      { title: "Foundations", topics: ["Basics", "Key Concepts"] },
      { title: "Service Lifecycle", topics: ["Strategy", "Design", "Transition", "Operation", "Improvement"] },
    ],
    projects: ["IT Service Management Plan", "Service Improvement Proposal"],
    outcomes: [
      "Understand ITIL best practices",
      "Streamline service delivery",
      "Align IT services with business goals",
    ],
    prerequisites: ["Basic IT service knowledge"],
    schedule: "Evening batches",
    image: "https://blog.masterofproject.com/wp-content/uploads/2017/04/ITIL-Training3.jpg",
    certificate: "Certificate of Completion: ITIL",
    demoVideo: "/videos/itil-demo.mp4",
    color: "from-indigo-500 to-indigo-700",
    bgColor: "from-indigo-500/10 to-indigo-700/10",
  },
  {
    id: "databricks",
    title: "Databricks",
    short: "Master Big Data with Databricks",
    description:
      "Master big data processing and analytics with our comprehensive Databricks training program. Learn to leverage Databricks for data engineering, machine learning, and real-time analytics. Gain hands-on experience with Spark, Delta Lake, and cloud integration through real-world projects.",
    duration: "3 Months",
    fees: "",
    level: "Intermediate",
    category: "Big Data",
    syllabus: [
      "Introduction to Databricks",
      "Apache Spark Fundamentals",
      "Data Engineering with Delta Lake",
      "Machine Learning with MLflow",
      "Real-Time Analytics",
      "Cloud Integration (AWS/Azure/GCP)",
      "Data Visualization in Databricks",
      "Performance Optimization",
    ],
    modules: [
      { title: "Databricks Basics", topics: ["Platform Overview", "Workspace Setup", "Notebooks"] },
      { title: "Spark & Data Engineering", topics: ["Spark SQL", "DataFrames", "Delta Lake"] },
      { title: "Machine Learning", topics: ["MLflow", "Model Training", "Hyperparameter Tuning"] },
      { title: "Advanced Analytics", topics: ["Streaming", "Visualization", "Optimization"] },
    ],
    projects: [
      "Real-Time Data Pipeline with Delta Lake",
      "Machine Learning Model Deployment with MLflow",
    ],
    outcomes: [
      "Build scalable data pipelines",
      "Develop and deploy machine learning models",
      "Master big data analytics with Databricks",
    ],
    prerequisites: ["Basic programming knowledge (Python/Scala)", "Familiarity with SQL"],
    schedule: "Weekday / Weekend batches available",
    image: "https://vectorseek.com/wp-content/uploads/2023/04/Databricks-Logo-Vector-768x768.jpg",
    certificate: "Certificate of Completion: Databricks",
    demoVideo: "/videos/databricks-demo.mp4",
    color: "from-cyan-500 to-cyan-700",
    bgColor: "from-cyan-500/10 to-cyan-700/10",
  },
  {
    id: "data-analytics",
    title: "Data Analytics",
    short: "Master Data-Driven Analysis",
    description:
      "Learn to analyze and interpret complex datasets using modern, industry-standard tools. This course covers machine learning, data visualization, and predictive analytics, empowering you to derive actionable insights from data.",
    duration: "3.5 Months",
    fees: "",
    level: "Intermediate",
    category: "Data Science",
    syllabus: [
      "Introduction to Data Analytics",
      "Python for Data Analysis",
      "Machine Learning Fundamentals",
      "Predictive Analytics",
      "Data Visualization with Tableau",
      "Analytics Frameworks (TensorFlow, PyTorch)",
      "Big Data Integration",
      "Real-World Case Studies",
    ],
    modules: [
      { title: "Data Analytics Basics", topics: ["Data Types", "Statistics", "Data Cleaning"] },
      { title: "Machine Learning", topics: ["Supervised Learning", "Unsupervised Learning", "Model Evaluation"] },
      { title: "Visualization & Analytics", topics: ["Tableau", "TensorFlow", "PyTorch"] },
      { title: "Advanced Analytics", topics: ["Predictive Models", "Big Data", "Case Studies"] },
    ],
    projects: [
      "Predictive Sales Forecasting Model",
      "Customer Segmentation Analysis",
    ],
    outcomes: [
      "Analyze complex datasets to surface business insights",
      "Create predictive models for business applications",
      "Visualize data effectively with modern tools",
    ],
    prerequisites: ["Basic Python programming", "Familiarity with statistics"],
    schedule: "Weekday / Weekend batches available",
    image: "https://img.freepik.com/premium-vector/data-analytics-logo-design-business-finance-logotype_969485-208.jpg?w=2000",
    certificate: "Certificate of Completion: Data Analytics",
    demoVideo: "../../videos/DAPreview.mp4",
    color: "from-orange-500 to-orange-700",
    bgColor: "from-orange-500/10 to-orange-700/10",
  },
];

export function getCourseById(id: string) {
  return courses.find((c) => c.id === id) || null;
}
