let razorpayPromise = null;

export const loadRazorpay = () => {
    // Already loaded
    if (window.Razorpay) {
        return Promise.resolve(true);
    }

    // Already loading
    if (razorpayPromise) {
        return razorpayPromise;
    }

    razorpayPromise = new Promise((resolve, reject) => {
        const existingScript = document.querySelector(
            'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        );

        // Script tag already exists but hasn't finished loading
        if (existingScript) {
            existingScript.addEventListener("load", () => {
                resolve(true);
            });

            existingScript.addEventListener("error", () => {
                razorpayPromise = null;
                reject(
                    new Error(
                        "Failed to load Razorpay Checkout."
                    )
                );
            });

            return;
        }

        const script = document.createElement("script");

        script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

        script.async = true;

        script.onload = () => {
            resolve(true);
        };

        script.onerror = () => {
            razorpayPromise = null;

            reject(
                new Error(
                    "Failed to load Razorpay Checkout."
                )
            );
        };

        document.body.appendChild(script);
    });

    return razorpayPromise;
};