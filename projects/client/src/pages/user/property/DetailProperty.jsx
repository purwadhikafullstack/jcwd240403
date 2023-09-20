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
import BuildingImageUpload from '../../../components/forms/property/BuildingImageUpload';
import HeadLine from '../../../components/texts/HeadLine';
import SubTitle from '../../../components/texts/SubTitle';
import Caption from '../../../components/texts/Caption';
import Title from '../../../components/texts/Title';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getMinimumPrice, getRange } from '../../../shared/utils';
import Carousel from '../../../components/widget/Carousel'
import Slider from 'react-slick';
import Column from '../../../components/widget/Column';


const DetailProperty = () => {
    let [searchParams] = useSearchParams()
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(searchParams?.get("start_date") ?? new Date())
    const [endDate, setEndDate] = useState(searchParams?.get("end_date") ?? new Date())
    const [property, setProperty] = useState(null)
    const [reviews, setReviews] = useState([])
    const [minPrice, setMinPrice] = useState(0)
    const [minPriceTmp, setMinPriceTmp] = useState(0)
    const [minSpecialPrice, setMinSpecialPrice] = useState(0)
    const [dateSpecialPrice, setDateSpecialPrice] = useState([])
    let { id } = useParams()
    const today = new Date();
    const [selectedDays, setSelectedDays] = useState({
        from: new Date(startDate),
        to: new Date(endDate),
    });
    const setting = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,

    }
    const changeDate = () => {
        navigate(`/property/${id}?start_date=${startDate}&end_date=${endDate}`)
        toast.success("Change Date Success")
    }
    const getDetailProperty = async (e) => {
        await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/${id.split("-")[1]}?start_date=${startDate}&end_date=${endDate}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => {
            setProperty(response.data.data)
            const prop = response.data.data
            let prices = prop?.Rooms.map(row => row.base_price)
            let prices2 = []
            let dateSpecialPriceTmp = []
            prop?.Rooms.map(row => {
                if (row.Special_prices.length) {
                    row.Special_prices.map(row2 => {
                        prices2.push(row2.price)
                        dateSpecialPriceTmp.push({
                            start: new Date(row2.start_date),
                            end: new Date(row2.end_date),
                        })
                    })
                } else {
                    prices2.push(row.base_price)
                }

            })
            console.log(dateSpecialPriceTmp)
            setMinPrice(getMinimumPrice(prices))
            setMinPriceTmp(getMinimumPrice(prices, false))
            setMinSpecialPrice(getMinimumPrice(prices2, false))
            setDateSpecialPrice(dateSpecialPriceTmp)

        })
    }
    const handleDayClick = (day, modifiers = {}) => {

        if (modifiers.disabled) {
            return;
        }
        if (modifiers.selected) {
            setSelectedDays({ from: null, to: null });
            return;
        }
        if (!selectedDays.from) {
            setSelectedDays({ from: day, to: null });
            return;
        }
        if (isBefore(day, selectedDays.from)) {
            setSelectedDays({ from: day, to: null });
            return;
        }
        setSelectedDays({ from: selectedDays.from, to: day });
    };

    const countNights = () => {
        const daysDifference = differenceInDays(selectedDays.to, selectedDays.from);

        return daysDifference;
    };

    const getReview = async () => {
        await axios.get(`${process.env.REACT_APP_API_BASE_URL}/transaction/review/property/${id.split("-")[1]}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => {
            setReviews(response.data.data)
        })
    }

    useEffect(() => {
        const konversiStartDate = moment(new Date(selectedDays.from)).format("YYYY-MM-DD")
        const konversiEndate = moment(new Date(selectedDays.to)).format("YYYY-MM-DD")
        if (selectedDays.from) {
            setStartDate(konversiStartDate)
        } else {
            setStartDate(null)
        }
        if (selectedDays.to) {
            setEndDate(konversiEndate)

        } else {
            setEndDate(null)
        }
    }, [selectedDays])

    useEffect(() => {
        getDetailProperty()
        getReview()
    }, [])

    return (
        <>
            <MainContainer >
                <div className='flex flex-col gap-10'>
                    <div className="flex flex-col gap-12 w-full max-w-7xl mx-auto">

                        <div className="flex justify-center py-4 px-2 border">

                            <div className="w-1/3 p-3">
                                <label htmlFor="" className='text-slate-600'>Date</label>
                                <ButtonDateRange
                                    className={"border-2 rounded-md"}
                                    selectedDays={selectedDays}
                                    handleDayClick={handleDayClick}
                                    today={today}
                                    totalNight={countNights()}
                                    price={minPriceTmp}
                                    specialPrice={minSpecialPrice}
                                    dateSpecialPrice={dateSpecialPrice}
                                />
                            </div>
                            <div className="w-40 p-3 mt-auto">
                                <Button className="py-3" type="button" label={'Apply Changes'} onClick={changeDate} />
                            </div>
                        </div>
                    </div>

                    <div>

                        <Slider  {...setting}>
                            {
                                property?.Pictures.map((row, idx) => (

                                    <div key={idx} className={` w-full aspect-video flex-shrink-0`}>
                                        <img className=' w-full aspect-video object-cover rounded-xl' src={`${process.env.REACT_APP_API_BASE_URL}${row?.img}`} />
                                    </div >



                                ))
                            }
                        </Slider>
                    </div>

                    <div className="flex flex-col gap-12 w-full max-w-7xl mx-auto">
                        <div className="flex flex-col gap-4">
                            <HeadLine label={property?.name} />
                            <div className="flex justify-between ">
                                <div className="flex flex-col gap-4">

                                    <SubTitle className="whitespace-pre-line" label={property?.Property_type.name} />
                                    <SubTitle label={property?.Location.city} />
                                </div>
                                <div className="flex flex-col gap-2 mt-auto">

                                    <Caption label="Start Form" />
                                    <Title label={minPrice} />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <HeadLine label="About Property" />
                            <SubTitle label={property?.description} />
                        </div>
                        <div className="flex flex-col gap-4 mb-32">
                            <HeadLine label="Rooms" />
                            {
                                property?.Rooms.map(row => (

                                    <div key={row.id}>
                                        <PropertyCard title={row.name}
                                            price={
                                                getRange(
                                                    row.Special_prices ?
                                                        (
                                                            row.Special_prices.find(srow => (srow.start_date == startDate && srow.end_date == endDate) || (srow.start_date == startDate && srow.end_date >= endDate) || (srow.start_date <= startDate && srow.end_date == endDate)) ?
                                                                [row.Special_prices.find(srow => (srow.start_date == startDate && srow.end_date == endDate) || (srow.start_date == startDate && srow.end_date >= endDate) || (srow.start_date <= startDate && srow.end_date == endDate)).price] :
                                                                [...row.Special_prices?.map(srow => srow.price), ...[row.base_price]]
                                                        )
                                                        : [row.base_price]
                                                    // [...row.Special_prices?.map(srow => srow.price), ...[row.base_price]]
                                                    // row.Special_prices.length ? [...row.Special_prices?.map(srow => srow.price)]/ : [...row.Special_prices?.map(srow => srow.price), ...[row.base_price]]
                                                )
                                            }
                                            location=""
                                            children={
                                                <div className='w-1/3 ml-auto'>
                                                    <Button type='button' className="w-28 ml-auto " label="Book Now" onClick={() => {
                                                        navigate(`/booking?start_date=${startDate}&end_date=${endDate}&room=${row.id}`)
                                                    }} />
                                                </div>
                                            }
                                            image={`${process.env.REACT_APP_API_BASE_URL}${row?.room_img}`} />
                                    </div>


                                ))
                            }
                        </div>
                        <div className="flex flex-col gap-4 mb-32">
                            <HeadLine label="Reviews" />
                            {
                                reviews.length ?
                                    <>
                                        {
                                            reviews.map(row => (
                                                <Column key={row.id}>
                                                    <Caption label={row.Booking?.User?.Profile?.full_name} />
                                                    <Title className={"font"} label={row.comment} />
                                                </Column>
                                            ))
                                        }
                                    </>
                                    :
                                    <></>
                            }
                        </div>
                    </div>
                </div>

            </MainContainer >
        </>
    )
}

export default DetailProperty
