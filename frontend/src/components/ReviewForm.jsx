import { TbCameraPlus } from "react-icons/tb";
import { useEffect, useState } from "react";
import { StarRating } from "./StarRating";
import { useApiFetch } from "../js/api";
import { ImagePreview } from "./ImagePreview";
import { validateFiles } from "../js/validateFiles";


export const  ReviewForm = ({id}) => {
    const [rating, setRating] = useState(4);
    const [comment, setComment] = useState("");
    const [files, setFiles] = useState([]); 
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const apiFetch = useApiFetch();

    // manage image files
    const handleFileChange = (e) => {
        let valid = validateFiles(e.target.files);
        if(!(valid === true)){
            alert(valid);
            return;
        }

        // append file
        setFiles((prev) => [...(prev || []), ...newFiles]);
        e.target.value = null;
    };


    // form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!acceptedPrivacy) {
            alert("Please accept the Privacy Policy.");
            return;
        }

        const review = Object.fromEntries(new FormData(e.target));
        review.rating = rating;
        review.images = files.map((file) => URL.createObjectURL(file));
        console.log("submitting review : ", review);
        

        // api calling
        const res = await apiFetch(`/listings/${id}/reviews`,{
            method: "POST",
            body: JSON.stringify({review})
        })
        if(!res.success){
            throw new Error("Could not save review");
        }else{
            console.log("Review saved");
        }
        
        // reset form
        setRating(4);
        setComment("");
        setFiles([]);
        setAcceptedPrivacy(false);

        e.target.reset();
    };

    useEffect(() => {

    }, [files]);

    return (
        <form className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg select-none" onSubmit={(e) => handleSubmit(e)}>
            <h2 className="text-2xl font-bold mb-6 text-center">Share your experience</h2>

            {/* Rating */}
            <div className="mb-4 text-center">
                <p className="mb-2 font-semibold">How would you rate us?</p>
                <StarRating rating={rating} setRating={setRating} />
            </div>

            {/* Review textarea */}
            <div className="mb-4">
                <label className="block mb-1 font-semibold" htmlFor="review">Review</label>
                <textarea id="review" rows={4} value={comment} name="comment"
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review..."
                    className='review-text-area'
                    required
                />
            </div>

            {/* Upload */} {/*May add later*/}
            <div className="mb-4">
                <p className="block mb-1 font-semibold">Upload image</p>
                <div className="flex justify-between items-start">
                    <div>
                        <label htmlFor="uploadImg" className="image-input"><TbCameraPlus /></label>
                        <input id="uploadImg" type="file" accept="image/*" onChange={handleFileChange}
                            className='hidden' multiple/>
                    </div>
                    <ImagePreview Files={files} setFiles={setFiles}/>
                </div>
                <small className="text-gray-500 mt-1 block">
                    Maximum size: 100 MB
                </small>
            </div>

            {/* Privacy Policy */}
            <div className="mb-4 flex items-center space-x-2">
                <input id="privacy" type="checkbox" name="privacy"
                    checked={acceptedPrivacy}
                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                    className="w-4 h-4 border-gray-300 rounded"
                    required
                />
                <label htmlFor="privacy" className="text-gray-700 text-sm">
                    I accept the{" "}
                    <a href="#" className="text-blue-600 underline" target="_blank" rel="noreferrer">
                        Privacy Policy
                    </a>
                </label>
            </div>

            {/* Submit button */}
            <button
                type="submit"
                disabled={!acceptedPrivacy}
                className={`w-full py-3 rounded text-white font-semibold transition ${acceptedPrivacy
                        ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        : "bg-blue-300 cursor-not-allowed"
                    }`}>
                Submit review
            </button>
        </form>
    );
};
