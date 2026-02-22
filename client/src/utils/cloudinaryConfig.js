import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
    cloud: {
        cloudName: "dz570qpba", // Using the cloudName provided in the user's example
    },
});

export default cld;
