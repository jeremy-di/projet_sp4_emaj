import { useRef, useState } from 'react';
import { useWebRTC } from '../useWebRTC';

export default function VideoCall({ roomId, isCaller }) {
  const remoteAudioRef = useRef(null);
  const [inCall, setInCall] = useState(false);
  const { init, hangup } = useWebRTC(roomId);

  const startCall = async () => {
    await init(
      isCaller,
      () => {},
      (remoteStream) => { remoteAudioRef.current.srcObject = remoteStream; }
    );
    setInCall(true);
  };

  const endCall = () => {
    hangup();
    remoteAudioRef.current.srcObject = null;
    setInCall(false);
  };

  return (
    <div>
      <audio ref={remoteAudioRef} autoPlay />

      {!inCall
        ? <button onClick={startCall}>{isCaller ? '📞 Appeler' : '📞 Rejoindre'}</button>
        : <button onClick={endCall}>🔴 Raccrocher</button>
      }
    </div>
  );
}