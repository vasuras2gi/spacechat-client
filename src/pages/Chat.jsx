// import React, { useState, useEffect, useMemo } from "react"; // Added useMemo
// import { io } from "socket.io-client";
// import ThreeChatRoom from "../components/ThreeChatRoom";

// const socket = io("http://localhost:5000");

// function Chat() {
//   const [username, setUsername] = useState("");
//   const [joined, setJoined] = useState(false);
//   const [receiver, setReceiver] = useState("");
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [onlineUsers, setOnlineUsers] = useState([]);

//   // --- RADAR LOGIC: Core positions calculate karna ---
//   const chatCores = useMemo(() => {
//     const cores = [{ id: "global", pos: [0, 0, 0] }];
//     if (Array.isArray(onlineUsers)) {
//       onlineUsers.filter(u => u !== username).forEach((user, i) => {
//         const id = [username, user].sort().join("-");
//         // Same logic as ThreeChatRoom: 40 units gap
//         cores.push({ id, pos: [(i + 1) * 40, 0, (i + 1) * 20] });
//       });
//     }
//     return cores;
//   }, [onlineUsers, username]);

//   useEffect(() => {
//     socket.on("receive_private_message", (data) => setMessages((prev) => [...prev, data]));
//     socket.on("receive_group_message", (data) => setMessages((prev) => [...prev, data]));
//     socket.on("online_users", (users) => setOnlineUsers(Array.isArray(users) ? users : []));
    
//     return () => {
//       socket.off("receive_private_message");
//       socket.off("receive_group_message");
//       socket.off("online_users");
//     };
//   }, []);

//   const joinChat = () => {
//     if (!username.trim()) return alert("Identity required.");
//     socket.emit("join", username);
//     setJoined(true);
//   };

//   const sendMessage = (type) => {
//     if (!message.trim()) return;
//     const data = { sender: username, receiver: type === "private" ? receiver : null, message, type };
//     if (type === "private" && !receiver) return alert("Select a node!");
//     socket.emit(type === "private" ? "private_message" : "group_message", data);
//     setMessages((prev) => [...prev, data]);
//     setMessage("");
//   };

//   if (!joined) {
//     return (
//       <div style={styles.loginPage}>
//         <div style={styles.loginBox}>
//           <h1 style={styles.glitchText}>SOLAR_NET_v2</h1>
//           <input style={styles.loginInput} placeholder="USER_ID" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => e.key === "Enter" && joinChat()} />
//           <button style={styles.loginBtn} onClick={joinChat}>INITIALIZE</button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.sidebar}>
//         <div style={styles.sidebarHeader}>ACTIVE_NODES</div>
//         {onlineUsers.filter(u => u !== username).map((u, i) => (
//           <div key={i} onClick={() => setReceiver(u)} style={{...styles.nodeItem, color: receiver === u ? "#00f2ff" : "#64748b", background: receiver === u ? "rgba(0,242,255,0.05)" : "transparent"}}>
//             <span style={{...styles.dot, backgroundColor: receiver === u ? "#00f2ff" : "#1e293b"}} /> {u.toUpperCase()}
//           </div>
//         ))}
        
//         {/* --- RADAR UI (Inside Sidebar) --- */}
//         <div style={styles.radarContainer}>
//           <div style={styles.radarTitle}>CORE_RADAR</div>
//           <div style={styles.radarMap}>
//             {chatCores.map(core => (
//               <div key={core.id} title={core.id} style={{
//                 position: 'absolute',
//                 left: `${50 + (core.pos[0] / 4)}%`, // Scaling down for radar
//                 top: `${50 + (core.pos[2] / 4)}%`,
//                 width: '6px', height: '6px',
//                 background: core.id === 'global' ? '#ffaa00' : '#00f2ff',
//                 borderRadius: '50%',
//                 boxShadow: core.id === 'global' ? '0 0 10px #ffaa00' : '0 0 10px #00f2ff'
//               }} />
//             ))}
//             {/* User Pointer (Center) */}
//             <div style={{ position: 'absolute', left: '50%', top: '50%', width: '4px', height: '4px', background: 'white', borderRadius: '50%' }} />
//           </div>
//         </div>
//       </div>

//       <div style={styles.viewport}>
//         <div style={styles.topBar}>
//           <div style={styles.logoText}>VIRTUAL_UNIT // <span style={{color: '#00f2ff'}}>{username.toUpperCase()}</span></div>
//           {receiver && <div style={styles.targetStatus}>LINK: {receiver.toUpperCase()}</div>}
//         </div>

//         <div style={styles.canvasWrapper}>
//           <ThreeChatRoom messages={messages} currentUser={username} onlineUsers={onlineUsers} />
//         </div>

