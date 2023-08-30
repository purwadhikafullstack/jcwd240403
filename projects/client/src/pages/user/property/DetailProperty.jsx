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
import { useParams } from 'react-router-dom';
import { getMinimumPrice } from '../../../shared/utils';



const DetailProperty = () => {
    const [property, setProperty] = useState(null)
    const [minPrice, setMinPrice] = useState(0)
    let { id } = useParams()
    const today = new Date();
    const tomorrow = new Date(today);
    const [selectedDays, setSelectedDays] = useState({
        from: today,
        to: tomorrow,
    });
    const getDetailProperty = async (e) => {
        await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/${id.split("-")[1]}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => {
            setProperty(response.data.data)
            const prop = response.data.data
            let prices = prop?.Rooms.map(row => row.base_price)
            setMinPrice(getMinimumPrice(prices))


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
    useEffect(() => {
        getDetailProperty()
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
                                />
                            </div>
                            <div className="w-40 p-3 mt-auto">
                                <Button className="py-3" type="button" label={'Ubah'} />
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-row gap-5 snap-x overflow-x-auto snap-mandatory ">
                        {
                            property?.Pictures.map((row, idx) => (
                                <>
                                    <div className={`${idx == 0 ? "ml-32" : idx == property?.Pictures.length - 1 ? "ml-5 mr-32" : "ml-5"} snap-center w-full aspect-video max-w-4xl flex-shrink-0`}>
                                        <img className=' w-full aspect-video object-cover rounded-xl' src={`${process.env.REACT_APP_API_BASE_URL}${row?.img}`} />
                                    </div >


                                </>
                            ))
                        }

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
                                    <>
                                        <div key={row.id}>
                                            <PropertyCard title={row.name} price={new Intl.NumberFormat().format(row.base_price)} location="" children={<div className='w-1/3 ml-auto'> <Button className="w-28 " label="Book Now" /></div>} image={`${process.env.REACT_APP_API_BASE_URL}${row?.room_img}`} />
                                        </div>

                                    </>
                                ))
                            }
                        </div>
                    </div>
                </div>

            </MainContainer >
        </>
    )
}

export default DetailProperty
