import React, { useState } from 'react'
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


function OrderList() {
    const [bookingStatus, setBookingStatus] = useState([

    ])
    return (
        <>
            <MainContainer>
                <Column className="max-w-7xl mx-auto gap-10">
                    <HeadLine label={"My Bookings"} />
                    <Row className="w-full gap-8">
                        <Column className="gap-8 w-full max-w-sm">
                            <CardView className="w-full gap-5">
                                <Title label={"Sort By"} />
                                <div className='flex gap-2 '>

                                    <input type="radio" id='1' name='sort ' className='cursor-pointer' /> <label className='cursor-pointer' htmlFor="1">highest Price</label>
                                </div>
                                <div className='flex gap-2 '>
                                    <input type="radio" id='2' name='sort' className='cursor-pointer' /> <label className='cursor-pointer' htmlFor="2">lowest Price</label>

                                </div>
                                <div className='flex gap-2 '>

                                    <input type="radio" id='3' name='sort' className='cursor-pointer' /> <label className='cursor-pointer' htmlFor="3">A - Z</label>
                                </div>
                                <div className='flex gap-2 '>
                                    <input type="radio" id='4' name='sort' className='cursor-pointer' /> <label className='cursor-pointer' htmlFor="4">Z - A</label>

                                </div>

                            </CardView>
                            <CardView className="w-full gap-5" >
                                <Title label={"Filter By"} />
                                <TextInput label={"Date"} type="date" />
                                <Dropdown label={"Booking Status"} items={bookingStatus} />
                                <TextInput label={"Booking Id"} />
                                <Button label={"Apply"} />

                            </CardView>
                        </Column>
                        <Column className="w-full">
                            <Cardorder header={<SubTitle label={"Booking Id : R4347P"} />} title={"Property Name Here"}
                                image={`https://bowa.com/wp-content/uploads/2015/07/MAY-Potomac-MD-Whole-House-Renovation-Sitting-Room.jpg`} />
                        </Column>
                    </Row>
                </Column>

            </MainContainer>
        </>
    )
}

export default OrderList
