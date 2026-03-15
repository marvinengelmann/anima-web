"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const NOISE_GLSL = /* glsl */ `
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0 / 7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x2_ = x_ * ns.x + ns.yyyy;
  vec4 y2_ = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x2_) - abs(y2_);
  vec4 b0 = vec4(x2_.xy, y2_.xy);
  vec4 b1 = vec4(x2_.zw, y2_.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

const eyeVertexShader =
	NOISE_GLSL +
	/* glsl */ `
uniform float uTime;

varying vec3 vLocalPosition;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;

void main() {
  vLocalPosition = position;
  vNormal = normalize(normalMatrix * normal);

  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;

  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPos.xyz;

  gl_Position = projectionMatrix * mvPos;
}
`;

const eyeFragmentShader =
	NOISE_GLSL +
	/* glsl */ `
uniform float uTime;
uniform float uIntro;
uniform float uDarkMode;
uniform float uPupilSize;
uniform vec2 uPointer;
uniform vec3 uIrisInner;
uniform vec3 uIrisMid;
uniform vec3 uIrisOuter;

varying vec3 vLocalPosition;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;

void main() {
  vec3 viewDir = normalize(vViewPosition);
  vec3 normal = normalize(vNormal);
  vec3 localDir = normalize(vLocalPosition);

  float angleFromFront = acos(clamp(localDir.z, -1.0, 1.0));
  float r = sin(angleFromFront);
  float a = atan(localDir.y, localDir.x);

  float irisR = 0.34;
  float pupilR = uPupilSize;
  float limbusW = 0.028;

  vec3 color = vec3(0.0);
  float alpha = 1.0;

  if (angleFromFront < irisR + limbusW + 0.02) {
    float irisNorm = clamp((r - pupilR) / (irisR - pupilR), 0.0, 1.0);

    float pupilEdge = smoothstep(pupilR - 0.006, pupilR + 0.004, r);
    vec3 pupilColor = vec3(0.008, 0.004, 0.006);
    float ruffNorm = clamp((r - pupilR) / (irisR - pupilR), 0.0, 1.0);
    float ruff = 1.0 - smoothstep(0.0, 0.09, ruffNorm);

    vec3 irisBase = mix(uIrisInner, uIrisMid, smoothstep(0.12, 0.5, irisNorm));
    irisBase = mix(irisBase, uIrisOuter, smoothstep(0.6, 0.95, irisNorm));

    float fibers = 0.0;
    for (int i = 0; i < 3; i++) {
      float freq = 35.0 + float(i) * 28.0;
      float noiseOff = snoise(vec3(float(i) * 7.3, r * 5.0, 0.0)) * 2.5;
      fibers += sin(a * freq + noiseOff) / (1.4 + float(i) * 0.6);
    }
    fibers = fibers * 0.25 + 0.5;
    irisBase *= 0.6 + fibers * 0.75;

    float cryptN = snoise(vec3(a * 2.5 + 50.0, r * 14.0, 0.0));
    float crypts = smoothstep(0.15, 0.5, cryptN);
    irisBase *= 0.55 + crypts * 0.45;

    float furrowN = snoise(vec3(a * 4.0, 0.0, 0.0)) * 3.0;
    float furrows = smoothstep(0.92, 1.0, sin(r * 70.0 + furrowN));
    irisBase -= vec3(0.05) * furrows;

    float collarette = 1.0 - smoothstep(0.0, 0.035, abs(irisNorm - 0.38));
    irisBase = mix(irisBase, uIrisMid * 1.4, collarette * 0.35);

    float limbal = smoothstep(0.86, 1.0, irisNorm);
    irisBase *= 1.0 - limbal * 0.6;

    irisBase *= 1.0 - ruff * 0.4;

    float breathGlow = sin(uTime * 0.5) * 0.1 + sin(uTime * 1.3) * 0.05;
    irisBase *= 1.0 + breathGlow;

    float microFiber = snoise(vec3(a * 60.0, r * 30.0, uTime * 0.01)) * 0.08;
    irisBase *= 1.0 + microFiber;

    float glowRing = 1.0 - smoothstep(0.0, 0.06, abs(irisNorm - 0.5));
    irisBase += uIrisMid * glowRing * 0.25;

    float innerGlow = smoothstep(pupilR + 0.02, pupilR + 0.06, r) *
                      (1.0 - smoothstep(pupilR + 0.06, pupilR + 0.12, r));
    irisBase += uIrisMid * innerGlow * 0.35;

    color = mix(pupilColor, irisBase, pupilEdge);

    if (r > irisR) {
      float scleraMix = smoothstep(irisR, irisR + limbusW, r);
      vec3 scleraEdge = mix(vec3(0.7, 0.65, 0.63), vec3(0.1, 0.08, 0.07), uDarkMode);
      color = mix(color, scleraEdge, scleraMix);
    }

  } else if (localDir.z > -0.25) {
    vec3 scleraDark = vec3(0.09, 0.08, 0.07);
    vec3 scleraLight = vec3(0.72, 0.68, 0.66);
    vec3 scleraBase = mix(scleraLight, scleraDark, uDarkMode);

    float v1 = snoise(vec3(a * 3.0, r * 7.0 - 8.0, 0.0));
    float v2 = snoise(vec3(a * 5.5 + 100.0, r * 10.0 - 8.0, 0.0));
    float vessels = (1.0 - smoothstep(0.0, 0.032, abs(v1))) * 0.15;
    vessels += (1.0 - smoothstep(0.0, 0.022, abs(v2))) * 0.1;
    vec3 vesselColorDark = vec3(0.3, 0.1, 0.1);
    vec3 vesselColorLight = vec3(0.7, 0.35, 0.35);
    scleraBase = mix(scleraBase, mix(vesselColorLight, vesselColorDark, uDarkMode), vessels);

    float nearIris = 1.0 - smoothstep(irisR + limbusW, irisR + 0.18, r);
    scleraBase = mix(scleraBase, mix(vec3(0.8, 0.7, 0.68), vec3(0.25, 0.12, 0.13), uDarkMode), nearIris * 0.3);

    float gridX = smoothstep(0.97, 1.0, sin(localDir.x * 45.0));
    float gridY = smoothstep(0.97, 1.0, sin(localDir.y * 45.0));
    float grid = gridX + gridY;
    scleraBase += vec3(0.5, 0.2, 0.25) * grid * 0.03;

    float scleraAlpha = mix(0.5, 1.0, uDarkMode);
    float scleraFalloff = smoothstep(irisR + limbusW, irisR + limbusW + 0.2, r);
    scleraAlpha *= mix(1.0, 1.0 - scleraFalloff * 0.95, 1.0 - uDarkMode);
    alpha *= scleraAlpha;

    color = scleraBase;
  } else {
    color = vec3(0.04, 0.03, 0.03);
  }

  vec3 lightPos = vec3(uPointer * 1.8, 4.0);
  vec3 lightDir = normalize(lightPos - vWorldPosition);
  vec3 halfVec = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfVec), 0.0), 280.0);
  color += vec3(1.0, 0.85, 0.88) * spec * 0.5;

  vec3 lightPos2 = vec3(uPointer * 0.4 + vec2(0.35, 0.6), 5.0);
  vec3 lightDir2 = normalize(lightPos2 - vWorldPosition);
  vec3 halfVec2 = normalize(lightDir2 + viewDir);
  float spec2 = pow(max(dot(normal, halfVec2), 0.0), 350.0);
  color += vec3(0.9, 0.8, 0.82) * spec2 * 0.2;

  float scanY = sin(uTime * 0.35) * 0.25;
  float scanLine = 1.0 - smoothstep(0.0, 0.006, abs(localDir.y - scanY));
  scanLine *= smoothstep(-0.1, 0.1, localDir.z);
  color += vec3(0.6, 0.3, 0.35) * scanLine * 0.12;

  float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 4.5);
  color += vec3(0.5, 0.2, 0.25) * fresnel * 0.15;

  float frontalFade = smoothstep(-0.25, 0.1, localDir.z);

  float edgeFresnel = 1.0 - max(dot(viewDir, normal), 0.0);
  float dissolveBase = edgeFresnel;

  float irisZone = 1.0 - smoothstep(0.0, irisR + limbusW + 0.05, angleFromFront);
  dissolveBase -= irisZone * 0.35;

  float n1 = snoise(vLocalPosition * 3.0 + uTime * 0.1) * 0.3;
  float n2 = snoise(vLocalPosition * 10.0 + uTime * 0.2) * 0.15;
  float dissolveNoise = n1 + n2;

  float dissolveThreshold = dissolveBase + dissolveNoise;
  float dissolveCutHi = mix(0.55, 0.75, uDarkMode);
  float dissolveCutLo = mix(0.25, 0.4, uDarkMode);
  float edgeFade = smoothstep(dissolveCutHi, dissolveCutLo, dissolveThreshold);

  float dissolveEdge = smoothstep(dissolveCutLo + 0.02, dissolveCutLo - 0.02, dissolveThreshold) *
                       (1.0 - smoothstep(dissolveCutLo - 0.02, dissolveCutLo - 0.08, dissolveThreshold));
  color += vec3(0.6, 0.25, 0.3) * dissolveEdge * mix(0.3, 0.6, uDarkMode);

  alpha = frontalFade * edgeFade * uIntro;

  if (alpha < 0.01) discard;

  gl_FragColor = vec4(color, alpha);
}
`;

interface ConsciousnessEyeProps {
	pointer: React.RefObject<THREE.Vector2>;
	isDark: boolean;
}

export function ConsciousnessEye({ pointer, isDark }: ConsciousnessEyeProps) {
	const meshRef = useRef<THREE.Mesh>(null);
	const lookTarget = useRef({ x: 0, y: 0 });
	const pupilTarget = useRef(0.11);
	const { viewport } = useThree();

	const uniforms = useMemo(
		() => ({
			uTime: { value: 0 },
			uIntro: { value: 0 },
			uDarkMode: { value: 1.0 },
			uPupilSize: { value: 0.11 },
			uPointer: { value: new THREE.Vector2(0, 0) },
			uIrisInner: { value: new THREE.Color(0.7, 0.18, 0.28) },
			uIrisMid: { value: new THREE.Color(0.95, 0.35, 0.45) },
			uIrisOuter: { value: new THREE.Color(0.3, 0.08, 0.15) },
		}),
		[],
	);

	useFrame((state) => {
		const mesh = meshRef.current;
		if (!mesh) return;

		const material = mesh.material as THREE.ShaderMaterial;
		const elapsed = state.clock.elapsedTime;

		material.uniforms.uTime.value = elapsed;
		material.uniforms.uIntro.value = 1.0;
		material.uniforms.uDarkMode.value = isDark ? 1.0 : 0.0;
		material.uniforms.uPointer.value.lerp(pointer.current!, 0.04);

		const targetRotY = pointer.current!.x * 0.45;
		const targetRotX = -pointer.current!.y * 0.3;
		lookTarget.current.x += (targetRotX - lookTarget.current.x) * 0.025;
		lookTarget.current.y += (targetRotY - lookTarget.current.y) * 0.025;
		mesh.rotation.set(lookTarget.current.x, lookTarget.current.y, 0);

		const cursorDist = Math.sqrt(
			pointer.current!.x ** 2 + pointer.current!.y ** 2,
		);
		const targetPupil = 0.07 + cursorDist * 0.06;
		pupilTarget.current +=
			(targetPupil - pupilTarget.current) * 0.012;
		material.uniforms.uPupilSize.value = pupilTarget.current;

		const aspect = viewport.aspect;
		const responsiveScale = Math.min(1.0, Math.max(0.55, aspect * 0.55));
		const breathScale =
			1.0 +
			Math.sin(elapsed * 0.4) * 0.008 +
			Math.sin(elapsed * 0.9) * 0.004;
		mesh.scale.setScalar(responsiveScale * breathScale);
	});

	return (
		<mesh ref={meshRef}>
			<sphereGeometry args={[1, 48, 48]} />
			<shaderMaterial
				vertexShader={eyeVertexShader}
				fragmentShader={eyeFragmentShader}
				uniforms={uniforms}
				transparent
				side={THREE.FrontSide}
			/>
		</mesh>
	);
}
