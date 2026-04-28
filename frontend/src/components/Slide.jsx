

export const Slide = ({ item }) => {
  return (
    <div className="relative flex items-center justify-center h-60 sm:h-1/3" >
      {/* <span className="h-96"> */}
        <img src={`/${item}`} alt="background_image" className="object-cover rounded-2xl w-full h-full" />
      {/* </span> */}
      <p className="absolute text-white md:text-xl lg:text-3xl">Awaken to a different world</p>
    </div>
  )
}