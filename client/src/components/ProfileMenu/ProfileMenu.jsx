import React from "react";
import { Avatar, Menu, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';
import {  useNavigate } from "react-router-dom";



const ProfileMenu = ({ user, logout }) => {
    const navigate = useNavigate()
    return (
        <MantineProvider>
            <Menu>
                <Menu.Target width={200} height={200}>
                    <Avatar src={user?.picture} alt='user image' radius="xl" />
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item onClick={()=> navigate("./favourites",{replace: true})}>
                        Favourites
                    </Menu.Item>

                    <Menu.Item onClick={()=> navigate("./bookings",{replace: true})}>
                        Bookings
                    </Menu.Item>

                    <Menu.Item onClick={() => {
                        localStorage.clear();
                        logout();
                    }}>
                        Logout
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </MantineProvider> 
    )
}

export default ProfileMenu;