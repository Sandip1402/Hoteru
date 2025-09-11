

export const StarRating = ({rating, setRating}) => {


    return (
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-3xl focus:outline-none ${star <= rating ? "text-blue-900" : "text-gray-300"
                        }`}
                    aria-label={`${star} Star`}
                >
                    ★
                </button>
            ))}
        </div>
    );
}