//         <div style={styles.inputArea}>
//           <div style={styles.inputWrapper}>
//             <input style={styles.mainInput} placeholder={receiver ? `Link to ${receiver}...` : "Broadcast..."} value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage(receiver ? "private" : "group")} />
//             <div style={styles.actionGroup}>
//               <button onClick={() => sendMessage("group")} style={{...styles.btnAction, background: "#ff007a"}}>GROUP</button>
//               <button onClick={() => sendMessage("private")} style={{...styles.btnAction, background: "#00f2ff", color: "black"}}>PRIVATE</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: { display: "flex", width: "100vw", height: "100vh", background: "#000", overflow: "hidden", fontFamily: "monospace" },
//   sidebar: { width: "240px", background: "rgba(2, 6, 23, 0.98)", borderRight: "1px solid #1e293b", padding: "20px", zIndex: 100, display: 'flex', flexDirection: 'column' },
//   sidebarHeader: { fontSize: "11px", color: "#475569", letterSpacing: "3px", marginBottom: "25px" },
//   nodeItem: { padding: "12px", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center" },
//   dot: { width: "7px", height: "7px", borderRadius: "50%", marginRight: "12px" },
//   radarContainer: { marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #1e293b' },
//   radarTitle: { fontSize: "9px", color: "#475569", marginBottom: "10px", textAlign: 'center' },
//   radarMap: { position: 'relative', width: '100%', height: '150px', background: 'rgba(0,0,0,0.5)', borderRadius: '10px', border: '1px solid #1e293b', overflow: 'hidden' },
//   viewport: { flex: 1, position: "relative" },
//   canvasWrapper: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" },
//   topBar: { position: "absolute", top: 25, left: 25, zIndex: 10 },
//   logoText: { color: "white", fontSize: "16px" },
//   targetStatus: { marginTop: "8px", color: "#ff007a", fontSize: "10px" },
//   inputArea: { position: "absolute", bottom: 40, width: "100%", display: "flex", justifyContent: "center", zIndex: 100 },
//   inputWrapper: { width: "70%", background: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(15px)", padding: "8px 25px", borderRadius: "100px", border: "1px solid rgba(0,242,255,0.2)", display: "flex", alignItems: "center" },
//   mainInput: { flex: 1, background: "transparent", border: "none", color: "white", outline: "none" },
//   actionGroup: { display: "flex", gap: "10px" },
//   btnAction: { border: "none", padding: "10px 20px", borderRadius: "50px", cursor: "pointer", fontWeight: "bold", fontSize: "11px" },
//   loginPage: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#010208" },
//   loginBox: { textAlign: "center", padding: "50px", background: "#0f172a", borderRadius: "24px", border: "1px solid #1e293b" },
//   glitchText: { color: "#00f2ff", fontSize: "28px", letterSpacing: "8px" },
//   loginInput: { padding: "15px", width: "280px", background: "#020617", border: "1px solid #1e293b", color: "#00f2ff", marginBottom: "25px", borderRadius: "8px", textAlign: "center" },
//   loginBtn: { width: "100%", padding: "15px", background: "#00f2ff", border: "none", fontWeight: "bold", cursor: "pointer", borderRadius: "8px" }
// };

