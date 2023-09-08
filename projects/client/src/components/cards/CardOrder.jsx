import React, { useEffect, useState } from "react";
import Row from "../widget/Row";
import Column from "../widget/Column";
import Caption from "../texts/Caption";
import Body from "../texts/Body";
import { TbArrowRight } from 'react-icons/tb';
import SubTitle from "../texts/SubTitle";
import { Link, useNavigate } from "react-router-dom";
import Button from "../buttons/Button";

function Cardorder({ title, type, check_in, check_out, status, image, header = null, booking_code, transactionTime, confirmCancel }) {
    const [showButton, setShowButton] = useState(false)
    const [isExpired, setIsExpired] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const navigate = useNavigate()
    const checkExpired = () => {
        if (status == "WAITING_FOR_PAYMENT") {
            const currentTime = new Date().getTime()
            const transactionDate = new Date(transactionTime).getTime()
            const diff = new Date(transactionDate + (2 * 3600 * 1000)).getTime() - currentTime
            if (diff > 0) {
                setShowButton(true)
                setIsExpired(false)
            } else {
                setIsExpired(true)
            }
        }
    }
    useEffect(() => {
        checkExpired()
    }, [])
    return (
        <div className="md:w-full md:min-h-[13rem] flex flex-col bg-white border border-gray-300 rounded-lg overflow-hidden" >
            <div className="px-4 py-2 border-b bg-slate-100">
                {header}
            </div>
            <Row className="w-full min-h-[180px] ">

                <div className="flex shrink-0">
                    <img
                        src={image}
                        alt="hotel"
                        className={`object-cover object-center h-full w-[180px] md:w-[350px] ${header !== null ? "rounded-bl-lg" : "rounded-l-lg"} `}
                    />
                </div>
                <div className="flex flex-col justify-between w-full p-3 md:px-5 py-4">
                    {/* Property Info */}
                    <div className="flex flex-col">
                        <div className="flex flex-col justify-between items-start">
                            <p className="capitalize font-bold text-xl mb-2">{title}</p>
                            <p className="capitalize font-medium text-sm mb-3 hidden md:block">{type}</p>
                            <Row className="w-fit gap-5 ">
                                <Column className="gap-1">
                                    <Caption label={"Check In"} />
                                    <Body label={check_in} />
                                </Column>
                                <TbArrowRight className='h-5 w-5 my-auto' />
                                <Column className="gap-1">
                                    <Caption label={"Check Out"} />
                                    <Body label={check_out} />
                                </Column>
                            </Row>

                        </div>

                    </div>

                    {/* Price */}
                    <div className="flex items-end flex-col border-t pt-3 gap-2">
                        {
                            status === "WAITING_FOR_PAYMENT" ?
                                <>
                                    <Button type="button" label={status.replaceAll("_", " ")} onClick={() => navigate(`/paymentproof/${booking_code}`)} />
                                    {
                                        showButton ?
                                            <>
                                                {
                                                    confirm ?
                                                        <>
                                                            <Row className="gap-5 mx-auto">
                                                                <Column>
                                                                    <Button label={"Yes, Cancel Order"} type="button" onClick={confirmCancel} />
                                                                </Column>
                                                                <Column>
                                                                    <Button className="bg-gray-800" label={"Close"} type="button" onClick={() => setConfirm(false)} />
                                                                </Column>
                                                            </Row>
                                                        </>
                                                        :
                                                        <>
                                                            <Button type="button" className="bg-red-900" label={"Cancel Booking"} onClick={() => setConfirm(true)} />
                                                        </>
                                                }
                                            </>
                                            :
                                            <>
                                                {
                                                    isExpired ? <><SubTitle label={"Expierd"} /></> : <></>
                                                }
                                            </>
                                    }
                                </> :
                                <>
                                    <SubTitle label={status.replaceAll("_", " ")} />
                                </>
                        }
                    </div>
                </div>
            </Row>
        </div>
    );
}

Cardorder.defaultProps = {
    title: "Hotel Sunset",
    type: "Hotel",
    status: "Done",
    check_in: "01-09-2023",
    check_out: "05-09-2023",
    image: "https://cdn.britannica.com/96/115096-050-5AFDAF5D/Bellagio-Hotel-Casino-Las-Vegas.jpg"
};

export default Cardorder;