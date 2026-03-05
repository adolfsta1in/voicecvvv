import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              color: "white",
              fontWeight: 800,
            }}
          >
            V
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.125rem" }}>VoiceCV</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <a
            href="#features"
            style={{
              color: "var(--muted)",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              transition: "color 0.2s",
            }}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            style={{
              color: "var(--muted)",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            How it works
          </a>
          <Link href="/app" className="btn-primary" style={{ padding: "10px 24px", textDecoration: "none" }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "100px 24px 80px",
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        <div
          className="animate-fade-in-up"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            background: "var(--surface)",
            border: "1px solid var(--border-color)",
            borderRadius: 100,
            fontSize: "0.8125rem",
            color: "var(--muted)",
            fontWeight: 500,
            marginBottom: 32,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          AI-powered resume builder
        </div>

        <h1
          className="animate-fade-in-up"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 24,
            animationDelay: "0.1s",
            letterSpacing: "-0.03em",
          }}
        >
          Your story becomes
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #6366f1, #818cf8, #6366f1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% 200%",
              animation: "gradient-shift 4s ease infinite",
            }}
          >
            your resume
          </span>
        </h1>

        <p
          className="animate-fade-in-up"
          style={{
            fontSize: "1.125rem",
            color: "var(--muted)",
            lineHeight: 1.7,
            maxWidth: 560,
            marginBottom: 40,
            animationDelay: "0.2s",
          }}
        >
          Stop struggling with blank pages. Just have a conversation with our AI
          assistant, and watch your professional CV build itself in real time.
        </p>

        <div
          className="animate-fade-in-up"
          style={{
            display: "flex",
            gap: 12,
            animationDelay: "0.3s",
          }}
        >
          <Link
            href="/app"
            className="btn-primary"
            style={{
              padding: "14px 32px",
              fontSize: "1rem",
              textDecoration: "none",
            }}
          >
            Start Building — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* App Preview */}
      <section
        className="animate-fade-in-up"
        style={{
          maxWidth: 1000,
          margin: "0 auto 100px",
          padding: "0 24px",
          animationDelay: "0.4s",
        }}
      >
        <div
          style={{
            borderRadius: 16,
            border: "1px solid var(--border-color)",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
            background: "var(--surface)",
          }}
        >
          {/* Browser bar mockup */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              borderBottom: "1px solid var(--border-color)",
              background: "var(--background)",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#ef4444",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#f59e0b",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#22c55e",
                }}
              />
            </div>
            <div
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: "0.75rem",
                color: "var(--muted)",
              }}
            >
              voicecv.app
            </div>
          </div>
          {/* App content */}
          <div
            style={{
              display: "flex",
              height: 400,
            }}
          >
            {/* Chat side */}
            <div
              style={{
                width: "40%",
                borderRight: "1px solid var(--border-color)",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "14px 14px 14px 4px",
                  background: "var(--background)",
                  border: "1px solid var(--border-color)",
                  fontSize: "0.8125rem",
                  color: "var(--foreground)",
                  maxWidth: "85%",
                }}
              >
                Hi! I&apos;m your CV assistant. Let&apos;s start building your resume.
                What&apos;s your name?
              </div>
              <div
                style={{
                  alignSelf: "flex-end",
                  padding: "10px 14px",
                  borderRadius: "14px 14px 4px 14px",
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  color: "white",
                  fontSize: "0.8125rem",
                  maxWidth: "85%",
                }}
              >
                I&apos;m Sarah Johnson, a product designer with 5 years of experience.
              </div>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "14px 14px 14px 4px",
                  background: "var(--background)",
                  border: "1px solid var(--border-color)",
                  fontSize: "0.8125rem",
                  color: "var(--foreground)",
                  maxWidth: "85%",
                }}
              >
                Great to meet you, Sarah! That&apos;s a fantastic field. Can you tell me
                about your most recent role?
              </div>
            </div>
            {/* CV side */}
            <div
              style={{
                flex: 1,
                padding: 20,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: 8,
                  width: "100%",
                  maxWidth: 360,
                  padding: 24,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: "#1a1a2e",
                    }}
                  >
                    Sarah Johnson
                  </div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      color: "#6366f1",
                      fontWeight: 500,
                    }}
                  >
                    Product Designer
                  </div>
                </div>
                <div
                  style={{
                    height: 2,
                    background:
                      "linear-gradient(90deg, transparent, #6366f1, transparent)",
                    marginBottom: 16,
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    height: 8,
                    background: "#f1f5f9",
                    borderRadius: 4,
                    marginBottom: 8,
                  }}
                />
                <div
                  style={{
                    width: "70%",
                    height: 8,
                    background: "#f1f5f9",
                    borderRadius: 4,
                    marginBottom: 8,
                  }}
                />
                <div
                  style={{
                    width: "85%",
                    height: 8,
                    background: "#f1f5f9",
                    borderRadius: 4,
                    marginBottom: 20,
                  }}
                />
                <div
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#6366f1",
                    borderBottom: "2px solid #6366f1",
                    paddingBottom: 3,
                    marginBottom: 8,
                  }}
                >
                  Experience
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 8,
                    background: "#f1f5f9",
                    borderRadius: 4,
                    marginBottom: 6,
                  }}
                />
                <div
                  style={{
                    width: "60%",
                    height: 8,
                    background: "#f1f5f9",
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            marginBottom: 12,
            letterSpacing: "-0.02em",
          }}
        >
          How it works
        </h2>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "1rem",
            marginBottom: 60,
          }}
        >
          Three simple steps to your perfect resume
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 32,
          }}
        >
          {[
            {
              step: "01",
              icon: "💬",
              title: "Tell Your Story",
              desc: "Chat naturally with our AI. It asks thoughtful questions about your career, experience, and achievements.",
            },
            {
              step: "02",
              icon: "✨",
              title: "AI Builds Your CV",
              desc: "Watch as your answers transform into polished, professional resume sections in real time.",
            },
            {
              step: "03",
              icon: "📄",
              title: "Export & Apply",
              desc: "Download your finished CV as a clean PDF, ready to send to employers.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: "36px 24px",
                borderRadius: 16,
                border: "1px solid var(--border-color)",
                background: "var(--surface)",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: 16,
                }}
              >
                {item.icon}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-primary)",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                STEP {item.step}
              </div>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--muted)",
                  lineHeight: 1.6,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            marginBottom: 12,
            letterSpacing: "-0.02em",
          }}
        >
          Why VoiceCV?
        </h2>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "1rem",
            marginBottom: 60,
          }}
        >
          Everything you need to create a standout resume
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}
        >
          {[
            {
              icon: "🎯",
              title: "Smart Follow-ups",
              desc: "The AI identifies weak descriptions and asks targeted questions to strengthen your experience bullets.",
            },
            {
              icon: "⚡",
              title: "Real-time Preview",
              desc: "See your CV update live as you chat. Every answer instantly shapes your professional document.",
            },
            {
              icon: "🧠",
              title: "Career Coach AI",
              desc: "Powered by advanced AI that understands career advancement and knows what recruiters look for.",
            },
            {
              icon: "📥",
              title: "One-click Export",
              desc: "Download your polished CV as a beautifully formatted PDF, ready to submit immediately.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: "28px 24px",
                borderRadius: 16,
                border: "1px solid var(--border-color)",
                background: "var(--surface)",
                textAlign: "left",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: 12 }}>
                {item.icon}
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--muted)",
                  lineHeight: 1.6,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          maxWidth: 700,
          margin: "0 auto",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            padding: "60px 40px",
            borderRadius: 24,
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #3730a3 100%)",
            color: "white",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              marginBottom: 12,
              letterSpacing: "-0.02em",
            }}
          >
            Ready to build your CV?
          </h2>
          <p
            style={{
              fontSize: "1rem",
              opacity: 0.85,
              marginBottom: 32,
              maxWidth: 440,
              margin: "0 auto 32px",
              lineHeight: 1.6,
            }}
          >
            Join thousands of professionals who built their resumes through
            conversation. It takes less than 10 minutes.
          </p>
          <Link
            href="/app"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              borderRadius: 12,
              background: "white",
              color: "#4f46e5",
              fontWeight: 700,
              fontSize: "1rem",
              textDecoration: "none",
              transition: "all 0.2s",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            Start Now — Free
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-color)",
          padding: "32px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "var(--muted)",
          fontSize: "0.8125rem",
        }}
      >
        <div>© 2025 VoiceCV. All rights reserved.</div>
        <div style={{ display: "flex", gap: 24 }}>
          <a
            href="#"
            style={{ color: "var(--muted)", textDecoration: "none" }}
          >
            Privacy
          </a>
          <a
            href="#"
            style={{ color: "var(--muted)", textDecoration: "none" }}
          >
            Terms
          </a>
          <a
            href="#"
            style={{ color: "var(--muted)", textDecoration: "none" }}
          >
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
