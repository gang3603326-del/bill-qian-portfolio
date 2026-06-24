import { Button } from "@/components/ui/button";
import { ExternalLink, Linkedin, Mail, Copy, Check, Download, Briefcase, Award, Users, Zap, MapPin, Calendar, Target, ChevronDown, Wrench, Settings, Factory, Globe } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

/* ============================================================
   粒子动画 Hook
   ============================================================ */
function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const initParticles = () => {
      const isMobile = canvas.offsetWidth < 768;
      const count = isMobile 
        ? Math.min(30, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 25000))
        : Math.min(80, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 12000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 200, 255, ${p.opacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(100, 200, 255, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    initParticles();
    draw();

    window.addEventListener("resize", () => {
      resize();
      initParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
}

/* ============================================================
   动态计数器 Hook
   ============================================================ */
function useCountUp(target: number, duration: number = 2000) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, target, duration]);

  return { value, ref };
}

/* ============================================================
   滚动触发 Hook
   ============================================================ */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ============================================================
   联系模块
   ============================================================ */
function ContactSection() {
  const [copied, setCopied] = useState(false);
  const email = "gang3603326@gmail.com";
  const linkedinUrl = "https://www.linkedin.com/in/bill-qian/";
  const { ref, visible } = useScrollReveal();
  const { t } = useLanguage();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    toast.success(t("contact.email") + " copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-14 md:py-28">
      <div className="container" ref={ref}>
        <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="tech-heading mb-4 text-center">{t("contact.title")}</h2>
          <p className="text-center text-muted-foreground mb-12">{t("contact.subtitle")}</p>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {/* 邮箱卡片 */}
              <div className="glass-panel p-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-[oklch(0.75_0.18_220/0.15)] flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 neon-text" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t("contact.email")}</h3>
                <p className="text-muted-foreground text-sm mb-6 break-all">{email}</p>
                <Button 
                  onClick={handleCopyEmail}
                  className="w-full bg-[oklch(0.75_0.18_220)] hover:bg-[oklch(0.7_0.18_220)] text-white gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      {t("contact.email")} ✓
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      {t("contact.copyEmail")}
                    </>
                  )}
                </Button>
              </div>

              {/* 微信二维码卡片 */}
              <div className="glass-panel p-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-[oklch(0.82_0.16_85/0.15)] flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 neon-gold" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.134 0 .24-.11.24-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.49.49 0 0 1 .177-.554C23.028 18.572 24 16.89 24 14.991c0-3.14-2.94-5.893-7.062-6.133zm-2.18 2.769c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t("contact.wechat")}</h3>
                <p className="text-muted-foreground text-sm mb-4">{t("contact.wechat.scan")}</p>
                <div className="w-32 h-32 bg-white rounded-lg p-1 mx-auto">
                  <img 
                    src="/bill-qian-portfolio/assets/wechat_qrcode.png" 
                    alt="微信二维码" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* LinkedIn 卡片 */}
              <div className="glass-panel p-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-[oklch(0.75_0.18_220/0.15)] flex items-center justify-center mb-4">
                  <Linkedin className="w-6 h-6 neon-text" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t("contact.linkedin")}</h3>
                <p className="text-muted-foreground text-sm mb-6">{t("contact.linkedin.view")}</p>
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button 
                    className="w-full bg-[oklch(0.75_0.18_220)] hover:bg-[oklch(0.7_0.18_220)] text-white gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    LinkedIn
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   KPI 计数器卡片
   ============================================================ */
function KpiCard({ target, suffix, label, prefix = "", decimals = 0 }: { target: number; suffix: string; label: string; prefix?: string; decimals?: number }) {
  const { value, ref } = useCountUp(target);
  const displayValue = decimals > 0 ? (value / Math.pow(10, decimals)).toFixed(decimals) : value.toString();
  return (
    <div className="metric-card" ref={ref}>
      <div className="text-2xl md:text-4xl font-bold neon-gold counter-value mb-2">
        {prefix}{displayValue}{suffix}
      </div>
      <div className="text-muted-foreground text-xs md:text-sm">{label}</div>
    </div>
  );
}

/* ============================================================
   技能雷达图数据 - 反映全能型定位
   ============================================================ */
