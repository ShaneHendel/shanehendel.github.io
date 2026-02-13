import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ComposedChart } from "recharts";

// ─── CONFIG ──────────────────────────────────────────────
const LINKS = {
  linkedin: "https://www.linkedin.com/in/shanehendel",
  virtualResume: "https://huggingface.co/spaces/shanehendel/virtualresume",
  email: "mailto:ShaneHendel@gmail.com",
  github: "https://github.com/shanehendel",
  // Update these with actual deployed URLs:
  fraudApp: "https://fraud-detection-dashboard-shanehendel.streamlit.app/",
  kpiApp: "https://kpi-reporting-engine-shanehendel.streamlit.app/",
  monitorDemo: "#projects",
};

const PROJECTS = [
  {
    id: "fraud",
    tag: "Machine Learning",
    title: "Credit Card Fraud Detection Pipeline",
    subtitle: "End-to-end ML system with SHAP explainability and production monitoring",
    problem: "Financial institutions lose billions annually to credit card fraud. Detection systems must balance precision (minimizing false alarms that frustrate customers) with recall (catching actual fraud before losses compound).",
    approach: "Built a complete ML pipeline: feature engineering from raw transaction data (behavioral z-scores, geo-distance, transaction velocity), XGBoost classification with class-imbalance handling, SHAP-based prediction explanations, and a batch-scoring workflow that simulates production deployment.",
    impact: [
      "15 engineered features including cardholder behavioral baselines and merchant distance",
      "Configurable threshold with real-time precision/recall tradeoff visualization",
      "Per-transaction SHAP waterfall charts for analyst review",
      "Batch scoring endpoint for new transaction CSVs",
    ],
    techStack: ["Python", "XGBoost", "SHAP", "Streamlit", "Plotly", "scikit-learn"],
    liveUrl: LINKS.fraudApp,
    liveLabel: "View Interactive Demo",
    color: "#1a3a4a",
    accent: "#c9a84c",
    relevance: "Mirrors production work at Charles Schwab.  Batch-scoring ML model trained on ~30M records across ~10K agents, driving >50% reduction in flagged avoidant behaviors.",
  },
  {
    id: "monitor",
    tag: "MLOps / Monitoring",
    title: "ML Model Monitoring Dashboard",
    subtitle: "Real-time performance drift tracking, feature importance shifts, and alerting",
    problem: "Deployed ML models degrade silently. Without systematic monitoring, teams discover performance issues only after business impact has occurred — missed fraud, bad recommendations, wrong risk scores.",
    approach: "Built an interactive monitoring dashboard tracking model health across 24 simulated production batches. Includes performance drift (precision/recall/AUC over time), prediction score distribution analysis, feature importance radar comparisons, PSI-based data drift detection, confusion matrix cost analysis, and configurable SLA thresholds with automated alerting.",
    impact: [
      "5 monitoring dimensions: performance, distribution, features, drift, confusion matrix",
      "Automated alerts when metrics breach SLA thresholds",
      "Cost-impact analysis translating model errors to dollar amounts",
      "Batch-level drill-down with health status indicators",
    ],
    techStack: ["React", "Recharts", "JavaScript"],
    liveUrl: LINKS.monitorDemo,
    liveLabel: "View Interactive Demo",
    color: "#0f172a",
    accent: "#f59e0b",
    relevance: "Extends the fraud detection pipeline into production operations — the kind of monitoring infrastructure that separates one-off models from sustainable ML systems.",
  },
  {
    id: "kpi",
    tag: "Analytics Engineering",
    title: "Automated KPI Reporting Engine",
    subtitle: "Ref-table-driven KPI computation with auto-generated MBR reports",
    problem: "Operations teams waste 10–20+ hours monthly gathering KPIs, building slide decks, and formatting reports. Every new metric request means code changes, and reporting logic lives in people's heads rather than in configuration.",
    approach: "Built a YAML-driven KPI engine where every metric is defined declaratively — calculation type, target, format, commentary template. The same engine computes KPIs across any time period, generates executive commentary from templates, and exports polished PDF and PPTX business reviews. Add a new KPI by adding a YAML entry, not by writing code.",
    impact: [
      "13 KPIs across 4 categories computed from a single YAML config file",
      "Auto-generated commentary with delta calculations and target tracking",
      "One-click PDF and PPTX monthly business review export",
      "Deep-dive explorer with breakdowns by country, product, customer, and time",
    ],
    techStack: ["Python", "Streamlit", "Plotly", "ReportLab", "python-pptx", "PyYAML"],
    liveUrl: LINKS.kpiApp,
    liveLabel: "View Interactive Demo",
    color: "#1e3a2f",
    accent: "#48a078",
    relevance: "Directly mirrors Schwab work — automated MBR reporting that eliminated 15 hours of Director time monthly, and ref-table-driven systems used in the ~40K monthly view call monitoring product.",
  },
  {
    id: "chatbot",
    tag: "AI / NLP",
    title: "Virtual Resume Chatbot",
    subtitle: "AI-powered conversational interface for professional background exploration",
    problem: "Traditional resumes are static documents that can't answer follow-up questions, provide context, or adapt to what a specific recruiter or hiring manager wants to know.",
    approach: "Built an interactive chatbot application using Gradio that draws from a comprehensive knowledge base covering technical skills, work history, and interview-ready STAR format stories. Designed with professional visual polish to serve as both a networking tool and a demonstration of AI application development.",
    impact: [
      "Comprehensive knowledge base with STAR-format interview stories",
      "Professional visual design appropriate for recruiter/hiring manager use",
      "Live on HuggingFace Spaces — always accessible",
      "Demonstrates practical AI application development",
    ],
    techStack: ["Python", "Gradio", "HuggingFace Spaces", "NLP"],
    liveUrl: LINKS.virtualResume,
    liveLabel: "Chat with My Resume",
    color: "#3a1e40",
    accent: "#a87ecf",
    relevance: "Showcases AI engineering capabilities and creative problem-solving — turning a static document into an interactive experience.",
  },
];

const CAREER = [
  { period: "2022 – Present", role: "Senior Manager, Analytics Developer", company: "Charles Schwab", highlight: "30+ production reports · ML model on 30M records · Agentic AI systems" },
  { period: "2019 – 2022", role: "Senior Business Analyst / Team Lead", company: "Caliber Home Loans", highlight: "11 Power Platform automations · 30 hrs/month saved · Beeline recovery" },
  { period: "2016 – 2019", role: "Agency Owner", company: "Farmers Insurance", highlight: "P&L ownership · 15% YoY growth · Turned around 2 failing agencies" },
  { period: "2009 – 2016", role: "Senior Business Analyst", company: "Fannie Mae", highlight: "Recovered $2.3M · 1.2M loan file digitization · 80+ bank settlements" },
];

const SKILLS = [
  { category: "BI & Analytics", items: ["Tableau Server", "KPI Architecture", "Executive Reporting", "Requirements Management"] },
  { category: "Data & Query", items: ["SQL", "Google BigQuery", "Oracle", "Teradata", "Data Normalization"] },
  { category: "Programming", items: ["Python", "Alteryx", "Streamlit", "Workflow Automation"] },
  { category: "Machine Learning", items: ["XGBoost", "scikit-learn", "SHAP", "NLP / BERT", "Batch Scoring"] },
  { category: "AI Engineering", items: ["MCP Servers", "GitHub Copilot", "Agentic Systems", "LangGraph", "CrewAI"] },
  { category: "Modernization", items: ["Platform Migrations", "Metric Standardization", "Data Warehouse", "Reporting Continuity"] },
];

