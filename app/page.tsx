"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "./components/atom";
import { Animation } from "./components/global";
import { Button, Card, Modal } from "./components/ui";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Animation>
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <section className="px-4 md:px-[118px] pt-[60px] md:pt-[100px] bg-gradient-to-l from-primary/20 to-secondary/20 rounded-b-[20px] flex flex-col lg:flex-row items-center lg:items-end gap-8 md:gap-[80px]">
          <motion.div
            className="flex flex-col items-start w-full lg:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              className="w-fit flex flex-row items-center gap-[8px] p-[6px] rounded-[100px] border border-primary/20 bg-primary/10 shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <p className="text-[14px] md:text-[16px] text-white leading-[20px] md:leading-[24px] font-poppins font-bold bg-primary py-[5px] px-[12px] rounded-[100px]">
                New
              </p>
              <p className="text-[14px] md:text-[16px] text-light/80 leading-[20px] md:leading-[24px] font-inter font-medium">
                Social Music Streaming
              </p>
            </motion.div>

            {/* Main Content */}
            <motion.div
              className="flex flex-col items-start gap-[20px] my-[30px] md:my-[43px] max-w-[678px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h1 className="text-[40px] md:text-[60px] lg:text-[76px] text-white leading-[44px] md:leading-[66px] lg:leading-[81px] font-poppins font-bold">
                Listen Together,{" "}
                <span className="text-secondary">Rise Together</span>
              </h1>
              <p className="text-[16px] md:text-[18px] lg:text-[20px] text-light/80 leading-[24px] md:leading-[32px] lg:leading-[40px] font-inter font-normal">
                Connect your music apps and experience synchronized listening
                with friends. Join listening parties, compete on leaderboards,
                and discover music together.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col md:flex-row items-center gap-[12px] mb-[60px] md:mb-[140px] w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                variant="primary"
                className="w-full md:w-auto px-8 py-4 text-lg"
              >
                Get Started
              </Button>
              <Button
                variant="secondary"
                className="w-full md:w-auto px-8 py-4 text-lg"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="w-full lg:w-auto flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="w-full max-w-[400px] lg:max-w-none h-[300px] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[28px] border border-primary/20 flex items-center justify-center">
              <p className="text-light/60 font-inter text-lg">
                Waves Hero Visual
              </p>
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="bg-gradient-to-br from-neutral/5 via-neutral/10 to-neutral/5 px-4 md:px-[118px] py-[80px] md:py-[120px] relative overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent/5 rounded-full blur-2xl"></div>
          </div>

          <motion.div
            className="flex flex-col gap-[20px] items-center text-center relative z-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="text-primary font-inter text-sm font-medium">
                Simple & Easy
              </span>
            </div>

            <h2 className="text-[32px] md:text-[48px] lg:text-[61px] text-white leading-[40px] md:leading-[60px] lg:leading-[80px] tracking-[-1.22px] font-poppins font-bold">
              How Waves Works
            </h2>
            <p className="max-w-[766px] text-light/60 text-[16px] md:text-[18px] lg:text-[20px] leading-[24px] md:leading-[28px] lg:leading-[30px] px-4 font-inter">
              Experience music together in three simple steps. No complex
              setups, just pure musical connection.
            </p>
          </motion.div>

          <motion.div
            className="mt-[80px] md:mt-[120px] relative z-10"
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
                    className="w-[400px] relative"
                    whileHover={{ y: -15, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-8 text-center h-full border-2 border-neutral-400/20 hover:border-primary/30 transition-all duration-300">
                      {/* Step Number Badge */}
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${step.color}/10 border-2 border-${step.color}/20 mb-6`}
                      >
                        <span
                          className={`text-${step.color} font-poppins font-bold text-2xl`}
                        >
                          {step.step}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className="text-7xl mb-6">{step.icon}</div>

                      {/* Title */}
                      <h3 className="text-white text-[24px] md:text-[26px] lg:text-[28px] leading-[28px] md:leading-[32px] lg:leading-[36px] font-poppins font-bold mb-4">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-light/60 text-[16px] md:text-[17px] lg:text-[18px] leading-[24px] md:leading-[26px] lg:leading-[28px] mb-6 font-inter">
                        {step.description}
                      </p>

                      {/* Features List */}
                      <div className="space-y-2">
                        {step.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center gap-2 text-sm text-light/50"
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full bg-${step.color}`}
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
            <div className="lg:hidden space-y-8">
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
                  <div className="absolute -top-4 -left-4 z-10">
                    <div
                      className={`w-12 h-12 rounded-full bg-${step.color} flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-white font-poppins font-bold text-lg">
                        {step.step}
                      </span>
                    </div>
                  </div>

                  <Card className="p-6 text-center border-2 border-neutral-400/20 hover:border-primary/30 transition-all duration-300">
                    {/* Icon */}
                    <div className="text-6xl mb-4">{step.icon}</div>

                    {/* Title */}
                    <h3 className="text-white text-[22px] leading-[28px] font-poppins font-bold mb-3">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-light/60 text-[15px] leading-[22px] mb-4 font-inter">
                      {step.description}
                    </p>

                    {/* Features List */}
                    <div className="grid grid-cols-2 gap-2 text-sm text-light/50">
                      {step.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center gap-2"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full bg-${step.color}`}
                          ></div>
                          <span className="font-inter text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Connecting Arrow (except for last item) */}
                  {index < 2 && (
                    <div className="flex justify-center mt-6">
                      <div className="w-8 h-8 text-primary/40">
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
            className="mt-[80px] text-center relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-full">
              <span className="text-primary font-inter text-sm">✨</span>
              <span className="text-light/80 font-inter text-sm font-medium">
                Ready to get started?
              </span>
              <Button variant="primary" size="sm" className="ml-2">
                Try Waves Now
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="px-4 md:px-[118px] py-[60px] md:py-[100px]"
        >
          <motion.div
            className="flex flex-col gap-[20px] items-center text-center mb-[60px] md:mb-[104px]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-[32px] md:text-[48px] lg:text-[61px] text-white leading-[40px] md:leading-[60px] lg:leading-[80px] tracking-[-1.22px] font-poppins font-bold">
              Why Choose Waves
            </h2>
            <p className="max-w-[766px] text-light/60 text-[16px] md:text-[18px] lg:text-[20px] leading-[24px] md:leading-[28px] lg:leading-[30px] px-4 font-inter">
              Experience the future of social music streaming with cutting-edge
              features and seamless integration.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-[24px]">
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
                <Card className="p-6 text-center h-full">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-white text-xl font-poppins font-bold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-light/60 text-sm font-inter">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/20 to-secondary/20 px-4 md:px-[118px] py-[60px] md:py-[100px] text-center">
          <motion.div
            className="max-w-[800px] mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-[32px] md:text-[48px] lg:text-[61px] text-white leading-[40px] md:leading-[60px] lg:leading-[80px] font-poppins font-bold mb-6">
              Ready to Make Waves?
            </h2>
            <p className="text-light/80 text-[16px] md:text-[18px] lg:text-[20px] leading-[24px] md:leading-[28px] lg:leading-[30px] mb-8 font-inter">
              Join thousands of music lovers who are already experiencing the
              future of social music streaming.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Button variant="primary" className="px-8 py-4 text-lg">
                Start Listening Together
              </Button>
              <Button variant="secondary" className="px-8 py-4 text-lg">
                View Demo
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-400/20 px-4 md:px-[118px] py-8 text-center">
          <p className="text-light/60 font-inter">
            Built with Next.js, Tailwind CSS, and TypeScript
          </p>
          <p className="mt-2 font-poppins text-primary">
            © {new Date().getFullYear()} Waves - Listen Together, Rise Together
          </p>
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
