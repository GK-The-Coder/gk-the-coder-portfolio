import React from "react";

const Contact = () => {
  return (
    <section className="py-24 px-6 max-w-4xl mx-auto text-center">
      <div className="glass-card p-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/20 blur-3xl rounded-full" />
        
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Let’s Build <span className="gradient-text">Something Epic</span></h2>
        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          I’m currently open to new opportunities and collaborations. Whether you have a project idea or just want to say hi, my inbox is always open.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="mailto:hello@example.com" className="px-8 py-3 bg-primary hover:bg-primary/80 text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-primary/30 w-full sm:w-auto">
            Send an Email
          </a >
          <div className="flex gap-4">
            <a href="#" className="p-3 glass-card hover:text-primary transition-colors">GitHub</a>
            <a href="#" className="p-3 glass-card hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="p-3 glass-card hover:text-primary transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
