

export const ImagePreview = ({Files, setFiles}) => {
  return (
        <div className="flex gap-3 flex-wrap mt-4">
            {Files.map((file, index) => (
                <div key={index} className="relative w-24 h-24">
                    <img src={URL.createObjectURL(file)} alt="preview" 
                        className="w-full h-full object-cover rounded" />
                    <button
                        type="button"
                        onClick={() =>
                            setFiles((prev) => prev.filter((_, i) => i !== index))
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-1">
                        ✕
                    </button>
                </div>
            ))}
        </div>
  )
}
