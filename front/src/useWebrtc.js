<<<<<<< HEAD
import { useRef, useCallback } from 'react'

const ICE_SERVERS = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
}

export function useWebRTC() {
  const pcRef = useRef(null)

  const init = useCallback(async (socket, isCaller, roomId, onRemoteStream, skipJoin = false, onIceStateChange) => {
    if (pcRef.current) {
      pcRef.current.close()
      pcRef.current = null
    }

    const pc = new RTCPeerConnection(ICE_SERVERS)
    const pendingCandidates = []
    pcRef.current = pc

    try {
        const localStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true
        })

        localStream.getTracks().forEach(track =>
            pc.addTrack(track, localStream)
        )
    } catch (e) {
        console.error('Erreur micro:', e)
        throw e
    }

    pc.ontrack = ({ streams }) => onRemoteStream(streams[0])

    pc.onicecandidate = ({ candidate }) => {
      if (candidate && pc.signalingState !== 'closed') {
        socket.emit('ice-candidate', { roomId, candidate })
      }
    }

    pc.oniceconnectionstatechange = () => {
      console.log('ICE state:', pc.iceConnectionState)
      onIceStateChange?.(pc.iceConnectionState)
    }

    if (!skipJoin) {
      socket.emit('join', roomId)
    }

    const onPeerJoined = async () => {
      if (pc.signalingState === 'closed') return
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      socket.emit('offer', { roomId, offer })
    }

    const onOffer = async (offer) => {
      if (pc.signalingState === 'closed') return
      await pc.setRemoteDescription(offer)
      while (pendingCandidates.length) {
        const candidate = pendingCandidates.shift()
        await pc.addIceCandidate(candidate)
      }
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      socket.emit('answer', { roomId, answer })
    }

    const onAnswer = async (answer) => {
      if (pc.signalingState === 'closed') return
      await pc.setRemoteDescription(answer)
      while (pendingCandidates.length) {
        const candidate = pendingCandidates.shift()
        await pc.addIceCandidate(candidate)
      }
    }

    const onIceCandidate = async (candidate) => {
        if (pc.signalingState === 'closed') return

        try {
            if (pc.remoteDescription) {
            await pc.addIceCandidate(candidate)
            } else {
            pendingCandidates.push(candidate)
            }
        } catch (e) {
            console.error('Erreur ICE candidate:', e)
        }
    }

    socket.off('peer-joined', onPeerJoined)
    socket.off('offer', onOffer)
    socket.off('answer', onAnswer)
    socket.off('ice-candidate', onIceCandidate)

    if (isCaller) {
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)

        socket.emit('offer', { roomId, offer })
    } else {
        socket.on('offer', onOffer)
    }

    socket.on('answer', onAnswer)
    socket.on('ice-candidate', onIceCandidate)

    pc._listeners = { onPeerJoined, onOffer, onAnswer, onIceCandidate }
  }, [])

  const hangup = useCallback((socket, roomId) => {
    const pc = pcRef.current
    if (pc) {
      if (pc._listeners) {
        socket.off('peer-joined', pc._listeners.onPeerJoined)
        socket.off('offer', pc._listeners.onOffer)
        socket.off('answer', pc._listeners.onAnswer)
        socket.off('ice-candidate', pc._listeners.onIceCandidate)
      }
      pc.close()
      pcRef.current = null
    }
    if (socket && roomId) socket.emit('call:ended', { roomId })
  }, [])

  return { init, hangup }
}
=======
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
>>>>>>> 7fc732a (init call)
