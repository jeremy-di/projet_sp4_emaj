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