// ─── INTERSECTION OBSERVER HOOK ──────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── COMPONENTS ──────────────────────────────────────────

function NavBar({ activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? "12px 40px" : "18px 40px",
      background: scrolled ? "rgba(252,250,245,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid #e8e2d4" : "none",
      transition: "all 0.3s ease",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <a href="#" style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700,
        color: "#1a2332", textDecoration: "none", letterSpacing: "-0.02em",
      }}>
        S. Hendel
      </a>
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        {navItems.map((item) => (
          <a key={item.href} href={item.href} onClick={(e) => { e.preventDefault(); document.getElementById(item.href.slice(1))?.scrollIntoView({ behavior: "smooth" }); }} style={{
            fontFamily: "'Libre Franklin', sans-serif", fontSize: 13, fontWeight: 500,
            color: activeSection === item.href.slice(1) ? "#1a2332" : "#7a7060",
            textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase",
            borderBottom: activeSection === item.href.slice(1) ? "2px solid #c9a84c" : "2px solid transparent",
            paddingBottom: 2, transition: "all 0.2s",
          }}>
            {item.label}
          </a>
        ))}
        <a href={LINKS.virtualResume} target="_blank" rel="noopener noreferrer" style={{
          fontFamily: "'Libre Franklin', sans-serif", fontSize: 12, fontWeight: 600,
          color: "#fcfaf5", background: "#1a2332", padding: "7px 18px",
          borderRadius: 4, textDecoration: "none", letterSpacing: "0.04em",
          textTransform: "uppercase", transition: "background 0.2s",
        }}>
          AI Resume
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  const [ref, inView] = useInView(0.1);
  return (
    <section ref={ref} style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "120px 60px 80px", maxWidth: 1200, margin: "0 auto",
      opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(30px)",
      transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)",
    }}>
      <div style={{ maxWidth: 720 }}>
        <div style={{
          fontFamily: "'Libre Franklin', sans-serif", fontSize: 12, fontWeight: 600,
          color: "#c9a84c", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20,
        }}>
          Senior Analytics Engineer · Financial Services
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 64, fontWeight: 700,
          color: "#1a2332", lineHeight: 1.05, letterSpacing: "-0.03em", margin: 0,
        }}>
          Shane Hendel
        </h1>
        <p style={{
          fontFamily: "'Libre Franklin', sans-serif", fontSize: 18, lineHeight: 1.7,
          color: "#5a5548", marginTop: 28, maxWidth: 580,
        }}>
          I build data products that drive decisions — from Tableau reporting ecosystems
          serving executives to ML models scoring 30M records. Currently at Charles Schwab,
          building agentic AI analytics systems and automated reporting infrastructure.
        </p>
        <div style={{ display: "flex", gap: 16, marginTop: 36, flexWrap: "wrap" }}>
          <a href="#projects" onClick={(e) => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }} style={{
            fontFamily: "'Libre Franklin', sans-serif", fontSize: 13, fontWeight: 600,
            color: "#fcfaf5", background: "#1a2332", padding: "12px 28px",
            borderRadius: 4, textDecoration: "none", letterSpacing: "0.04em",
            textTransform: "uppercase", transition: "all 0.2s",
          }}>
            View Projects
          </a>
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "'Libre Franklin', sans-serif", fontSize: 13, fontWeight: 600,
            color: "#1a2332", background: "transparent", padding: "12px 28px",
            borderRadius: 4, textDecoration: "none", letterSpacing: "0.04em",
            textTransform: "uppercase", border: "1.5px solid #1a2332",
          }}>
            LinkedIn
          </a>
        </div>

        {/* Metric highlights */}
        <div style={{ display: "flex", gap: 48, marginTop: 56 }}>
          {[
            { value: "30+", label: "Production Reports" },
            { value: "30M+", label: "Records Modeled" },
            { value: "40K", label: "Monthly Report Views" },
            { value: ">50%", label: "Negative Behavior Reduction" },
          ].map((m) => (
            <div key={m.label}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700,
                color: "#1a2332",
              }}>{m.value}</div>
              <div style={{
                fontFamily: "'Libre Franklin', sans-serif", fontSize: 11, color: "#948b7a",
                letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 2,
              }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index, onDemoClick }) {
  const [ref, inView] = useInView(0.1);
  const [expanded, setExpanded] = useState(false);
  const isEven = index % 2 === 0;

  const handleCTAClick = (e) => {
    if (onDemoClick) {
      e.preventDefault();
      onDemoClick();
    }
  };

  return (
    <article ref={ref} style={{
      opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(40px)",
      transition: `all 0.7s cubic-bezier(0.22,1,0.36,1) ${index * 0.1}s`,
      marginBottom: 64,
    }}>
      {/* Tag & Title */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, marginBottom: 12,
      }}>
        <span style={{
          fontFamily: "'Libre Franklin', sans-serif", fontSize: 11, fontWeight: 600,
          color: "#c9a84c", letterSpacing: "0.08em", textTransform: "uppercase",
          background: "#c9a84c14", padding: "4px 12px", borderRadius: 3,
        }}>
          {project.tag}
        </span>
      </div>

      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700,
        color: "#1a2332", margin: 0, lineHeight: 1.15, letterSpacing: "-0.02em",
      }}>
        {project.title}
      </h3>
      <p style={{
        fontFamily: "'Libre Franklin', sans-serif", fontSize: 15, color: "#7a7060",
        marginTop: 6, marginBottom: 24,
      }}>
        {project.subtitle}
      </p>

      {/* Two-column layout */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32,
        background: "#faf8f3", borderRadius: 8, padding: 32,
        border: "1px solid #ebe6d9",
      }}>
        {/* Left: Case Study */}
        <div>
          <div style={{
            fontFamily: "'Libre Franklin', sans-serif", fontSize: 11, fontWeight: 600,
            color: "#948b7a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10,
          }}>The Problem</div>
          <p style={{
            fontFamily: "'Libre Franklin', sans-serif", fontSize: 14, lineHeight: 1.65,
            color: "#3d3830", margin: 0,
          }}>
            {project.problem}
          </p>

          <div style={{
            fontFamily: "'Libre Franklin', sans-serif", fontSize: 11, fontWeight: 600,
            color: "#948b7a", letterSpacing: "0.08em", textTransform: "uppercase",
            marginTop: 22, marginBottom: 10,
          }}>Approach</div>
          <p style={{
            fontFamily: "'Libre Franklin', sans-serif", fontSize: 14, lineHeight: 1.65,
            color: "#3d3830", margin: 0,
          }}>
            {project.approach}
          </p>
        </div>

        {/* Right: Impact & Tech */}
        <div>
          <div style={{
            fontFamily: "'Libre Franklin', sans-serif", fontSize: 11, fontWeight: 600,
            color: "#948b7a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10,
          }}>Key Outcomes</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
            {project.impact.map((item, i) => (
              <div key={i} style={{
                display: "flex", gap: 10, alignItems: "flex-start",
                fontFamily: "'Libre Franklin', sans-serif", fontSize: 13, lineHeight: 1.55, color: "#3d3830",
              }}>
                <span style={{
                  color: project.accent, fontSize: 14, marginTop: 2, flexShrink: 0,
                }}>◆</span>
                {item}
              </div>
            ))}
          </div>

          <div style={{
            fontFamily: "'Libre Franklin', sans-serif", fontSize: 11, fontWeight: 600,
            color: "#948b7a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10,
          }}>Tech Stack</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 22 }}>
            {project.techStack.map((t) => (
              <span key={t} style={{
                fontFamily: "'Libre Franklin', sans-serif", fontSize: 11, fontWeight: 500,
                color: "#5a5548", background: "#f0ece3", padding: "4px 10px", borderRadius: 3,
                border: "1px solid #e4dfd4",
              }}>{t}</span>
            ))}
          </div>

          {/* Real-world relevance */}
          <div style={{
            background: "#1e3a2f0a", border: "1px solid #1e3a2f18",
            borderRadius: 6, padding: "12px 16px", marginBottom: 20,
          }}>
            <div style={{
              fontFamily: "'Libre Franklin', sans-serif", fontSize: 10, fontWeight: 600,
              color: "#948b7a", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6,
            }}>Production Relevance</div>
            <p style={{
              fontFamily: "'Libre Franklin', sans-serif", fontSize: 12, lineHeight: 1.55,
              color: "#5a5548", margin: 0, fontStyle: "italic",
            }}>
              {project.relevance}
            </p>
          </div>

          {/* CTA */}
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={handleCTAClick} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "'Libre Franklin', sans-serif", fontSize: 13, fontWeight: 600,
            color: "#fcfaf5", background: "#0f172a", padding: "10px 22px",
            borderRadius: 4, textDecoration: "none", letterSpacing: "0.03em",
            transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >
            {project.liveLabel} →
          </a>
          <div style={{
            fontFamily: "'Libre Franklin', sans-serif", fontSize: 11, color: "#948b7a",
            marginTop: 8, fontStyle: "italic",
          }}>Live app — may take a moment to load</div>
        </div>
      </div>
    </article>
  );
}

