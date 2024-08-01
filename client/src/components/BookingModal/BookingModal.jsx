import React, { useContext, useState } from "react";
import { Button,  MantineProvider,  Modal } from '@mantine/core'
import {  DatePicker } from '@mantine/dates'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import UserDetailContext from "../../Context/UseDetailContext.js"

import { bookVisit } from "../../utils/api.js";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const BookingModal = ({ opened, setOpened, email ,propertyId}) => {

    const [value, setValue] = useState(null);
    const {userDetails : {token}, setUserDetails} = useContext(UserDetailContext);
    const handleBookingSuccess = () => {
        toast.success("Tou have booked your visit",{
            position: "bottom-right"
        });
        setUserDetails((prev) => ({
            ...prev,
            bookings: [
                ...prev.bookings,
                {
                    id: propertyId, 
                    date: dayjs(value).format("DD/MM/YYYY"),
                },
            ],
        }));
    };

    const {mutate, isLoading} = useMutation({
        mutationFn: () => bookVisit(value,propertyId,email, token),
        onSuccess: handleBookingSuccess,
        onError: ({response}) => toast.error(response.data.message),
        onSettled: () => setOpened(false)
    })

    return (
        <MantineProvider>
            <Modal
                opened={opened}
                onClose={() => { setOpened(false) }}
                title="Select your date of visit"
                centered
            >
                <div className="flexColCenter" style={{gap: "1rem"}}>
                    <DatePicker popoverProps={{ withinPortal: true }} value={value} onChange={setValue} minDate={new Date()}/>
                    <Button disabled={!value || isLoading} onClick={() => mutate()}>
                        Book Visit
                    </Button>
                </div>
            </Modal>
        </MantineProvider>
    )
}

export default BookingModal;
