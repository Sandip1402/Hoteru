import { TbCameraPlus } from "react-icons/tb";
import { useEffect, useState } from "react";
import { StarRating } from "./StarRating";
import { apiFetch } from "../js/api";
import { redirect } from "react-router-dom";


export const  ReviewForm = ({id}) => {
    const [rating, setRating] = useState(4);
    const [review, setReview] = useState("");
    const [files, setFiles] = useState([]); 
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);

        // validating file
        const validFiles = newFiles.filter(
            (file) =>
            (file.type === "image/jpeg" || file.type === "image/png") &&
                file.size <= 100 * 1024 * 1024
        );

        if (validFiles.length !== newFiles.length) {
            alert("Some files were invalid. Please upload only JPEG/PNG under 100MB.");
        }
        
        // append file
        setFiles((prev) => [...(prev || []), ...validFiles]);
        e.target.value = null;
    };


    // form submission
    const handleSubmit = async (formData) => {
        if (!acceptedPrivacy) {
            alert("Please accept the Privacy Policy.");
            return;
        }
        const review = Object.fromEntries(formData);
        review.rating = rating;
        console.log(review);
        const res = apiFetch(`/listings/${id}/review`,
            {method: "POST"}, 
            review
        )
        if(!res.success){
            throw new Error("Could not save review");
        }
        
    };



    // useEffect(() => {
    // console.log("Current files:", files);
    // }, [files]);

    return (
        <form className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg select-none" action={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-center">Share your experience</h2>

            {/* Rating */}
            <div className="mb-4 text-center">
                <p className="mb-2 font-semibold">How would you rate us?</p>
                <StarRating rating={rating} setRating={setRating} />
            </div>

            {/* Review textarea */}
            <div className="mb-4">
                <label className="block mb-1 font-semibold" htmlFor="review">
                    Review
                </label>
                <textarea
                    id="review"
                    rows={4}
                    value={review}
                    name="commment"
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write your review..."
                    className='review-text-area'
                />
            </div>

            {/* Upload */} {/*May add later*/}
            <div className="mb-4">
                <p className="block mb-1 font-semibold">Upload image</p>
                <div className="flex justify-between items-start">
                    <div>
                        <label htmlFor="uploadImg" className="image-input"><TbCameraPlus /></label>
                        <input id="uploadImg" type="file" accept="image/*" onChange={handleFileChange} name="images"
                            className='hidden' multiple/>
                    </div>
                    {/* preview */}{/*may be added later */}
                    {/* {files.length !== 0 ? 
                        <ul>
                            <small>Click to remove</small>
                            {files.map((file, idx) => (
                                <li key={idx}><img src=""/>
                                    <button type="button" onClick={() => handleRemoveFile(idx)} className="text-red-500">
                                        ❌
                                    </button>
                                </li>
                            ))}
                        </ul> : ''
                    } */}
                </div>
                <small className="text-gray-500 mt-1 block">
                    Maximum size: 100 MB
                </small>
            </div>

            {/* Privacy Policy */}
            <div className="mb-4 flex items-center space-x-2">
                <input
                    id="privacy"
                    type="checkbox"
                    name="privacy"
                    checked={acceptedPrivacy}
                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                    className="w-4 h-4 border-gray-300 rounded"
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
