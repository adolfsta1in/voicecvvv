import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>
            {/* Navbar */}
            <nav
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0 48px",
                    height: 72,
                    borderBottom: "1px solid var(--border-color)",
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    background: "var(--background)",
                    backdropFilter: "blur(12px)",
                }}
            >
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", textDecoration: "none", fontWeight: 500, fontSize: "0.875rem" }} className="hover:text-foreground">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Home
                </Link>
            </nav>

            <main style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px 100px" }}>
                <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>Privacy Policy</h1>
                <p style={{ color: "var(--muted)", marginBottom: 48, fontSize: "1.125rem" }}>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                <section style={{ marginBottom: 40 }} className="chat-markdown">
                    <h3>1. Information We Collect</h3>
                    <p>
                        When you use VoiceCV, we collect the information you explicitly provide during your conversation with our AI assistant. This includes your name, work experience, education, skills, and any other professional details you choose to share for the purpose of generating your resume.
                    </p>
                    <p>
                        We securely store this information in your account so that you can revisit, edit, and export your CV at any time. We also collect basic account information such as your email address when you sign up.
                    </p>
                </section>

                <section style={{ marginBottom: 40 }} className="chat-markdown">
                    <h3>2. How We Use Your Information</h3>
                    <p>We use the information we collect strictly to:</p>
                    <ul>
                        <li>Generate, format, and improve your personal resume.</li>
                        <li>Maintain your account and provide customer support.</li>
                        <li>Improve the quality and accuracy of our AI conversations.</li>
                    </ul>
                    <p>
                        <strong>We do not sell your personal data to third parties, recruiters, or marketing agencies.</strong> Your career data belongs strictly to you.
                    </p>
                </section>

                <section style={{ marginBottom: 40 }} className="chat-markdown">
                    <h3>3. Data Retention and Deletion</h3>
                    <p>
                        We retain your CV data for as long as your account remains active. You maintain full control over your data.
                    </p>
                    <p>
                        At any time, you can delete specific CVs or permanently delete your entire account. Upon account deletion, all associated personal data and resumes are permanently removed from our active databases.
                    </p>
                </section>

                <section style={{ marginBottom: 40 }} className="chat-markdown">
                    <h3>4. Third-Party Services</h3>
                    <p>
                        To provide our services, we use trusted third-party providers (such as Supabase for database hosting and Vercel for web hosting) and large language models (to generate your CV content). These providers are strictly bound by confidentiality agreements and are only permitted to process your data as necessary to provide the service.
                    </p>
                </section>

                <section style={{ marginBottom: 40 }} className="chat-markdown">
                    <h3>Contact Us</h3>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@voicecv.app" style={{ color: "var(--color-primary)" }}>support@voicecv.app</a>.
                    </p>
                </section>
            </main>
        </div>
    );
}