// export default Chat;
import React, { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import * as THREE from "three";
import ThreeChatRoom from "../components/ThreeChatRoom";

const socket = io("https://spcaechat-server.onrender.com");

function Chat() {
  // Initialize username and joined state from localStorage if available
  const [username, setUsername] = useState(() => localStorage.getItem("chat_username") || "");
  const [joined, setJoined] = useState(() => !!localStorage.getItem("chat_username"));
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  // Track player position for the Radar Red Dot
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0, 10));

  // --- AUTO RE-JOIN ON RELOAD ---
  useEffect(() => {
    const savedUser = localStorage.getItem("chat_username");
    if (savedUser) {
      socket.emit("join", savedUser);
    }
  }, []);

  // --- CORE POSITION LOGIC ---
  const chatCores = useMemo(() => {
    const cores = [{ id: "global", pos: [0, 0, 0] }];
    if (Array.isArray(onlineUsers)) {
      onlineUsers.filter(u => u !== username).forEach((user, i) => {
        const id = [username, user].sort().join("-");
        cores.push({ id, pos: [(i + 1) * 50, 0, (i + 1) * 30] });
      });
    }
    return cores;
  }, [onlineUsers, username]);

  useEffect(() => {
    socket.on("receive_private_message", (data) => setMessages((prev) => [...prev, data]));
    socket.on("receive_group_message", (data) => setMessages((prev) => [...prev, data]));
    socket.on("online_users", (users) => setOnlineUsers(Array.isArray(users) ? users : []));
    
    return () => {
      socket.off("receive_private_message");
      socket.off("receive_group_message");
      socket.off("online_users");
    };
  }, []);

  const joinChat = () => {
    if (!username.trim()) return alert("Identity required.");
    localStorage.setItem("chat_username", username.trim());
    socket.emit("join", username.trim());
    setJoined(true);
  };

  const logout = () => {
    localStorage.removeItem("chat_username");
    setJoined(false);
    setUsername("");
    setReceiver("");
    setMessages([]);
    window.location.reload();
  };

  const sendMessage = (type) => {
    if (!message.trim()) return;
    const data = { sender: username, receiver: type === "private" ? receiver : null, message, type };
    if (type === "private" && !receiver) return alert("Select a node first!");
    socket.emit(type === "private" ? "private_message" : "group_message", data);
    setMessages((prev) => [...prev, data]);
    setMessage("");
  };

  if (!joined) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginBox}>
          <h1 style={styles.glitchText}>SOLAR_NET_v2</h1>
          <p style={styles.loginSub}>NEURAL_LINK_PENDING...</p>
          <input 
            style={styles.loginInput} 
            placeholder="ENTER_USER_ID" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && joinChat()} 
          />
          <button style={styles.loginBtn} onClick={joinChat}>INITIALIZE</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* LEFT SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "20px" }}>
          <div style={styles.sidebarHeader}>ACTIVE_NODES</div>
          <button onClick={logout} style={styles.logoutBtn} title="Disconnect Session">LOGOUT</button>
        </div>
        
        <div style={styles.userList}>
          {onlineUsers.filter(u => u !== username).map((u, i) => (
            <div 
              key={i} 
              onClick={() => setReceiver(u)} 
              style={{
                ...styles.nodeItem, 
                color: receiver === u ? "#00f2ff" : "#64748b", 
                background: receiver === u ? "rgba(0,242,255,0.1)" : "transparent",
                borderRight: receiver === u ? "2px solid #00f2ff" : "none"
              }}
            >
              <span style={{...styles.dot, backgroundColor: receiver === u ? "#00f2ff" : "#1e293b"}} /> 
              {u.toUpperCase()}
            </div>
          ))}
        </div>
        
        {/* --- DYNAMIC RADAR UI --- */}
        <div style={styles.radarContainer}>
          <div style={styles.radarTitle}>TACTICAL_MAP</div>
          <div style={styles.radarMap}>
            <div style={styles.radarGrid} />
            {chatCores.map(core => (
              <div key={core.id} title={core.id} style={{
                position: 'absolute',
                left: `${50 + (core.pos[0] / 6)}%`, 
                top: `${50 + (core.pos[2] / 6)}%`,
                width: '6px', height: '6px',
                background: core.id === 'global' ? '#ffaa00' : '#00f2ff',
                borderRadius: '50%',
                boxShadow: core.id === 'global' ? '0 0 8px #ffaa00' : '0 0 8px #00f2ff',
                transform: 'translate(-50%, -50%)',
                zIndex: 2
              }} />
            ))}
            <div style={{
              position: 'absolute',
              left: `${50 + (playerPosition.x / 6)}%`,
              top: `${50 + (playerPosition.z / 6)}%`,
              width: '8px', height: '8px',
              background: '#ff0000',
              borderRadius: '50%',
              boxShadow: '0 0 10px #ff0000',
              border: '1px solid white',
              transform: 'translate(-50%, -50%)',
              zIndex: 3,
              transition: 'all 0.1s linear'
            }} />
          </div>
        </div>
      </div>

      {/* MAIN VIEWPORT */}
      <div style={styles.viewport}>
        <div style={styles.topBar}>
          <div style={styles.logoText}>
            VIRTUAL_UNIT // <span style={{color: '#00f2ff'}}>{username.toUpperCase()}</span>
          </div>
          {receiver && (
            <div style={styles.targetStatus}>
              SECURE_LINK_ACTIVE: <span style={{color: '#00f2ff'}}>{receiver.toUpperCase()}</span>
              <button onClick={() => setReceiver("")} style={styles.clearReceiverBtn}>[X]</button>
            </div>
          )}
        </div>

        <div style={styles.canvasWrapper}>
          <ThreeChatRoom 
            messages={messages} 
            currentUser={username} 
            onlineUsers={onlineUsers}
            onPlayerMove={(pos) => setPlayerPosition(pos.clone())}
            onSelectUser={(targetUser) => setReceiver(targetUser)}
          />
        </div>

        <div style={styles.inputArea}>
          <div style={styles.inputWrapper}>
            <input 
              style={styles.mainInput} 
              placeholder={receiver ? `Send signal to ${receiver}...` : "Broadcast to Global Core..."} 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && sendMessage(receiver ? "private" : "group")} 
            />
            <div style={styles.actionGroup}>
              <button onClick={() => sendMessage("group")} style={{...styles.btnAction, background: "#ff007a"}}>GROUP</button>
              <button onClick={() => sendMessage("private")} style={{...styles.btnAction, background: "#00f2ff", color: "black"}}>PRIVATE</button>
            </div>
          </div>
        </div>

        <div style={styles.controlsHint}>
          CLICK TO LOCK MOUSE | WASD TO NAVIGATE
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", width: "100vw", height: "100vh", background: "#000", overflow: "hidden", fontFamily: "'Courier New', monospace" },
  sidebar: { width: "260px", background: "#020617", borderRight: "1px solid #1e293b", padding: "20px", zIndex: 100, display: 'flex', flexDirection: 'column' },
  sidebarHeader: { fontSize: "12px", color: "#475569", letterSpacing: "4px", fontWeight: "bold" },
  logoutBtn: { background: "transparent", border: "1px solid #ff007a", color: "#ff007a", fontSize: "9px", padding: "4px 8px", cursor: "pointer", borderRadius: "4px" },
  userList: { flex: 1, overflowY: 'auto' },
  nodeItem: { padding: "14px 15px", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", transition: "0.3s", marginBottom: "4px", borderRadius: "4px" },
  dot: { width: "8px", height: "8px", borderRadius: "50%", marginRight: "12px" },
  radarContainer: { marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #1e293b' },
  radarTitle: { fontSize: "10px", color: "#475569", marginBottom: "15px", textAlign: 'center', letterSpacing: '2px' },
  radarMap: { position: 'relative', width: '100%', height: '180px', background: '#010409', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' },
  radarGrid: { position: 'absolute', width: '100%', height: '100%', backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.2 },
  viewport: { flex: 1, position: "relative", background: "#000" },
  canvasWrapper: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 },
  topBar: { position: "absolute", top: 30, left: 30, zIndex: 10, pointerEvents: "none" },
  logoText: { color: "white", fontSize: "18px", fontWeight: "bold", textShadow: "0 0 10px rgba(0,242,255,0.5)" },
  targetStatus: { marginTop: "10px", color: "#ff007a", fontSize: "11px", letterSpacing: "1px", pointerEvents: "auto", display: "flex", alignItems: "center", gap: "8px" },
  clearReceiverBtn: { background: "none", border: "none", color: "#ff007a", cursor: "pointer", fontWeight: "bold" },
  inputArea: { position: "absolute", bottom: 40, width: "100%", display: "flex", justifyContent: "center", zIndex: 100 },
  inputWrapper: { width: "75%", maxWidth: "900px", background: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(20px)", padding: "10px 30px", borderRadius: "100px", border: "1px solid rgba(0,242,255,0.3)", display: "flex", alignItems: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.9)" },
  mainInput: { flex: 1, background: "transparent", border: "none", color: "white", outline: "none", fontSize: "15px" },
  actionGroup: { display: "flex", gap: "12px", marginLeft: "20px" },
  btnAction: { border: "none", padding: "12px 24px", borderRadius: "50px", cursor: "pointer", fontWeight: "bold", fontSize: "12px", transition: "0.2s" },
  controlsHint: { position: 'absolute', top: 30, right: 30, color: 'rgba(255,255,255,0.3)', fontSize: '10px', zIndex: 10 },
  loginPage: { height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center", background: "#010208" },
  loginBox: { textAlign: "center", padding: "60px", background: "#0f172a", borderRadius: "32px", border: "1px solid #1e293b", boxShadow: "0 0 60px rgba(0,242,255,0.15)" },
  glitchText: { color: "#00f2ff", fontSize: "32px", letterSpacing: "10px", marginBottom: "10px", textShadow: "0 0 20px #00f2ff" },
  loginSub: { color: '#475569', fontSize: '11px', letterSpacing: '3px', marginBottom: '30px' },
  loginInput: { padding: "18px", width: "320px", background: "#020617", border: "1px solid #1e293b", color: "#00f2ff", marginBottom: "30px", borderRadius: "12px", outline: "none", textAlign: "center", fontSize: "18px" },
  loginBtn: { width: "100%", padding: "18px", background: "#00f2ff", border: "none", fontWeight: "bold", cursor: "pointer", borderRadius: "12px", fontSize: "16px", letterSpacing: "2px" }
};

export default Chat;