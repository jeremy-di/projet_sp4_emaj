const IncomingCallModal = ({ caller, onAccept, onReject }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-80 rounded-2xl bg-white p-6 shadow-xl text-center">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-green-600">
          <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-slate-800">Appel entrant</h2>
      <p className="mt-1 text-sm text-slate-500">{caller?.callerName} vous appelle</p>
      <div className="mt-5 flex gap-3">
        <button
          onClick={onReject}
          className="flex-1 rounded-xl bg-red-100 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-200"
        >
          Refuser
        </button>
        <button
          onClick={onAccept}
          className="flex-1 rounded-xl bg-green-500 py-2.5 text-sm font-semibold text-white hover:bg-green-600"
        >
          Décrocher
        </button>
      </div>
    </div>
  </div>
)

export default IncomingCallModal
