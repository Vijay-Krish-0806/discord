'use client';
 
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation';
 
export default function DiscordCloneLanding() {
  const [isVisible, setIsVisible] = useState(false);
  const router=useRouter();
  useEffect(() => {
    setIsVisible(true);
  }, []);
  const handleLogin=()=>{
    redirect('/me')
  }
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-10"></div>
      </div>
 
      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* Optional: Add your logo here if needed */}
        </div>
       
        {/* Login Button - Top Right Corner */}
        <Button
          className="cursor-pointer bg-[#3ac1cf] hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/25"
          onClick={handleLogin}
        >
          Login
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </header>
 
      {/* Hero Section - Fixed to fit screen */}
      <div className="flex h-[calc(100vh-80px)]"> {/* Subtract header height */}
        {/* Left Section - Adjusted for proper fit */}
        <div className="w-1/2 flex items-center justify-start relative">
          <div className="relative">
             <div className='border-[15px] border-[#3ac1cf] rounded-full p-115 z-10 absolute -ml-55 -mt-30'></div>
            <div className="rounded-full bg-white p-50 shadow-2xl -ml-60 -mt-15 relative"> {/* Reduced padding and scaled */}
              <Image
                src="/Vconnect.png"
                alt="App Logo"
                width={400}  // Reduced width
                height={400} // Reduced height
                className="rounded-full ml-15"
                priority // Add priority for above-the-fold image
              />
            </div>
          </div>
        </div>
       
        {/* Right Section - Adjusted for proper fit */}
        <div className="w-1/2 flex items-center justify-center p-10"> {/* Reduced padding */}
          <section className="relative z-10 w-full max-w-xl -mt-20"> {/* Reduced max-width */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200 text-left">
                Let's Collaborate
                <span className="block">with World</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 text-left leading-relaxed"> {/* Reduced margin and changed to text-lg */}
                VConnect is a modern platform for communities, friends, and teams to connect, share, and hang out in a seamless, secure environment.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400"> {/* Changed to flex-wrap and reduced gap */}
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" /> {/* Reduced icon size */}
                  <span>Rich Messaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Video Calls</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Voice Channels</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}