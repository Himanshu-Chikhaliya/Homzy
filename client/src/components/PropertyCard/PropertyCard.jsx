import React from "react";
import './PropertyCard.css'
import { AiFillHeart } from 'react-icons/ai'
import { truncate } from 'lodash'
import { useNavigate } from "react-router-dom";
import Heart from "../Heart/Heart";

import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import cld from "../../utils/cloudinaryConfig";

const PropertyCard = ({ card }) => {

    const navigate = useNavigate();

    const img = cld.image(card.image.split('/').pop().split('.')[0])
        .format('auto')
        .quality('auto')
        .resize(auto().gravity(autoGravity()).width(500).height(500));

    return (
        <div className="flexColStart r-card" onClick={() => navigate(`../properties/${card.id}`)}>
            {/* <AiFillHeart size={24} color="white" /> */}
            <Heart id={card?.id} />
            <AdvancedImage cldImg={img} alt="home" />

            <span className="secondaryText r-price">
                <span style={{ color: "orange" }}>$</span>
                <span>{card.price}</span>
            </span>

            <span className="primaryText">{truncate(card.title, { length: 15 })}</span>
            <span className="secondaryText">{truncate(card.description, { length: 80 })}</span>
            {/* <span className="primaryText">{card.name}</span>
            <span className="secondaryText">{card.detail}</span> */}
        </div>
    )
}

export default PropertyCard;
