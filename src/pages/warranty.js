import React from 'react';
import Layout from '../components/layout/layout';
import { Container, Row, Col } from 'react-bootstrap';
const Warrent = () => {
    return (
        <>
            <Layout>
                <Container className="my-5 p-5">
                    <Row className="mb-5">
                        <h1 className="text-center">
                            Warranty &amp; Returns Policy
                        </h1>
                    </Row>
                    <Row>
                        <h3>WARRANTY</h3>
                        <p className="text-justify">
                            RevelWell is committed to providing you with
                            products of the highest quality. Many of our
                            products carry warranty policies in the event of a
                            defective or damaged product. Should you encounter
                            an issue with your item that you believe falls
                            within your products warranty policy, please contact
                            us at info@revelwell.com.au so that we can assist
                            with arranging the warranty claim with the
                            manufacturer. In order for us to assist you, you
                            will need to provide us with your proof of purchase
                            (Invoice/Receipt), full contact details and evidence
                            of the defect in order to initiate the warranty
                            process. This should be a photo image or brief video
                            clip of the product showing the defect. The costs of
                            claiming the warranty (for example, the
                            postage/shipping costs for the return of product)
                            will NOT be borne by RevelWell. Our products are
                            covered by warranty for a period of 12 months from
                            delivery date The manufacturer will not accept
                            products that are deemed to be damaged on purpose or
                            not properly maintained or for products used outside
                            of their intended means
                        </p>
                        <h5>Personal Injuries/Damage</h5>
                        <p className="text-justify">
                            We do not cover any personal injuries or damage due
                            to accidents, misuse, neglect, normal wear, improper
                            assembly, re-assembly or improper maintenance.
                        </p>
                        <h3>RETURNS</h3>
                        <p className="text-justify">
                            All sales are final, we do not accept returns for
                            any items purchased from RevelWell. If an item is
                            damaged or faulty upon receiving it, we reserve the
                            opportunity to fix the problem and may seek to
                            repair the faulty item under warranty. If the
                            problem is major or cannot be fixed, we will look to
                            provide a brand-new replacement, or provide a full
                            refund. We will not accept returns for goods damaged
                            in your care.
                        </p>
                        <p className="text-justify">
                            Claims for a return must be made within the first 7
                            days upon recieving your item to entitle you to a
                            refund. To be eligible for a return, your item must
                            be unused and in the new condition that you received
                            it. It must also be in the original packaging. The
                            box (where applicable) must be in original condition
                            and unmarked. The contents of the box must be in
                            original condition and unmarked. We will require
                            photo evidence of this prior to a return being made
                            under our free returns policy.{' '}
                        </p>
                        <p className="text-justify">
                            Delivery and labour costs will not be included in
                            the refund and cost of returning the product will be
                            at the customers own expense.
                        </p>
                        <p className="text-justify">
                            Returned items must be shipped back to the warehouse
                            from which it was originally shipped. Contact our
                            customer service team at info@revelwell.com.au to
                            begin the returns process and identify where the
                            return should be shipped to.
                        </p>
                        <h5>Refunds (if applicable)</h5>
                        <p className="text-justify">
                            Once your return is received and inspected, we will
                            send you an email to notify you that we have
                            received your returned item. We will also notify you
                            of the approval or rejection of your refund. If you
                            are approved, then your refund will be processed,
                            and a credit will automatically be applied to your
                            credit card or original method of payment, within 5
                            days.
                        </p>
                    </Row>
                    <Row>
                        <h5>
                            Refunds will not be issued in the following
                            instances:
                        </h5>
                    </Row>
                    <Row>
                        <Col className="pl-5">
                            <ol>
                                <li>
                                    You change your mind or no longer want the
                                    item
                                </li>
                                <li>
                                    Found the item at a cheaper price elsewhere
                                </li>
                                <li>Chose the wrong size or colour</li>
                                <li>The item was damaged in your care</li>
                            </ol>
                        </Col>
                    </Row>
                    <Row>
                        <h3>Late or missing refunds (if applicable)</h3>
                        <p className="text-justify">
                            If you haven’t received your refund, check your bank
                            account and contact your credit card company, it may
                            take some time before your refund is officially
                            posted. If you have done all of this and you still
                            have not received your refund, please contact us at
                            info@revelwell.com.au.
                        </p>
                        <h3>Sale items (if applicable)</h3>
                        <p className="text-justify">
                            Only regular priced items may be refunded,
                            unfortunately sale items cannot be refunded.
                        </p>
                        <h3>Exchanges (if applicable)</h3>
                        <p className="text-justify">
                            We only replace items if they are defective or
                            damaged. If you need to exchange it for the same
                            item, send us an email at info@revelwell.com.au and
                            our customer service team will begin the exchange
                            process.
                        </p>
                        <h3>Shipping of Returns</h3>
                        <p className="text-justify">
                            RevelWell can arrange for your item to be returned
                            to us, including arranging for shipping. However,
                            please note that if you receive a refund, the cost
                            of return shipping will be deducted from your
                            refund. We will inform you of the shipping cost
                            prior to initiating the return process.
                        </p>
                        <p className="text-justify">
                            Depending on where you live, the time it may take
                            for your exchanged product to reach you, may vary.
                        </p>
                        <p className="text-justify">
                            If you are shipping an item over $75, you should
                            consider using a trackable shipping service or
                            purchasing shipping insurance. We do not guarantee
                            that we will receive your returned item.
                        </p>
                    </Row>
                </Container>
            </Layout>
        </>
    );
};

export default Warrent;
