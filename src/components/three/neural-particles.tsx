"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 300;

const particleVertexShader = /* glsl */ `
attribute float aScale;
attribute float aPhase;
attribute float aSpeed;

uniform float uTime;
uniform float uPixelRatio;
uniform float uAlphaScale;

varying float vAlpha;
varying float vScale;

void main() {
  vec3 pos = position;

  float angle = uTime * aSpeed * 0.08 + aPhase;
  float ca = cos(angle);
  float sa = sin(angle);
  pos.xz = mat2(ca, sa, -sa, ca) * pos.xz;

  float breathPhase = aPhase * 6.2831;
  float drift = sin(uTime * 0.25 + breathPhase) * 0.12;
  drift += sin(uTime * 0.4 + breathPhase * 0.7) * 0.06;
  pos += normalize(pos) * drift;

  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  float size = aScale * uPixelRatio * 3.5;
  gl_PointSize = size * (250.0 / -mvPos.z);
  gl_PointSize = min(gl_PointSize, 8.0);

  vAlpha = smoothstep(12.0, 3.0, -mvPos.z) * aScale * uAlphaScale;
  vScale = aScale;

  gl_Position = projectionMatrix * mvPos;
}
`;

const particleFragmentShader = /* glsl */ `
uniform vec3 uColor;

varying float vAlpha;
varying float vScale;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;

  float core = smoothstep(0.5, 0.0, d);
  float glow = smoothstep(0.5, 0.15, d);

  float alpha = mix(core * 0.4, glow * 0.15, 1.0 - vScale) * vAlpha;
  vec3 color = uColor * (1.0 + core * 0.5);

  gl_FragColor = vec4(color, alpha);
}
`;

interface NeuralParticlesProps {
	isDark: boolean;
}

export function NeuralParticles({ isDark }: NeuralParticlesProps) {
	const pointsRef = useRef<THREE.Points>(null);
	const matRef = useRef<THREE.ShaderMaterial>(null);

	const geometry = useMemo(() => {
		const positions = new Float32Array(PARTICLE_COUNT * 3);
		const scales = new Float32Array(PARTICLE_COUNT);
		const phases = new Float32Array(PARTICLE_COUNT);
		const speeds = new Float32Array(PARTICLE_COUNT);

		for (let i = 0; i < PARTICLE_COUNT; i++) {
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);
			const r = 2.0 + Math.random() * 3.0;

			positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
			positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
			positions[i * 3 + 2] = r * Math.cos(phi);

			scales[i] = 0.15 + Math.random() * 0.85;
			phases[i] = Math.random();
			speeds[i] = 0.3 + Math.random() * 0.7;
		}

		const geo = new THREE.BufferGeometry();
		geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
		geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
		geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
		return geo;
	}, []);

	useFrame((state) => {
		if (!matRef.current || !pointsRef.current) return;
		matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
		pointsRef.current.rotation.y += 0.0003;
	});

	const color = isDark
		? new THREE.Color(0.95, 0.65, 0.72)
		: new THREE.Color(0.25, 0.08, 0.12);

	return (
		<points ref={pointsRef} geometry={geometry}>
			<shaderMaterial
				key={isDark ? "d" : "l"}
				ref={matRef}
				vertexShader={particleVertexShader}
				fragmentShader={particleFragmentShader}
				uniforms={{
					uTime: { value: 0 },
					uPixelRatio: {
						value: Math.min(
							typeof window !== "undefined"
								? window.devicePixelRatio
								: 1,
							2,
						),
					},
					uAlphaScale: { value: isDark ? 1.0 : 5.0 },
					uColor: { value: color },
				}}
				transparent
				depthWrite={false}
				blending={
					isDark ? THREE.AdditiveBlending : THREE.NormalBlending
				}
			/>
		</points>
	);
}
