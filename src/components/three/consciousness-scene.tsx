"use client";

import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ConsciousnessEye } from "./consciousness-eye";
import { CyberOverlay } from "./cyber-overlay";
import { NeuralParticles } from "./neural-particles";

function SceneContent({
	pointer,
	isDark,
}: { pointer: React.RefObject<THREE.Vector2>; isDark: boolean }) {
	return (
		<>
			<ambientLight intensity={0.04} color="#f5e6e8" />
			<pointLight position={[2, 3, 5]} intensity={0.1} color="#fda4af" />
			<pointLight position={[-3, -1, 3]} intensity={0.03} color="#e8d5d8" />
			<ConsciousnessEye pointer={pointer} isDark={isDark} />
			<CyberOverlay pointer={pointer} isDark={isDark} />
			<NeuralParticles isDark={isDark} />
			<EffectComposer>
				<Bloom
					luminanceThreshold={0.6}
					luminanceSmoothing={0.4}
					intensity={0.8}
					mipmapBlur
				/>
				<Vignette eskil={false} offset={0.2} darkness={isDark ? 0.6 : 0.0} />
			</EffectComposer>
		</>
	);
}

export function ConsciousnessScene() {
	const pointer = useRef(new THREE.Vector2(0, 0));
	const [visible, setVisible] = useState(false);
	const onCreated = useCallback(() => setVisible(true), []);
	const { resolvedTheme } = useTheme();
	const isDark = resolvedTheme !== "light";

	useEffect(() => {
		const onMove = (e: MouseEvent) => {
			pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
			pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
		};

		const onTouch = (e: TouchEvent) => {
			const touch = e.touches[0];
			pointer.current.x = (touch.clientX / window.innerWidth) * 2 - 1;
			pointer.current.y = -(touch.clientY / window.innerHeight) * 2 + 1;
		};

		window.addEventListener("mousemove", onMove);
		window.addEventListener("touchmove", onTouch, { passive: true });

		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("touchmove", onTouch);
		};
	}, []);

	return (
		<Canvas
			dpr={[1, 1.5]}
			gl={{
				antialias: true,
				alpha: true,
				toneMapping: THREE.ACESFilmicToneMapping,
				toneMappingExposure: 0.85,
			}}
			camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 50 }}
			onCreated={onCreated}
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				pointerEvents: "none",
				opacity: visible ? 1 : 0,
				transition: "opacity 300ms ease-out",
			}}
		>
			<SceneContent pointer={pointer} isDark={isDark} />
		</Canvas>
	);
}
