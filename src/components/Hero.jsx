import React from "react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 animated-grid -z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background -z-10" />
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="text-center lg:text-left space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Hi, I\'m <span className="gradient-text">Your Name</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-medium">
            Full Stack Developer | MERN Stack | Problem Solver
          </p>
          <p className="text-lg text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Building high-end digital experiences with a focus on performance, 
            scalability, and breathtaking user interfaces.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
            <button className="px-8 py-3 bg-primary hover:bg-primary/80 text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-primary/30">
              View Projects
            </button>
            <button className="px-8 py-3 border border-white/10 hover:bg-white/5 text-white font-semibold rounded-full transition-all backdrop-blur-sm">
              Download Resume
            </button>
          </div>
        </div>

        {/* Right Content - Profile Image & Floating Icons */}
        <div className="relative flex justify-center items-center">
          {/* Glowing Gradient Ring */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full p-1 bg-gradient-to-tr from-primary via-secondary to-highlight animate-spin-slow">
            <div className="w-full h-full rounded-full bg-background p-1">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-background">
                <img 
                  src="https://via.placeholder.com/400" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Floating Tech Icons */}
          <div className="absolute -top-10 -left-10 animate-float p-4 glass-card" style={{ animationDelay: "0s" }}>
            <span className="text-2xl">??</span>
          </div>
          <div className="absolute top-20 -right-10 animate-float p-4 glass-card" style={{ animationDelay: "2s" }}>
            <span className="text-2xl">??</span>
          </div>
          <div className="absolute -bottom-10 left-20 animate-float p-4 glass-card" style={{ animationDelay: "4s" }}>
            <span className="text-2xl">??</span>
          </div>
          <div className="absolute bottom-10 -right-20 animate-float p-4 glass-card" style={{ animationDelay: "1s" }}>
            <span className="text-2xl">??</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
