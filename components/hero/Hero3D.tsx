'use client'

import { Canvas } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { Float, Environment } from '@react-three/drei'

/**
 * HERO 3D — Geometría flotante con Bloom + luz ambiente
 * Web 4.0 luxury dark
 */

function RotatingGeometry() {
  const meshRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!meshRef.current) return

    const animate = () => {
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.0005
        meshRef.current.rotation.y += 0.0008
        meshRef.current.rotation.z += 0.0003
      }
      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.4}
      depthTest={false}
      floatIntensity={1}
    >
      <group ref={meshRef}>
        {/* Icosaedro principal — con glow */}
        <mesh scale={2}>
          <icosahedronGeometry args={[1, 4]} />
          <meshPhongMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.15}
            wireframe={false}
            shininess={100}
          />
        </mesh>

        {/* Wireframe overlay — líneas sutiles */}
        <mesh scale={2.05} position={[0, 0, 0.01]}>
          <icosahedronGeometry args={[1, 4]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe={true}
            opacity={0.08}
            transparent
          />
        </mesh>

        {/* Partículas flotantes — pequeños cubos orbitando */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const x = Math.cos(angle) * 3
          const z = Math.sin(angle) * 3
          return (
            <mesh key={i} position={[x, Math.sin(i * 0.5) * 0.5, z]} scale={0.15}>
              <boxGeometry args={[1, 1, 1]} />
              <meshPhongMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={0.2}
              />
            </mesh>
          )
        })}
      </group>
    </Float>
  )
}

function Scene() {
  return (
    <>
      {/* Lighting setup — refined */}
      <ambientLight intensity={0.6} color="#ffffff" />
      <pointLight position={[10, 10, 10]} intensity={1.0} color="#ffffff" castShadow />
      <pointLight position={[-10, -10, 10]} intensity={0.4} color="#ffffff" />
      <pointLight position={[0, -15, 5]} intensity={0.3} color="#ffffff" />

      {/* HDRI environment — subtle ambient */}
      <Environment preset="night" intensity={0.3} />

      {/* Geometry */}
      <RotatingGeometry />

      {/* Postprocessing — Bloom para glow premium */}
      <EffectComposer>
        <Bloom
          intensity={0.95}
          luminanceThreshold={0.08}
          luminanceSmoothing={0.95}
          mipmapBlur={true}
          kernelSize={2.5}
        />
      </EffectComposer>
    </>
  )
}

export function Hero3D() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Canvas 3D */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ position: 'absolute', inset: 0 }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
      >
        <Scene />
      </Canvas>

      {/* Overlay content — tipografía + CTA */}
      <div className="relative z-10 text-center pointer-events-none">
        <h1 className="text-hero font-display italic font-bold mb-6 text-white drop-shadow-xl">
          Victor IA
        </h1>
        <p className="text-xl text-text-secondary max-w-md mx-auto mb-12 drop-shadow-lg">
          Inteligencia artificial que trabaja contigo en tiempo real
        </p>

        {/* CTA — pointer-events-auto para hacer clickeable */}
        <button
          className="btn btn-primary pointer-events-auto"
          onClick={() => window.location.href = '/dashboard'}
        >
          Acceder al Dashboard
        </button>
      </div>

      {/* Gradient overlay — sutil vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
    </div>
  )
}
