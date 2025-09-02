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
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6 mb-16">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="ocean-wave"
            >
              <h1 className="text-6xl font-bold text-white font-poppins bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Waves
              </h1>
              <p className="text-light/80 mt-4 max-w-2xl mx-auto font-inter text-lg">
                Listen Together, Rise Together. Connect your music apps and experience synchronized listening with friends.
              </p>
              <div className="mt-6 flex justify-center">
                <div className="w-24 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"></div>
              </div>
            </motion.div>

            <div className="flex gap-4 justify-center">
              <Button
                variant="primary"
                onClick={() => toast.success("Welcome to Waves! 🌊")}
                className="seafoam-glow"
              >
                Get Started
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  window.open(
                    "https://github.com/victorola-coder/waves"
                  )
                }
              >
                View on GitHub
              </Button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs
            tabs={tabs}
            defaultValue="components"
            className="justify-center"
          />

          {/* Components Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Buttons Section */}
            <Glow className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4 font-poppins">Buttons</h2>
              <div className="flex flex-row flex-wrap gap-4">
                <Button variant="default">Default Button</Button>
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="danger">Danger Button</Button>
                <Button variant="google">Google Button</Button>
                <Button loading>Loading Button</Button>
              </div>
            </Glow>

            {/* Loading States */}
            <Glow className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4 font-poppins">Loaders</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-2">
                  <Loader size="small" />
                  <span className="text-sm text-light/60">Small</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Loader size="medium" />
                  <span className="text-sm text-light/60">Medium</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Loader size="large" />
                  <span className="text-sm text-light/60">Large</span>
                </div>
              </div>
            </Glow>

            {/* Icons & SVGs */}
            <Glow className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4 font-poppins">
                Icons & SVGs
              </h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col items-center gap-2">
                  <EyeIcon className="w-6 h-6" fill="white" />
                  <span className="text-sm text-light/60">Eye</span>
                </div>
                {/* Add more icons here */}
              </div>
            </Glow>

            {/* Form Inputs Section */}
            <Glow className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4 font-poppins">Inputs</h2>
              <Input
                placeholder="Regular Input"
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInputValue(e.target.value)
                }
              />
              <Input
                type="password"
                placeholder="Password Input"
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInputValue(e.target.value)
                }
              />
              <TextArea
                name="textarea"
                value={textAreaValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTextAreaValue(e.target.value)
                }
                placeholder="Text Area Input"
              />
            </Glow>

            {/* Form Validation */}
            <Glow className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4 font-poppins">
                Form Validation
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Form submitted!");
                }}
                className="space-y-4"
              >
                <Input
                  placeholder="Email"
                  type="email"
                  error="Please enter a valid email"
                />
                <Input
                  placeholder="Password"
                  type="password"
                  error="Password is required"
                />
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </Glow>

            {/* Toggle & Select Section */}
            <Glow className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4 font-poppins">
                Interactive Components
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-white">Toggle Component</span>
                  <Toggle checked={toggleState} onChange={setToggleState} />
                </div>
                <Select
                  options={selectOptions}
                  placeholder="Select an option"
                  onChange={(value) => console.log(value)}
                />
              </div>
            </Glow>

            {/* Animations */}
            <Glow className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4 font-poppins">
                Wave Animations
              </h2>
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-neutral/60 p-4 rounded-lg text-white text-center border border-primary/20"
                >
                  Hover & Tap Animation
                </motion.div>
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="bg-neutral/60 p-4 rounded-lg text-white text-center border border-secondary/20 animate-wave-float"
                >
                  Wave Float Animation
                </motion.div>
              </div>
            </Glow>

            {/* Color Palette */}
            <Glow className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4 font-poppins">
                Waves Brand Colors
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-12 rounded-lg bg-primary shadow-lg shadow-primary/25" />
                  <span className="text-sm text-light/60">Ocean Blue</span>
                </div>
                <div className="space-y-2">
                  <div className="h-12 rounded-lg bg-secondary shadow-lg shadow-secondary/25" />
                  <span className="text-sm text-light/60">Seafoam Green</span>
                </div>
                <div className="space-y-2">
                  <div className="h-12 rounded-lg bg-accent shadow-lg shadow-accent/25" />
                  <span className="text-sm text-light/60">Sunset Coral</span>
                </div>
                <div className="space-y-2">
                  <div className="h-12 rounded-lg bg-neutral border border-neutral-400" />
                  <span className="text-sm text-light/60">Dark Slate</span>
                </div>
              </div>
            </Glow>

            {/* Card & Image Section */}
            <Glow className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4 font-poppins">
                Display Components
              </h2>
              <Card>
                <div className="bg-neutral/60 p-4 rounded-lg">
                  <Image
                    src="/images/logo.svg"
                    alt="Waves Logo"
                    width={300}
                    height={200}
                    className="rounded-lg"
                  />
                </div>
              </Card>
            </Glow>

            {/* Loading States Section */}
            <Glow className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4 font-poppins">
                Loading States
              </h2>
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-12 w-1/2" />
              </div>
            </Glow>

            {/* Modal & OTP Section */}
            <Glow className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4 font-poppins">
                Advanced Components
              </h2>
              <div className="space-y-4">
                <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                <div className="mt-8">
                  <h3 className="text-white mb-4">OTP Input</h3>
                  <Otp />
                </div>
              </div>
            </Glow>

            {/* Toast Notifications */}
            <Glow className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4 font-poppins">
                Toast Notifications
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="default"
                  onClick={() => toast.success("Success message")}
                >
                  Success Toast
                </Button>
                <Button
                  variant="danger"
                  onClick={() => toast.error("Error message")}
                >
                  Error Toast
                </Button>
                <Button
                  variant="primary"
                  onClick={() => toast.info("Info message")}
                >
                  Info Toast
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => toast.warning("Warning message")}
                >
                  Warning Toast
                </Button>
              </div>
            </Glow>

            {/* Typography */}
            <Glow className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4 font-poppins">
                Waves Typography
              </h2>
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-poppins font-bold text-white">
                    Heading 1 - Poppins Bold
                  </h1>
                  <p className="text-light/60 text-sm">
                    Font: Poppins Bold - 36px
                  </p>
                </div>
                <div>
                  <h2 className="text-3xl font-poppins font-semibold text-white">
                    Heading 2 - Poppins Semibold
                  </h2>
                  <p className="text-light/60 text-sm">
                    Font: Poppins Semibold - 30px
                  </p>
                </div>
                <div>
                  <p className="text-base font-inter text-white">
                    Regular paragraph text with Inter
                  </p>
                  <p className="text-light/60 text-sm">
                    Font: Inter Regular - 16px
                  </p>
                </div>
                <div>
                  <p className="font-geistMono text-white">
                    Monospace text with Geist Mono
                  </p>
                  <p className="text-light/60 text-sm">
                    Font: Geist Mono - 16px
                  </p>
                </div>
              </div>
            </Glow>

            {/* Gradients */}
            <Glow className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4 font-poppins">
                Wave Gradients
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/25" />
                  <span className="text-sm text-light/60">
                    Ocean to Seafoam
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-gradient-to-r from-accent to-secondary shadow-lg shadow-accent/25" />
                  <span className="text-sm text-light/60">
                    Sunset to Seafoam
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-gradient-to-r from-neutral to-neutral-600 shadow-lg shadow-neutral/25" />
                  <span className="text-sm text-light/60">
                    Dark Slate Gradient
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent shadow-lg shadow-primary/25" />
                  <span className="text-sm text-light/60">
                    Full Wave Spectrum
                  </span>
                </div>
              </div>
            </Glow>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Modal Example"
        >
          <div className="space-y-4">
            <p className="text-white">
              This is an example modal that showcases the Modal component with the new Waves design system.
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
      </div>
      <footer className="mt-16 text-center text-light/60 border-t border-neutral-400/20 pt-8">
        <p className="font-inter">Built with Next.js, Tailwind CSS, and TypeScript</p>
        <p className="mt-2 font-poppins text-primary">© {new Date().getFullYear()} Waves - Listen Together, Rise Together</p>
      </footer>
    </Animation>
  );
}
