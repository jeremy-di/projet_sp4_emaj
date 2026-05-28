import { useState, useEffect, useCallback, useRef } from 'react'
import { useWebRTC } from './useWebRTC'
import socket from './socket'

export function useCall() {
  const { init, hangup } = useWebRTC()
  const remoteAudioRef = useRef(null)
  const roomIdRef = useRef(null)

  const [callState, setCallState] = useState('idle')
  const [roomId, setRoomId] = useState(null)
  const [caller, setCaller] = useState(null)

  const setRoom = (id) => {
    roomIdRef.current = id
    setRoomId(id)
  }

  useEffect(() => {
    const onIncoming = ({ roomId, callerName, callerSocketId }) => {
      setRoom(roomId)
      setCaller({ callerName, callerSocketId })
      setCallState('incoming')
    }

    const onAccepted = async ({ roomId }) => {
      setRoom(roomId)
      await init(socket, true, roomId, (stream) => {
        if (remoteAudioRef.current) remoteAudioRef.current.srcObject = stream
      }, true)
      setCallState('inCall')
    }

    const onRejected = () => {
      setCallState('idle')
      setRoom(null)
    }

    const onEnded = () => {
      hangup(socket, roomIdRef.current)
      setCallState('idle')
      setRoom(null)
      if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null
    }

    socket.off('call:incoming')
    socket.off('call:accepted')
    socket.off('call:rejected')
    socket.off('call:ended')

    socket.on('call:incoming', onIncoming)
    socket.on('call:accepted', onAccepted)
    socket.on('call:rejected', onRejected)
    socket.on('call:ended', onEnded)

    return () => {
      socket.off('call:incoming', onIncoming)
      socket.off('call:accepted', onAccepted)
      socket.off('call:rejected', onRejected)
      socket.off('call:ended', onEnded)
    }
  }, [init, hangup])

  const startCall = useCallback((targetSocketId, callerName) => {
    const room = `call-${Date.now()}`
    setRoom(room)
    setCallState('calling')
    socket.emit('join', room)
    socket.emit('call:invite', { roomId: room, targetSocketId, callerName })
  }, [])

  const acceptCall = useCallback(async () => {
    const room = roomIdRef.current
    socket.emit('call:accepted', { callerSocketId: caller.callerSocketId, roomId: room })
    await init(socket, false, room, (stream) => {
      if (remoteAudioRef.current) remoteAudioRef.current.srcObject = stream
    })
    setCallState('inCall')
  }, [caller, init])

  const rejectCall = useCallback(() => {
    socket.emit('call:rejected', { callerSocketId: caller.callerSocketId })
    setCallState('idle')
    setRoom(null)
  }, [caller])

  const endCall = useCallback(() => {
    hangup(socket, roomIdRef.current)
    setCallState('idle')
    setRoom(null)
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null
  }, [hangup])

  return {
    callState, caller, remoteAudioRef,
    startCall, acceptCall, rejectCall, endCall
  }
}