function ExperienceSection() {
  const [ref, inView] = useInView(0.1);
  return (
    <section id="experience" ref={ref} style={{
      padding: "80px 60px", maxWidth: 1200, margin: "0 auto",
      opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(30px)",
      transition: "all 0.7s cubic-bezier(0.22,1,0.36,1)",
    }}>
      <div style={{
        fontFamily: "'Libre Franklin', sans-serif", fontSize: 12, fontWeight: 600,
        color: "#c9a84c", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12,
      }}>Career</div>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 700,
        color: "#1a2332", margin: 0, letterSpacing: "-0.02em",
      }}>Experience</h2>

      <div style={{ marginTop: 40 }}>
        {CAREER.map((job, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "180px 1fr", gap: 32,
            padding: "24px 0",
            borderBottom: i < CAREER.length - 1 ? "1px solid #ebe6d9" : "none",
          }}>
            <div>
              <div style={{
                fontFamily: "'Libre Franklin', sans-serif", fontSize: 13, fontWeight: 600,
                color: "#1a2332",
              }}>{job.period}</div>
            </div>
            <div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700,
                color: "#1a2332",
              }}>{job.role}</div>
              <div style={{
                fontFamily: "'Libre Franklin', sans-serif", fontSize: 14, fontWeight: 500,
                color: "#c9a84c", marginTop: 2,
              }}>{job.company}</div>
              <div style={{
                fontFamily: "'Libre Franklin', sans-serif", fontSize: 13, color: "#7a7060",
                marginTop: 8, lineHeight: 1.5,
              }}>{job.highlight}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32 }}>
        <div style={{
          fontFamily: "'Libre Franklin', sans-serif", fontSize: 13, color: "#948b7a",
        }}>
          <strong style={{ color: "#1a2332" }}>Education:</strong> B.S.B.A Finance — Northern Arizona University
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  const [ref, inView] = useInView(0.1);
  return (
    <section id="skills" ref={ref} style={{
      padding: "80px 60px", maxWidth: 1200, margin: "0 auto",
      opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(30px)",
      transition: "all 0.7s cubic-bezier(0.22,1,0.36,1)",
    }}>
      <div style={{
        fontFamily: "'Libre Franklin', sans-serif", fontSize: 12, fontWeight: 600,
        color: "#c9a84c", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12,
      }}>Capabilities</div>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 700,
        color: "#1a2332", margin: 0, letterSpacing: "-0.02em",
      }}>Technical Skills</h2>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 40,
      }}>
        {SKILLS.map((group) => (
          <div key={group.category} style={{
            background: "#faf8f3", border: "1px solid #ebe6d9", borderRadius: 8, padding: 24,
          }}>
            <div style={{
              fontFamily: "'Libre Franklin', sans-serif", fontSize: 11, fontWeight: 600,
              color: "#c9a84c", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14,
            }}>{group.category}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {group.items.map((item) => (
                <span key={item} style={{
                  fontFamily: "'Libre Franklin', sans-serif", fontSize: 12,
                  color: "#3d3830", background: "#f0ece3", padding: "5px 11px",
                  borderRadius: 3, border: "1px solid #e4dfd4",
                }}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  const [ref, inView] = useInView(0.1);
  return (
    <section id="contact" ref={ref} style={{
      padding: "80px 60px 100px", maxWidth: 1200, margin: "0 auto",
      opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(30px)",
      transition: "all 0.7s cubic-bezier(0.22,1,0.36,1)",
    }}>
      <div style={{
        background: "#1a2332", borderRadius: 12, padding: "56px 64px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 32,
      }}>
        <div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700,
            color: "#fcfaf5", margin: 0, letterSpacing: "-0.02em",
          }}>Let's connect.</h2>
          <p style={{
            fontFamily: "'Libre Franklin', sans-serif", fontSize: 15, color: "#948b7a",
            marginTop: 10, maxWidth: 440,
          }}>
            Open to analytics engineering, data engineering, and business intelligence engineering roles
            in financial services and tech.
          </p>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <a href={LINKS.email} style={{
            fontFamily: "'Libre Franklin', sans-serif", fontSize: 13, fontWeight: 600,
            color: "#1a2332", background: "#c9a84c", padding: "12px 28px",
            borderRadius: 4, textDecoration: "none", letterSpacing: "0.03em",
          }}>
            ShaneHendel@gmail.com
          </a>
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "'Libre Franklin', sans-serif", fontSize: 13, fontWeight: 600,
            color: "#fcfaf5", background: "transparent", padding: "12px 28px",
            borderRadius: 4, textDecoration: "none", letterSpacing: "0.03em",
            border: "1.5px solid #fcfaf550",
          }}>
            LinkedIn
          </a>
          <a href={LINKS.virtualResume} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "'Libre Franklin', sans-serif", fontSize: 13, fontWeight: 600,
            color: "#fcfaf5", background: "transparent", padding: "12px 28px",
            borderRadius: 4, textDecoration: "none", letterSpacing: "0.03em",
            border: "1.5px solid #fcfaf550",
          }}>
            AI Resume Chat
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── DATA GENERATION ──────────────────────────────────────────
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateBatchData(nBatches = 24) {
  const rng = seededRandom(42);
  const batches = [];
  const baseDate = new Date("2024-01-15");

  for (let i = 0; i < nBatches; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i * 14);

    // Simulate gradual drift: model degrades slightly over time, with a spike around batch 16-18
    const driftFactor = i > 14 ? 0.06 * (i - 14) : 0;
    const spike = i >= 16 && i <= 18 ? 0.08 : 0;

    const precision = Math.max(0.7, 0.94 - driftFactor - spike + (rng() - 0.5) * 0.04);
    const recall = Math.max(0.6, 0.89 - driftFactor * 0.8 - spike * 1.2 + (rng() - 0.5) * 0.05);
    const f1 = 2 * (precision * recall) / (precision + recall || 1);
    const rocAuc = Math.max(0.75, 0.965 - driftFactor * 0.5 - spike * 0.6 + (rng() - 0.5) * 0.02);

    const nTransactions = Math.round(38000 + rng() * 8000 + (i > 12 ? 5000 : 0));
    const fraudRate = 0.017 + driftFactor * 0.003 + (rng() - 0.5) * 0.002;
    const nFraud = Math.round(nTransactions * fraudRate);
    const nFlagged = Math.round(nFraud / recall);

    // Feature importance (simulating shifts)
    const featureImportance = {
      amt_zscore: 0.22 - driftFactor * 0.02 + rng() * 0.01,
      distance_to_merchant: 0.18 + driftFactor * 0.015 + rng() * 0.01,
      log_amt: 0.14 - driftFactor * 0.005 + rng() * 0.008,
      tx_frequency_1h: 0.11 + driftFactor * 0.01 + rng() * 0.006,
      is_night: 0.09 + spike * 0.03 + rng() * 0.005,
      category_fraud_rate: 0.08 - driftFactor * 0.008 + rng() * 0.004,
      amt_to_median_ratio: 0.07 + rng() * 0.005,
      age: 0.04 + rng() * 0.003,
      log_city_pop: 0.03 + rng() * 0.002,
      day_of_week: 0.02 + rng() * 0.002,
    };

    // Feature drift (PSI - Population Stability Index)
    const featureDrift = {
      amt_zscore: 0.01 + driftFactor * 0.08 + rng() * 0.01,
      distance_to_merchant: 0.02 + driftFactor * 0.12 + rng() * 0.015,
      log_amt: 0.008 + driftFactor * 0.04 + rng() * 0.008,
      tx_frequency_1h: 0.015 + driftFactor * 0.06 + spike * 0.1 + rng() * 0.01,
      is_night: 0.005 + spike * 0.15 + rng() * 0.005,
      category_fraud_rate: 0.01 + driftFactor * 0.03 + rng() * 0.008,
    };

    // Prediction distribution stats
    const predMeanLegit = 0.05 + driftFactor * 0.02 + rng() * 0.01;
    const predMeanFraud = 0.82 - driftFactor * 0.04 - spike * 0.06 + rng() * 0.03;

    batches.push({
      batch: i + 1,
      date: date.toISOString().split("T")[0],
      dateLabel: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      precision: +precision.toFixed(4),
      recall: +recall.toFixed(4),
      f1: +f1.toFixed(4),
      rocAuc: +rocAuc.toFixed(4),
      nTransactions,
      nFraud,
      nFlagged,
      fraudRate: +fraudRate.toFixed(4),
      flagRate: +(nFlagged / nTransactions).toFixed(4),
      falsePositiveRate: +((nFlagged - nFraud * recall) / (nTransactions - nFraud)).toFixed(5),
      featureImportance,
      featureDrift,
      predMeanLegit: +predMeanLegit.toFixed(4),
      predMeanFraud: +predMeanFraud.toFixed(4),
      predSeparation: +(predMeanFraud - predMeanLegit).toFixed(4),
      tp: Math.round(nFraud * recall),
      fp: Math.round(nFlagged - nFraud * recall),
      fn: Math.round(nFraud * (1 - recall)),
      tn: Math.round(nTransactions - nFlagged - nFraud * (1 - recall)),
    });
  }
  return batches;
}

