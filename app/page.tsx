"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Image,
  Input,
  Modal,
  Otp,
  Select,
  Skeleton,
  Tabs,
  TextArea,
  Toggle,
} from "./components/ui";
import { motion } from "framer-motion";
import { EyeIcon } from "./components/svgs";
import { toast } from "sonner";
import { Animation, Glow, Loader } from "./components/global";
import { Header } from "./components/atom";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggleState, setToggleState] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");

  const tabs = [
    { label: "Overview", value: "overview" },
    { label: "Components", value: "components" },
    { label: "Settings", value: "settings" },
  ];

  const selectOptions = [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
  ];

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
          className="bg-neutral/5 px-4 md:px-[118px] py-[60px] md:py-[100px]"
        >
          <motion.div
            className="flex flex-col gap-[20px] items-center text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-[32px] md:text-[48px] lg:text-[61px] text-white leading-[40px] md:leading-[60px] lg:leading-[80px] tracking-[-1.22px] font-poppins font-bold">
              How Waves Works
            </h2>
            <p className="max-w-[766px] text-light/60 text-[16px] md:text-[18px] lg:text-[20px] leading-[24px] md:leading-[28px] lg:leading-[30px] px-4 font-inter">
              Experience music together in three simple steps. No complex
              setups, just pure musical connection.
            </p>
          </motion.div>

          <motion.div
            className="mt-[60px] md:mt-[104px] flex flex-col lg:flex-row justify-center items-center gap-6 md:gap-[24px]"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {[
              {
                title: "Connect Your Music",
                description:
                  "Link your Spotify, YouTube Music, or other streaming accounts to get started.",
                icon: "🎵",
              },
              {
                title: "Join Listening Parties",
                description:
                  "Create or join rooms where everyone listens to the same music in perfect sync.",
                icon: "🎉",
              },
              {
                title: "Compete & Connect",
                description:
                  "Rise up the leaderboards, unlock achievements, and make new music friends.",
                icon: "🏆",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="w-full lg:w-[384px]"
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="w-full lg:w-[384px] px-[18px] pb-[36px] py-[43px] text-center">
                  <div className="text-6xl mb-6">{step.icon}</div>
                  <h3 className="text-[#111827] text-[20px] md:text-[22px] lg:text-[25px] leading-[24px] md:leading-[28px] lg:leading-[30px] font-poppins font-bold mb-4">
                    {step.title}
                  </h3>
                  <p className="text-[#5A5A5A] text-[14px] md:text-[15px] lg:text-[16px] leading-[20px] md:leading-[24px] lg:leading-[31px] mx-auto text-center px-4 md:px-0 font-inter">
                    {step.description}
                  </p>
                </Card>
              </motion.div>
            ))}
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
