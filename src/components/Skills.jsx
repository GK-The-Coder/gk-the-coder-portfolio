import React from "react";

const SkillBadge = ({ name, category }) => (
  <div className="flex flex-col items-center p-4 glass-card group hover:border-primary transition-colors">
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
      <span className="text-xl">{category === "Frontend" ? "??" : category === "Backend" ? "??" : "???"}</span>
    </div >
    <span className="text-sm font-medium text-slate-300">{name}</span>
  </div>
);

const Skills = () => {
  const skillSets = {
    Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    Backend: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Redis"],
    Tools: ["Git", "Docker", "AWS", "Vercel", "Figma"]
  };

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold">Technical <span className="gradient-text">Arsenal</span></h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          A blend of modern tools and foundational knowledge used to build scalable applications.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {Object.entries(skillSets).map(([category, skills]) => (
          <div key={category} className="space-y-6">
            <h3 className="text-xl font-bold text-center text-secondary uppercase tracking-widest">{category}</h3>
            <div className="grid grid-cols-2 gap-4">
              {skills.map(skill => <SkillBadge key={skill} name={skill} category={category} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
