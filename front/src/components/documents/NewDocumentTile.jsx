const NewDocumentTile = ({ onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-white text-slate-400 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
    >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-16 w-16">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span className="text-sm font-semibold">Nouveau document</span>
    </button>
)

export default NewDocumentTile
