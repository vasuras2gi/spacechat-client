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

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  Text, Float, Billboard, Sphere, Stars, 
  PerspectiveCamera, PointerLockControls 
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// --- 1. SIGNAL BEAM (Animation Effect from Camera) ---
function SignalBeam({ start, end, color }) {
  const ref = useRef();
  const [opacity, setOpacity] = useState(1);

  useFrame((state, delta) => {
    if (opacity > 0) setOpacity((prev) => prev - delta * 1.2);
  });

  if (opacity <= 0) return null;

  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} linewidth={2} />
    </line>
  );
}

// --- 2. MESSAGE NODE (Dual-Sided & Anti-Overlap) ---
function MessageNode({ msg, index, total, coreScale, currentUser }) {
  const isMe = msg.sender.toLowerCase() === currentUser.toLowerCase();
  
  const orbitRadius = (coreScale * 2.2) + 1.8;
  const side = isMe ? 1 : -1; 
  
  const angle = index * 0.4; 
  const x = (Math.cos(angle) * 0.5) + (side * orbitRadius);
  const z = Math.sin(angle) * 1.5;
  const y = index * 0.8; 

  const userColor = isMe ? "#00f2ff" : "#ff007a";
  const opacity = Math.max(0.3, 1 - (total - 1 - index) * 0.12);

  return (
    <group position={[x, y, z]}>
      <Billboard>
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.4}>
          
          {/* 1. TEXT FIX: Anchor aur position adjust kiye taaki sphere se door rahe */}
          <Text 
            // Position mein X-offset diya taaki dot ke bagal se start ho
            position={[isMe ? 0.3 : -0.3, 0, 0]} 
            fontSize={0.28} 
            color="white" 
            anchorX={isMe ? "left" : "right"} // Me = Text starts from left, Others = starts from right
            fillOpacity={opacity}
            maxWidth={3.5}
            outlineWidth={0.015}
            outlineColor={userColor}
          >
            {`${msg.sender.toUpperCase()}: ${msg.message}`}
          </Text>
          
          {/* 2. SPHERE FIX: Depth offset (Z-axis) taaki text ke peeche rahe */}
          <Sphere args={[0.08, 16, 16]} position={[0, 0, -0.05]}> 
            <meshStandardMaterial 
              color={userColor} 
              emissive={userColor} 
              emissiveIntensity={opacity * 8} 
              transparent 
              opacity={opacity} 
            />
          </Sphere>

          {/* Background Plate ko bhi thoda peeche rakha readability ke liye */}
          <mesh position={[isMe ? 1.8 : -1.8, 0, -0.1]}>
            <planeGeometry args={[3.6, 0.6]} />
            <meshBasicMaterial color="#000" transparent opacity={opacity * 0.5} />
          </mesh>

        </Float>
      </Billboard>
    </group>
  );
}

// --- 3. CHAT SYSTEM ---
function ChatSystem({ coreId, position, messages, currentUser }) {
  const relevantMessages = messages.filter(m => {
    const msgId = m.type === "group" ? "global" : [m.sender, m.receiver].sort().join("-");
    return msgId === coreId;
  });

  const activityScale = Math.min(1 + relevantMessages.length * 0.2, 4);
  const coreColor = coreId === "global" ? "#ffcc33" : "#00f2ff";

  return (
    <group position={position}>
      <mesh scale={activityScale}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={activityScale * 2} />
        <pointLight intensity={15} color={coreColor} distance={60} />
      </mesh>

      <Billboard position={[0, (relevantMessages.length * 0.8) + activityScale + 2.5, 0]}>
        <Text fontSize={0.8} color="white" outlineWidth={0.04} outlineColor={coreColor}>
          {coreId === "global" ? "GLOBAL_CORE" : `SECURE_LINK: ${coreId.split('-').find(n => n !== currentUser)?.toUpperCase()}`}
        </Text>
      </Billboard>

      {relevantMessages.map((msg, i) => (
        <MessageNode 
          key={i} 
          msg={msg} 
          index={i} 
          total={relevantMessages.length} 
          coreScale={activityScale}
          currentUser={currentUser}
        />
      ))}
    </group>
  );
}

// --- 4. FPS PLAYER (With Movement Sync) ---
function FPSPlayer({ onMove }) {
  const { camera } = useThree();
  const speed = 0.5;
  const keys = useRef({});

  useEffect(() => {
    const handleDown = (e) => (keys.current[e.code] = true);
    const handleUp = (e) => (keys.current[e.code] = false);
    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);
    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
    };
  }, []);

  useFrame(() => {
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, Number(!!keys.current["KeyS"]) - Number(!!keys.current["KeyW"]));
    const sideVector = new THREE.Vector3(Number(!!keys.current["KeyA"]) - Number(!!keys.current["KeyD"]), 0, 0);

    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed).applyQuaternion(camera.quaternion);
    camera.position.add(direction);
    
    if (onMove) onMove(camera.position);
  });

  return <PointerLockControls />;
}

// --- MAIN ROOM ---
export default function ThreeChatRoom({ messages = [], currentUser = "", onlineUsers = [], onPlayerMove }) {
  const [activeSignals, setActiveSignals] = useState([]);
  const lastMsgCount = useRef(messages.length);

  const chatCores = useMemo(() => {
    const cores = [{ id: "global", pos: [0, 0, 0] }];
    if (Array.isArray(onlineUsers)) {
      const filtered = onlineUsers.filter(u => u !== currentUser);
      filtered.forEach((user, i) => {
        const id = [currentUser, user].sort().join("-");
        const angle = (i / Math.max(1, filtered.length)) * Math.PI * 2;
        const radius = 60;
        cores.push({ id, pos: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] });
      });
    }
    return cores;
  }, [onlineUsers, currentUser]);

  // Effect to trigger "Signal Beam" animation
  useEffect(() => {
    if (messages.length > lastMsgCount.current) {
      const newMsg = messages[messages.length - 1];
      if (newMsg.sender.toLowerCase() === currentUser.toLowerCase()) {
        const targetCoreId = newMsg.type === "group" ? "global" : [newMsg.sender, newMsg.receiver].sort().join("-");
        const targetPos = chatCores.find(c => c.id === targetCoreId)?.pos || [0, 0, 0];
        
        // Signal trigger logic
        const signalId = Date.now();
        setActiveSignals(prev => [...prev, { id: signalId, end: targetPos }]);
        setTimeout(() => setActiveSignals(prev => prev.filter(s => s.id !== signalId)), 1000);
      }
      lastMsgCount.current = messages.length;
    }
  }, [messages, currentUser, chatCores]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas shadows>
        <color attach="background" args={["#010208"]} />
        <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={60} />
        <Stars radius={300} count={6000} factor={7} fade />
        <ambientLight intensity={0.3} />
        
        <FPSPlayer onMove={onPlayerMove} />

        {/* Dynamic Signals */}
        <SceneSignals signals={activeSignals} />

        {chatCores.map((core) => (
          <ChatSystem 
            key={core.id} 
            coreId={core.id} 
            position={core.pos} 
            messages={messages} 
            currentUser={currentUser}
          />
        ))}

        <EffectComposer>
          <Bloom intensity={1.8} luminanceThreshold={0.15} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

// Helper to get camera position for signals
function SceneSignals({ signals }) {
  const { camera } = useThree();
  return signals.map(sig => (
    <SignalBeam 
      key={sig.id} 
      start={[camera.position.x, camera.position.y - 0.5, camera.position.z]} 
      end={sig.end} 
      color="#00f2ff" 
    />
  ));
}