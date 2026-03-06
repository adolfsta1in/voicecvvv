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
        className="bg-grid-pattern"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "100px 24px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80vw",
            height: "80vh",
            background: "radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15), transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
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
              color: "var(--color-primary)",
              fontWeight: 600,
              marginBottom: 32,
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 8px rgba(34, 197, 94, 0.6)",
              }}
            />
            AI-powered resume builder
          </div>

          <h1
            className="animate-fade-in-up"
            style={{
              fontSize: "clamp(3rem, 6vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: 24,
              animationDelay: "0.1s",
              letterSpacing: "-0.03em",
            }}
          >
            Your story becomes
            <br />
            <span
              style={{
                background: "linear-gradient(to right, #6366f1, #a855f7, #6366f1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "200% auto",
                animation: "gradient-x 4s linear infinite",
              }}
            >
              your resume
            </span>
          </h1>

          <p
            className="animate-fade-in-up"
            style={{
              fontSize: "1.25rem",
              color: "var(--muted)",
              lineHeight: 1.6,
              maxWidth: 600,
              marginBottom: 48,
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
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              animationDelay: "0.3s",
            }}
          >
            <Link
              href="/app"
              className="btn-primary"
              style={{
                padding: "16px 40px",
                fontSize: "1.125rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                borderRadius: 14,
              }}
            >
              Start Building — It&apos;s Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s" }} className="group-hover:translate-x-1">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>

            {/* Social Proof */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
              <div style={{ display: "flex", marginLeft: 10 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: `var(--surface-hover)`,
                      border: "2px solid var(--background)",
                      marginLeft: -10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      overflow: "hidden"
                    }}
                  >
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=e2e8f0`} alt="User avatar" width="32" height="32" />
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ display: "flex", gap: 2, color: "#f59e0b", marginBottom: 2 }}>
                  {"★".repeat(5)}
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--muted)", fontWeight: 500 }}>
                  <strong style={{ color: "var(--foreground)" }}>10,000+</strong> CVs built
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section
        className="animate-fade-in-up animate-float"
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
              className="group hover:-translate-y-1 hover:shadow-xl"
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
              className="group hover:-translate-y-1 hover:shadow-xl"
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

      {/* FAQ Section */}
      <section
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "80px 24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              marginBottom: 12,
              letterSpacing: "-0.02em",
            }}
          >
            Frequently Asked Questions
          </h2>
          <p style={{ color: "var(--muted)" }}>Everything you need to know about VoiceCV.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            {
              q: "Is it really free to use?",
              a: "Yes! Creating your resume, chatting with our AI, and exporting to PDF is completely free."
            },
            {
              q: "How does the AI builder work?",
              a: "It acts like an expert career coach. You tell it your experiences in plain English (or any language), and it writes professional, metric-driven bullet points for you."
            },
            {
              q: "Can I customize the design later?",
              a: "Absolutely. Once the AI generates the content, you can switch between multiple premium layouts, change fonts, and adjust spacing in our visual editor."
            },
            {
              q: "Is my data private?",
              a: "We take privacy seriously. We don't sell your data to recruiters, and you can easily delete your account and all associated CVs at any time."
            }
          ].map((faq, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border-color)",
                padding: "24px",
                borderRadius: 16,
              }}
            >
              <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, marginBottom: 8, color: "var(--foreground)" }}>
                {faq.q}
              </h3>
              <p style={{ fontSize: "0.9375rem", color: "var(--muted)", lineHeight: 1.6 }}>
                {faq.a}
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
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Decorative background elements */}
          <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(40px)" }} />
          <div style={{ position: "absolute", bottom: -50, left: -50, width: 200, height: 200, background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(40px)" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <h2
              style={{
                fontSize: "2.25rem",
                fontWeight: 800,
                marginBottom: 16,
                letterSpacing: "-0.02em",
              }}
            >
              Ready to build your CV?
            </h2>
            <p
              style={{
                fontSize: "1.0625rem",
                opacity: 0.9,
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
              className="group"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "16px 36px",
                borderRadius: 12,
                background: "white",
                color: "#4f46e5",
                fontWeight: 700,
                fontSize: "1rem",
                textDecoration: "none",
                transition: "all 0.2s",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
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
                className="group-hover:translate-x-1"
                style={{ transition: "transform 0.2s" }}
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
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
          fontSize: "0.875rem",
        }}
      >
        <div>© {new Date().getFullYear()} VoiceCV. All rights reserved.</div>
        <div style={{ display: "flex", gap: 24 }}>
          <Link href="/privacy" style={{ color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }} className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" style={{ color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }} className="hover:text-foreground">
            Terms
          </Link>
          <a href="mailto:support@voicecv.app" style={{ color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }} className="hover:text-foreground">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