function generateScoreDistribution(batch, rng_seed = 99) {
  const rng = seededRandom(rng_seed + batch.batch);
  const bins = [];
  for (let b = 0; b < 20; b++) {
    const center = (b + 0.5) / 20;
    const legitDensity = Math.exp(-((center - batch.predMeanLegit) ** 2) / (2 * 0.04 ** 2)) * 800;
    const fraudDensity = Math.exp(-((center - batch.predMeanFraud) ** 2) / (2 * 0.1 ** 2)) * 40;
    bins.push({
      bin: center.toFixed(2),
      binLabel: `${(b * 5).toString()}–${((b + 1) * 5).toString()}%`,
      legitimate: Math.round(legitDensity + rng() * 20),
      fraud: Math.round(fraudDensity + rng() * 3),
    });
  }
  return bins;
}

// ─── THEME & CONSTANTS ──────────────────────────────────────
const COLORS = {
  bg: "#0a0e17",
  surface: "#111827",
  surfaceHover: "#1a2234",
  border: "#1e293b",
  borderActive: "#334155",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#475569",
  accent: "#f59e0b",
  accentDim: "rgba(245,158,11,0.15)",
  danger: "#ef4444",
  dangerDim: "rgba(239,68,68,0.12)",
  success: "#10b981",
  successDim: "rgba(16,185,129,0.12)",
  info: "#3b82f6",
  infoDim: "rgba(59,130,246,0.12)",
  cyan: "#06b6d4",
  purple: "#a78bfa",
  grid: "#1e293b",
  tooltipBg: "#1e293b",
};

const THRESHOLDS = { precision: 0.85, recall: 0.80, rocAuc: 0.90, psi: 0.1 };

// ─── COMPONENTS ──────────────────────────────────────────────

function StatusBadge({ status }) {
  const config = {
    healthy: { color: COLORS.success, bg: COLORS.successDim, label: "HEALTHY" },
    warning: { color: COLORS.accent, bg: COLORS.accentDim, label: "WARNING" },
    critical: { color: COLORS.danger, bg: COLORS.dangerDim, label: "CRITICAL" },
    degraded: { color: COLORS.purple, bg: "rgba(167,139,250,0.12)", label: "DEGRADED" },
  };
  const c = config[status] || config.healthy;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700,
      fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.08em",
      color: c.color, background: c.bg, border: `1px solid ${c.color}30`,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%", background: c.color,
        boxShadow: `0 0 6px ${c.color}`,
        animation: status === "critical" ? "pulse 1.5s infinite" : "none",
      }} />
      {c.label}
    </span>
  );
}

function MetricCard({ label, value, unit, delta, status, subtitle }) {
  const deltaColor = delta > 0 ? COLORS.success : delta < 0 ? COLORS.danger : COLORS.textMuted;
  const borderColor = status === "critical" ? COLORS.danger : status === "warning" ? COLORS.accent : COLORS.border;
  return (
    <div style={{
      background: COLORS.surface, border: `1px solid ${borderColor}`,
      borderRadius: 8, padding: "16px 20px", minWidth: 0, flex: 1,
      borderTop: status === "critical" ? `2px solid ${COLORS.danger}` : status === "warning" ? `2px solid ${COLORS.accent}` : "none",
    }}>
      <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: COLORS.text, fontFamily: "'Outfit', sans-serif" }}>
          {value}
        </span>
        {unit && <span style={{ fontSize: 13, color: COLORS.textMuted }}>{unit}</span>}
      </div>
      {delta !== undefined && (
        <div style={{ fontSize: 12, color: deltaColor, fontFamily: "'IBM Plex Mono', monospace", marginTop: 4 }}>
          {delta > 0 ? "▲" : delta < 0 ? "▼" : "─"} {Math.abs(delta).toFixed(3)} vs prev
        </div>
      )}
      {subtitle && <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}

