const RemoteCursor = ({ cursor, style }) => {
    return (
        <div
            className="absolute pointer-events-none transition-all duration-100 ease-linear"
            style={{
                left: style.left,
                top: style.top,
                zIndex: 10
            }}
        >
            <div
                className="w-[2px] h-6 bg-blue-500 relative"
            >
                <div
                    className="absolute bottom-full left-0 bg-blue-500 text-white text-[10px] px-1 rounded-sm whitespace-nowrap mb-1"
                >
                    {cursor.username}
                </div>
            </div>
        </div>
    );
};

export default RemoteCursor;