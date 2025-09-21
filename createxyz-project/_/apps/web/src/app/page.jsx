import { useState, useEffect } from "react";
import { Play, Sparkles, Users, Shield } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import TwoFilloutSlidersSideBySide from "@/components/TwoFilloutSlidersSideBySide";

export default function HomePage() {
  const [animationsVisible, setAnimationsVisible] = useState(false);
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  // If user is already logged in, redirect to dashboard
  if (isSignedIn && user) {
    window.location.href = "/dashboard";
    return null;
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Inter:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-gradient-to-br from-[#8B70F6] via-[#9D7DFF] to-[#7E64F2]">
        {/* Header */}
        <header className="relative z-10 px-6 py-6">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center">
                <Sparkles size={24} className="text-[#8B70F6]" />
              </div>
              <span 
                className="text-white text-2xl font-bold"
                style={{ fontFamily: "Instrument Serif, serif" }}
              >
                WebAppZo
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="/account/signin"
                className="px-6 py-3 rounded-2xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-200"
              >
                Login
              </a>
              <a
                href="/account/signup"
                className="px-6 py-3 rounded-2xl bg-white text-[#8B70F6] font-semibold hover:bg-gray-100 transition-all duration-200"
              >
                Sign Up
              </a>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 py-20 relative overflow-hidden">
          <div className="max-w-[1200px] mx-auto text-center">
            <div
              className={`transition-all duration-1000 ${
                animationsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h1
                className="text-5xl md:text-7xl text-white mb-6 leading-tight"
                style={{
                  fontFamily: "Instrument Serif, serif",
                  letterSpacing: "-0.02em",
                }}
              >
                Welcome to <em className="font-medium">WebAppZo</em>
              </h1>

              <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto">
                The ultimate platform for your clients to connect, engage, and grow their business with powerful tools and seamless experiences.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
                <a
                  href="/account/signup"
                  className="group px-8 py-4 bg-white text-[#8B70F6] font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
                >
                  Get Started Free
                </a>
              </div>
            </div>

            <TwoFilloutSlidersSideBySide />

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              {[
                {
                  icon: Users,
                  title: "Client Management",
                  description: "Effortlessly manage all your clients in one centralized dashboard"
                },
                {
                  icon: Sparkles,
                  title: "Smart Analytics",
                  description: "Get powerful insights into your business performance and growth"
                },
                {
                  icon: Shield,
                  title: "Secure Platform",
                  description: "Enterprise-grade security to keep your data safe and protected"
                }
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className={`
                    bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 
                    transition-all duration-500 hover:bg-white/20 hover:transform hover:scale-105
                    ${animationsVisible 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-8"
                    }
                  `}
                  style={{ transitionDelay: `${(index + 1) * 200}ms` }}
                >
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <feature.icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Elements Animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`
                  absolute w-4 h-4 bg-white/20 rounded-full
                  ${animationsVisible ? "animate-float" : "opacity-0"}
                `}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </section>

        <style jsx global>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
              opacity: 0.3;
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
              opacity: 0.8;
            }
          }
          
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}</style>
      </div>
    </>
  );
}