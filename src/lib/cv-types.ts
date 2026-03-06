export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  title?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  description: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights?: string[];
}

export interface CVLayout {
  sectionOrder: string[];
  themeColor?: string;
  documentSpacing?: "tight" | "normal" | "relaxed";
  fontSize?: "small" | "normal" | "large";
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages?: string[];
  certifications?: string[];
  templateId?: string;
  layout: CVLayout;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface AIResponse {
  message: string;
  cvUpdate?: Partial<CVData>;
}

export const emptyCVData: CVData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  layout: {
    sectionOrder: ["summary", "experience", "education", "certifications", "skills", "languages"],
    documentSpacing: "normal",
    fontSize: "normal",
  },
};
