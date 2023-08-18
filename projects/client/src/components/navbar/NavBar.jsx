import React from 'react'
import ButtonWithLogo from '../buttons/ButtonWithLogo'
import { UserIcon } from '@heroicons/react/24/solid'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import useToken from "../../shared/hooks/useToken";

const NavBar = () => {
    const { token, removeToken } = useToken()
    const navigateTo = useNavigate();
    return (
        <>
            <div className="sticky bg-white top-0 w-full flex items-center justify-between flex-row px-5 py-3 shadow md:shadow-none">
                <ButtonWithLogo
                    onClick={() => { navigateTo('/') }}
                    align="row"
                    imageSize="h-12 w-12"
                    textSize="text-xl"
                    type="dark"
                />
                {token ? (
                    <div className="flex flex-row items-center gap-3">
                        <div className="shrink-0 grow-0 h-10 w-10 rounded-full p-2 border border-primary">
                            <UserIcon color="#2E90E6" onClick={() => { navigateTo('/profile') }} />
                        </div>
                        <button onClick={removeToken} className="text-primary underline">
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-row space-x-4">
                        <Link to="/login" className="text-primary underline">
                            Login
                        </Link>
                        <Link to="/register" className="text-primary underline">
                            Register
                        </Link>
                    </div>
                )}
            </div>

        </>
    )
}

export default NavBar