function SectionHeader({ title, subtitle, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16, marginTop: 32 }}>
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: 0, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.01em" }}>{title}</h2>
        {subtitle && <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

function AlertRow({ alerts }) {
  if (!alerts.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
      {alerts.map((a, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "8px 14px",
          borderRadius: 6, fontSize: 13, fontFamily: "'IBM Plex Mono', monospace",
          background: a.level === "critical" ? COLORS.dangerDim : COLORS.accentDim,
          border: `1px solid ${a.level === "critical" ? COLORS.danger : COLORS.accent}30`,
          color: a.level === "critical" ? COLORS.danger : COLORS.accent,
        }}>
          <span style={{ fontSize: 15 }}>{a.level === "critical" ? "⚠" : "◈"}</span>
          <span>{a.message}</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: COLORS.textDim }}>{a.batch}</span>
        </div>
      ))}
    </div>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 16px", borderRadius: 5, border: `1px solid ${active ? COLORS.accent : COLORS.border}`,
      background: active ? COLORS.accentDim : "transparent",
      color: active ? COLORS.accent : COLORS.textMuted,
      fontSize: 12, fontWeight: 600, cursor: "pointer",
      fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.03em",
      transition: "all 0.15s",
    }}>
      {label}
    </button>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: COLORS.tooltipBg, border: `1px solid ${COLORS.borderActive}`,
      borderRadius: 6, padding: "10px 14px", fontSize: 12,
      fontFamily: "'IBM Plex Mono', monospace", boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    }}>
      <div style={{ color: COLORS.textMuted, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "2px 0" }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
          <span style={{ color: COLORS.textMuted }}>{p.name}:</span>
          <span style={{ color: COLORS.text, fontWeight: 600 }}>{typeof p.value === "number" ? p.value.toFixed(4) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────

function ModelMonitoringDashboard() {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [activeTab, setActiveTab] = useState("performance");
  const [threshold, setThreshold] = useState(0.5);
  const [animatedIn, setAnimatedIn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimatedIn(true), 100);
    return () => clearTimeout(t);
  }, []);

  const batches = useMemo(() => generateBatchData(24), []);
  const latest = batches[batches.length - 1];
  const prev = batches[batches.length - 2];
  const current = selectedBatch !== null ? batches[selectedBatch] : latest;
  const scoreDistribution = useMemo(() => generateScoreDistribution(current), [current]);

  // Determine overall health
  const getStatus = useCallback((batch) => {
    if (batch.precision < THRESHOLDS.precision - 0.05 || batch.recall < THRESHOLDS.recall - 0.05) return "critical";
    if (batch.precision < THRESHOLDS.precision || batch.recall < THRESHOLDS.recall) return "warning";
    const maxPSI = Math.max(...Object.values(batch.featureDrift));
    if (maxPSI > THRESHOLDS.psi * 1.5) return "critical";
    if (maxPSI > THRESHOLDS.psi) return "warning";
    return "healthy";
  }, []);

  // Generate alerts
  const alerts = useMemo(() => {
    const a = [];
    batches.slice(-6).forEach((b) => {
      if (b.recall < THRESHOLDS.recall)
        a.push({ level: "critical", message: `Recall dropped to ${(b.recall * 100).toFixed(1)}% — below ${THRESHOLDS.recall * 100}% threshold`, batch: `Batch ${b.batch}` });
      if (b.precision < THRESHOLDS.precision)
        a.push({ level: "warning", message: `Precision at ${(b.precision * 100).toFixed(1)}% — approaching threshold`, batch: `Batch ${b.batch}` });
      const maxDrift = Math.max(...Object.values(b.featureDrift));
      if (maxDrift > THRESHOLDS.psi)
        a.push({ level: b.recall < THRESHOLDS.recall ? "critical" : "warning", message: `Feature drift detected (PSI=${maxDrift.toFixed(3)})`, batch: `Batch ${b.batch}` });
    });
    return a.slice(-4);
  }, [batches]);

  // Feature importance for radar
  const radarData = useMemo(() => {
    const baseline = batches[0].featureImportance;
    const curr = current.featureImportance;
    return Object.keys(baseline).slice(0, 8).map((k) => ({
      feature: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      featureKey: k,
      baseline: +(baseline[k] * 100).toFixed(1),
      current: +(curr[k] * 100).toFixed(1),
    }));
  }, [batches, current]);

  // Drift data for bar chart
  const driftData = useMemo(() => {
    return Object.entries(current.featureDrift)
      .map(([k, v]) => ({ feature: k.replace(/_/g, " "), psi: +v.toFixed(4), alert: v > THRESHOLDS.psi }))
      .sort((a, b) => b.psi - a.psi);
  }, [current]);

  // Confusion matrix
  const confusionData = useMemo(() => {
    const { tp, fp, fn, tn } = current;
    const total = tp + fp + fn + tn;
    return { tp, fp, fn, tn, total };
  }, [current]);

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, color: COLORS.text,
      fontFamily: "'Outfit', sans-serif", padding: 0,
      opacity: animatedIn ? 1 : 0, transition: "opacity 0.6s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .anim-in { animation: slideUp 0.4s ease both; }
        .batch-dot { cursor: pointer; transition: all 0.15s; }
        .batch-dot:hover { transform: scale(1.3); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.borderActive}; border-radius: 3px; }
        input[type=range] { -webkit-appearance: none; height: 4px; background: ${COLORS.border}; border-radius: 2px; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: ${COLORS.accent}; cursor: pointer; border: 2px solid ${COLORS.bg}; }
      `}</style>

      {/* ─── HEADER ─── */}
      <div style={{
        padding: "20px 32px", borderBottom: `1px solid ${COLORS.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 100%)`,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 6,
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.danger})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 800, color: COLORS.bg,
            }}>◆</div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
              Fraud Detection Model Monitor
            </h1>
          </div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4, fontFamily: "'IBM Plex Mono', monospace" }}>
            XGBoost v2.0 · Credit Card Fraud Pipeline · {batches.length} batches tracked
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <StatusBadge status={getStatus(latest)} />
          <div style={{ fontSize: 11, color: COLORS.textDim, fontFamily: "'IBM Plex Mono', monospace", textAlign: "right" }}>
            <div>Latest: {latest.dateLabel}</div>
            <div>{latest.nTransactions.toLocaleString()} txns scored</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 32px 40px", maxWidth: 1440, margin: "0 auto" }}>

        {/* ─── ALERTS ─── */}
        {alerts.length > 0 && (
          <div className="anim-in" style={{ animationDelay: "0.1s", marginTop: 20 }}>
            <AlertRow alerts={alerts} />
          </div>
        )}

        {/* ─── KPI ROW ─── */}
        <div className="anim-in" style={{ display: "flex", gap: 12, marginTop: 20, animationDelay: "0.15s", flexWrap: "wrap" }}>
          <MetricCard label="ROC AUC" value={current.rocAuc.toFixed(3)} delta={current.rocAuc - prev.rocAuc} status={current.rocAuc < THRESHOLDS.rocAuc ? "warning" : undefined} />
          <MetricCard label="Precision" value={(current.precision * 100).toFixed(1)} unit="%" delta={current.precision - prev.precision} status={current.precision < THRESHOLDS.precision ? "warning" : undefined} />
          <MetricCard label="Recall" value={(current.recall * 100).toFixed(1)} unit="%" delta={current.recall - prev.recall} status={current.recall < THRESHOLDS.recall ? "critical" : undefined} />
          <MetricCard label="F1 Score" value={current.f1.toFixed(3)} delta={current.f1 - prev.f1} />
          <MetricCard label="Fraud Rate" value={(current.fraudRate * 100).toFixed(2)} unit="%" subtitle={`${current.nFraud.toLocaleString()} of ${current.nTransactions.toLocaleString()}`} />
          <MetricCard label="Flagged" value={current.nFlagged.toLocaleString()} subtitle={`Flag rate: ${(current.flagRate * 100).toFixed(2)}%`} />
        </div>

        {/* ─── TABS ─── */}
        <div style={{ display: "flex", gap: 8, marginTop: 28, flexWrap: "wrap" }}>
          {[
            ["performance", "Performance Drift"],
            ["distribution", "Score Distribution"],
            ["features", "Feature Analysis"],
            ["drift", "Data Drift"],
            ["confusion", "Confusion Matrix"],
          ].map(([key, label]) => (
            <TabButton key={key} label={label} active={activeTab === key} onClick={() => setActiveTab(key)} />
          ))}
        </div>

        {/* ─── BATCH SELECTOR ─── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20, padding: "10px 16px", background: COLORS.surface, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
          <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>BATCH:</span>
          <div style={{ display: "flex", gap: 4, flex: 1, flexWrap: "wrap" }}>
            {batches.map((b, i) => {
              const s = getStatus(b);
              const isSelected = selectedBatch === i || (selectedBatch === null && i === batches.length - 1);
              const dotColor = s === "critical" ? COLORS.danger : s === "warning" ? COLORS.accent : COLORS.success;
              return (
                <div key={i} className="batch-dot" onClick={() => setSelectedBatch(i)}
                  title={`Batch ${b.batch} · ${b.dateLabel}\nAUC: ${b.rocAuc.toFixed(3)} · P: ${(b.precision*100).toFixed(1)}% · R: ${(b.recall*100).toFixed(1)}%`}
                  style={{
                    width: isSelected ? 18 : 12, height: isSelected ? 18 : 12,
                    borderRadius: 3, background: isSelected ? dotColor : `${dotColor}50`,
                    border: isSelected ? `2px solid ${dotColor}` : "none",
                    boxShadow: isSelected ? `0 0 8px ${dotColor}60` : "none",
                  }}
                />
              );
            })}
          </div>
          <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
            B{current.batch} · {current.dateLabel}
          </span>
        </div>

        {/* ─── PERFORMANCE DRIFT TAB ─── */}
        {activeTab === "performance" && (
          <div className="anim-in">
            <SectionHeader title="Model Performance Over Time" subtitle="Bi-weekly batch scoring metrics with SLA thresholds" />
            <div style={{ background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: "20px 16px" }}>
              <ResponsiveContainer width="100%" height={360}>
                <ComposedChart data={batches} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                  <XAxis dataKey="dateLabel" tick={{ fill: COLORS.textMuted, fontSize: 11, fontFamily: "'IBM Plex Mono'" }} />
                  <YAxis domain={[0.6, 1.0]} tick={{ fill: COLORS.textMuted, fontSize: 11, fontFamily: "'IBM Plex Mono'" }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={THRESHOLDS.precision} stroke={COLORS.accent} strokeDasharray="6 4" label={{ value: "Precision SLA", fill: COLORS.accent, fontSize: 10, fontFamily: "'IBM Plex Mono'" }} />
                  <ReferenceLine y={THRESHOLDS.recall} stroke={COLORS.danger} strokeDasharray="6 4" label={{ value: "Recall SLA", fill: COLORS.danger, fontSize: 10, fontFamily: "'IBM Plex Mono'" }} />
                  <Area type="monotone" dataKey="rocAuc" fill={COLORS.infoDim} stroke="none" />
                  <Line type="monotone" dataKey="rocAuc" stroke={COLORS.info} strokeWidth={2} dot={false} name="ROC AUC" />
                  <Line type="monotone" dataKey="precision" stroke={COLORS.accent} strokeWidth={2} dot={false} name="Precision" />
                  <Line type="monotone" dataKey="recall" stroke={COLORS.danger} strokeWidth={2} dot={false} name="Recall" />
                  <Line type="monotone" dataKey="f1" stroke={COLORS.purple} strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="F1" />
                  <Legend iconType="line" wrapperStyle={{ fontSize: 11, fontFamily: "'IBM Plex Mono'" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
              <div style={{ background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: "20px 16px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 12 }}>Transaction Volume</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={batches}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                    <XAxis dataKey="dateLabel" tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: "'IBM Plex Mono'" }} />
                    <YAxis tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: "'IBM Plex Mono'" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="nTransactions" fill={COLORS.infoDim} stroke={COLORS.info} strokeWidth={1.5} name="Transactions" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: "20px 16px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 12 }}>Fraud Rate Trend</div>
                <ResponsiveContainer width="100%" height={200}>
                  <ComposedChart data={batches}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                    <XAxis dataKey="dateLabel" tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: "'IBM Plex Mono'" }} />
                    <YAxis tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: "'IBM Plex Mono'" }} tickFormatter={(v) => `${(v * 100).toFixed(1)}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="fraudRate" fill={COLORS.dangerDim} stroke={COLORS.danger} strokeWidth={1.5} name="Fraud Rate" />
                    <Line type="monotone" dataKey="flagRate" stroke={COLORS.accent} strokeWidth={1.5} dot={false} name="Flag Rate" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ─── SCORE DISTRIBUTION TAB ─── */}
        {activeTab === "distribution" && (
          <div className="anim-in">
            <SectionHeader title="Prediction Score Distribution" subtitle={`Batch ${current.batch} · ${current.dateLabel} · Separation: ${current.predSeparation.toFixed(3)}`}
              right={
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>
                    Threshold: {threshold.toFixed(2)}
                  </span>
                  <input type="range" min="0.1" max="0.95" step="0.05" value={threshold}
                    onChange={(e) => setThreshold(+e.target.value)} style={{ width: 120 }} />
                </div>
              }
            />
            <div style={{ background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: "20px 16px" }}>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={scoreDistribution} barCategoryGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                  <XAxis dataKey="bin" tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: "'IBM Plex Mono'" }} label={{ value: "Fraud Probability", position: "insideBottom", offset: -2, fill: COLORS.textMuted, fontSize: 11 }} />
                  <YAxis tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: "'IBM Plex Mono'" }} label={{ value: "Count", angle: -90, position: "insideLeft", fill: COLORS.textMuted, fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="legitimate" stackId="a" fill={COLORS.info} opacity={0.6} name="Legitimate" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="fraud" stackId="a" fill={COLORS.danger} name="Fraud" radius={[2, 2, 0, 0]} />
                  <ReferenceLine x={threshold.toFixed(2)} stroke={COLORS.accent} strokeWidth={2} strokeDasharray="6 4" label={{ value: `T=${threshold}`, fill: COLORS.accent, fontSize: 11, fontFamily: "'IBM Plex Mono'" }} />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: "'IBM Plex Mono'" }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <SectionHeader title="Class Separation Over Time" subtitle="Gap between mean fraud and legitimate prediction scores" />
            <div style={{ background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: "20px 16px" }}>
              <ResponsiveContainer width="100%" height={240}>
                <ComposedChart data={batches}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                  <XAxis dataKey="dateLabel" tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: "'IBM Plex Mono'" }} />
                  <YAxis tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: "'IBM Plex Mono'" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="predSeparation" fill={COLORS.accentDim} stroke={COLORS.accent} strokeWidth={2} name="Separation" />
                  <Line type="monotone" dataKey="predMeanFraud" stroke={COLORS.danger} strokeWidth={1.5} dot={false} name="Mean (Fraud)" />
                  <Line type="monotone" dataKey="predMeanLegit" stroke={COLORS.info} strokeWidth={1.5} dot={false} name="Mean (Legit)" />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: "'IBM Plex Mono'" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ─── FEATURE ANALYSIS TAB ─── */}
        {activeTab === "features" && (
          <div className="anim-in">
            <SectionHeader title="Feature Importance Comparison" subtitle="Baseline (Batch 1) vs Current selection — shift detection" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: "20px 16px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 16 }}>Radar Comparison</div>
                <ResponsiveContainer width="100%" height={360}>
                  <RadarChart data={radarData} outerRadius={120}>
                    <PolarGrid stroke={COLORS.grid} />
                    <PolarAngleAxis dataKey="feature" tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: "'IBM Plex Mono'" }} />
                    <PolarRadiusAxis tick={{ fill: COLORS.textDim, fontSize: 9 }} />
                    <Radar name="Baseline" dataKey="baseline" stroke={COLORS.info} fill={COLORS.infoDim} fillOpacity={0.3} strokeWidth={2} />
                    <Radar name="Current" dataKey="current" stroke={COLORS.accent} fill={COLORS.accentDim} fillOpacity={0.3} strokeWidth={2} />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: "'IBM Plex Mono'" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: "20px 16px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 16 }}>Importance Bar Chart</div>
                <ResponsiveContainer width="100%" height={360}>
                  <BarChart data={radarData.sort((a, b) => b.current - a.current)} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                    <XAxis type="number" tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: "'IBM Plex Mono'" }} />
                    <YAxis type="category" dataKey="feature" tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: "'IBM Plex Mono'" }} width={130} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="baseline" fill={COLORS.info} opacity={0.5} name="Baseline" barSize={10} radius={[0, 3, 3, 0]} />
                    <Bar dataKey="current" fill={COLORS.accent} name="Current" barSize={10} radius={[0, 3, 3, 0]} />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: "'IBM Plex Mono'" }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Importance heatmap over time */}
            <SectionHeader title="Importance Trend Heatmap" subtitle="Top features across all batches" />
            <div style={{ background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: "20px 16px", overflowX: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: `140px repeat(${batches.length}, 1fr)`, gap: 1, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }}>
                <div style={{ padding: "6px 8px", color: COLORS.textMuted }}>Feature \ Batch</div>
                {batches.map((b, i) => (
                  <div key={i} style={{ padding: "6px 2px", color: COLORS.textMuted, textAlign: "center", fontSize: 9 }}>{b.batch}</div>
                ))}
                {Object.keys(batches[0].featureImportance).slice(0, 6).map((feat) => (
                  [
                    <div key={`l-${feat}`} style={{ padding: "6px 8px", color: COLORS.textMuted, whiteSpace: "nowrap" }}>
                      {feat.replace(/_/g, " ")}
                    </div>,
                    ...batches.map((b, i) => {
                      const val = b.featureImportance[feat];
                      const intensity = Math.min(1, val / 0.25);
                      return (
                        <div key={`${feat}-${i}`} style={{
                          padding: "6px 2px", textAlign: "center",
                          background: `rgba(245, 158, 11, ${intensity * 0.6})`,
                          color: intensity > 0.4 ? COLORS.bg : COLORS.textMuted,
                          fontWeight: intensity > 0.4 ? 600 : 400,
                          borderRadius: 2,
                        }}>
                          {(val * 100).toFixed(0)}
                        </div>
                      );
                    })
                  ]
                )).flat()}
              </div>
            </div>
          </div>
        )}

        {/* ─── DATA DRIFT TAB ─── */}
        {activeTab === "drift" && (
          <div className="anim-in">
            <SectionHeader title="Feature Data Drift (PSI)" subtitle={`Population Stability Index · Batch ${current.batch} vs Training Baseline`} />
            <div style={{ background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: "20px 16px" }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={driftData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                  <XAxis type="number" tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: "'IBM Plex Mono'" }} />
                  <YAxis type="category" dataKey="feature" tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: "'IBM Plex Mono'" }} width={130} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine x={THRESHOLDS.psi} stroke={COLORS.accent} strokeDasharray="6 4" label={{ value: "PSI Threshold", fill: COLORS.accent, fontSize: 10 }} />
                  <Bar dataKey="psi" name="PSI" barSize={16} radius={[0, 4, 4, 0]}>
                    {driftData.map((d, i) => (
                      <Cell key={i} fill={d.alert ? COLORS.danger : COLORS.info} opacity={d.alert ? 0.9 : 0.6} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <SectionHeader title="Drift Trend Over Time" subtitle="PSI evolution for top features across batches" />
            <div style={{ background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: "20px 16px" }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={batches}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                  <XAxis dataKey="dateLabel" tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: "'IBM Plex Mono'" }} />
                  <YAxis tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: "'IBM Plex Mono'" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={THRESHOLDS.psi} stroke={COLORS.accent} strokeDasharray="6 4" />
                  {["distance_to_merchant", "tx_frequency_1h", "amt_zscore", "is_night"].map((feat, i) => {
                    const colors = [COLORS.danger, COLORS.accent, COLORS.info, COLORS.purple];
                    return (
                      <Line key={feat} type="monotone"
                        dataKey={(d) => d.featureDrift[feat]}
                        stroke={colors[i]} strokeWidth={1.5} dot={false}
                        name={feat.replace(/_/g, " ")}
                      />
                    );
                  })}
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: "'IBM Plex Mono'" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Drift summary table */}
            <div style={{ background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 20, marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 12 }}>Drift Assessment Summary</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 120px", gap: 0, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                <div style={{ padding: "8px 12px", color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}`, fontWeight: 600 }}>Feature</div>
                <div style={{ padding: "8px 12px", color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}`, fontWeight: 600, textAlign: "right" }}>PSI</div>
                <div style={{ padding: "8px 12px", color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}`, fontWeight: 600, textAlign: "right" }}>Δ Importance</div>
                <div style={{ padding: "8px 12px", color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}`, fontWeight: 600, textAlign: "center" }}>Status</div>
                {driftData.map((d) => {
                  const feat = d.feature.replace(/ /g, "_");
                  const impShift = (current.featureImportance[feat] || 0) - (batches[0].featureImportance[feat] || 0);
                  return [
                    <div key={`n-${feat}`} style={{ padding: "8px 12px", color: COLORS.text, borderBottom: `1px solid ${COLORS.border}` }}>{d.feature}</div>,
                    <div key={`p-${feat}`} style={{ padding: "8px 12px", color: d.alert ? COLORS.danger : COLORS.text, borderBottom: `1px solid ${COLORS.border}`, textAlign: "right", fontWeight: d.alert ? 700 : 400 }}>{d.psi.toFixed(4)}</div>,
                    <div key={`i-${feat}`} style={{ padding: "8px 12px", color: Math.abs(impShift) > 0.02 ? COLORS.accent : COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}`, textAlign: "right" }}>{impShift > 0 ? "+" : ""}{(impShift * 100).toFixed(1)}%</div>,
                    <div key={`s-${feat}`} style={{ padding: "8px 12px", borderBottom: `1px solid ${COLORS.border}`, textAlign: "center" }}>
                      <StatusBadge status={d.psi > THRESHOLDS.psi * 1.5 ? "critical" : d.psi > THRESHOLDS.psi ? "warning" : "healthy"} />
                    </div>,
                  ];
                }).flat()}
              </div>
            </div>
          </div>
        )}

        {/* ─── CONFUSION MATRIX TAB ─── */}
        {activeTab === "confusion" && (
          <div className="anim-in">
            <SectionHeader title="Confusion Matrix" subtitle={`Batch ${current.batch} · ${current.dateLabel} · Threshold: ${threshold.toFixed(2)}`}
              right={
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>
                    Threshold: {threshold.toFixed(2)}
                  </span>
                  <input type="range" min="0.1" max="0.95" step="0.05" value={threshold}
                    onChange={(e) => setThreshold(+e.target.value)} style={{ width: 120 }} />
                </div>
              }
            />
            <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20 }}>
              {/* Matrix visual */}
              <div style={{ background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", gridTemplateRows: "40px 1fr 1fr", gap: 4 }}>
                  <div />
                  <div style={{ textAlign: "center", fontSize: 11, color: COLORS.textMuted, fontFamily: "'IBM Plex Mono', monospace", alignSelf: "end", paddingBottom: 8 }}>Pred: Legit</div>
                  <div style={{ textAlign: "center", fontSize: 11, color: COLORS.textMuted, fontFamily: "'IBM Plex Mono', monospace", alignSelf: "end", paddingBottom: 8 }}>Pred: Fraud</div>

                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "'IBM Plex Mono', monospace", display: "flex", alignItems: "center", justifyContent: "center" }}>Act: Legit</div>
                  <div style={{
                    background: `rgba(16, 185, 129, ${Math.min(0.4, confusionData.tn / confusionData.total * 3)})`,
                    borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    padding: 20, border: `1px solid ${COLORS.success}30`,
                  }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.success }}>{confusionData.tn.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 4 }}>True Negative</div>
                  </div>
                  <div style={{
                    background: COLORS.accentDim, borderRadius: 8,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    padding: 20, border: `1px solid ${COLORS.accent}30`,
                  }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.accent }}>{confusionData.fp.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 4 }}>False Positive</div>
                  </div>

                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "'IBM Plex Mono', monospace", display: "flex", alignItems: "center", justifyContent: "center" }}>Act: Fraud</div>
                  <div style={{
                    background: COLORS.dangerDim, borderRadius: 8,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    padding: 20, border: `1px solid ${COLORS.danger}30`,
                  }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.danger }}>{confusionData.fn.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 4 }}>False Negative</div>
                  </div>
                  <div style={{
                    background: `rgba(16, 185, 129, 0.15)`, borderRadius: 8,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    padding: 20, border: `1px solid ${COLORS.success}30`,
                  }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.success }}>{confusionData.tp.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 4 }}>True Positive</div>
                  </div>
                </div>
              </div>

              {/* Derived metrics */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 16 }}>Derived Metrics</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    {[
                      { label: "Accuracy", value: ((confusionData.tp + confusionData.tn) / confusionData.total * 100).toFixed(2) + "%" },
                      { label: "Precision", value: (confusionData.tp / (confusionData.tp + confusionData.fp) * 100).toFixed(2) + "%" },
                      { label: "Recall", value: (confusionData.tp / (confusionData.tp + confusionData.fn) * 100).toFixed(2) + "%" },
                      { label: "Specificity", value: (confusionData.tn / (confusionData.tn + confusionData.fp) * 100).toFixed(2) + "%" },
                      { label: "False Pos Rate", value: (confusionData.fp / (confusionData.fp + confusionData.tn) * 100).toFixed(3) + "%" },
                      { label: "Neg Pred Value", value: (confusionData.tn / (confusionData.tn + confusionData.fn) * 100).toFixed(2) + "%" },
                    ].map((m) => (
                      <div key={m.label} style={{ padding: "12px 16px", background: COLORS.bg, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
                        <div style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>{m.label}</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginTop: 4, fontFamily: "'Outfit', sans-serif" }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 12 }}>Cost Analysis</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.8 }}>
                    <div>False Negatives (missed fraud): <span style={{ color: COLORS.danger, fontWeight: 600 }}>{confusionData.fn.toLocaleString()}</span> · Est. loss: <span style={{ color: COLORS.danger, fontWeight: 600 }}>${(confusionData.fn * 487).toLocaleString()}</span></div>
                    <div>False Positives (false alarms): <span style={{ color: COLORS.accent, fontWeight: 600 }}>{confusionData.fp.toLocaleString()}</span> · Est. review cost: <span style={{ color: COLORS.accent, fontWeight: 600 }}>${(confusionData.fp * 12).toLocaleString()}</span></div>
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${COLORS.border}`, color: COLORS.text }}>
                      Net cost impact: <span style={{ fontWeight: 700, color: COLORS.text }}>${(confusionData.fn * 487 + confusionData.fp * 12).toLocaleString()}</span> / batch
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── FOOTER ─── */}
        <div style={{ marginTop: 48, paddingTop: 20, borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11, color: COLORS.textDim, fontFamily: "'IBM Plex Mono', monospace" }}>
            Built by Shane Hendel · Fraud Detection Pipeline v2.0
          </div>
          <div style={{ fontSize: 11, color: COLORS.textDim, fontFamily: "'IBM Plex Mono', monospace" }}>
            {batches.length} batches · {batches.reduce((s, b) => s + b.nTransactions, 0).toLocaleString()} total transactions
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("");
  const [showMonitor, setShowMonitor] = useState(false);

  useEffect(() => {
    const sections = ["projects", "experience", "skills", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#fcfaf5", color: "#1a2332",
      fontFamily: "'Libre Franklin', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Libre+Franklin:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: #c9a84c40; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #fcfaf5; }
        ::-webkit-scrollbar-thumb { background: #d4cfc2; border-radius: 3px; }

        @media (max-width: 900px) {
          nav > div:last-child a:not(:last-child) { display: none !important; }
        }
      `}</style>

      <NavBar activeSection={activeSection} />

      {/* Monitor Dashboard Modal */}
      {showMonitor && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 200,
          background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 24px", background: "#111827", borderBottom: "1px solid #1e293b",
          }}>
            <span style={{
              fontFamily: "'Libre Franklin', sans-serif", fontSize: 13, fontWeight: 600,
              color: "#e2e8f0", letterSpacing: "0.03em",
            }}>ML Model Monitoring Dashboard — Interactive Demo</span>
            <button onClick={() => setShowMonitor(false)} style={{
              background: "transparent", border: "1px solid #334155", borderRadius: 4,
              color: "#e2e8f0", padding: "6px 16px", fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "'Libre Franklin', sans-serif",
            }}>✕ Close</button>
          </div>
          <div style={{ flex: 1, overflow: "auto" }}>
            <ModelMonitoringDashboard />
          </div>
        </div>
      )}
      <Hero />

      {/* Divider */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 60px" }}>
        <div style={{ borderBottom: "1px solid #ebe6d9" }} />
      </div>

      {/* Projects */}
      <section id="projects" style={{ padding: "80px 60px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          fontFamily: "'Libre Franklin', sans-serif", fontSize: 12, fontWeight: 600,
          color: "#c9a84c", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12,
        }}>Portfolio</div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 700,
          color: "#1a2332", margin: 0, letterSpacing: "-0.02em", marginBottom: 48,
        }}>Featured Projects</h2>

        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i}
            onDemoClick={project.id === "monitor" ? () => setShowMonitor(true) : undefined}
          />
        ))}
      </section>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 60px" }}>
        <div style={{ borderBottom: "1px solid #ebe6d9" }} />
      </div>

      <ExperienceSection />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 60px" }}>
        <div style={{ borderBottom: "1px solid #ebe6d9" }} />
      </div>

      <SkillsSection />
      <ContactSection />
    </div>
  );
}
