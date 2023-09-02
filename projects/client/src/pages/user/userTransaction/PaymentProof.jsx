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
    const [tmpPhoto, setTmpPhoto] = useState(null)
    let [searchParams] = useSearchParams()
    const navigate = useNavigate();
    let { booking_code } = useParams()
    const getBooking = async () => {
        await axios.get(`${process.env.REACT_APP_API_BASE_URL}/transaction/book/${booking_code}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => {
            if (response.data.status) {
                setBooking(response.data.data)
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
                navigate(`/booking?start_date=${booking?.check_in_date}&end_date=${booking?.check_out_date}&room=${booking?.room_id}`)
            }
        })
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

    }, [])
    return (
        <>
            <MainContainer>
                <Column className="max-w-7xl mx-auto gap-10">
                    <CardView className="mx-auto min-w-[10rem]">
                        <SubTitle className="text-center" label={"23:22"} />
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

                                <label htmlFor="Payment_Proof" className="flex  flex-col cursor-pointer border p-6 bg-slate-50 rounded-md w-1/2 max-w-[1/2] mx-auto h-52">
                                    <input onChange={changeImage} id="Payment_Proof" type="file" className="hidden" />
                                    <div className="my-auto">
                                        <TbPlus className='h-10 w-10 mx-auto' />
                                        <Body className="text-center" label={"Choose File"} />
                                    </div>
                                </label>
                            </Column>
                            {
                                tmpPhoto ?
                                    <>
                                        <Column>
                                            <img src={tmpPhoto} alt="Payment Proof" className='w-1/3 mx-auto' />
                                        </Column>
                                    </>
                                    : <></>
                            }
                            <Row className="justify-between w-1/2 mx-auto gap-10">
                                <Button className="w-fit px-6" label={"Cancle Booking"} type='button' onClick={cancelOrder} />
                                <Button label={"Submit"} type='button' onClick={uploadPaymentProof} />

                            </Row>
                        </Column>
                    </Column>




                </Column>

            </MainContainer>
        </>
    )
}

export default PaymentProof
