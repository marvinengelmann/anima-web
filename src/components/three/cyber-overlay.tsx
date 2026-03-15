"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const ringVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vPos;

void main() {
  vUv = uv;
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const ringFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uIntro;
uniform vec3 uColor;
uniform float uSegments;
uniform float uSpeed;
uniform float uGapRatio;

varying vec2 vUv;

void main() {
  float ringAngle = vUv.x;

  float dash = step(uGapRatio, fract(ringAngle * uSegments));
  if (dash < 0.5) discard;

  float pulse = fract(ringAngle - uTime * uSpeed);
  float pulseIntensity = smoothstep(0.0, 0.06, pulse) * (1.0 - smoothstep(0.06, 0.22, pulse));

  float fadeEdge = smoothstep(0.0, 0.01, vUv.y) * smoothstep(1.0, 0.99, vUv.y);

  vec3 color = uColor * (0.35 + pulseIntensity * 3.0);
  float alpha = (0.35 + pulseIntensity * 0.65) * fadeEdge * uIntro;

  gl_FragColor = vec4(color, alpha);
}
`;

const RING_CONFIG = [
	{
		radius: 1.35,
		tube: 0.003,
		rotation: [0, 0, 0] as const,
		segments: 32,
		speed: 0.06,
		gap: 0.4,
		rotSpeed: [0, 0.0004, 0],
	},
	{
		radius: 1.7,
		tube: 0.0025,
		rotation: [0.25, 0.15, 0.1] as const,
		segments: 24,
		speed: -0.08,
		gap: 0.45,
		rotSpeed: [0.0002, -0.0006, 0.0001],
	},
	{
		radius: 2.1,
		tube: 0.002,
		rotation: [-0.15, -0.1, 0.2] as const,
		segments: 40,
		speed: 0.05,
		gap: 0.5,
		rotSpeed: [-0.0001, 0.0003, -0.0002],
	},
];

const RING_COLOR_DARK = new THREE.Color(0.9, 0.45, 0.55);
const RING_COLOR_LIGHT = new THREE.Color(0.5, 0.2, 0.28);

function HudRing({
	config,
	pointer,
	isDark,
}: {
	config: (typeof RING_CONFIG)[0];
	pointer: React.RefObject<THREE.Vector2>;
	isDark: boolean;
}) {
	const meshRef = useRef<THREE.Mesh>(null);
	const matRef = useRef<THREE.ShaderMaterial>(null);

	const uniforms = useMemo(
		() => ({
			uTime: { value: 0 },
			uIntro: { value: 0 },
			uColor: { value: new THREE.Color(0.9, 0.45, 0.55) },
			uSegments: { value: config.segments },
			uSpeed: { value: config.speed },
			uGapRatio: { value: config.gap },
		}),
		[config],
	);

	useFrame((state) => {
		if (!meshRef.current || !matRef.current) return;
		const mat = matRef.current;
		const elapsed = state.clock.elapsedTime;

		mat.uniforms.uTime.value = elapsed;
		mat.uniforms.uIntro.value = 1.0;
		mat.uniforms.uColor.value.lerp(
			isDark ? RING_COLOR_DARK : RING_COLOR_LIGHT,
			0.05,
		);
		mat.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;

		meshRef.current.rotation.x += config.rotSpeed[0];
		meshRef.current.rotation.y += config.rotSpeed[1];
		meshRef.current.rotation.z += config.rotSpeed[2];

		const tiltX = pointer.current!.y * 0.03;
		const tiltY = pointer.current!.x * 0.05;
		meshRef.current.rotation.x += tiltX * 0.01;
		meshRef.current.rotation.y += tiltY * 0.01;
	});

	return (
		<mesh
			ref={meshRef}
			rotation={[config.rotation[0], config.rotation[1], config.rotation[2]]}
		>
			<torusGeometry args={[config.radius, config.tube, 4, 64]} />
			<shaderMaterial
				ref={matRef}
				vertexShader={ringVertexShader}
				fragmentShader={ringFragmentShader}
				uniforms={uniforms}
				transparent
				depthWrite={false}
				side={THREE.DoubleSide}
			/>
		</mesh>
	);
}

const tickVertexShader = /* glsl */ `
attribute float aAngle;
attribute float aLength;

uniform float uTime;
uniform float uIntro;
uniform float uRadius;

varying float vAlpha;

void main() {
  float angle = aAngle;
  float len = aLength;

  float r = uRadius + len * 0.12;
  vec3 pos = vec3(cos(angle) * r, sin(angle) * r, 0.0);

  float pulse = fract(angle / 6.2831 - uTime * 0.04);
  float pulseGlow = smoothstep(0.0, 0.05, pulse) * (1.0 - smoothstep(0.05, 0.15, pulse));

  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = (1.5 + pulseGlow * 3.0) * (200.0 / -mvPos.z);
  gl_PointSize = min(gl_PointSize, 5.0);

  vAlpha = (0.3 + pulseGlow * 0.7) * uIntro;

  gl_Position = projectionMatrix * mvPos;
}
`;

const tickFragmentShader = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float glow = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(uColor * (1.0 + glow * 0.5), glow * vAlpha);
}
`;

function DataTicks({ isDark }: { isDark: boolean }) {
	const pointsRef = useRef<THREE.Points>(null);
	const tickMatRef = useRef<THREE.ShaderMaterial>(null);
	const TICK_COUNT = 60;

	const [geometry, uniforms] = useMemo(() => {
		const angles = new Float32Array(TICK_COUNT);
		const lengths = new Float32Array(TICK_COUNT);
		const positions = new Float32Array(TICK_COUNT * 3);

		for (let i = 0; i < TICK_COUNT; i++) {
			const angle = (i / TICK_COUNT) * Math.PI * 2;
			angles[i] = angle;
			lengths[i] = Math.random();
			positions[i * 3] = 0;
			positions[i * 3 + 1] = 0;
			positions[i * 3 + 2] = 0;
		}

		const geo = new THREE.BufferGeometry();
		geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		geo.setAttribute("aAngle", new THREE.BufferAttribute(angles, 1));
		geo.setAttribute("aLength", new THREE.BufferAttribute(lengths, 1));

		const u = {
			uTime: { value: 0 },
			uIntro: { value: 0 },
			uRadius: { value: 1.42 },
			uColor: { value: new THREE.Color(0.9, 0.45, 0.55) },
		};

		return [geo, u] as const;
	}, []);

	useFrame((state) => {
		if (!pointsRef.current || !tickMatRef.current) return;
		const mat = tickMatRef.current;
		mat.uniforms.uTime.value = state.clock.elapsedTime;
		mat.uniforms.uIntro.value = 1.0;
		mat.uniforms.uColor.value.lerp(
			isDark ? RING_COLOR_DARK : RING_COLOR_LIGHT,
			0.05,
		);
		mat.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
	});

	return (
		<points ref={pointsRef} geometry={geometry}>
			<shaderMaterial
				ref={tickMatRef}
				vertexShader={tickVertexShader}
				fragmentShader={tickFragmentShader}
				uniforms={uniforms}
				transparent
				depthWrite={false}
			/>
		</points>
	);
}

interface CyberOverlayProps {
	pointer: React.RefObject<THREE.Vector2>;
	isDark: boolean;
}

export function CyberOverlay({ pointer, isDark }: CyberOverlayProps) {
	return (
		<group>
			{RING_CONFIG.map((config, i) => (
				<HudRing key={i} config={config} pointer={pointer} isDark={isDark} />
			))}
			<DataTicks isDark={isDark} />
		</group>
	);
}