const radarDataKeys = [
  { key: "skills.radar.equipment", value: 95 },
  { key: "skills.radar.process", value: 92 },
  { key: "skills.radar.production", value: 90 },
  { key: "skills.radar.team", value: 88 },
  { key: "skills.radar.npi", value: 90 },
  { key: "skills.radar.cost", value: 91 },
];


/* ============================================================
   主页面
   ============================================================ */
export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticles(canvasRef);

  const heroReveal = useScrollReveal();
  const expertiseReveal = useScrollReveal();
  const careerReveal = useScrollReveal();
  const projectsReveal = useScrollReveal();
  const skillsReveal = useScrollReveal();

  const [navScrolled, setNavScrolled] = useState(false);
  const { t, lang, setLang } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 导航栏 - 霓虹光效 */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${navScrolled ? "bg-background/95 backdrop-blur-xl border-b border-[oklch(0.75_0.18_220/0.2)] shadow-[0_2px_20px_oklch(0.75_0.18_220/0.05)]" : "bg-transparent border-b border-transparent"}`}>
        <div className="container flex items-center justify-between py-3 md:py-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-[oklch(0.75_0.18_220)] flex items-center justify-center pulse-glow">
              <span className="font-bold text-white text-base md:text-lg">Q</span>
            </div>
            <div>
              <h1 className="font-bold text-foreground text-sm md:text-base">钱刚 Bill Qian</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">SMT ME主管 | 设备·工艺·生产</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-5">
            <a href="#kpi" className="text-sm text-muted-foreground hover:text-[oklch(0.75_0.18_220)] transition-colors">{t("nav.results")}</a>
            <a href="#career" className="text-sm text-muted-foreground hover:text-[oklch(0.75_0.18_220)] transition-colors">{t("nav.career")}</a>
            <a href="#projects" className="text-sm text-muted-foreground hover:text-[oklch(0.75_0.18_220)] transition-colors">{t("nav.projects")}</a>
            <a href="#skills" className="text-sm text-muted-foreground hover:text-[oklch(0.75_0.18_220)] transition-colors">{t("nav.skills")}</a>
            <a href="#documents" className="text-sm text-muted-foreground hover:text-[oklch(0.75_0.18_220)] transition-colors">{t("nav.documents")}</a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-[oklch(0.75_0.18_220)] transition-colors">{t("nav.contact")}</a>
            <button 
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-[oklch(0.82_0.16_85)] transition-colors border border-border/40 rounded px-2 py-1"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === "zh" ? "EN" : "中"}
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              className="md:hidden flex items-center gap-1 text-xs text-muted-foreground hover:text-[oklch(0.82_0.16_85)] transition-colors border border-border/40 rounded px-2 py-1"
            >
              <Globe className="w-3 h-3" />
              {lang === "zh" ? "EN" : "中"}
            </button>
            <a href="/bill-qian-portfolio/assets/bill_qian_resume.pdf" download="钱刚_SMT专家简历.pdf">
              <Button className="bg-[oklch(0.82_0.16_85)] hover:bg-[oklch(0.78_0.16_85)] text-[oklch(0.12_0.01_250)] gap-1.5 md:gap-2 text-xs md:text-sm font-semibold px-3 md:px-4">
                <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">{t("nav.downloadFull")}</span>{t("nav.download")}
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* ============================================================
          Hero 区 - 粒子动画 + 网格背景
          ============================================================ */}
      <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* 粒子画布 */}
        <canvas ref={canvasRef} className="particles-canvas" />
        {/* 网格背景 */}
        <div className="absolute inset-0 grid-bg opacity-40" />
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

        <div className="container relative z-10 text-center py-12 md:py-20" ref={heroReveal.ref}>
          <div className={`transition-all duration-1000 ${heroReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            {/* 状态标签 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[oklch(0.75_0.18_220/0.3)] bg-[oklch(0.75_0.18_220/0.05)] mb-8">
              <span className="w-2 h-2 rounded-full bg-[oklch(0.7_0.2_150)] animate-pulse" />
              <span className="text-sm text-muted-foreground">{t("hero.status")}</span>
            </div>

            <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">
              <span className="text-foreground">{t("hero.name")}</span>
              <span className="text-muted-foreground text-xl md:text-3xl lg:text-4xl ml-3 md:ml-4 font-normal">{t("hero.nameEn")}</span>
            </h1>
            
            <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold neon-text mb-4 md:mb-6">
              {t("hero.title")}
            </h2>
            
            <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-10 leading-relaxed max-w-3xl mx-auto">
              {t("hero.desc")}
            </p>

            {/* 三位一体标签 */}
            <div className="flex flex-wrap justify-center gap-3 mb-6 md:mb-10">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[oklch(0.75_0.18_220/0.4)] bg-[oklch(0.75_0.18_220/0.08)] text-sm text-[oklch(0.8_0.12_220)]">
                <Wrench className="w-3.5 h-3.5" />
                {t("hero.tag.equipment")}
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[oklch(0.82_0.16_85/0.4)] bg-[oklch(0.82_0.16_85/0.08)] text-sm text-[oklch(0.85_0.12_85)]">
                <Settings className="w-3.5 h-3.5" />
                {t("hero.tag.process")}
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[oklch(0.7_0.2_150/0.4)] bg-[oklch(0.7_0.2_150/0.08)] text-sm text-[oklch(0.75_0.15_150)]">
                <Factory className="w-3.5 h-3.5" />
                {t("hero.tag.production")}
              </span>
            </div>

            {/* 求职意向栏 */}
            <div className="glass-panel neon-border p-4 md:p-6 max-w-2xl mx-auto mb-8 md:mb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 justify-center">
                  <Target className="w-4 h-4 neon-text" />
                  <span className="text-muted-foreground">{t("hero.info.role")}</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <MapPin className="w-4 h-4 neon-text" />
                  <span className="text-muted-foreground">{t("hero.info.location")}</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Calendar className="w-4 h-4 neon-text" />
                  <span className="text-muted-foreground">{t("hero.info.availability")}</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Briefcase className="w-4 h-4 neon-text" />
                  <span className="text-muted-foreground">{t("hero.info.status")}</span>
                </div>
              </div>
            </div>

            {/* 向下滚动指示 */}
            <div className="animate-bounce">
              <ChevronDown className="w-6 h-6 text-muted-foreground mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          核心 KPI 仪表盘 - 动态计数器
          ============================================================ */}
      <section id="kpi" className="py-14 md:py-28">
        <div className="container">
          <div className="gradient-divider mb-16" />
          <h2 className="tech-heading mb-4 text-center">{t("kpi.title")}</h2>
          <p className="text-center text-muted-foreground mb-12">{t("kpi.subtitle")}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto">
            <KpiCard target={15} suffix={lang === "zh" ? "年+" : "yr+"} label={t("kpi.experience")} />
            <KpiCard target={85} suffix="%+" label={t("kpi.maintenance")} />
            <KpiCard target={30} suffix="%+" label={t("kpi.spi")} />
            <KpiCard target={400} suffix="h+" label={t("kpi.uptime")} />
          </div>

          {/* 第二行 KPI */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto mt-3 md:mt-6">
            <KpiCard target={20} suffix="+" label={t("kpi.lines")} />
            <KpiCard target={9850} suffix="%" label={t("kpi.firstpass")} decimals={2} />
            <KpiCard target={15} suffix="%+" label={t("kpi.costdown")} />
            <KpiCard target={8} suffix="-12%" label={t("kpi.efficiency")} prefix="" />
          </div>
        </div>
      </section>

      {/* ============================================================
          核心专业能力 - 三位一体
          ============================================================ */}
      <section id="expertise" className="py-14 md:py-28">
        <div className="container" ref={expertiseReveal.ref}>
          <div className={`transition-all duration-700 ${expertiseReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="gradient-divider mb-16" />
            <h2 className="tech-heading mb-4 text-center">{t("core.title")}</h2>
            <p className="text-center text-muted-foreground mb-12">{t("core.subtitle")}</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* 设备工程 */}
              <div className="glass-panel p-8 neon-border">
                <div className="w-12 h-12 rounded-lg bg-[oklch(0.75_0.18_220/0.15)] flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6 neon-text" />
                </div>
                <h3 className="font-semibold text-foreground mb-4">{t("core.equip.h3")}</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• {t("core.equip.li1")}</li>
                  <li>• {t("core.equip.li2")}</li>
                  <li>• {t("core.equip.li3")}</li>
                  <li>• {t("core.equip.li4")}</li>
                  <li>• {t("core.equip.li5")}</li>
                </ul>
                <div className="mt-6 pt-6 border-t border-border/30">
                  <p className="text-xs neon-gold font-semibold">{t("core.equip.stat")}</p>
                </div>
              </div>

              {/* 工艺工程 */}
              <div className="glass-panel p-8 neon-border">
                <div className="w-12 h-12 rounded-lg bg-[oklch(0.82_0.16_85/0.15)] flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 neon-gold" />
                </div>
                <h3 className="font-semibold text-foreground mb-4">{t("core.process.h3")}</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• {t("core.process.li1")}</li>
                  <li>• {t("core.process.li2")}</li>
                  <li>• {t("core.process.li3")}</li>
                  <li>• {t("core.process.li4")}</li>
                  <li>• {t("core.process.li5")}</li>
                  <li>• {t("core.process.li6")}</li>
                </ul>
                <div className="mt-6 pt-6 border-t border-border/30">
                  <p className="text-xs neon-gold font-semibold">{t("core.process.stat")}</p>
                </div>
              </div>

              {/* 生产管理 */}
              <div className="glass-panel p-8 neon-border">
                <div className="w-12 h-12 rounded-lg bg-[oklch(0.7_0.2_150/0.15)] flex items-center justify-center mb-4">
                  <Factory className="w-6 h-6 text-[oklch(0.7_0.2_150)]" />
                </div>
                <h3 className="font-semibold text-foreground mb-4">{t("core.prod.h3")}</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• {t("core.prod.li1")}</li>
                  <li>• {t("core.prod.li2")}</li>
                  <li>• {t("core.prod.li3")}</li>
                  <li>• {t("core.prod.li4")}</li>
                  <li>• {t("core.prod.li5")}</li>
                  <li>• {t("core.prod.li6")}</li>
                </ul>
                <div className="mt-6 pt-6 border-t border-border/30">
                  <p className="text-xs neon-gold font-semibold">{t("core.prod.stat")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          工作经历 - 严格按简历
          ============================================================ */}
      <section id="career" className="py-14 md:py-28">
        <div className="container max-w-4xl mx-auto" ref={careerReveal.ref}>
          <div className={`transition-all duration-700 ${careerReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="gradient-divider mb-16" />
            <h2 className="tech-heading mb-12 text-center">{t("career.title")}</h2>
            
            <div className="space-y-6">
              {/* 当前职位 - 捷盛电子 */}
              <div className="glass-panel p-6 md:p-8 gold-border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[oklch(0.82_0.16_85/0.15)] flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 neon-gold" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-foreground text-lg">{t("career.jse.title")}</h3>
                      <span className="text-xs bg-[oklch(0.7_0.2_150/0.2)] text-[oklch(0.7_0.2_150)] px-2 py-0.5 rounded font-semibold">{t("career.jse.badge")}</span>
                    </div>
                    <p className="neon-gold text-sm">{t("career.jse.company2")}</p>
                    <p className="text-muted-foreground text-xs">{t("career.jse.time2")}</p>
                  </div>
                </div>
                <div className="ml-0 md:ml-16">
                  <p className="text-sm text-muted-foreground mb-3 font-semibold">{t("career.jse.core")}</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {t("career.jse.li1")}</li>
                    <li>• {t("career.jse.li2")}</li>
                    <li>• {t("career.jse.li3")}</li>
                    <li>• {t("career.jse.li4")}</li>
                    <li>• {t("career.jse.li5")}</li>
                    <li>• {t("career.jse.li6")}</li>
                    <li>• {t("career.jse.li7")}</li>
                    <li>• {t("career.jse.li8")}</li>
                    <li>• {t("career.jse.li9")}</li>
                  </ul>
                </div>
              </div>

              {/* 信昱智能 */}
              <div className="glass-panel p-6 md:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[oklch(0.75_0.18_220/0.1)] flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">{t("career.xk.title")}</h3>
                    <p className="neon-text text-sm">{t("career.xk.company2")}</p>
                    <p className="text-muted-foreground text-xs">{t("career.xk.time2")}</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-0 md:ml-16">
                  <li>• {t("career.xk.li1")}</li>
                  <li>• {t("career.xk.li2")}</li>
                  <li>• {t("career.xk.li3")}</li>
                  <li>• {t("career.xk.li4")}</li>
                  <li>• {t("career.xk.li5")}</li>
                </ul>
              </div>

              {/* 乐依文 */}
              <div className="glass-panel p-6 md:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[oklch(0.75_0.18_220/0.1)] flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">{t("career.lfw.title")}</h3>
                    <p className="neon-text text-sm">{t("career.lfw.company2")}</p>
                    <p className="text-muted-foreground text-xs">{t("career.lfw.time2")}</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-0 md:ml-16">
                  <li>• {t("career.lfw.li1")}</li>
                  <li>• {t("career.lfw.li2")}</li>
                  <li>• {t("career.lfw.li3")}</li>
                  <li>• {t("career.lfw.li4")}</li>
                  <li>• {t("career.lfw.li5")}</li>
                  <li>• {t("career.lfw.li6")}</li>
                </ul>
              </div>

              {/* 群光电子 - 生产主管 */}
              <div className="glass-panel p-6 md:p-8 gold-border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[oklch(0.82_0.16_85/0.15)] flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 neon-gold" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-foreground text-lg">{t("career.qg.title")}</h3>
                      <span className="text-xs bg-[oklch(0.82_0.16_85/0.2)] text-[oklch(0.82_0.16_85)] px-2 py-0.5 rounded font-semibold">{t("career.qg.badge")}</span>
                    </div>
                    <p className="neon-gold text-sm">{t("career.qg.company2")}</p>
                    <p className="text-muted-foreground text-xs">{t("career.qg.time2")}</p>
                  </div>
                </div>
                <div className="ml-0 md:ml-16">
                  <p className="text-sm text-muted-foreground mb-3 font-semibold">{t("career.qg.core")}</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {t("career.qg.li1")}</li>
                    <li>• {t("career.qg.li2")}</li>
                    <li>• {t("career.qg.li3")}</li>
                    <li>• {t("career.qg.li4")}</li>
                    <li>• {t("career.qg.li5")}</li>
                    <li>• {t("career.qg.li6")}</li>
                    <li>• {t("career.qg.li7")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          核心项目成果 - 严格按简历
          ============================================================ */}
      <section id="projects" className="py-14 md:py-28">
        <div className="container max-w-4xl mx-auto" ref={projectsReveal.ref}>
          <div className={`transition-all duration-700 ${projectsReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="gradient-divider mb-16" />
            <h2 className="tech-heading mb-12 text-center">{t("projects.title")}</h2>
            
            <div className="space-y-8">
              {/* 项目 1: 工艺持续改进 */}
              <div className="glass-panel p-6 md:p-8 neon-border">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs bg-[oklch(0.75_0.18_220)] text-white px-3 py-1 rounded font-semibold">{t("proj1.badge")}</span>
                  <span className="text-xs text-muted-foreground">{t("proj1.company")}</span>
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-4">{t("proj1.title")}</h3>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {t("proj1.desc")}
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-[oklch(0.14_0.012_250)] rounded-lg p-4 text-center border border-border/30">
                    <p className="text-2xl font-bold neon-gold">30%+</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("proj1.stat1")}</p>
                  </div>
                  <div className="bg-[oklch(0.14_0.012_250)] rounded-lg p-4 text-center border border-border/30">
                    <p className="text-2xl font-bold neon-gold">{t("proj1.stat2val")}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("proj1.stat2")}</p>
                  </div>
                  <div className="bg-[oklch(0.14_0.012_250)] rounded-lg p-4 text-center border border-border/30">
                    <p className="text-2xl font-bold neon-gold">{t("proj1.stat3val")}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("proj1.stat3")}</p>
                  </div>
                </div>

                <div className="bg-[oklch(0.14_0.012_250)] rounded-lg p-4 border border-border/30">
                  <p className="text-sm font-semibold neon-text mb-2">{t("proj1.resp")}</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• {t("proj1.li1")}</li>
                    <li>• {t("proj1.li2")}</li>
                    <li>• {t("proj1.li3")}</li>
                    <li>• {t("proj1.li4")}</li>
                  </ul>
                </div>
              </div>

              {/* 项目 2: 技术培训与本地化 */}
              <div className="glass-panel p-6 md:p-8 neon-border">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs bg-[oklch(0.82_0.16_85)] text-[oklch(0.12_0.01_250)] px-3 py-1 rounded font-semibold">{t("proj2.badge")}</span>
                  <span className="text-xs text-muted-foreground">{t("proj2.company")}</span>
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-4">{t("proj2.title")}</h3>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {t("proj2.desc")}
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-[oklch(0.14_0.012_250)] rounded-lg p-4 text-center border border-border/30">
                    <p className="text-2xl font-bold neon-gold">85%+</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("proj2.stat1")}</p>
                  </div>
                  <div className="bg-[oklch(0.14_0.012_250)] rounded-lg p-4 text-center border border-border/30">
                    <p className="text-2xl font-bold neon-gold">{t("proj2.stat2val")}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("proj2.stat2")}</p>
                  </div>
                  <div className="bg-[oklch(0.14_0.012_250)] rounded-lg p-4 text-center border border-border/30">
                    <p className="text-2xl font-bold neon-gold">{t("proj2.stat3val")}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("proj2.stat3")}</p>
                  </div>
                </div>

                <div className="bg-[oklch(0.14_0.012_250)] rounded-lg p-4 border border-border/30">
                  <p className="text-sm font-semibold neon-text mb-2">{t("proj2.resp")}</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• {t("proj2.li1")}</li>
                    <li>• {t("proj2.li2")}</li>
                    <li>• {t("proj2.li3")}</li>
                    <li>• {t("proj2.li4")}</li>
                    <li>• {t("proj2.li5")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          技能体系 + 雷达图
          ============================================================ */}
      <section id="skills" className="py-14 md:py-28">
        <div className="container" ref={skillsReveal.ref}>
          <div className={`transition-all duration-700 ${skillsReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="gradient-divider mb-16" />
            <h2 className="tech-heading mb-12 text-center">{t("skills.title")}</h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* 雷达图 */}
              <div className="glass-panel p-8 flex items-center justify-center neon-border">
                <div className="w-full" style={{ height: "320px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarDataKeys.map(d => ({ skill: t(d.key), value: d.value, fullMark: 100 }))} cx="50%" cy="50%" outerRadius="75%">
                      <PolarGrid stroke="oklch(0.28 0.02 250 / 0.6)" />
                      <PolarAngleAxis 
                        dataKey="skill" 
                        tick={{ fill: "oklch(0.75 0.02 250)", fontSize: 12 }} 
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={{ fill: "oklch(0.5 0.02 250)", fontSize: 10 }}
                      />
                      <Radar
                        name={t("skills.title")}
                        dataKey="value"
                        stroke="oklch(0.75 0.18 220)"
                        fill="oklch(0.75 0.18 220)"
                        fillOpacity={0.25}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 设备技能列表 */}
              <div className="space-y-6">
                <div className="glass-panel p-6">
                  <h3 className="font-semibold text-foreground mb-4 neon-text">{t("skills.equip.h3")}</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground mb-1">{t("skills.equip.placement")}</p>
                      <p>{t("skills.equip.placement.desc")}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">{t("skills.equip.printer")}</p>
                      <p>{t("skills.equip.printer.desc")}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">{t("skills.equip.reflow")}</p>
                      <p>{t("skills.equip.reflow.desc")}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">{t("skills.equip.inspect")}</p>
                      <p>{t("skills.equip.inspect.desc")}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6">
                  <h3 className="font-semibold text-foreground mb-4 neon-gold">{t("skills.process2.h3")}</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground mb-1">{t("skills.process2.opt")}</p>
                      <p>{t("skills.process2.opt.desc")}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">{t("skills.process2.prod")}</p>
                      <p>{t("skills.process2.prod.desc")}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">{t("skills.process2.sys")}</p>
                      <p>{t("skills.process2.sys.desc")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 行业经验标签 */}
            <div className="mt-8 glass-panel p-6 max-w-5xl mx-auto">
              <h3 className="font-semibold text-foreground mb-4 text-center">{t("skills.industry.title")}</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {t("skills.industry.tags").split(",").map((tag) => (
                  <span key={tag} className="text-xs bg-[oklch(0.75_0.18_220/0.1)] text-[oklch(0.75_0.18_220)] border border-[oklch(0.75_0.18_220/0.3)] px-3 py-1.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 语言能力 */}
            <div className="mt-4 glass-panel p-6 max-w-5xl mx-auto">
              <h3 className="font-semibold text-foreground mb-4 text-center">{t("skills.lang.h3")}</h3>
              <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
                <span>{t("skills.lang.zh")}</span>
                <span className="text-border">|</span>
                <span>{t("skills.lang.en2")}</span>
                <span className="text-border">|</span>
                <span>{t("skills.lang.vn")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ============================================================
          专业文档展示
          ============================================================ */}
      <section id="documents" className="py-14 md:py-28">
        <div className="container max-w-4xl mx-auto">
          <div className="gradient-divider mb-16" />
          <h2 className="tech-heading mb-4 text-center">{t("docs.title")}</h2>
          <p className="text-center text-muted-foreground mb-12">{t("docs.subtitle")}</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* 文档 1: SMT新人调机培训 */}
            <a 
              href="/bill-qian-portfolio/assets/smt_training.pptx" 
              download="SMT新人调机培训：从理论到实操_(专业版).pptx"
              className="glass-panel p-6 neon-border hover:border-[oklch(0.75_0.18_220/0.6)] transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-[oklch(0.75_0.18_220/0.15)] flex items-center justify-center mb-4 group-hover:bg-[oklch(0.75_0.18_220/0.25)] transition-colors">
                <svg className="w-6 h-6 neon-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm group-hover:text-[oklch(0.75_0.18_220)] transition-colors">{t("docs.d1.title")}</h3>
              <p className="text-muted-foreground text-xs mb-4">{t("docs.d1.desc")}</p>
              <div className="flex items-center gap-2 text-xs text-[oklch(0.75_0.18_220)]">
                <Download className="w-3.5 h-3.5" />
                <span>{t("docs.download")}</span>
              </div>
            </a>

            {/* 文档 2: BGA印刷短路改善 */}
            <a 
              href="/bill-qian-portfolio/assets/bga_report.pptx" 
              download="0.3_Pitch_BGA_印刷短路改善专项技术报告.pptx"
              className="glass-panel p-6 neon-border hover:border-[oklch(0.82_0.16_85/0.6)] transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-[oklch(0.82_0.16_85/0.15)] flex items-center justify-center mb-4 group-hover:bg-[oklch(0.82_0.16_85/0.25)] transition-colors">
                <svg className="w-6 h-6 neon-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm group-hover:text-[oklch(0.82_0.16_85)] transition-colors">{t("docs.d2.title")}</h3>
              <p className="text-muted-foreground text-xs mb-4">{t("docs.d2.desc")}</p>
              <div className="flex items-center gap-2 text-xs text-[oklch(0.82_0.16_85)]">
                <Download className="w-3.5 h-3.5" />
                <span>{t("docs.download")}</span>
              </div>
            </a>

            {/* 文档 3: 设备运行分析报告 */}
            <a 
              href="/bill-qian-portfolio/assets/smt_equipment_report.pptx" 
              download="2019_Q1_SMT_设备运行专项分析报告.pptx"
              className="glass-panel p-6 neon-border hover:border-[oklch(0.75_0.18_220/0.6)] transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-[oklch(0.75_0.18_220/0.15)] flex items-center justify-center mb-4 group-hover:bg-[oklch(0.75_0.18_220/0.25)] transition-colors">
                <svg className="w-6 h-6 neon-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm group-hover:text-[oklch(0.75_0.18_220)] transition-colors">{t("docs.d3.title")}</h3>
              <p className="text-muted-foreground text-xs mb-4">{t("docs.d3.desc")}</p>
              <div className="flex items-center gap-2 text-xs text-[oklch(0.75_0.18_220)]">
                <Download className="w-3.5 h-3.5" />
                <span>{t("docs.download")}</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 联系区 */}
      <ContactSection />

      {/* 页脚 */}
      <footer className="border-t border-border/30 py-8">
        <div className="container text-center text-muted-foreground text-sm">
          <a
            href="/bill-qian-portfolio/assets/bill_qian_resume.pdf"
            download="钱刚_SMT专家简历.pdf"
            className="inline-flex items-center gap-2 mb-4 px-5 py-2.5 rounded-lg bg-[oklch(0.75_0.18_220/0.1)] border border-[oklch(0.75_0.18_220/0.3)] text-[oklch(0.75_0.18_220)] hover:bg-[oklch(0.75_0.18_220/0.2)] transition-all text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            {t("nav.resume")}
          </a>
          <p className="mb-2">{t("footer.copyright")}</p>
          <p className="text-xs text-muted-foreground/60">{t("footer.desc")}</p>
        </div>
      </footer>
    </div>
  );
}
