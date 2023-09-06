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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TextInput from '../../../components/textInputs/TextInput';
import { getRange } from '../../../shared/utils';
import Pagination from '../../../components/pagination/Pagination';


const useQuery = () => {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
}
const AvailableProperty = () => {

    let query = useQuery()
    const navigate = useNavigate();
    const [location, setLocation] = useState(null)
    const [locations, setLocations] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [limitPage, setLimitPage] = useState(10)
    const [sortBy, setSortBy] = useState(null)
    const [nameFilter, setNameFilter] = useState(null)
    const [typeFilter, setTypeFilter] = useState(null)
    const [properties, setProperties] = useState(null)
    const [propertyTypes, setPropertyTypes] = useState([])
    const [rangePrice, setRangePrice] = useState("")
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
            await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product?location=${location.id}&start_date=${startDate}&end_date=${endDate}&page=${currentPage}&perPage=${limitPage}&sortBy=${sortBy}&name=${nameFilter ?? ''}&typeRoom=${typeFilter?.id ?? ""}`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then(response => {
                setProperties(response.data.data)
                const prop = response.data.data
                setTotalPage(response.data.pagination.totalPage)
            })
        } else {
            if (!location) {
                toast.error("Location Must Be Selected")
            } else if (!startDate && !endDate) {
                toast.error("Date Must Be Selected")
            }
        }
    }
    const getLocations = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/location/all`)
        const data = response.data
        setLocations(data.data)
    }

    const getTypes = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/property-type/all`)
        const data = response.data
        setPropertyTypes(data.data)
    }

    const onChangePage = (page) => {
        setCurrentPage(page)

    }

    const onChangeSort = (e) => {
        // e.preventDefault()
        const { value } = e.target
        setSortBy(value)
    }

    const onChangeFilterName = (e) => {
        const { value } = e.target
        setNameFilter(value)
        console.log(value)
    }
    const onChangeFilterType = (e) => {
        setTypeFilter(e)
        console.log(e)
    }

    useEffect(() => {
        if (location != null) { availableData() }
    }, [currentPage, sortBy])

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
        getLocations()
        getTypes()
    }, [])
    return (
        <>
            <MainContainer>
                <div className="w-full max-w-7xl flex flex-col mx-auto gap-5">

                    <div className="flex justify-between py-4 px-2 bg-white rounded-md border ">
                        <div className="flex w-full ">

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
                                    className="border rounded-md"
                                    selectedDays={selectedDays}
                                    handleDayClick={handleDayClick}
                                    today={today}
                                    totalNight={countNights()}
                                />
                            </div>
                        </div>
                        <div className="w-40 p-3 mt-auto ">
                            <Button className="py-3" label={"Search"} type='button' onClick={availableData} />
                        </div>
                    </div>
                    <div className="flex flex-row gap-8 ">
                        <div className='flex w-full max-w-sm flex-col gap-5  '>
                            <div className='w-full h-auto flex flex-col bg-white p-4 rounded-md justify-start gap-5 border'>
                                <h6>sort by</h6>
                                <div className='flex gap-2 '>

                                    <input type="radio" id='1' name='sort' value={"HighestPrices"} onChange={onChangeSort} className='cursor-pointer' /> <label className='cursor-pointer' htmlFor="1">highest Price</label>
                                </div>
                                <div className='flex gap-2 '>
                                    <input type="radio" id='2' name='sort' value={"LowestPice"} onChange={onChangeSort} className='cursor-pointer' /> <label className='cursor-pointer' htmlFor="2">lowest Price</label>

                                </div>
                                <div className='flex gap-2 '>

                                    <input type="radio" id='3' name='sort' value={"A-Z"} onChange={onChangeSort} className='cursor-pointer' /> <label className='cursor-pointer' htmlFor="3">A - Z</label>
                                </div>
                                <div className='flex gap-2 '>
                                    <input type="radio" id='4' name='sort' value={"Z-A"} onChange={onChangeSort} className='cursor-pointer' /> <label className='cursor-pointer' htmlFor="4">Z - A</label>

                                </div>

                            </div>
                            <div className='w-full h-auto flex flex-col bg-white p-4 rounded-md gap-5 border'>
                                <h6>Filter</h6>
                                <TextInput label={"Name"} placeholder={"Name"} onChange={onChangeFilterName} />
                                {
                                    propertyTypes && <Dropdown items={propertyTypes} labelField={"name"}
                                        label={"Type"} onItemChange={onChangeFilterType}
                                        selected={typeFilter} />
                                }

                                <div className="w-1/3 ml-auto">
                                    <Button label={"Apply"} type='button' onClick={availableData} />
                                </div>
                            </div>

                        </div>
                        <div className="flex w-full flex-col gap-y-5">
                            {
                                (properties != null)
                                    ?
                                    <>
                                        {
                                            properties.length ?
                                                properties.map(row => (
                                                    <>
                                                        <div key={row.id}>
                                                            <PropertyCard title={row.name}
                                                                price={
                                                                    getRange(
                                                                        row.Rooms?.map(row => {
                                                                            let prices = []
                                                                            prices.push(row.base_price)
                                                                            if (row.Special_prices) {
                                                                                prices.push(row.Special_prices.map(srow => srow.price))
                                                                            }
                                                                            return prices.flat()
                                                                        }).flat()
                                                                        // row.Rooms?.map(row => row.base_price)
                                                                    )
                                                                }
                                                                location={row.Location.city} image={`${process.env.REACT_APP_API_BASE_URL}${row.Rooms[0]?.room_img}`} >
                                                                <div className='w-1/3 ml-auto'>
                                                                    <Button onClick={() => {
                                                                        navigate(`/property/${row.name}-${row.id}?start_date=${startDate}&end_date=${endDate}`)

                                                                    }}
                                                                        label={"Detail"}
                                                                        type='button'
                                                                    />

                                                                </div>
                                                            </PropertyCard>
                                                        </div >

                                                    </>
                                                ))
                                                :
                                                <>
                                                    <p className='text-red-700'>Data Not Found</p>
                                                </>
                                        }
                                    </>
                                    :
                                    <>
                                    </>
                            }
                            {
                                properties != null && <Pagination totalPage={totalPage} onChangePage={onChangePage} />
                            }

                        </div>
                    </div>
                </div>

            </MainContainer >
        </>
    )
}

export default AvailableProperty
