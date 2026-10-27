// Extra content shown on the Course Details page (tools, career roles,
// learning materials, video lessons). Keyed by course id so the main
// courses.ts file stays small. Anything missing falls back to sensible defaults.

export interface LearningMaterial {
  title: string;
  description: string;
  url: string;
  type: "Documentation" | "Tutorial";
}

export interface VideoLesson {
  title: string;
  /** Paste a YouTube video id here to play it inside the page. */
  youtubeId?: string;
}

export interface CourseExtras {
  tools: string[];
  careerRoles: string[];
  materials: LearningMaterial[];
  /** Optional: override lesson video ids by module title. */
  videoIds?: Record<string, string>;
  /** Optional: id of the course-preview video. */
  previewYoutubeId?: string;
}

export const courseExtras: Record<string, CourseExtras> = {
  "fullstack-java": {
    tools: ["Java", "Spring Boot", "Spring Security", "Hibernate / JPA", "MySQL", "MongoDB", "Docker", "Git & GitHub", "Maven", "Postman"],
    careerRoles: ["Java Developer", "Backend Engineer", "Full-Stack Developer", "Microservices Developer"],
    materials: [
      { type: "Documentation", title: "The Java Tutorials (Oracle)", description: "Official step-by-step tutorials covering the Java language and core APIs.", url: "https://docs.oracle.com/javase/tutorial/" },
      { type: "Tutorial", title: "Spring Guides", description: "Short, hands-on guides for Spring Boot, REST APIs, security and more.", url: "https://spring.io/guides" },
      { type: "Documentation", title: "Hibernate ORM Documentation", description: "Reference and user guides for ORM, JPA and persistence.", url: "https://hibernate.org/orm/documentation/" },
      { type: "Tutorial", title: "Baeldung", description: "Practical articles on Java, Spring, testing and backend development.", url: "https://www.baeldung.com/" },
    ],
  },
  "python-dsa": {
    tools: ["Python", "VS Code", "Jupyter Notebook", "Git & GitHub", "LeetCode", "HackerRank"],
    careerRoles: ["Python Developer", "Software Engineer", "Backend Developer", "Competitive Programmer"],
    materials: [
      { type: "Documentation", title: "The Python Tutorial", description: "Official introduction to Python syntax, data structures and modules.", url: "https://docs.python.org/3/tutorial/" },
      { type: "Documentation", title: "Python Data Structures", description: "Official guide to lists, stacks, queues, dicts and sets.", url: "https://docs.python.org/3/tutorial/datastructures.html" },
      { type: "Tutorial", title: "GeeksforGeeks", description: "Concept explanations and practice problems for DSA and interviews.", url: "https://www.geeksforgeeks.org/" },
      { type: "Tutorial", title: "LeetCode", description: "Practice coding problems and prepare for technical interviews.", url: "https://leetcode.com/" },
    ],
  },
  "cyber-security": {
    tools: ["Kali Linux", "Wireshark", "Nmap", "Metasploit", "Burp Suite", "Splunk"],
    careerRoles: ["Security Analyst", "SOC Analyst", "Penetration Tester", "Network Security Engineer"],
    materials: [
      { type: "Documentation", title: "OWASP Foundation", description: "Open standards and guides for web application security.", url: "https://owasp.org/" },
      { type: "Documentation", title: "NIST Cybersecurity Framework", description: "Industry-standard framework for managing security risk.", url: "https://www.nist.gov/cyberframework" },
      { type: "Documentation", title: "Kali Linux Documentation", description: "Official docs for tools used in penetration testing.", url: "https://www.kali.org/docs/" },
      { type: "Tutorial", title: "MITRE ATT&CK", description: "Knowledge base of real-world attacker tactics and techniques.", url: "https://attack.mitre.org/" },
    ],
  },
  "digital-marketing": {
    tools: ["Google Analytics", "Google Ads", "Search Console", "Meta Ads Manager", "Canva", "Mailchimp"],
    careerRoles: ["Digital Marketing Executive", "SEO Specialist", "Social Media Manager", "Performance Marketer"],
    materials: [
      { type: "Tutorial", title: "Google Skillshop", description: "Free training for Google Ads, Analytics and more.", url: "https://skillshop.withgoogle.com/" },
      { type: "Documentation", title: "Google Search Central", description: "Official SEO documentation straight from Google.", url: "https://developers.google.com/search/docs" },
      { type: "Tutorial", title: "HubSpot Academy", description: "Free courses on inbound marketing, content and email.", url: "https://academy.hubspot.com/" },
      { type: "Tutorial", title: "Meta Business Help", description: "Guides for running campaigns on Facebook and Instagram.", url: "https://www.facebook.com/business/learn" },
    ],
  },
  "microsoft-azure": {
    tools: ["Azure Portal", "Azure CLI", "Virtual Machines", "Azure Storage", "Microsoft Entra ID", "ARM / Bicep"],
    careerRoles: ["Cloud Engineer", "Azure Administrator", "Cloud Support Engineer", "DevOps Engineer"],
    materials: [
      { type: "Documentation", title: "Azure Documentation", description: "Official reference for every Azure service.", url: "https://learn.microsoft.com/azure/" },
      { type: "Tutorial", title: "Microsoft Learn: Azure", description: "Free guided learning paths for Azure fundamentals and beyond.", url: "https://learn.microsoft.com/training/azure/" },
      { type: "Documentation", title: "Azure Architecture Center", description: "Reference architectures and best-practice design guides.", url: "https://learn.microsoft.com/azure/architecture/" },
      { type: "Tutorial", title: "AZ-900 Certification", description: "Exam overview for Azure Fundamentals.", url: "https://learn.microsoft.com/credentials/certifications/azure-fundamentals/" },
    ],
  },
  salesforce: {
    tools: ["Salesforce Platform", "Apex", "Lightning Web Components", "Flows", "SOQL", "Trailhead"],
    careerRoles: ["Salesforce Administrator", "Salesforce Developer", "CRM Consultant", "Business Analyst"],
    materials: [
      { type: "Tutorial", title: "Trailhead", description: "Free, hands-on Salesforce learning modules and trails.", url: "https://trailhead.salesforce.com/" },
      { type: "Documentation", title: "Salesforce Help", description: "Official help articles for admins and users.", url: "https://help.salesforce.com/" },
      { type: "Documentation", title: "Salesforce Developers", description: "Apex, LWC and API documentation for developers.", url: "https://developer.salesforce.com/" },
    ],
  },
  itil: {
    tools: ["ServiceNow", "Jira Service Management", "Incident Management", "Change Management", "Service Desk"],
    careerRoles: ["Service Desk Analyst", "IT Service Manager", "Change Manager", "ITSM Consultant"],
    materials: [
      { type: "Documentation", title: "PeopleCert ITIL", description: "Official home of ITIL certifications and guidance.", url: "https://www.peoplecert.org/" },
      { type: "Tutorial", title: "Atlassian ITSM Guide", description: "Practical introduction to IT service management practices.", url: "https://www.atlassian.com/itsm" },
      { type: "Documentation", title: "ServiceNow Documentation", description: "Product docs for a leading ITSM platform.", url: "https://docs.servicenow.com/" },
    ],
  },
  databricks: {
    tools: ["Databricks", "Apache Spark", "PySpark", "Delta Lake", "SQL", "MLflow"],
    careerRoles: ["Data Engineer", "Big Data Developer", "Spark Developer", "Analytics Engineer"],
    materials: [
      { type: "Documentation", title: "Databricks Documentation", description: "Official docs for the Databricks platform.", url: "https://docs.databricks.com/" },
      { type: "Documentation", title: "Apache Spark Docs", description: "Programming guides for Spark SQL, DataFrames and streaming.", url: "https://spark.apache.org/docs/latest/" },
      { type: "Documentation", title: "Delta Lake", description: "Documentation for the open table format used on Databricks.", url: "https://docs.delta.io/" },
      { type: "Tutorial", title: "Databricks Learning", description: "Free training and learning paths from Databricks.", url: "https://www.databricks.com/learn" },
    ],
  },
  "data-analytics": {
    tools: ["Python", "Pandas", "Tableau", "TensorFlow", "PyTorch", "Jupyter Notebook"],
    careerRoles: ["Data Analyst", "Business Analyst", "BI Developer", "Junior ML Engineer"],
    materials: [
      { type: "Documentation", title: "pandas Documentation", description: "User guide for data cleaning and analysis in Python.", url: "https://pandas.pydata.org/docs/" },
      { type: "Documentation", title: "scikit-learn", description: "Official guides for machine learning models and evaluation.", url: "https://scikit-learn.org/stable/" },
      { type: "Tutorial", title: "Kaggle Learn", description: "Short, practical courses on Python, pandas and ML.", url: "https://www.kaggle.com/learn" },
      { type: "Tutorial", title: "Tableau Learning", description: "Free training videos for data visualization.", url: "https://www.tableau.com/learn" },
    ],
  },
};

export function getCourseExtras(id: string): CourseExtras {
  return (
    courseExtras[id] ?? {
      tools: [],
      careerRoles: [],
      materials: [],
    }
  );
}