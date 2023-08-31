import React from 'react'
import MainContainer from '../../../components/layouts/MainContainer'
import Column from '../../../components/widget/Column'
import CardView from '../../../components/cards/CardView'
import SubTitle from '../../../components/texts/SubTitle'
import HeadLine from '../../../components/texts/HeadLine'
import Title from '../../../components/texts/Title'
import { TbPlus } from 'react-icons/tb';
import Body from '../../../components/texts/Body'
import Row from '../../../components/widget/Row'
import Button from '../../../components/buttons/Button'

function PaymentProof() {
    return (
        <>
            <MainContainer>
                <Column className="max-w-7xl mx-auto gap-10">
                    <CardView className="mx-auto min-w-[10rem]">
                        <SubTitle className="text-center" label={"23:22"} />
                    </CardView>
                    <Column>
                        <Title label={"Amount "} />
                        <SubTitle label={"1,000,000"} />
                    </Column>
                    <Column>
                        <Title label={"Account Number"} />
                        <SubTitle label={"123Prf"} />
                    </Column>
                    <Column className="gap-2">
                        <Title label={"Upload Payment Proof"} />
                        <Column className="gap-8">
                            <label htmlFor="Payment_Proof" className="flex  flex-col cursor-pointer border p-6 bg-slate-50 rounded-md w-1/2 max-w-[1/2] mx-auto h-52">
                                <input id="Payment_Proof" type="file" className="hidden" />
                                <div className="my-auto">
                                    <TbPlus className='h-10 w-10 mx-auto' />
                                    <Body className="text-center" label={"Choose File"} />
                                </div>
                            </label>
                            <Row className="justify-between w-1/2 mx-auto gap-10">
                                <Button className="w-fit px-6" label={"Cancle Booking"} />
                                <Button label={"Submit"} />

                            </Row>
                        </Column>
                    </Column>




                </Column>

            </MainContainer>
        </>
    )
}

export default PaymentProof
