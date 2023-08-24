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
import { useLocation } from 'react-router-dom';


const useQuery = () => {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
}
const AvailableProperty = () => {

    let query = useQuery()
    const [location, setLocation] = useState(null)
    const [locations, setLocations] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [properties, setProperties] = useState([])
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [selectedDays, setSelectedDays] = useState({
        from: today,
        to: tomorrow,
    });

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
    const availableData = async () => {
        if (location && startDate && endDate) {
            await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product?location=${location.id}&start_date=${startDate}&end_date=${endDate}`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then(response => {
                setProperties(response.data.data)
                console.log(response.data.data)
            })
        }
    }
    const getLocations = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/location/all`)
        const data = response.data
        setLocations(data.data)
    }

    useEffect(() => {
        const konversiStartDate = moment(new Date(selectedDays.from)).format("YYYY-MM-DD")
        const konversiEndate = moment(new Date(selectedDays.to)).format("YYYY-MM-DD")
        setStartDate(konversiStartDate)
        setEndDate(konversiEndate)
    }, [selectedDays])

    useEffect(() => {
        getLocations()
    }, [])
    return (
        <>
            <MainContainer>
                <div className="flex justify-center py-4 px-2 ">
                    <div className="w-1/3 p-3">
                        {
                            locations && <Dropdown items={locations} labelField={"city"}
                                label={"Location"} onItemChange={(e) => setLocation(e)}
                                selected={location} />
                        }
                    </div>
                    <div className="w-1/3 p-3">
                        <label htmlFor="" className='text-slate-600'>Date</label>
                        <ButtonDateRange
                            selectedDays={selectedDays}
                            handleDayClick={handleDayClick}
                            today={today}
                            totalNight={countNights()}
                        />
                    </div>
                    <div className="w-1/3 p-3 align-middle my-auto ">
                        <Button label={"Search"} type='button' onClick={availableData} />
                    </div>
                </div>
                <div className="grid grid-rows-6 justify-center">
                    {
                        properties.map(row => (
                            <>
                                <div className="p-2" key={row.id}>
                                    <PropertyCard title={row.name} price={row.Rooms[0]?.base_price} location={row.Location.city} image={`${process.env.REACT_APP_API_BASE_URL}${row.Rooms[0]?.room_img}`} />
                                </div>

                            </>
                        ))
                    }
                </div>

            </MainContainer>
        </>
    )
}

export default AvailableProperty
