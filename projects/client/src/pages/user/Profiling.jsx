import React, { useState } from "react";
import Button from "../../components/buttons/Button"
import TextInput from "../../components/textInputs/TextInput";
import axios from "axios";
import { useEffect } from "react";
import MainContainer from "../../components/layouts/MainContainer";
import { toast } from "react-hot-toast"
import * as Yup from "yup";

function Profiling() {
    const [full_name, setFull_name] = useState("")
    const [birth_date, setBirth_date] = useState("")
    const [gender, setGender] = useState("")
    const [phone_number, setPhone_number] = useState("")
    const [email, setEmail] = useState("")
    const [foto, setFoto] = useState("")
    const [updateFoto, setUpdateFoto] = useState(false)
    const [fototemp, setFototemp] = useState("https://tse1.mm.bing.net/th?id=OIP.yYUwl3GDU07Q5J5ttyW9fQHaHa&pid=Api&rs=1&c=1&qlt=95&h=180")
    const [editable, setEditable] = useState(true)

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
                setEditable(true)
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
        console.log(data.birth_date)
        setBirth_date(data.birth_date != null ? data.birth_date.split("T")[0] : "")
        setGender(data.gender)
        setPhone_number(data.phone_number)
        setEmail(data.User.email)
        setFoto(data.profile_picture != null ? `${process.env.REACT_APP_API_BASE_URL}${data.profile_picture}` : null)
        console.log(phone_number)
    }


    const switchEdit = async (e) => {
        e.preventDefault()
        setEditable(false)
    }

    const maxFilesize = 1024000
    const validFileExtension = { image: ["image/jpg", "image/gif", "image/jpeg", "image/png"] }
    const isValidFileExtension = async (fileName, filetype) => {
        return fileName && validFileExtension[filetype].includes(fileName)
    }
    const changeImage = async (e) => {
        if (e.target.files) {
            const fileSchema = await Yup.object().shape({
                file: Yup.mixed().required("Required").test("is-valid-type", "not a valid image type", async value => {
                    const cekImageType = await isValidFileExtension(value?.type, "image")
                    if (!cekImageType) {
                        toast.error("not a valid image type")
                        setFoto(null)
                        return false
                    }
                    return true
                }).test("is-valid-size", "max allowed size is 1 MB", value => {
                    const cekImageSize = (value && value.size <= maxFilesize)
                    if (!cekImageSize) {
                        toast.error("max allowed size is 1 MB")
                        setFoto(null)

                        return false
                    }
                    return true
                })

            })
            const cekFileSchema = await fileSchema.validate({ file: e.target.files[0] })
            if (cekFileSchema) {
                setUpdateFoto(true)
                setFoto(e.target.files[0])
                setFototemp(await URL.createObjectURL(e.target.files[0]))
            }
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
                if (data.message) {
                    toast.success(data.message)
                    setFoto(null)
                    setUpdateFoto(false)

                }

            }).catch((error) => {
                setFoto(null)
                if (error.response.data.error) {
                    toast.error(error.response.data.error)
                }
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
                                <img src={updateFoto ? fototemp : foto ?? fototemp} alt="profile" className="aspect-[1/1] max-w-[200px] rounded-full object-cover " />
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
                            }} required={true} disabled={editable} />
                        </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                        <div className="md:w-1/3">
                            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-full-name">
                                Gender
                            </label>
                        </div>
                        <div className="md:w-1/3">
                            <select defaultValue={gender} disabled={editable} name="gender" id="gender" required={true} onChange={(e) => {
                                setGender(e.target.value)
                            }}>
                                <option value="">GENDER</option>
                                <option value="MALE" selected={(gender == "MALE")}>Male</option>
                                <option value="FEMALE" selected={(gender == "FEMALE")}>Female</option>
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
                            }} required={true} disabled={editable} />
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
                            }} required={true} disabled={editable} />
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
                            }} required={true} disabled={editable} />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="p-4">
                            {
                                editable
                                    ?
                                    <>
                                        <Button type="button" label={'Edit'} onClick={switchEdit}> </Button>
                                    </>
                                    :
                                    <>
                                        <Button label={'Save Changes'}></Button>
                                    </>
                            }
                        </div>
                    </div>
                </form>

            </MainContainer>

        </>
    );
}

export default Profiling;
