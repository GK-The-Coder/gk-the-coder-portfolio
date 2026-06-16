import React from "react";

const About = () => {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Engineering <span className="gradient-text">with Passion</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            I am a full-stack developer specializing in the MERN stack, dedicated to creating high-performance web applications that deliver exceptional user experiences. 
            My approach combines a deep understanding of software architecture with a keen eye for visual detail.
          </p>
          <p className="text-lg text-slate-400 leading-relaxed">
            Over the years, I\'ve evolved from a hobbyist to a professional engineer, tackling complex problems and building products that scale. 
            I believe in clean code, continuous learning, and the power of minimal, focused design.
          </p>
          <div className="flex gap-8 pt-4">
            <div>
              <span className="block text-3xl font-bold text-primary">5+</span>
              <span className="text-sm text-slate-500 uppercase tracking-wide">Years Experience</span>
            </div>
            <div>
              <span className="block text-3xl font-bold text-secondary">20+</span>
              <span className="text-sm text-slate-500 uppercase tracking-wide">Projects Done</span>
            </div>
          </div>
        </div>
        <div className="glass-card p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl font-bold">My Philosophy</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="text-primary">?</span>
                <p className="text-slate-400">Performance is a feature. I optimize every single pixel and single byte of data.</p>
              </div>
              <div className="flex gap-4">
                <span className="text-secondary">??</span>
                <p className="text-slate-400">User-centric design. If it\'s not intuitive, it\'s not finished.</p>
              </div>
              <div className="flex gap-4">
                <span className="text-highlight">???</span>
                <p className="text-slate-400">Robust architecture. Building for today, planning for tomorrow.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
