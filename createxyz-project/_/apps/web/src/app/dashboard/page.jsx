import { useState, useEffect } from "react";
import {
  Sparkles,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus,
  TrendingUp,
  Calendar,
  MessageSquare,
  LogOut
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
// import TwoFilloutSliders from "@/components/FilloutSlider";
import TwoFilloutSliders from "@/components/TwoFilloutSliders";
import EmbedManager from "./EmbedManager";

export default function DashboardPage() {
  const [animationsVisible, setAnimationsVisible] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    // First show the welcome animation
    const welcomeTimer = setTimeout(() => {
      setWelcomeVisible(true);
    }, 500);

    // Then show the dashboard content
    const dashboardTimer = setTimeout(() => {
      setAnimationsVisible(true);
    }, 1500);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(dashboardTimer);
    };
  }, []);

  // Redirect to home if not authenticated
  // if (isLoaded && !isSignedIn) {
  //   window.location.href = "/";
  //   return null;
  // }

  // if (!isLoaded) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-[#8B70F6] via-[#9D7DFF] to-[#7E64F2] flex items-center justify-center">
  //       <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  //     </div>
  //   );
  // }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#8B70F6] via-[#9D7DFF] to-[#7E64F2] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <TwoFilloutSliders />
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Inter:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Welcome Overlay */}
        {welcomeVisible && (
          <div
            className={`fixed inset-0 bg-gradient-to-br from-[#8B70F6] via-[#9D7DFF] to-[#7E64F2] z-50 flex items-center justify-center transition-all duration-2000 ${
              animationsVisible ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Sparkles size={40} className="text-white" />
              </div>
              <h1
                className="text-5xl font-bold mb-4 animate-fade-in"
                style={{ fontFamily: "Instrument Serif, serif" }}
              >
                Welcome to WebAppZo!
              </h1>
              <p className="text-xl opacity-90 animate-fade-in-delay">
                Hello {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'there'}! Let's get started on your journey.
              </p>
            </div>
          </div>
        )}

        {/* Main Dashboard */}
        <div className={`transition-all duration-1000 ${animationsVisible ? "opacity-100" : "opacity-0"}`}>
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B70F6] to-[#9D7DFF] rounded-2xl flex items-center justify-center">
                  <Sparkles size={24} className="text-white" />
                </div>
                <span
                  className="text-2xl font-bold text-gray-800"
                  style={{ fontFamily: "Instrument Serif, serif" }}
                >
                  WebAppZo
                </span>
              </div>

              {/* Search */}
              <div className="hidden md:flex items-center space-x-4 flex-1 max-w-lg mx-8">
                <div className="relative w-full">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search anything..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-xl focus:border-[#8B70F6] focus:ring-2 focus:ring-[#8B70F6]/20 focus:bg-white transition-all duration-200 outline-none"
                  />
                </div>
              </div>

              {/* User Actions */}
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-600 hover:text-[#8B70F6] hover:bg-gray-100 rounded-xl transition-all duration-200">
                  <Bell size={20} />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{user?.emailAddresses?.[0]?.emailAddress}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-[#8B70F6] to-[#9D7DFF] rounded-full flex items-center justify-center text-white font-bold">
                    {(user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0] || 'U').toUpperCase()}
                  </div>
                </div>
                <a
                  href="/account/logout"
                  className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                  <LogOut size={20} />
                </a>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-6 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1
                className="text-4xl font-bold text-gray-800 mb-2"
                style={{ fontFamily: "Instrument Serif, serif" }}
              >
                Welcome back, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'there'}! 👋
              </h1>
              <p className="text-gray-600 text-lg">Here's what's happening with your account today.</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Removed Quick Actions */}
            </div>

            {/* Embedded Apps */}
            <EmbedManager />

          </main>
        </div>

        <style jsx global>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }

          .animate-fade-in-delay {
            animation: fade-in 1s ease-out 0.5s both;
          }

          .animate-slide-up {
            animation: slide-up 0.6s ease-out both;
          }
        `}</style>
      </div>
    </>
  );
}