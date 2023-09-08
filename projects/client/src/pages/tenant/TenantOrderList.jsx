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

function TenantOrderList() {

    const [listOrder, setListOrder] = useState([])
    const [orderData, setOrderData] = useState([])
    const [show, setShow] = useState(false)
    const [order, setOrder] = useState(null)
    const getOrderData = async () => {
        const { data } = await api.get("/transaction/order-user");
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
            payment_status: action == 10 ? "ACCEPTED" : "DECLINED"
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
        axios.patch(`${process.env.REACT_APP_API_BASE_URL}/transaction/order-user/${order.booking_code}/${order.user_id}`, {}, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => {
            setShow(false)
            getOrderData()
        })
    }

    const onSelectHandler = (userOrder) => {
        setShow(true)
        const data = listOrder.find((orders) => orders.id == userOrder.id)
        setOrder(data)
        console.log(data)
    };


    useEffect(() => {
        getOrderData()
    }, [])
    return (

        <>
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
                        <Row className="w-full justify-between">
                            <Row className="gap-3">
                                <Button label={"Accept"} className="bg-blue-600 hover:bg-blue-800" type='button' onClick={() => acceptOrder(10)} />
                                <Button label={"Decline"} className="bg-orange-600 hover:bg-orange-800" type='button' onClick={() => acceptOrder(20)} />
                            </Row>
                            <Column>
                                <Button label={"Cancel Order"} className="w-fit bg-red-600 hover:bg-red-800" type='button' onClick={() => cancelOrder()} />
                            </Column>

                        </Row>
                    </Column>
                </ModalDialog>
            }
        </>
    )
}

export default TenantOrderList
