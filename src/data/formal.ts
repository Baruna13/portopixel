/**
 * Text of the formal portfolio, taken from the CV (translated to English).
 * No percentages, years of experience, or other numbers that are not in the CV.
 */
export const FORMAL = {
  headline: "Software Engineer · Full Stack Developer",
  summary:
    "D4 Software Engineering Technology student at IPB University's Vocational School (semester 5), focused on Full Stack Development. Experienced in building web and mobile applications with Laravel, Express.js, React, Next.js, and Flutter. Actively works on team projects, from information systems to computer vision-based applications.",
  education: {
    school: "IPB University, Bogor",
    program: "D4 Software Engineering Technology (Teknologi Rekayasa Perangkat Lunak)",
    unit: "Vocational School",
    period: "Jul 2024 - Present",
    courses: ["Web Programming", "Mobile Programming", "Information Systems", "User Experience"],
  },
  skillGroups: [
    {
      key: "frontend",
      title: "Frontend & Mobile",
      items: ["JavaScript", "TypeScript", "React (Vite)", "Next.js", "Flutter (Dart)", "Tailwind CSS", "Responsive Design"],
    },
    {
      key: "backend",
      title: "Backend & Database",
      items: ["Laravel", "PHP", "Node.js", "Express.js", "REST API", "MySQL", "PostgreSQL", "MongoDB", "Supabase"],
    },
    { key: "design", title: "UI/UX Design", items: ["Figma", "Wireframing", "Prototyping"] },
    { key: "tools", title: "Tools", items: ["Git", "GitHub", "Vercel", "Postman", "PHPUnit"] },
  ],
  softSkills: ["Teamwork", "Communication", "Problem Solving"],
} as const;
