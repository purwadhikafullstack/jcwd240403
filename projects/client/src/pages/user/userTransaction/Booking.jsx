import React from 'react'
import MainContainer from '../../../components/layouts/MainContainer'
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast"
import * as Yup from "yup";
import Dropdown from '../../../components/dropdown/Dropdown';
import ButtonDateRange from '../../../components/buttons/ButtonDateRange';
import { isBefore, differenceInDays, set } from "date-fns";
import moment from 'moment';
import Button from '../../../components/buttons/Button';
import PropertyCard from '../../../components/cards/PropertyCard';
import Column from '../../../components/widget/Column';
import Row from '../../../components/widget/Row';
import HeadLine from '../../../components/texts/HeadLine';
import SubTitle from '../../../components/texts/SubTitle';
import CardView from '../../../components/cards/CardView';
import Caption from '../../../components/texts/Caption';
import Body from '../../../components/texts/Body';
import { TbArrowRight } from 'react-icons/tb';
import Title from '../../../components/texts/Title';
import { useNavigate, useSearchParams } from 'react-router-dom';



const BookingProperty = () => {
    let [searchParams] = useSearchParams()
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(searchParams?.get("start_date") ?? new Date())
    const [room, setRoom] = useState(null)
    const [price, setPrice] = useState(0)
    const [endDate, setEndDate] = useState(searchParams?.get("end_date") ?? new Date())
    const getThisRoom = async () => {
        await axios.get(`${process.env.REACT_APP_API_BASE_URL}/transaction/book?start_date=${startDate}&end_date=${endDate}&room_id=${searchParams.get("room")}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => {
            if (response.data.status) {
                setRoom(response.data.data)
                totalPrice(response.data.data)
            }
        })
    }
    const totalPrice = (room) => {
        const dateInConvertion = new Date(startDate).getTime();
        const dateOutConvertion = new Date(endDate).getTime();
        const timeDiff = dateOutConvertion - dateInConvertion;
        const days = Math.ceil(Math.abs(timeDiff) / (1000 * 3600 * 24))
        let totalSpecialPrice = 0;
        let totalSpecialPriceDays = 0;


        room.Special_prices.forEach(row => {
            const csd = new Date(row.start_date).getTime()
            const ced = new Date(row.end_date).getTime()
            const tmpc = Math.abs(csd - ced)
            const tmpd = Math.ceil(Math.abs(tmpc) / (1000 * 3600 * 24))
            totalSpecialPriceDays = totalSpecialPriceDays + tmpd
            totalSpecialPrice += (tmpd * row.price)

            // if (new Date(row.start_date) >= new Date(startDate) && new Date(row.end_date) >= new Date(startDate)) {
            //     const tmpsd = (new Date(row.start_date).getTime()) - (new Date(startDate).getTime())
            //     const tmpsdDays = Math.ceil(Math.abs(tmpsd) / (1000 * 3600 * 24)); 
            // }
            // if (new Date(row.end_date) >= new Date(endDate) && new Date(row.start_date) <= new Date(endDate)) {
            //     const tmped = (new Date(row.end_date).getTime()) - (new Date(endDate).getTime())
            //     const tmpedDays = Math.ceil(Math.abs(tmped) / (1000 * 3600 * 24));
            // }

        })
        let totalBasePrice = 0
        let totalBasePriceDays = Math.abs(days - totalSpecialPriceDays);
        totalBasePrice += (totalBasePriceDays * room.base_price)
        setPrice(totalBasePrice + totalSpecialPrice)

    }
    useEffect(() => {
        getThisRoom()
    }, [])
    return (
        <>
            <MainContainer>
                <Column className="max-w-7xl mx-auto gap-10">
                    <Row className="gap-10 ">
                        <img className='w-1/2 aspect-video rounded-lg' src={`${process.env.REACT_APP_API_BASE_URL}${room?.room_img}`} alt="" />
                        <Column className="w-full gap-5">
                            <HeadLine label={room?.Property?.name} />
                            <SubTitle label={room?.Property?.Property_type?.name} />
                            <SubTitle label={room?.Property?.Location?.city} />
                        </Column>
                    </Row>
                    <CardView>
                        <Row className="w-fit gap-5 ">
                            <Column className="gap-1">
                                <Caption label={"Check In"} />
                                <Body label={moment(startDate, "YYYY-MM-DD").format("DD/MM/YYYY")} />
                            </Column>
                            <TbArrowRight className='h-5 w-5 my-auto' />
                            <Column className="gap-1">
                                <Caption label={"Check Out"} />
                                <Body label={moment(endDate, "YYYY-MM-DD").format("DD/MM/YYYY")} />
                            </Column>
                        </Row>
                    </CardView>

                    <SubTitle label={room?.name} />
                    <Column className="gap-1">
                        <Body label={"Total Price"} />
                        <Title label={new Intl.NumberFormat().format(price)} />
                    </Column>
                    <Button className="mx-auto w-36 mb-60" label={"Make Payment"} type='button' onClick={totalPrice} />
                </Column>

            </MainContainer>
        </>
    )
}

export default BookingProperty