import { CVData } from "./cv-types";

/**
 * Applies a dot-notation field change to the CV and returns a Partial<CVData>
 * suitable for dispatching as UPDATE_CV.
 *
 * Supported paths:
 *   "personalInfo.fullName"
 *   "summary"
 *   "experience.0.jobTitle"
 *   "experience.0.company"
 *   "experience.0.startDate"
 *   "experience.0.endDate"
 *   "experience.0.location"
 *   "experience.0.description.2"   (individual bullet)
 *   "education.0.degree"
 *   "education.0.institution"
 *   "education.0.startDate"
 *   "education.0.endDate"
 *   "education.0.location"
 *   "education.0.gpa"
 *   "skills.3"
 *   "languages.0"
 *   "certifications.0"
 */
export function applyPatch(cv: CVData, path: string, value: string): Partial<CVData> {
    const parts = path.split(".");

    if (parts[0] === "personalInfo" && parts.length === 2) {
        return {
            personalInfo: {
                ...cv.personalInfo,
                [parts[1]]: value,
            },
        };
    }

    if (parts[0] === "summary") {
        return { summary: value };
    }

    if (parts[0] === "experience" && parts.length >= 3) {
        const idx = parseInt(parts[1], 10);
        const field = parts[2];
        const updated = cv.experience.map((exp, i) => {
            if (i !== idx) return exp;
            if (field === "description" && parts.length === 4) {
                const bulletIdx = parseInt(parts[3], 10);
                const newDesc = [...exp.description];
                newDesc[bulletIdx] = value;
                return { ...exp, description: newDesc };
            }
            return { ...exp, [field]: value };
        });
        return { experience: updated };
    }

    if (parts[0] === "education" && parts.length >= 3) {
        const idx = parseInt(parts[1], 10);
        const field = parts[2];
        const updated = cv.education.map((edu, i) => {
            if (i !== idx) return edu;
            if (field === "highlights" && parts.length === 4) {
                const hIdx = parseInt(parts[3], 10);
                const newH = [...(edu.highlights ?? [])];
                newH[hIdx] = value;
                return { ...edu, highlights: newH };
            }
            return { ...edu, [field]: value };
        });
        return { education: updated };
    }

    if (parts[0] === "skills" && parts.length === 2) {
        const idx = parseInt(parts[1], 10);
        const updated = [...cv.skills];
        updated[idx] = value;
        return { skills: updated };
    }

    if (parts[0] === "languages" && parts.length === 2) {
        const idx = parseInt(parts[1], 10);
        const updated = [...(cv.languages ?? [])];
        updated[idx] = value;
        return { languages: updated };
    }

    if (parts[0] === "certifications" && parts.length === 2) {
        const idx = parseInt(parts[1], 10);
        const updated = [...(cv.certifications ?? [])];
        updated[idx] = value;
        return { certifications: updated };
    }

    return {};
}
