import { ResumeData } from "./types";

// Realistic sample data for resume preview
export const sampleResumeData: ResumeData = {
  personalInfo: {
    fullName: "Alexandru Popescu",
    jobTitle: "Senior Software Engineer",
    email: "alexandru.popescu@email.com",
    phone: "+40 721 234 567",
    location: "București, România",
    linkedin: "linkedin.com/in/alexpopescu",
    website: "alexpopescu.dev",
    summary:
      "Senior Software Engineer cu peste 7 ani de experiență în dezvoltarea de aplicații web și mobile. Specializat în React, Node.js și arhitecturi cloud. Pasionat de clean code, performanță și mentorat tehnic.",
  },
  workExperience: [
    {
      id: "1",
      company: "TechVision Solutions",
      position: "Senior Software Engineer",
      location: "București, România",
      startDate: "2021-03",
      endDate: null,
      description:
        "Lead developer pentru platforma principală de e-commerce cu peste 2M utilizatori activi lunar.",
      achievements: [
        "Arhitecturat și implementat microservicii care au redus timpul de răspuns cu 40%",
        "Mentorat echipă de 5 developeri juniori și mid-level",
        "Implementat CI/CD pipeline reducând timpul de deployment de la 2 ore la 15 minute",
        "Migrat aplicația legacy de la Angular la React, îmbunătățind performanța cu 60%",
      ],
    },
    {
      id: "2",
      company: "Digital Innovations SRL",
      position: "Full Stack Developer",
      location: "Cluj-Napoca, România",
      startDate: "2018-06",
      endDate: "2021-02",
      description:
        "Dezvoltator principal pentru aplicații B2B în industria financiară.",
      achievements: [
        "Dezvoltat dashboard de analytics folosit de peste 50 de companii",
        "Optimizat queries de bază de date reducând costurile de server cu 35%",
        "Implementat sistem de autentificare OAuth 2.0 pentru 100k+ utilizatori",
      ],
    },
    {
      id: "3",
      company: "StartUp Hub",
      position: "Junior Developer",
      location: "Timișoara, România",
      startDate: "2016-09",
      endDate: "2018-05",
      description: "Dezvoltare aplicații mobile și web pentru diverse startup-uri.",
      achievements: [
        "Creat 3 aplicații mobile de la zero până la lansare în App Store",
        "Colaborat cu echipe de design pentru implementarea pixel-perfect a UI/UX",
      ],
    },
  ],
  education: [
    {
      id: "1",
      institution: "Universitatea Politehnica București",
      degree: "Master",
      field: "Inginerie Software",
      location: "București, România",
      startDate: "2014",
      endDate: "2016",
      gpa: "9.5/10",
      achievements: ["Lucrare de disertație premiată", "Bursă de merit academic"],
    },
    {
      id: "2",
      institution: "Universitatea Politehnica București",
      degree: "Licență",
      field: "Calculatoare și Tehnologia Informației",
      location: "București, România",
      startDate: "2010",
      endDate: "2014",
      gpa: "9.2/10",
    },
  ],
  skills: [
    { id: "1", name: "React", level: "expert", category: "Frontend" },
    { id: "2", name: "TypeScript", level: "expert", category: "Languages" },
    { id: "3", name: "Node.js", level: "advanced", category: "Backend" },
    { id: "4", name: "PostgreSQL", level: "advanced", category: "Database" },
    { id: "5", name: "AWS", level: "advanced", category: "Cloud" },
    { id: "6", name: "Docker", level: "intermediate", category: "DevOps" },
    { id: "7", name: "GraphQL", level: "advanced", category: "Backend" },
    { id: "8", name: "Next.js", level: "expert", category: "Frontend" },
    { id: "9", name: "Python", level: "intermediate", category: "Languages" },
    { id: "10", name: "MongoDB", level: "intermediate", category: "Database" },
  ],
  languages: [
    { id: "1", name: "Română", level: "native" },
    { id: "2", name: "Engleză", level: "fluent" },
    { id: "3", name: "Germană", level: "conversational" },
  ],
  certifications: [
    {
      id: "1",
      name: "AWS Solutions Architect Associate",
      issuer: "Amazon Web Services",
      date: "2023",
    },
    {
      id: "2",
      name: "Google Cloud Professional Developer",
      issuer: "Google",
      date: "2022",
    },
  ],
};

