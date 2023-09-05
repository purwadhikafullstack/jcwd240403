import React, { useEffect, useState } from 'react'
import MainContainer from '../../../components/layouts/MainContainer'
import Column from '../../../components/widget/Column'
import HeadLine from '../../../components/texts/HeadLine'
import Row from '../../../components/widget/Row'
import CardView from '../../../components/cards/CardView'
import Title from '../../../components/texts/Title'
import TextInput from '../../../components/textInputs/TextInput'
import { date } from 'yup'
import Dropdown from '../../../components/dropdown/Dropdown'
import Button from '../../../components/buttons/Button'
import PropertyCard from '../../../components/cards/PropertyCard'
import SubTitle from '../../../components/texts/SubTitle'
import Cardorder from '../../../components/cards/CardOrder'
import axios from 'axios'
import moment from 'moment';
import Pagination from '../../../components/pagination/Pagination'


function OrderList() {
    const [bookingStatus, setBookingStatus] = useState([{ id: 1, name: 'WAITING FOR PAYMENT', value: "WAITING_FOR_PAYMENT" },
    { id: 2, name: `PROCESSING PAYMENT`, value: "PROCESSING_PAYMENT" },
    { id: 3, name: `DONE`, value: "DONE" },
    { id: 4, name: `CANCELED`, value: "CANCELED" }])
    const [orders, setOrders] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [limitPage, setLimitPage] = useState(2)
    const [sortBy, setSortBy] = useState(null)
    const [bookingIdFilter, setBookingIdFilter] = useState(null)
    const [bookingDateFilter, setBookingDateFilter] = useState(null)
    const [bookingStatusFilter, setBookingStatusFilter] = useState(null)
    const getAllOrder = async (e) => {
        await axios.get(`${process.env.REACT_APP_API_BASE_URL}/transaction/order?page=${currentPage}&perPage=${limitPage}&sortBy=${sortBy ?? ""}&date=${bookingDateFilter ?? ""}&booking_status=${bookingStatusFilter?.value ?? ""}&booking_code=${bookingIdFilter ?? ""}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => {
            if (response.data.status) {
                setOrders(response.data.data)
                setTotalPage(response.data.pagination.totalPage)
            }
        })
    }


    const onChangePage = (page) => {
        setCurrentPage(page)

    }

    const onChangeSort = (e) => {
        // e.preventDefault()
        const { value } = e.target
        setSortBy(value)
        console.log(value)
    }

    const onChangeFilterType = (e) => {
        setBookingStatusFilter(e)
        console.log(e)
    }

    const onChangeFilterBookingId = (e) => {
        const { value } = e.target
        setBookingIdFilter(value)
        console.log(value)
    }

    const onChangeFilterBookingDate = (e) => {
        const { value } = e.target
        setBookingDateFilter(value)
        console.log(value)
    }

    useEffect(() => {
        getAllOrder()
    }, [currentPage, sortBy])
    return (
        <>
            <MainContainer>
                <Column className="max-w-7xl mx-auto gap-10 w-full">
                    <HeadLine label={"My Bookings"} />
                    <Row className="w-full gap-8">
                        <Column className="flex w-full gap-8 max-w-sm">
                            <CardView className="w-full gap-5">
                                <Title label={"Sort By"} />
                                <div className='flex gap-2 '>

                                    <input type="radio" id='1' name='sort' value={"HighestPrice"} onChange={onChangeSort} className='cursor-pointer' /> <label className='cursor-pointer' htmlFor="1">highest Price</label>
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

                            </CardView>
                            <CardView className="w-full gap-5" >
                                <Title label={"Filter By"} />
                                <TextInput label={"Date"} type="date" onChange={onChangeFilterBookingDate} />
                                <Dropdown label={"Booking Status"} selected={bookingStatusFilter} items={bookingStatus} onItemChange={onChangeFilterType} />
                                <TextInput label={"Booking Code"} onChange={onChangeFilterBookingId} />
                                <Button label={"Apply"} onClick={getAllOrder} />

                            </CardView>
                        </Column>
                        <Column className="w-full gap-y-4">
                            {
                                orders?.length ?
                                    <>
                                        {
                                            orders.map(row => (
                                                <Cardorder key={row.id}
                                                    header={<SubTitle label={`Booking Code : ${row.booking_code}`} />}
                                                    title={row.Room?.Property?.name}
                                                    image={`${process.env.REACT_APP_API_BASE_URL}${row.Room?.room_img}`}
                                                    type={`${row.Room?.Property?.Property_type?.name} - ${row.Room?.name}`}
                                                    check_in={moment(row.check_in_date, "YYYY-MM-DD").format("DD/MM/YYYY")}
                                                    check_out={moment(row.check_out_date, "YYYY-MM-DD").format("DD/MM/YYYY")}
                                                    status={row.booking_status}
                                                    booking_code={row.booking_code}
                                                />
                                            ))
                                        }
                                    </>
                                    : <></>
                            }
                            {
                                orders != null && <Pagination totalPage={totalPage} onChangePage={onChangePage} />
                            }
                        </Column>
                    </Row>
                </Column>

            </MainContainer>
        </>
    )
}

export default OrderList
