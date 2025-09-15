

export const Modal = ({ show, onClose, children }) => {
    if (!show) return null; // don’t render if not visible

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose} /> {/* close when clicking outside */}

            {/* Modal content */}
            <div className="relative z-10 w-80">
                {children}
            </div>
        </div>
    )
}
