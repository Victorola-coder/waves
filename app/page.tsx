"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "./components/atom";
import { Animation } from "./components/global";
import { Button, Card, Modal } from "./components/ui";
import { WavesHero } from "./components/svgs";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Animation>
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <section className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[118px] pt-[40px] sm:pt-[50px] md:pt-[60px] lg:pt-[80px] xl:pt-[100px] bg-gradient-to-l from-primary/20 to-secondary/20 rounded-b-[16px] sm:rounded-b-[18px] md:rounded-b-[20px] flex flex-col lg:flex-row items-center lg:items-center gap-6 sm:gap-7 md:gap-8 lg:gap-[80px] xl:gap-[100px]">
          <motion.div
            className="flex flex-col items-start w-full lg:w-auto text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              className="w-fit flex flex-row items-center gap-[6px] sm:gap-[8px] p-[4px] sm:p-[6px] rounded-[80px] sm:rounded-[100px] border border-primary/20 bg-primary/10 shadow-lg mx-auto lg:mx-0"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <p className="text-[12px] sm:text-[14px] md:text-[16px] text-white leading-[16px] sm:leading-[18px] md:leading-[20px] font-poppins font-bold bg-primary py-[3px] sm:py-[4px] md:py-[5px] px-[8px] sm:px-[10px] md:px-[12px] rounded-[80px] sm:rounded-[100px]">
                New
              </p>
              <p className="text-[12px] sm:text-[14px] md:text-[16px] text-light/80 leading-[16px] sm:leading-[18px] md:leading-[20px] font-inter font-medium">
                Social Music Streaming
              </p>
            </motion.div>

            {/* Main Content */}
            <motion.div
              className="flex flex-col items-start gap-[16px] sm:gap-[18px] md:gap-[20px] my-[24px] sm:my-[28px] md:my-[32px] lg:my-[43px] max-w-[678px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h1 className="text-[28px] sm:text-[32px] md:text-[40px] lg:text-[60px] xl:text-[76px] text-white leading-[32px] sm:leading-[36px] md:leading-[44px] lg:leading-[66px] xl:leading-[81px] font-poppins font-bold">
                Listen Together,{" "}
                <span className="text-secondary">Rise Together</span>
              </h1>
              <p className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-light/80 leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[32px] xl:leading-[40px] font-inter font-normal">
                Connect your music apps and experience synchronized listening
                with friends. Join listening parties, compete on leaderboards,
                and discover music together.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center gap-[10px] sm:gap-[12px] mb-[40px] sm:mb-[50px] md:mb-[60px] lg:mb-[100px] xl:mb-[140px] w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                variant="primary"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
              >
                Get Started
              </Button>
              <Button
                variant="secondary"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="w-full lg:w-auto flex justify-center lg:justify-start"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-none h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] flex items-center justify-center">
              <WavesHero className="w-full h-full" />
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="bg-gradient-to-br from-neutral/5 via-neutral/10 to-neutral/5 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[118px] py-[60px] sm:py-[70px] md:py-[80px] lg:py-[100px] xl:py-[120px] relative overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 bg-primary/5 rounded-full blur-2xl sm:blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-28 sm:w-32 md:w-40 h-28 sm:h-32 md:h-40 bg-secondary/5 rounded-full blur-2xl sm:blur-3xl"></div>
            <div className="absolute top-1/2 left-1/4 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-accent/5 rounded-full blur-xl sm:blur-2xl"></div>
          </div>

          <motion.div
            className="flex flex-col gap-[16px] sm:gap-[18px] md:gap-[20px] items-center text-center relative z-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="text-primary font-inter text-xs sm:text-sm font-medium">
                Simple & Easy
              </span>
            </div>

            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[48px] xl:text-[61px] text-white leading-[28px] sm:leading-[32px] md:leading-[40px] lg:leading-[60px] xl:leading-[80px] tracking-[-1.22px] font-poppins font-bold">
              How Waves Works
            </h2>
            <p className="max-w-[766px] text-light/60 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[20px] leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[28px] xl:leading-[30px] px-4 font-inter">
              Experience music together in three simple steps. No complex
              setups, just pure musical connection.
            </p>
          </motion.div>

          <motion.div
            className="mt-[60px] sm:mt-[70px] md:mt-[80px] lg:mt-[100px] xl:mt-[120px] relative z-10"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {/* Desktop: Horizontal layout with connecting lines */}
            <div className="hidden lg:flex items-center justify-center gap-8 xl:gap-12">
              {[
                {
                  step: "01",
                  title: "Connect Your Music",
                  description:
                    "Link your Spotify, YouTube Music, or other streaming accounts to get started. We support all major platforms.",
                  icon: "🎵",
                  color: "primary",
                  features: [
                    "Spotify Integration",
                    "YouTube Music",
                    "Apple Music",
                    "Last.fm Scrobbling",
                  ],
                },
                {
                  step: "02",
                  title: "Join Listening Parties",
                  description:
                    "Create or join rooms where everyone listens to the same music in perfect sync. Real-time chat and reactions.",
                  icon: "🎉",
                  color: "secondary",
                  features: [
                    "Real-time Sync",
                    "Live Chat",
                    "Room Creation",
                    "Invite Friends",
                  ],
                },
                {
                  step: "03",
                  title: "Compete & Connect",
                  description:
                    "Rise up the leaderboards, unlock achievements, and make new music friends. Track your progress and stats.",
                  icon: "🏆",
                  color: "accent",
                  features: [
                    "Leaderboards",
                    "Achievements",
                    "Friend System",
                    "Progress Tracking",
                  ],
                },
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  {/* Step Card */}
                  <motion.div
                    className="w-[350px] xl:w-[400px] relative"
                    whileHover={{ y: -15, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-6 sm:p-8 text-center h-full border-2 border-neutral-400/20 hover:border-primary/30 transition-all duration-300">
                      {/* Step Number Badge */}
                      <div
                        className={`inline-flex items-center justify-center w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-full bg-${step.color}/10 border-2 border-${step.color}/20 mb-4 sm:mb-6`}
                      >
                        <span
                          className={`text-${step.color} font-poppins font-bold text-lg sm:text-xl md:text-2xl`}
                        >
                          {step.step}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className="text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-6">
                        {step.icon}
                      </div>

                      {/* Title */}
                      <h3 className="text-white text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] xl:text-[28px] leading-[24px] sm:leading-[26px] md:leading-[28px] lg:leading-[30px] xl:leading-[36px] font-poppins font-bold mb-3 sm:mb-4">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-light/60 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px] xl:leading-[28px] mb-4 sm:mb-6 font-inter">
                        {step.description}
                      </p>

                      {/* Features List */}
                      <div className="space-y-2">
                        {step.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center gap-2 text-xs sm:text-sm text-light/50"
                          >
                            <div
                              className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-${step.color}`}
                            ></div>
                            <span className="font-inter">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>

                  {/* Connecting Line (except for last item) */}
                  {index < 2 && (
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-neutral-400/20 to-neutral-400/20 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-secondary/40 to-accent/40 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile: Vertical layout */}
            <div className="lg:hidden space-y-6 sm:space-y-8">
              {[
                {
                  step: "01",
                  title: "Connect Your Music",
                  description:
                    "Link your Spotify, YouTube Music, or other streaming accounts to get started. We support all major platforms.",
                  icon: "🎵",
                  color: "primary",
                  features: [
                    "Spotify Integration",
                    "YouTube Music",
                    "Apple Music",
                    "Last.fm Scrobbling",
                  ],
                },
                {
                  step: "02",
                  title: "Join Listening Parties",
                  description:
                    "Create or join rooms where everyone listens to the same music in perfect sync. Real-time chat and reactions.",
                  icon: "🎉",
                  color: "secondary",
                  features: [
                    "Real-time Sync",
                    "Live Chat",
                    "Room Creation",
                    "Invite Friends",
                  ],
                },
                {
                  step: "03",
                  title: "Compete & Connect",
                  description:
                    "Rise up the leaderboards, unlock achievements, and make new music friends. Track your progress and stats.",
                  icon: "🏆",
                  color: "accent",
                  features: [
                    "Leaderboards",
                    "Achievements",
                    "Friend System",
                    "Progress Tracking",
                  ],
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 sm:-top-4 -left-3 sm:-left-4 z-10">
                    <div
                      className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-${step.color} flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-white font-poppins font-bold text-base sm:text-lg">
                        {step.step}
                      </span>
                    </div>
                  </div>

                  <Card className="p-4 sm:p-6 text-center border-2 border-neutral-400/20 hover:border-primary/30 transition-all duration-300">
                    {/* Icon */}
                    <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">
                      {step.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-white text-[18px] sm:text-[20px] md:text-[22px] leading-[22px] sm:leading-[24px] md:leading-[28px] font-poppins font-bold mb-2 sm:mb-3">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-light/60 text-[13px] sm:text-[14px] md:text-[15px] leading-[18px] sm:leading-[20px] md:leading-[22px] mb-3 sm:mb-4 font-inter">
                      {step.description}
                    </p>

                    {/* Features List */}
                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-light/50">
                      {step.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center gap-2"
                        >
                          <div
                            className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-${step.color}`}
                          ></div>
                          <span className="font-inter text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Connecting Arrow (except for last item) */}
                  {index < 2 && (
                    <div className="flex justify-center mt-4 sm:mt-6">
                      <div className="w-6 sm:w-8 h-6 sm:h-8 text-primary/40">
                        <svg fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            className="mt-[40px] sm:mt-[50px] md:mt-[60px] lg:mt-[70px] xl:mt-[80px] text-center relative z-10 px-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex flex-col items-center gap-4 sm:gap-3 px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl sm:rounded-full max-w-xs sm:max-w-none mx-auto">
              <div className="flex items-center gap-2">
                <span className="text-primary text-lg sm:text-xl">✨</span>
                <span className="text-light/80 font-inter text-base sm:text-lg font-medium">
                  Ready to get started?
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
              >
                Try Waves Now
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[118px] py-[60px] sm:py-[70px] md:py-[80px] lg:py-[100px] xl:py-[120px]"
        >
          <motion.div
            className="flex flex-col gap-[16px] sm:gap-[18px] md:gap-[20px] items-center text-center mb-[60px] sm:mb-[70px] md:mb-[80px] lg:mb-[100px] xl:mb-[120px]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[48px] xl:text-[61px] text-white leading-[28px] sm:leading-[32px] md:leading-[40px] lg:leading-[60px] xl:leading-[80px] tracking-[-1.22px] font-poppins font-bold">
              Why Choose Waves
            </h2>
            <p className="max-w-[766px] text-light/60 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[20px] leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[28px] xl:leading-[30px] px-4 font-inter">
              Experience the future of social music streaming with cutting-edge
              features and seamless integration.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-[24px]">
            {[
              {
                title: "Real-time Sync",
                description: "Perfect synchronization across all devices",
                icon: "⚡",
              },
              {
                title: "Social Features",
                description: "Connect with music lovers worldwide",
                icon: "🌍",
              },
              {
                title: "Leaderboards",
                description: "Compete and climb the ranks",
                icon: "🏅",
              },
              {
                title: "Achievements",
                description: "Unlock badges and milestones",
                icon: "🎖️",
              },
              {
                title: "Multi-Platform",
                description: "Works with all major streaming services",
                icon: "🔗",
              },
              {
                title: "Privacy First",
                description: "Your data stays secure and private",
                icon: "🔒",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="p-4 sm:p-6 text-center h-full">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-white text-lg sm:text-xl font-poppins font-bold mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-light/60 text-xs sm:text-sm font-inter">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/20 to-secondary/20 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[118px] py-[60px] sm:py-[70px] md:py-[80px] lg:py-[100px] xl:py-[120px] text-center">
          <motion.div
            className="max-w-[800px] mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[48px] xl:text-[61px] text-white leading-[28px] sm:leading-[32px] md:leading-[40px] lg:leading-[60px] xl:leading-[80px] font-poppins font-bold mb-4 sm:mb-6">
              Ready to Make Waves?
            </h2>
            <p className="text-light/80 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[20px] leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[28px] xl:leading-[30px] mb-6 sm:mb-8 font-inter">
              Join thousands of music lovers who are already experiencing the
              future of social music streaming.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button
                variant="primary"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
              >
                Start Listening Together
              </Button>
              <Button
                variant="secondary"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
              >
                View Demo
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-neutral/20 border-t border-neutral-400/20 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[118px] py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16">
          <div className="max-w-7x_ mx-auto">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 mb-6 sm:mb-8">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <span className="text-white font-poppins font-bold text-lg sm:text-xl">
                      🌊
                    </span>
                  </div>
                  <span className="text-white font-poppins font-bold text-xl sm:text-2xl">
                    Waves
                  </span>
                </div>
                <p className="text-light/60 font-inter text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 max-w-md">
                  Listen Together, Rise Together. Experience the future of
                  social music streaming with friends and music lovers
                  worldwide.
                </p>
                <div className="flex space-x-3 sm:space-x-4">
                  <a
                    href="#"
                    className="w-8 sm:w-10 h-8 sm:h-10 bg-neutral/40 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <span className="text-light/60 hover:text-primary text-base sm:text-lg">
                      🎵
                    </span>
                  </a>
                  <a
                    href="#"
                    className="w-8 sm:w-10 h-8 sm:h-10 bg-neutral/40 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <span className="text-light/60 hover:text-primary text-base sm:text-lg">
                      🌊
                    </span>
                  </a>
                  <a
                    href="#"
                    className="w-8 sm:w-10 h-8 sm:h-10 bg-neutral/40 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <span className="text-light/60 hover:text-primary text-base sm:text-lg">
                      🎉
                    </span>
                  </a>
                </div>
              </div>

              {/* Product Links */}
              <div>
                <h3 className="text-white font-poppins font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                  Product
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-light/60 hover:text-primary font-inter text-xs sm:text-sm transition-colors duration-200"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-light/60 hover:text-primary font-inter text-xs sm:text-sm transition-colors duration-200"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-light/60 hover:text-primary font-inter text-xs sm:text-sm transition-colors duration-200"
                    >
                      API
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-light/60 hover:text-primary font-inter text-xs sm:text-sm transition-colors duration-200"
                    >
                      Integrations
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="text-white font-poppins font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                  Company
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-light/60 hover:text-primary font-inter text-xs sm:text-sm transition-colors duration-200"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-light/60 hover:text-primary font-inter text-xs sm:text-sm transition-colors duration-200"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-light/60 hover:text-primary font-inter text-xs sm:text-sm transition-colors duration-200"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-light/60 hover:text-primary font-inter text-xs sm:text-sm transition-colors duration-200"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="border-t border-neutral-400/20 pt-6 sm:pt-8 mb-6 sm:mb-8">
              <div className="text-center_">
                <h3 className="text-white font-poppins font-semibold text-base sm:text-lg mb-2">
                  Stay in the loop
                </h3>
                <p className="text-light/60 font-inter text-xs sm:text-sm mb-3 sm:mb-4">
                  Get the latest updates on new features and releases
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto_">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 w-full px-3 sm:px-4 py-2 sm:py-3 bg-neutral/60 border border-neutral-400/30 rounded-lg text-white placeholder-light/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 font-inter text-sm"
                  />
                  <Button
                    variant="primary"
                    className="w-full sm:w-auto text-sm"
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-neutral-400/20 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm text-light/40 font-inter text-center sm:text-left">
                <span>
                  © {new Date().getFullYear()} Waves. All rights reserved.
                </span>
                <div className="flex gap-3 sm:gap-6">
                  <a
                    href="#"
                    className="hover:text-primary transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors duration-200"
                  >
                    Terms of Service
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-light/40 text-xs sm:text-sm font-inter">
                  Made with
                </span>
                <span className="text-accent text-base sm:text-lg">❤️</span>
                <span className="text-light/40 text-xs sm:text-sm font-inter">
                  for music lovers
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Modal Example"
      >
        <div className="space-y-4">
          <p className="text-white">
            This is an example modal that showcases the Modal component with the
            new Waves design system.
          </p>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(false)}
            className="w-full"
          >
            Close Modal
          </Button>
        </div>
      </Modal>
    </Animation>
  );
}
