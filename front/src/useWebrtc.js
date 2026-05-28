import { useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const ICE_SERVERS = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

export function useWebRTC(roomId) {
  const socketRef = useRef(null);
  const pcRef     = useRef(null);

  const init = useCallback(async (isCaller, onLocalStream, onRemoteStream) => {
    const socket = io('http://localhost:3000', {
      auth: { token: localStorage.getItem('token') }
    });
    socketRef.current = socket;

    const localStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    });
    onLocalStream(localStream);

    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;

    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    pc.ontrack = ({ streams }) => onRemoteStream(streams[0]);

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit('ice-candidate', { roomId, candidate });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('ICE state:', pc.iceConnectionState);
    };

    socket.emit('join', roomId);

    if (isCaller) {
      socket.on('peer-joined', async () => {
        console.log("Pair connecté, envoi de l'offre...");
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('offer', { roomId, offer });
      });
    } else {
      socket.on('offer', async (offer) => {
        console.log('Offre reçue, envoi de la réponse...');
        await pc.setRemoteDescription(offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { roomId, answer });
      });
    }

    socket.on('answer', async (answer) => {
      await pc.setRemoteDescription(answer);
    });

    socket.on('ice-candidate', async (candidate) => {
      try {
        await pc.addIceCandidate(candidate);
      } catch (e) {
        console.error('Erreur ICE candidate:', e);
      }
    });
  }, [roomId]);

  const hangup = useCallback(() => {
    pcRef.current?.close();
    socketRef.current?.disconnect();
  }, []);

  return { init, hangup };
}