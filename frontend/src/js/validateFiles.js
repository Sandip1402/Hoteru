

export const validateFiles = (files) => {
    if (!files || files.length === 0) return "Please give atleast one image"

    const totalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 100 * 1024 * 1024) {
        return "Total file size must be less than 100MB.";
    }

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    for (let file of files) {
        if (!validTypes.includes(file.type)) {
            return "Only JPEG or PNG files are allowed.";
        }
    }

    return true;
};
