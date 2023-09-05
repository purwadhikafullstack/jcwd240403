import React, { useState } from 'react'
import MainContainer from '../../../components/layouts/MainContainer'
import Column from '../../../components/widget/Column'
import CardView from '../../../components/cards/CardView'
import SubTitle from '../../../components/texts/SubTitle'
import HeadLine from '../../../components/texts/HeadLine'
import Title from '../../../components/texts/Title'
import { TbPlus } from 'react-icons/tb';
import Body from '../../../components/texts/Body'
import Row from '../../../components/widget/Row'
import Button from '../../../components/buttons/Button'
import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from "react-hot-toast"
import * as Yup from "yup";

function PaymentProof() {
    const [booking, setBooking] = useState({})
    const [photo, setPhoto] = useState(null)
    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)
    const [second, setSecond] = useState(0)
    const [tmpPhoto, setTmpPhoto] = useState(null)
    const [checkIn, setCheckIn] = useState(null)
    const [checkOut, setCheckOut] = useState(null)
    const [roomId, setRoomId] = useState(0)
    let [searchParams] = useSearchParams()
    const navigate = useNavigate();
    let { booking_code } = useParams()
    const getBooking = async () => {
        console.log("Masuk")
        console.log(booking_code)

        await axios.get(`${process.env.REACT_APP_API_BASE_URL}/transaction/book/${booking_code}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => {
            console.log(response)
            if (response.data.status) {
                setBooking(response.data.data)
                setCheckIn(response.data.data.check_in_date)
                setCheckOut(response.data.data.check_out_date)
                setRoomId(response.data.data.room_id)
                const interval = setInterval(() => {
                    getTimeRemaining(response.data.data)
                }, 1000);
            }
        })
    }
    const cancelOrder = async () => {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/transaction/book/${booking_code}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => {
            if (response.data.status) {
                navigate(`/booking?start_date=${checkIn}&end_date=${checkOut}&room=${roomId}`)
            }
        })
    }

    const getTimeRemaining = async (booking) => {
        const currentTime = new Date().getTime()
        const transactionTime = new Date(booking.createdAt).getTime()
        const diff = new Date(transactionTime + (2 * 3600 * 1000)).getTime() - currentTime
        setHour(Math.floor((diff / (1000 * 3600)) % 24))
        setMinute(Math.floor((diff / 1000 / 60) % 60))
        setSecond(Math.floor((diff / 1000) % 60))
        if (diff < 0) {
            cancelOrder()
        }
    }

    const maxFilesize = 1024000
    const validFileExtension = { image: ["image/jpg", "image/jpeg", "image/png"] }
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
                        setPhoto(null)
                        return false
                    }
                    return true
                }).test("is-valid-size", "max allowed size is 1 MB", value => {
                    const cekImageSize = (value && value.size <= maxFilesize)
                    if (!cekImageSize) {
                        toast.error("max allowed size is 1 MB")
                        setPhoto(null)

                        return false
                    }
                    return true
                })

            })
            const cekFileSchema = await fileSchema.validate({ file: e.target.files[0] })
            if (cekFileSchema) {
                setPhoto(e.target.files[0])
                setTmpPhoto(await URL.createObjectURL(e.target.files[0]))
            }
        }
    }
    const uploadPaymentProof = async (e) => {
        e.preventDefault()
        if (photo) {
            const formData = new FormData()
            formData.append("file", photo)

            await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/transaction/book/${booking_code}`, formData, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then(response => {
                if (response.data.status) {
                    toast.success(response.data.message)
                    navigate("/orderlist")
                } else {
                    toast.error(response.data.message)
                }
            })
        }
    }
    useEffect(() => {
        getBooking()


    }, [booking_code])
    return (
        <>
            <MainContainer>
                <Column className="max-w-7xl mx-auto gap-10">
                    <div className='gap-10' />
                    <CardView className="mx-auto min-w-[10rem]">
                        <SubTitle className="text-center" label={`${hour} Hours : ${minute} Minutes : ${second} Seconds Remaining`} />
                    </CardView>
                    <Column>
                        <Title label={"Amount "} />
                        <SubTitle label={new Intl.NumberFormat().format(booking?.total_invoice ?? 0)} />
                    </Column>
                    <Column>
                        <Title label={"Booking Code"} />
                        <SubTitle label={booking?.booking_code} />
                    </Column>
                    <Column className="gap-2">
                        <Title label={"Upload Payment Proof"} />
                        <Column className="gap-8">
                            <Column>

                                <label htmlFor="Payment_Proof" className="flex  flex-col gap-3 cursor-pointer border p-6 bg-slate-50 rounded-md min-w-[10rem] aspect-square mx-auto h-52">
                                    <input onChange={changeImage} id="Payment_Proof" type="file" className="hidden" />
                                    {
                                        tmpPhoto ?
                                            <>
                                                <img src={tmpPhoto} alt="Payment Proof" className='w-full aspect-square object-cover mx-auto' />
                                            </>
                                            : <>
                                                <div className="my-auto">
                                                    <TbPlus className='h-10 w-10 mx-auto' />
                                                    <Body className="text-center" label={"Choose File"} />
                                                </div>
                                            </>
                                    }

                                </label>
                            </Column>

                            <Row className="justify-between w-1/2 mx-auto gap-10">
                                <Button className="w-fit px-6 bg-red-950" label={"Cancle Booking"} type='button' onClick={cancelOrder} />
                                <Button label={"Submit"} type='button' onClick={uploadPaymentProof} />

                            </Row>
                            <div className='gap-10' />
                        </Column>

                    </Column>




                </Column>

            </MainContainer>
        </>
    )
}

export default PaymentProof
