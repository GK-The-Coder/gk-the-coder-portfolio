import React from "react";

const ProjectCard = ({ title, desc, tags, link }) => (
  <div className="glass-card group p-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-slate-400 mb-6 leading-relaxed">{desc}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map(tag => (
          <span key={tag} className="px-3 py-1 text-xs font-medium bg-white/5 border border-white/10 rounded-full text-slate-300">
            {tag}
          </span>
        ))}
      </div>
      <a href={link} className="inline-flex items-center gap-2 text-secondary font-semibold hover:text-primary transition-colors">
        View Project <span className="text-lg">?</span>
      </a>
    </div>
  </div>
);

const Projects = () => {
  const projects = [
    {
      title: "SaaS Analytics Dashboard",
      desc: "A high-performance real-time analytics platform with complex data visualizations and AI-driven insights.",
      tags: ["React", "TypeScript", "Tailwind", "Chart.js"],
      link: "#"
    },
    {
      title: "AI Content Generator",
      desc: "Enterprise-grade content automation tool leveraging GPT-4 for high-conversion marketing copy.",
      tags: ["Next.js", "OpenAI", "Node.js", "MongoDB"],
      link: "#"
    },
    {
      title: "E-Commerce Ecosystem",
      desc: "A scalable multi-vendor marketplace with seamless payment integration and advanced inventory management.",
      tags: ["MERN Stack", "Redux", "Stripe", "AWS"],
      link: "#"
    }
  ];

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold">Featured <span className="gradient-text">Projects</span></h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          A curated collection of my most impactful work, combining technical rigor with high-end design.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p, i) => <ProjectCard key={i} {...p} />)}
      </div>
    </section>
  );
};

export default Projects;
