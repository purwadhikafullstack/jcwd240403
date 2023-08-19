import React, { useState } from "react";
import Button from "../../components/buttons/Button"
import TextInput from "../../components/textInputs/TextInput";
import axios, { Axios } from "axios";
import { useEffect } from "react";
import MainContainer from "../../components/layouts/MainContainer";
import { toast } from "react-hot-toast"

function Profiling() {
    const updateProfile = async (e) => {
        e.preventDefault()
        const data = {
            full_name,
            birth_date,
            gender,
            email,
            phone_number

        }
        await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/profile`, data, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(res => {
            const data = res.data
            if (data.status) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        })

    }
    const getUserData = async (e) => {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/profile`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        // untuk memasukan data user yang mau dirubah
        const getData = response.data
        const { data } = getData
        setFull_name(data.full_name)
        setBirth_date(data.birth_date.split("T")[0])
        setGender(data.gender)
        setPhone_number(data.phone_number)
        setEmail(data.User.email)
        setFoto(`${process.env.REACT_APP_API_BASE_URL}${data.profile_picture}`)
    }
    const [full_name, setFull_name] = useState("")
    const [birth_date, setBirth_date] = useState("")
    const [gender, setGender] = useState("")
    const [phone_number, setPhone_number] = useState("")
    const [email, setEmail] = useState("")
    const [foto, setFoto] = useState("")
    const [fototemp, setFototemp] = useState(null)

    const changeImage = async (e) => {
        if (e.target.files) {
            console.log(e.target.files)
            setFoto(e.target.files[0])
            setFototemp(URL.createObjectURL(e.target.files[0]))
        }
    }



    const updateImage = async (e) => {
        e.preventDefault()
        if (foto) {
            const formData = new FormData()
            formData.append("file", foto)

            await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/profile/picture`, formData, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then(res => {
                const data = res.data
                toast.success(data.message)

            })

        }
    }

    useEffect(function () {
        getUserData()
    }, [])
    return (
        <>
            <MainContainer>
                <div className="flex">
                    <div className="pt-3 pl-5 block text-gray-500 font-bold">My Profile</div>
                </div>

                <form onSubmit={updateImage} action="" method="post" encType="multipart/form-data">
                    <div className="flex justify-center">
                        <label htmlFor="foto" className="cursor-pointer">
                            <input id="foto" type="file" className="hidden" onChange={changeImage} />
                            <div className="">
                                <img src={fototemp ?? foto} alt="profile" className="aspect-[1/1] max-w-[200px] rounded-full object-cover " />
                            </div>
                        </label>
                    </div>
                    <div className="flex justify-center">
                        <div className="p-4">
                            <Button label={'Update Photo Profile'}></Button>
                        </div>
                    </div>
                </form>

                <form onSubmit={updateProfile} action="" method="post">

                    <div className="md:flex md:items-center mb-6">
                        <div className="md:w-1/3">
                            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-full-name">
                                Name
                            </label>
                        </div>
                        <div className="md:w-1/3">
                            <TextInput placeholder={'Full Name'} value={full_name} onChange={(e) => {
                                setFull_name(e.target.value)
                            }} required={true} />
                        </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                        <div className="md:w-1/3">
                            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-full-name">
                                Gender
                            </label>
                        </div>
                        <div className="md:w-1/3">
                            <select defaultValue={gender} name="gender" id="gender" required={true} onChange={(e) => {
                                setGender(e.target.value)
                            }}>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </select>
                        </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                        <div className="md:w-1/3">
                            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-full-name">
                                Birth Date
                            </label>
                        </div>
                        <div className="md:w-1/3">
                            <TextInput placeholder={'Birth Date '} value={birth_date} type={"date"} onChange={(e) => {
                                setBirth_date(e.target.value)
                            }} required={true} />
                        </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                        <div className="md:w-1/3">
                            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-full-name">
                                Phone
                            </label>
                        </div>
                        <div className="md:w-1/3">
                            <TextInput placeholder={'Phone Number'} value={phone_number} onChange={(e) => {
                                setPhone_number(e.target.value)
                            }} required={true} />
                        </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                        <div className="md:w-1/3">
                            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-full-name">
                                Email
                            </label>
                        </div>
                        <div className="md:w-1/3">
                            <TextInput placeholder={'Email'} value={email} onChange={(e) => {
                                setEmail(e.target.value)
                            }} required={true} />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="p-4">
                            <Button label={'Save Changes'}></Button>
                        </div>
                    </div>
                </form>

            </MainContainer>

        </>
    );
}

export default Profiling;
