"use client";

import { Button } from "../ui";
import { Menu, X } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      label: "How it works",
      href: "#how-it-works",
    },
    {
      label: "Features",
      href: "#features",
    },
    {
      label: "Leaderboards",
      href: "#leaderboards",
    },
    {
      label: "Pricing",
      href: "#pricing",
    },
    {
      label: "About",
      href: "#about",
    },
  ];

  const containerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const navVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const navItemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <motion.header
      className="bg-neutral/80 backdrop-blur-xl border-b border-neutral-400/20 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[131px] py-3 md:py-[10px] flex items-center justify-between relative sticky top-0 z-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Logo */}
      <motion.figure
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        className="flex-shrink-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-poppins font-bold text-lg md:text-xl lg:text-2xl">
              W
            </span>
          </div>
          <span className="text-white font-poppins font-bold text-xl md:text-2xl lg:text-3xl">
            Waves
          </span>
        </div>
      </motion.figure>

      {/* Desktop Navigation */}
      <motion.nav
        className="hidden lg:block flex-1 mx-8 xl:mx-16"
        variants={navVariants}
      >
        <ul className="flex items-center justify-center gap-6 xl:gap-8 2xl:gap-[52px]">
          {navItems.map((item, index) => (
            <motion.li
              key={index}
              variants={navItemVariants}
              whileHover={{
                y: -2,
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
            >
              <a
                href={item.href}
                className="text-[16px] xl:text-[18px] 2xl:text-[20px] leading-[24px] xl:leading-[28px] 2xl:leading-[40px] font-inter font-medium transition-all duration-300 hover:text-primary hover:font-semibold cursor-pointer text-light/80 whitespace-nowrap"
              >
                {item.label}
              </a>
            </motion.li>
          ))}
        </ul>
      </motion.nav>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden flex flex-col space-y-1 p-2 z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-light" />
        ) : (
          <Menu className="w-6 h-6 text-light" />
        )}
      </button>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden absolute top-full left-0 right-0 bg-neutral/95 backdrop-blur-xl border-t border-neutral-400/20 z-40"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <nav className="px-4 py-6">
              <ul className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.label}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <a
                      href={item.href}
                      className="text-[18px] leading-[24px] font-inter font-medium transition-all duration-300 hover:text-primary hover:font-semibold cursor-pointer text-light/80 block py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Button - Hidden on Mobile */}
      <motion.div
        className="hidden lg:block flex-shrink-0"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="primary"
          className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3"
        >
          Get Started
        </Button>
      </motion.div>
    </motion.header>
  );
}
