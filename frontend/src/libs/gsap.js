"use client";
import gsap from "gsap";
import { ScrollSmoother, ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
export { gsap, ScrollTrigger, ScrollSmoother };
