import { useEffect, useState } from "react";
import { Sparkles, LogOut } from "lucide-react";
import useAuth from "@/utils/useAuth";

export default function LogoutPage() {
  const [animationsVisible, setAnimationsVisible] = useState(false);
  const { signOut } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Inter:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-gradient-to-br from-[#8B70F6] via-[#9D7DFF] to-[#7E64F2] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Floating Elements Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-3 h-3 bg-white/20 rounded-full
                ${animationsVisible ? "animate-float" : "opacity-0"}
              `}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${4 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div
          className={`
            w-full max-w-md bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20
            transition-all duration-1000 ${
              animationsVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-95"
            }
          `}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8B70F6] to-[#9D7DFF] rounded-2xl flex items-center justify-center">
                <Sparkles size={24} className="text-white" />
              </div>
              <span 
                className="text-2xl font-bold text-gray-800"
                style={{ fontFamily: "Instrument Serif, serif" }}
              >
                WebAppZo
              </span>
            </div>
            <h1
              className="text-3xl font-bold text-gray-800 mb-2"
              style={{ fontFamily: "Instrument Serif, serif" }}
            >
              Sign Out
            </h1>
            <p className="text-gray-600">Are you sure you want to sign out of your account?</p>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="group w-full bg-gradient-to-r from-[#8B70F6] to-[#9D7DFF] text-white font-bold py-4 rounded-2xl hover:from-[#7E64F2] hover:to-[#8B70F6] focus:outline-none focus:ring-2 focus:ring-[#8B70F6] focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 mb-4"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>

          {/* Back to Dashboard Link */}
          <a
            href="/dashboard"
            className="block text-center text-[#8B70F6] font-semibold hover:text-[#7E64F2] transition-colors duration-200"
          >
            Back to Dashboard
          </a>
        </div>

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