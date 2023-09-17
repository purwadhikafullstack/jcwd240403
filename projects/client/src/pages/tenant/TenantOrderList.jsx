import axios from 'axios'
import React, { useState } from 'react'
import api from '../../shared/api'
import { useEffect } from 'react'
import TableWithSortHeader from '../../components/tables/TableWithSortHeader'
import { Navigate } from 'react-router-dom'
import ModalDialog from '../../components/widget/ModalDialog'
import Column from '../../components/widget/Column'
import Title from '../../components/texts/Title'
import SubTitle from '../../components/texts/SubTitle'
import Button from '../../components/buttons/Button'
import Row from '../../components/widget/Row'
import Dropdown from '../../components/dropdown/Dropdown'
import TextInput from '../../components/textInputs/TextInput'
import TextAreaWithLabel from '../../components/textInputs/TextAreaWithLabel'
import { Field } from 'formik'


function TenantOrderList() {

    const [listOrder, setListOrder] = useState([])
    const [orderData, setOrderData] = useState([])
    const [show, setShow] = useState(false)
    const [sendReason, setSendReason] = useState("")
    const [reason, setReason] = useState("")
    const [showDecline, setShowDecline] = useState(false)
    const [showCancel, setShowCancel] = useState(false)
    const [showAction, setShowAction] = useState(true)
    const [cancelConfirm, setCancelConfirm] = useState(0)
    const [order, setOrder] = useState(null)
    const [statusBy, setStatusBy] = useState(null)
    const [typeBy, setTypeBy] = useState(null)
    const [locationBy, setLocationBy] = useState(null)
    const [statusFilter, setStatusFilter] = useState([])
    const [typeFilter, setTypeFilter] = useState([])
    const [locationFilter, setLocationFilter] = useState([])
    const getOrderData = async () => {
        const { data } = await api.get(`/transaction/order-user?location=${locationBy?.id ?? ""}&type=${typeBy?.id ?? ""}&status=${statusBy?.id ?? ""}`);
        const response =
            data && data.data && data.data.length
                ? data.data.map((item) => ({ id: item.id, userName: item.User.Profile.full_name, Property_Name: item.Room.Property.name, location: item.Room.Property.Location.city, property_Type: item.Room.Property.Property_type.name, status: item.booking_status }))
                : [];
        setOrderData(response)
        setListOrder(data.data)
    }

    const onCLoseDialog = () => {
        setShow(false)
    };

    const acceptOrder = async (action) => {
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/transaction/order-user/${order.booking_code}/${order.user_id}`, {
            payment_status: action == 10 ? "ACCEPTED" : "DECLINED",
            reject_reason: reason
        }, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => {
            setShow(false)
            getOrderData()
        })
    }
    const cancelOrder = async (action) => {
        axios.patch(`${process.env.REACT_APP_API_BASE_URL}/transaction/order-user/${order.booking_code}/${order.user_id}`, {
            cancel_reason: reason

        }, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => {
            setShow(false)
            getOrderData()
        })
    }

    const onSelectHandler = (userOrder) => {
        const data = listOrder.find((orders) => orders.id == userOrder.id)
        setOrder(data)
        setShowAction(false)
        if (data?.booking_status != "DONE" && data?.booking_status != "CANCELED") {
            setShowAction(true)
        }
        setShow(true)
    };

    const getFilter = async () => {
        await axios.get(`${process.env.REACT_APP_API_BASE_URL}/transaction/filter`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => {
            if (response.data.status) {
                setStatusFilter(response.data.data.status)
                setLocationFilter([{ id: "", city: "All" }, ...response.data.data.location])
                setTypeFilter([{ id: "", name: "All" }, ...response.data.data.propertyType])
            }
        })
    }

    const reasonHandler = (e) => {
        setReason(e.target.value)
    }


    useEffect(() => {
        getOrderData()
        getFilter()
    }, [locationBy, statusBy, typeBy])
    return (

        <>


            <Row className="w-full gap-4">
                <Column className="w-1/3">
                    <Dropdown labelField='city' className="w-full" label={`Location`} selected={locationBy} items={locationFilter} onItemChange={(e) => setLocationBy(e)} />
                </Column>
                <Column className="w-1/3">
                    <Dropdown labelField='name' className="w-full" label={`Property Type`} selected={typeBy} items={typeFilter} onItemChange={(e) => setTypeBy(e)} />
                </Column >
                <Column className="w-1/3">
                    <Dropdown labelField='value' className="w-full" label={`Status`} selected={statusBy} items={statusFilter} onItemChange={(e) => setStatusBy(e)} />

                </Column>
            </Row>
            <TableWithSortHeader
                title={"Order List"}
                description={"List All Orders By Customers"}
                data={orderData}
                onDetail={onSelectHandler}

            />
            {
                order != null && <ModalDialog show={show} onClose={onCLoseDialog} className="max-w-xl">
                    <Column className="px-6 py-8 gap-5 ">
                        <Column>
                            <Title label={"Detail Order"} />
                            <SubTitle label={order.booking_code} />
                        </Column>
                        <img className='w-full max-w-sm rounded-lg mx-auto' src={`${process.env.REACT_APP_API_BASE_URL}${order.payment_proof}`} />
                        <Row>
                            {
                                sendReason ?
                                    <>
                                        <TextAreaWithLabel label={`${sendReason} Reason`} placeholder={`${sendReason} Reason`} form={{ errors: [] }} onChange={reasonHandler} />
                                    </>
                                    :
                                    <></>
                            }
                        </Row>
                        {
                            showAction ?
                                <>
                                    <Row className="w-full justify-between">
                                        <Row className="gap-3 my-auto">
                                            <Button label={"Accept"} className="bg-blue-600 hover:bg-blue-800" type='button' onClick={() => acceptOrder(10)} />
                                            {
                                                showDecline ?
                                                    <>
                                                        <Button label={"yes, Decline"} className="bg-orange-600 hover:bg-orange-800" type='button' onClick={() => {
                                                            acceptOrder(20)
                                                            setShowDecline(false)
                                                            setSendReason("")

                                                        }} />
                                                        <Button label={"Close"} className="bg-orange-600 hover:bg-orange-800" type='button' onClick={() => {
                                                            setShowDecline(false)
                                                            setSendReason("")
                                                        }} />

                                                    </>
                                                    :
                                                    <>
                                                        <Button label={"Decline"} className="bg-orange-600 hover:bg-orange-800" type='button' onClick={() => {
                                                            setShowDecline(true)
                                                            setSendReason("decline")
                                                            setShowCancel(false)
                                                            setCancelConfirm(null)
                                                        }} />

                                                    </>
                                            }
                                        </Row>
                                        <Column>
                                            {
                                                order?.id == cancelConfirm ?
                                                    <>
                                                        <div className='gap-4'>
                                                            <Button label={"Yes, Cancel This Order"} className="w-fit bg-red-600 my-2 hover:bg-red-800" type='button' onClick={() => {
                                                                cancelOrder()
                                                                setShowCancel(false)
                                                                setSendReason("")
                                                                setCancelConfirm(null)

                                                            }} />
                                                            <Button label={"Close"} className="w-fit bg-gray-600 my-2 hover:bg-gray-800" type='button' onClick={() => {
                                                                setCancelConfirm(0)
                                                                setShowCancel(false)
                                                                setSendReason("")
                                                            }} />

                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <Button label={"Cancel Order"} type='button' className={"w-fit bg-red-600 hover:bg-red-800"} onClick={() => {
                                                            setCancelConfirm(order.id)
                                                            setShowCancel(true)
                                                            setSendReason("cancel")
                                                            setShowDecline(false)
                                                        }} />
                                                    </>
                                            }
                                        </Column>

                                    </Row>
                                </>
                                :
                                <></>
                        }
                    </Column>
                </ModalDialog>
            }
        </>
    )
}

export default TenantOrderList
