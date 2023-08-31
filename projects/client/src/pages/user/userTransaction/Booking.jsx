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



const BookingProperty = () => {
    return (
        <>
            <MainContainer>
                <Column className="max-w-7xl mx-auto gap-10">
                    <Row className="gap-10 ">
                        <img className='w-1/2 aspect-video rounded-lg' src="https://bowa.com/wp-content/uploads/2015/07/MAY-Potomac-MD-Whole-House-Renovation-Sitting-Room.jpg" alt="" />
                        <Column className="w-full gap-5">
                            <HeadLine label={"property.name"} />
                            <SubTitle label={"Property Type"} />
                            <SubTitle label={"Location"} />
                        </Column>
                    </Row>
                    <CardView>
                        <Row className="w-fit gap-5 ">
                            <Column className="gap-1">
                                <Caption label={"Check In"} />
                                <Body label={"30/08/2023"} />
                            </Column>
                            <TbArrowRight className='h-5 w-5 my-auto' />
                            <Column className="gap-1">
                                <Caption label={"Check Out"} />
                                <Body label={"31/08/2023"} />
                            </Column>
                        </Row>
                    </CardView>

                    <SubTitle label={"Room Type"} />
                    <Column className="gap-1">
                        <Body label={"Total Price"} />
                        <Title label={"1.000.000"} />
                    </Column>
                    <Button className="mx-auto w-36 mb-60" label={"Make Paayment"} />
                </Column>

            </MainContainer>
        </>
    )
}

export default BookingProperty