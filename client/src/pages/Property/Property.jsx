import React, { useContext, useState } from 'react';
import './Property.css'
import { useMutation, useQuery } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom';
import { getProperty, removeBooking, removeResidency } from '../../utils/api'
import { PuffLoader } from 'react-spinners';
import { AiFillHeart } from 'react-icons/ai';

import { MdMeetingRoom, MdLocationPin } from 'react-icons/md';
import { FaShower } from "react-icons/fa";
import { AiTwotoneCar } from "react-icons/ai";
import Map from '../../components/Map/Map';
import useAuthCheck from '../../hooks/useAuthCheck';
import { useAuth0 } from '@auth0/auth0-react';
import BookingModal from '../../components/BookingModal/BookingModal.jsx';
import UserDetailContext from '../../Context/UseDetailContext.js';
import { Button } from '@mantine/core';
import { toast } from 'react-toastify';
import Heart from '../../components/Heart/Heart.jsx';

import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import cld from "../../utils/cloudinaryConfig";

import { getPublicIdFromURL } from "../../utils/common";

const Property = () => {

    const { pathname } = useLocation()
    const navigate = useNavigate()
    const id = pathname.split("/").slice(-1)[0]
    const { data, isLoading, isError } = useQuery(["resd", id], () =>
        getProperty(id)
    );

    const publicId = getPublicIdFromURL(data?.image);
    const img = publicId
        ? cld.image(publicId)
            .format('auto')
            .quality('auto')
            .resize(auto().gravity(autoGravity()).width(1200).height(600))
        : null;

    const [modalOpened, setModalOpened] = useState(false)
    const { validateLogin } = useAuthCheck()
    const { user } = useAuth0();


    const { userDetails: { token, bookings }, setUserDetails } = useContext(UserDetailContext);

    const { mutate: cancelBooking, isLoading: cancelling } = useMutation({
        mutationFn: () => removeBooking(id, user?.email, token),
        onSuccess: () => {
            setUserDetails((prev) => ({
                ...prev,
                bookings: prev.bookings.filter((booking) => booking?.id !== id)
            }))

            toast.success("Booking cancelled", { position: 'bottom-right' });
        }
    })

    const { mutate: deleteResidencyMutation, isLoading: deleting } = useMutation({
        mutationFn: () => removeResidency(id, user?.email, token),
        onSuccess: () => {
            toast.success("Property deleted successfully", { position: "bottom-right" });
            navigate("/properties");
        },
        onError: (err) => {
            toast.error(err.message, { position: "bottom-right" });
        }
    });


    if (isLoading) {
        return (
            <div className="wrapper">
                <div className="flexCenter paddings">
                    <PuffLoader />
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="wrapper">
                <div className="flexCenter paddings">
                    <span>Error while fetching the property details</span>
                </div>
            </div>
        )
    }


    return (
        <div className='wrapper'>
            <div className="flexColCenter paddings innerWidth property-container">

                {/* like button */}
                <div className="like">
                    <Heart id={id} />
                </div>

                {/* delete button */}
                {user?.email === data?.userEmail && (
                    <button
                        className="button"
                        style={{ backgroundColor: "red", position: "absolute", top: "16rem", right: "2rem" }}
                        onClick={() => deleteResidencyMutation()}
                        disabled={deleting}
                    >
                        Delete Property
                    </button>
                )}

                {/* image */}
                {img ? <AdvancedImage cldImg={img} alt="home image" /> : <img src={data?.image} alt="home image" style={{ width: "100%", maxHeight: "600px", objectFit: "cover" }} />}

                <div className="flexCenter property-details">


                    {/* left */}
                    <div className="flexColStart left">
                        {/* head */}
                        <div className="flexStart head">
                            <span className='primaryText'>{data?.title}</span>
                            <span className='orangeText' style={{ fontSize: '1.5rem' }}>$ {data?.price}</span>
                        </div>

                        {/* facilities */}
                        <div className="flexStart facilities">

                            {/* Bathroom */}
                            <div className="flexStart fascility">
                                <FaShower size={20} color="#1F3E72" />
                                <span>{data?.facilities?.bathrooms} Bathrooms</span>
                            </div>

                            {/* parkings */}
                            <div className="flexStart fascility">
                                <AiTwotoneCar size={20} color="#1F3E72" />
                                <span>{data?.facilities?.parkings} parking</span>
                            </div>

                            {/* bedrooms  */}
                            <div className="flexStart fascility">
                                <MdMeetingRoom size={20} color="#1F3E72" />
                                <span>{data?.facilities?.bedrooms} Room/s</span>
                            </div>
                        </div>


                        {/* descroption */}
                        <span className="secondaryText" style={{ textAlign: "justify" }}>
                            {data?.description}
                        </span>

                        {/* address */}
                        <div className="flexStart" style={{ gap: "1rem" }}>
                            <MdLocationPin size={25} />

                            <span className="secondaryText" >
                                {data?.address}{""}{data?.city}{""}{data?.country}
                            </span>
                        </div>

                        {/* booking button  */}
                        {
                            bookings?.some((booking) => booking.id === id) ? (
                                <>
                                    <Button variant='outline' w={"100%"} color='red' onClick={() => cancelBooking()} disabled={cancelling}>
                                        <span>Cancel booking</span>
                                    </Button>

                                    <span>
                                        Your visit already booked for date {bookings?.find((booking) => booking?.id === id)?.date}
                                    </span>
                                </>
                            ) : (
                                <button className="button"
                                    onClick={() => {
                                        validateLogin() && setModalOpened(true)
                                    }}
                                >
                                    Book your visit
                                </button>
                            )}

                        <BookingModal
                            opened={modalOpened}
                            setOpened={setModalOpened}
                            propertyId={id}
                            email={user?.email}
                        />

                    </div>

                    {/* right */}
                    <div className="map">
                        <Map
                            address={data?.address}
                            city={data?.city}
                            country={data?.country} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Property;
