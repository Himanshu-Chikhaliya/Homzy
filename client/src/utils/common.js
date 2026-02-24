export const getMenuStyles = (menuOpened) => {
  if (document.documentElement.clientWidth <= 800) {
    return { right: !menuOpened && "-100%" };
  }
};

export const sliderSettings = {
  slidesPerView: 1,
  spaceBetween: 50,
  breakpoints: {
    480: {
      slidesPerView: 1,
    },
    600: {
      slidesPerView: 2
    },
    750: {
      slidesPerView: 3
    },
    1100: {
      slidesPerView: 4,
    },
  },

};


export const updateFavourites = (id, favourites) => {
  if (favourites.includes(id)) {
    return favourites.filter((resId) => resId !== id)
  } else {
    return [...favourites, id]
  }
}


export const checkFavourites = (id, favourites) => {
  return favourites?.includes(id) ? "fa3e5f" : "white"

}

export const validateString = (value) => {
  return value?.length < 3 || value === null
    ? "Must have atleast 3 characters"
    : null;
};

export const getPublicIdFromURL = (url) => {
  if (!url) return null;
  // Robust extraction of public_id from Cloudinary URL
  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");
  if (uploadIndex === -1) return url; // Fallback to full URL if not standard

  const afterUpload = parts.slice(uploadIndex + 1);
  const versionIndex = afterUpload.findIndex(part => /^v\d+$/.test(part));

  let publicIdWithExt;
  if (versionIndex !== -1) {
    publicIdWithExt = afterUpload.slice(versionIndex + 1).join("/");
  } else {
    // Check if the first part after upload is a transformation string (contains , or _)
    // or if it's the start of the public ID. Simple check: if it looks like a version v123...
    publicIdWithExt = afterUpload.join("/");
  }

  // Remove extension
  return publicIdWithExt.split(".").slice(0, -1).join(".") || publicIdWithExt;
};