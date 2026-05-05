{/* Veritcal Card */}

export const CardY = ({item, style}) => {
  return (
    <span className="h-60 w-50">
        <img src={item} alt="image" className="object-cover rounded-2xl h-full" />
    </span>
  )
}