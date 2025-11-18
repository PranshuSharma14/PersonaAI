"use client"

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRightIcon, BotIcon, MessageSquareIcon, SparklesIcon, VideoIcon, ZapIcon, CheckIcon, UsersIcon, TrendingUpIcon } from "lucide-react";
import Link from "next/link";

export const HomeView = () => {
  
  return ( 
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-green-950 to-gray-900">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-green-950 to-gray-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/5 bg-grid-16"></div>
        
        {/* Main Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          
          {/* Header */}
          <div className="text-center space-y-8">
            
            {/* Badge */}
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20 transition-colors">
              <SparklesIcon className="w-3 h-3 mr-1" />
              AI-Powered Conversations
            </Badge>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white">
                Create{" "}
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Smart AI Agents
                </span>
                <br />
                That Actually Listen
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Build personalized AI agents that understand context, remember conversations, 
                and provide intelligent responses for any domain or expertise.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button 
                asChild 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                <Link href="/agents">
                  Get Started Free
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="border-green-500/30 text-green-400 hover:bg-green-500/10 px-8 py-3 text-lg"
              >
                <Link href="/meetings">
                  View Demo
                  <VideoIcon className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative">
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl shadow-green-500/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Sample Agents */}
                {[
                  { name: "Music Expert", icon: "🎵", description: "Discuss songs, share lyrics, recommend music" },
                  { name: "Fitness Coach", icon: "💪", description: "Workout plans, nutrition advice, motivation" },
                  { name: "Tech Assistant", icon: "🤖", description: "Code help, debugging, tech guidance" }
                ].map((agent, index) => (
                  <Card key={index} className="bg-gray-800/70 border-gray-600/40 p-4 hover:bg-gray-700/70 hover:border-green-500/30 hover:scale-105 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl group-hover:scale-110 transition-transform duration-300">{agent.icon}</div>
                      <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors duration-300">
                        {agent.name}
                      </h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{agent.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Powerful Features for{" "}
              <span className="text-green-400">Modern AI</span>
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Everything you need to create, manage, and scale intelligent AI agents
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {[
              {
                icon: <BotIcon className="h-8 w-8 text-green-400" />,
                title: "Custom AI Agents",
                description: "Create specialized AI agents with unique personalities and expertise for any domain"
              },
              {
                icon: <VideoIcon className="h-8 w-8 text-blue-400" />,
                title: "Video Meetings",
                description: "Have real-time video conversations with your AI agents using advanced voice technology"
              },
              {
                icon: <MessageSquareIcon className="h-8 w-8 text-purple-400" />,
                title: "Smart Conversations",
                description: "Context-aware discussions that remember previous interactions and maintain continuity"
              },
              {
                icon: <SparklesIcon className="h-8 w-8 text-yellow-400" />,
                title: "Auto Summaries",
                description: "Automatically generate comprehensive meeting summaries with key insights and action items"
              },
              {
                icon: <ZapIcon className="h-8 w-8 text-orange-400" />,
                title: "Instant Responses",
                description: "Lightning-fast AI responses powered by the latest GPT models and optimized infrastructure"
              },
              {
                icon: <TrendingUpIcon className="h-8 w-8 text-emerald-400" />,
                title: "Analytics & Insights",
                description: "Track conversation patterns, agent performance, and user engagement metrics"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-800/60 border-gray-600/50 p-6 hover:bg-gray-700/60 transition-all group backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="bg-gray-700/50 w-14 h-14 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-green-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof / Stats */}
      <div className="py-24 bg-gray-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Trusted by <span className="text-green-400">Thousands</span> Worldwide
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Join our growing community of AI enthusiasts and professionals
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { 
                number: "10K+", 
                label: "AI Agents Created",
                icon: <BotIcon className="w-8 h-8 text-green-400" />
              },
              { 
                number: "50K+", 
                label: "Conversations",
                icon: <MessageSquareIcon className="w-8 h-8 text-blue-400" />
              },
              { 
                number: "99.9%", 
                label: "Uptime",
                icon: <ZapIcon className="w-8 h-8 text-yellow-400" />
              },
              { 
                number: "500+", 
                label: "Happy Users",
                icon: <UsersIcon className="w-8 h-8 text-purple-400" />
              }
            ].map((stat, index) => (
              <Card key={index} className="bg-gray-800/60 border-gray-600/50 p-6 hover:bg-gray-700/60 hover:border-green-500/50 transition-all duration-300 group backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="bg-gray-700/50 w-16 h-16 rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                    {stat.number}
                  </div>
                  <div className="text-gray-200 text-sm sm:text-base font-medium">
                    {stat.label}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 relative">
        {/* Enhanced background */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.1)_0%,_transparent_70%)]" />
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-600/30 rounded-3xl p-12 shadow-2xl shadow-green-500/10">
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Ready to Build Your First{" "}
                <span className="text-green-400">AI Agent?</span>
              </h2>
              
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                Join thousands of users who are already creating intelligent AI agents. 
                Get started in minutes, no technical expertise required.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-4 text-lg shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105 transition-all duration-300"
                >
                  <Link href="/agents">
                    Create Your First Agent
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-6 pt-8">
                {[
                  { icon: <CheckIcon className="h-4 w-4 text-green-400" />, text: "Free to start" },
                  { icon: <CheckIcon className="h-4 w-4 text-green-400" />, text: "No credit card required" },
                  { icon: <CheckIcon className="h-4 w-4 text-green-400" />, text: "Setup in minutes" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-800/50 rounded-full px-4 py-2 backdrop-blur-sm border border-gray-600/30 hover:border-green-500/30 transition-all duration-300">
                    {item.icon}
                    <span className="text-sm font-medium text-gray-200">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   );
}
 
