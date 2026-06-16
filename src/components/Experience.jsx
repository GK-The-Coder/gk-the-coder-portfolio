import React from "react";

const ExperienceItem = ({ company, role, period, desc }) => (
  <div className="relative pl-8 pb-12 border-l-2 border-primary/30 last:pb-0">
    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary shadow-[0_0_10px_#8B5CF6]" />
    <div className="glass-card p-6">
      <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-2">
        <h3 className="text-xl font-bold">{role} <span className="text-slate-400 font-normal">@ {company}</span></h3>
        <span className="text-sm font-medium text-secondary">{period}</span>
      </div>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const Experience = () => {
  const items = [
    {
      company: "TechNova Solutions",
      role: "Senior Full Stack Engineer",
      period: "2022 - Present",
      desc: "Leading the development of core SaaS infrastructure, improving system latency by 40% and scaling to 100k+ monthly active users."
    },
    {
      company: "WebFlow Studio",
      role: "Frontend Developer",
      period: "2020 - 2022",
      desc: "Designed and implemented complex UI systems for Fortune 500 clients, focusing on accessibility and high-conversion landing pages."
    },
    {
      company: "Innovate Lab",
      role: "Junior Developer",
      period: "2019 - 2020",
      desc: "Collaborated on building internal tooling and API integrations, gaining deep expertise in the MERN stack."
    }
  ];

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold">Professional <span className="gradient-text">Journey</span></h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          My evolution as a developer, from curiosity to crafting enterprise-scale applications.
        </p>
      </div>
      <div className="space-y-0">
        {items.map((item, i) => <ExperienceItem key={i} {...item} />)}
      </div>
    </section>
  );
};

export default Experience;
