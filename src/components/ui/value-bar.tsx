"use client";

import { motion } from "framer-motion";
import { useRevealed } from "./fade-in";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface ValueBarProps {
	percent: number;
	color?: string;
	className?: string;
}

export function ValueBar({ percent, color, className }: ValueBarProps) {
	const revealed = useRevealed();

	return (
		<motion.div
			className={`h-full rounded-full ${className ?? ""}`}
			initial={{ width: "0%" }}
			animate={{ width: revealed ? `${percent}%` : "0%" }}
			transition={{ duration: 0.7, ease: EASE }}
			style={color ? { backgroundColor: color } : undefined}
		/>
	);
}
