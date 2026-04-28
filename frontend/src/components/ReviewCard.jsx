

export const ReviewCard = () => {
    return (
        <div className="flex flex-col gap-y-2 w-80">

            {/* User info */}
            <div className="flex gap-1 items-center">
                <span className="w-10">
                    <img className="rounded-full" alt="Avatar" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </span>
                <span className="">
                    <p>Walter White</p>
                    <p className="text-gray-500">22/8/23</p>
                </span>
            </div>

            {/* Feedback */}
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe non qui animi adipisc </p>

        </div>
    )
}