// English version of sample data
export const sampleResumeDataEn: ResumeData = {
  personalInfo: {
    fullName: "Alex Johnson",
    jobTitle: "Senior Software Engineer",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexjohnson",
    website: "alexjohnson.dev",
    summary:
      "Senior Software Engineer with 7+ years of experience building scalable web and mobile applications. Specialized in React, Node.js, and cloud architectures. Passionate about clean code, performance optimization, and technical mentorship.",
  },
  workExperience: [
    {
      id: "1",
      company: "TechVision Inc.",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2021-03",
      endDate: null,
      description:
        "Lead developer for the main e-commerce platform serving 2M+ monthly active users.",
      achievements: [
        "Architected and implemented microservices reducing response time by 40%",
        "Mentored a team of 5 junior and mid-level developers",
        "Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes",
        "Migrated legacy Angular app to React, improving performance by 60%",
      ],
    },
    {
      id: "2",
      company: "Digital Innovations LLC",
      position: "Full Stack Developer",
      location: "Austin, TX",
      startDate: "2018-06",
      endDate: "2021-02",
      description:
        "Core developer for B2B applications in the financial industry.",
      achievements: [
        "Built analytics dashboard used by 50+ enterprise clients",
        "Optimized database queries reducing server costs by 35%",
        "Implemented OAuth 2.0 authentication system for 100k+ users",
      ],
    },
    {
      id: "3",
      company: "StartUp Hub",
      position: "Junior Developer",
      location: "Seattle, WA",
      startDate: "2016-09",
      endDate: "2018-05",
      description: "Developed mobile and web applications for various startups.",
      achievements: [
        "Created 3 mobile apps from scratch to App Store launch",
        "Collaborated with design teams for pixel-perfect UI/UX implementation",
      ],
    },
  ],
  education: [
    {
      id: "1",
      institution: "Stanford University",
      degree: "Master of Science",
      field: "Computer Science",
      location: "Stanford, CA",
      startDate: "2014",
      endDate: "2016",
      gpa: "3.9/4.0",
      achievements: ["Award-winning thesis", "Dean's List"],
    },
    {
      id: "2",
      institution: "UC Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "Berkeley, CA",
      startDate: "2010",
      endDate: "2014",
      gpa: "3.7/4.0",
    },
  ],
  skills: [
    { id: "1", name: "React", level: "expert", category: "Frontend" },
    { id: "2", name: "TypeScript", level: "expert", category: "Languages" },
    { id: "3", name: "Node.js", level: "advanced", category: "Backend" },
    { id: "4", name: "PostgreSQL", level: "advanced", category: "Database" },
    { id: "5", name: "AWS", level: "advanced", category: "Cloud" },
    { id: "6", name: "Docker", level: "intermediate", category: "DevOps" },
    { id: "7", name: "GraphQL", level: "advanced", category: "Backend" },
    { id: "8", name: "Next.js", level: "expert", category: "Frontend" },
    { id: "9", name: "Python", level: "intermediate", category: "Languages" },
    { id: "10", name: "MongoDB", level: "intermediate", category: "Database" },
  ],
  languages: [
    { id: "1", name: "English", level: "native" },
    { id: "2", name: "Spanish", level: "fluent" },
    { id: "3", name: "French", level: "conversational" },
  ],
  certifications: [
    {
      id: "1",
      name: "AWS Solutions Architect Associate",
      issuer: "Amazon Web Services",
      date: "2023",
    },
    {
      id: "2",
      name: "Google Cloud Professional Developer",
      issuer: "Google",
      date: "2022",
    },
  ],
};

// Empty resume data for new resumes
export const emptyResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
  },
  workExperience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
};
