"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { type ReactNode, createContext, useContext, useRef } from "react";

const RevealedContext = createContext(false);

export function useRevealed() {
	return useContext(RevealedContext);
}

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUpVariants: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0 },
};

const staggerContainerVariants: Variants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.08 } },
};

const staggerItemVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4, ease: EASE },
	},
};

interface FadeInProps {
	children: ReactNode;
	className?: string;
	delay?: number;
	stagger?: boolean;
}

export function FadeIn({
	children,
	className,
	delay = 0,
	stagger = false,
}: FadeInProps) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<RevealedContext.Provider value={inView}>
			<motion.div
				ref={ref}
				initial="hidden"
				animate={inView ? "visible" : "hidden"}
				variants={stagger ? staggerContainerVariants : fadeUpVariants}
				transition={
					stagger
						? undefined
						: { duration: 0.5, ease: EASE, delay }
				}
				className={className}
			>
				{children}
			</motion.div>
		</RevealedContext.Provider>
	);
}

export function FadeInItem({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<motion.div variants={staggerItemVariants} className={className}>
			{children}
		</motion.div>
	);
}
