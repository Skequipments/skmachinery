'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import hero from '@/images/hero-img.png';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    if (!heroRef.current) return;

    // Initially hide all elements
    gsap.set([contentRef.current, headingRef.current, textRef.current, buttonRef.current, imageRef.current], {
      opacity: 0,
      y: 30
    });

    // Create a master timeline
    const masterTL = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    // Content animation sequence
    masterTL
      // Fade in container first
      .to(contentRef.current, {
        opacity: 1,
        duration: 0.5
      })
      // Then animate heading
      .to(headingRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'back.out(1.2)'
      }, 0.2)
      // Then animate text
      .to(textRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6
      }, 0.4)
      // Then animate button
      .to(buttonRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)'
      }, 0.5)
      // Finally animate image with more dramatic effect
      .to(imageRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'back.out(2)'
      }, 0.3);

    // Scroll trigger to restart animation when scrolled into view
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top 80%",
      onEnter: () => masterTL.restart(),
      // Prevent memory leaks
      onLeaveBack: () => masterTL.progress(0).pause(),
      markers: false // Set to true for debugging if needed
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      masterTL.kill();
    };
  }, []);

  return (
    <section className="py-10 bg-blue-50 z-5 overflow-hidden" ref={heroRef}>
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 mb-8 md:mb-0 pr-0 md:pr-8" ref={contentRef}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" ref={headingRef}>
              Leading Manufacturer of <span className="text-red-500">High-Quality</span> Testing Equipments
            </h1>
            <p className="text-gray-600 mb-6" ref={textRef}>
              Discover high-efficiency testing equipment designed to meet modern industry standards and your exact needs.
            </p>
            <div ref={buttonRef}>
              <Button
                asChild
                className="bonik-btn-primary px-5 py-3 rounded-xl font-medium tracking-wide shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:scale-105"
              >
                <Link href="/products">Shop Now</Link>
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/3" ref={imageRef}>
            <Image
              src={hero}
              alt="Testing Equipment"
              width={300}
              height={300}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}