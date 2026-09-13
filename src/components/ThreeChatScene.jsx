// import React, { useRef, useState, useEffect, useMemo } from "react";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { 
//   Text, Float, Billboard, Sphere, Stars, 
//   PerspectiveCamera, PointerLockControls // <-- Mouse control ke liye
// } from "@react-three/drei";
// import { EffectComposer, Bloom } from "@react-three/postprocessing";
// import * as THREE from "three";

// // --- MESSAGE NODE ---
// function MessageNode({ msg, index, total }) {
//   const angle = index * 0.5;
//   const radius = 5; 
//   const x = Math.cos(angle) * radius;
//   const z = Math.sin(angle) * radius;
//   const y = (index - total / 2) * 1.2;
//   const color = msg.type === "private" ? "#00f2ff" : "#ff007a";

//   return (
//     <group position={[x, y, z]}>
//       <Billboard>
//         <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
//           <Sphere args={[0.12, 16, 16]} position={[-1.2, 0.3, 0]}>
//             <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} />
//           </Sphere>
//           <Text fontSize={0.2} color="white" anchorX="left" maxWidth={2.5}>
//             {`${msg.sender.toUpperCase()}: ${msg.message}`}
//           </Text>
//         </Float>
//       </Billboard>
//     </group>
//   );
// }

// // --- CHAT SYSTEM (Individual Sun/Core) ---
// function ChatSystem({ coreId, position, messages, currentUser }) {
//   const relevantMessages = messages.filter(m => {
//     const msgId = m.type === "group" ? "global" : [m.sender, m.receiver].sort().join("-");
//     return msgId === coreId;
//   });

//   const isAuthorized = coreId === "global" || coreId.includes(currentUser);
//   if (!isAuthorized) return null;

//   return (
//     <group position={position}>
//       <mesh>
//         <sphereGeometry args={[1.5, 32, 32]} />
//         <meshStandardMaterial 
//           color={coreId === "global" ? "#ffcc33" : "#00f2ff"} 
//           emissive={coreId === "global" ? "#ffaa00" : "#0066ff"} 
//           emissiveIntensity={3} 
//         />
//         <pointLight intensity={8} color={coreId === "global" ? "#ffaa00" : "#00f2ff"} />
//       </mesh>
//       <Text position={[0, 2.5, 0]} fontSize={0.4} color="white">
//         {coreId === "global" ? "GLOBAL_CORE" : `LINK: ${coreId.replace(currentUser, "").replace("-", "")}`}
//       </Text>
//       {relevantMessages.map((msg, i) => (
//         <MessageNode key={i} msg={msg} index={i} total={relevantMessages.length} />
//       ))}
//     </group>
//   );
// }

// // --- FPS CONTROLS (WASD + MOUSE) ---
// function FPSPlayer() {
//   const { camera } = useThree();
//   const speed = 0.4;
//   const keys = useRef({});

//   useEffect(() => {
//     const handleDown = (e) => (keys.current[e.code] = true);
//     const handleUp = (e) => (keys.current[e.code] = false);
//     window.addEventListener("keydown", handleDown);
//     window.addEventListener("keyup", handleUp);
//     return () => {
//       window.removeEventListener("keydown", handleDown);
//       window.removeEventListener("keyup", handleUp);
//     };
//   }, []);

//   useFrame(() => {
//     // Movement direction according to where camera is LOOKING
//     const direction = new THREE.Vector3();
//     const frontVector = new THREE.Vector3(0, 0, Number(!!keys.current["KeyS"]) - Number(!!keys.current["KeyW"]));
//     const sideVector = new THREE.Vector3(Number(!!keys.current["KeyA"]) - Number(!!keys.current["KeyD"]), 0, 0);

//     direction
//       .subVectors(frontVector, sideVector)
//       .normalize()
//       .multiplyScalar(speed)
//       .applyQuaternion(camera.quaternion);

//     camera.position.add(direction);
//   });

//   return <PointerLockControls />; // Isse mouse lock ho jayega screen par
// }

// export default function ThreeChatRoom({ messages = [], currentUser = "", onlineUsers = [] }) {
//   const chatCores = useMemo(() => {
//     const cores = [{ id: "global", pos: [0, 0, 0] }];
//     if (onlineUsers && Array.isArray(onlineUsers)) {
//       onlineUsers.forEach((user, i) => {
//         if (user !== currentUser) {
//           const id = [currentUser, user].sort().join("-");
//           cores.push({ id, pos: [(i + 1) * 40, 0, (i + 1) * 20] });
//         }
//       });
//     }
//     return cores;
//   }, [onlineUsers, currentUser]);

//   return (
//     <div style={{ width: "100%", height: "100%", cursor: "crosshair" }}>
//       <Canvas shadows>
//         <color attach="background" args={["#010208"]} />
//         <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={60} />
        
//         <Stars radius={300} count={8000} factor={7} fade speed={1.5} />
//         <ambientLight intensity={0.4} />

//         <FPSPlayer />

//         {chatCores.map((core) => (
//           <ChatSystem 
//             key={core.id} 
//             coreId={core.id} 
//             position={core.pos} 
//             messages={messages} 
//             currentUser={currentUser} 
//           />
//         ))}

//         <EffectComposer disableNormalPass>
//           <Bloom intensity={1.5} luminanceThreshold={0.2} mipmapBlur />
//         </EffectComposer>
//       </Canvas>
//       {/* User ko batane ke liye ki click karein */}
//       <div style={{ position: "absolute", top: "10px", right: "10px", color: "#00f2ff", fontSize: "10px", pointerEvents: "none" }}>
//         CLICK TO LOCK MOUSE | WASD TO MOVE
//       </div>
//     </div>
//   );
// }