import React from 'react';

const Faq = () => {
    return (
        <div>
            <div className="bg-primary">
                <div className="bg-pattern bg-black-op-25"
                // style="background-image: url('assets/media/various/bg-pattern.png');"
                >
                    <div className="content content-top text-center">
                        <div className="py-50">
                            <h1 className="font-w700 text-white mb-10">Frequently Asked Questions</h1>
                            <h2 className="h4 font-w400 text-white-op">Our latest news and learning articles.</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="row items-push py-30">
                    <div className="col-xl-8">
                        <div className="mb-50">
                            <h3 className="h4 font-w700 text-uppercase mb-5">Air Quality Index (AQI)</h3>
                            <p>The air quality index (AQI) is an index for reporting air quality on a daily basis.
                                It is a measure of how air pollution affects one's health within a short time period.
                                The purpose of the AQI is to help people know how the local air quality impacts their health.
                            </p>
                        </div>
                        <div className="mb-50">
                            <h3 className="h4 font-w700 text-uppercase mb-5">How AQI is calculated</h3>
                            <br />
                            <p>
                                <img src={require('./AQI.png')} style={{ width: '90%', height: '100%' }} alt="boohoo" className="img-responsive" />
                            </p>
                            <p>Based on the <a href="http://www.indiaenvironmentportal.org.in/files/file/Air%20Quality%20Index.pdf" >CPCB guidelines document</a>,
                            the AQI is to be calculated.
                            </p>
                            <p>The Sub-indices for individual pollutants at a monitoring location are calculated using its
                                24-hourly average concentration value (8-hourly in case of CO and O 3 ) and health
                                breakpoint concentration range. The worst sub-index is the AQI for that location.
                            </p>
                            <p>
                                All the eight pollutants may not be monitored at all the locations. Overall AQI is
    calculated only if data are available for minimum three pollutants out of which one should
    necessarily be either PM 2.5 or PM 10 . Else, data are considered insufficient for calculating
    AQI. Similarly, a minimum of 16 hours’ data is considered necessary for calculating sub-
    index.
                            </p>
                            <p>
                                The sub-indices for monitored pollutants are calculated and disseminated, even if data are
    inadequate for determining AQI. The Individual pollutant-wise sub-index will provide air
    quality status for that pollutant.
                            </p>
                            <p>
                                The web-based system is designed to provide AQI on real time basis. It is an automated
    system that captures data from continuous monitoring stations without human
    intervention, and displays AQI based on running average values (e.g. AQI at 6am on a
    day will incorporate data from 6am on previous day to the current day).
                            </p>
                            <p>
                                For manual monitoring stations, an AQI calculator is developed wherein data can be fed
    manually to get AQI value.
                            </p>

                        </div>
                    </div>


                    <div className="col-xl-4">
                        <div className="block block-transparent">
                            <div className="block-header">
                                <h3 className="block-title text-uppercase"><i className="fa fa-fw fa-list mr-5"></i>
                                    Envitus </h3>
                            </div>
                            <div className="block-header">
                                <h3 className="block-title text-uppercase">
                                    Aquire </h3>
                                <ul>
                                    <li>Dense Urban Monitoring Networks</li>
                                    <li>Supports Over Pollutants</li>
                                    <li>Hyper Local Micro Climate Data</li>
                                </ul>
                            </div>
                            <div className="block-header">
                                <h3 className="block-title text-uppercase">
                                    Analyse </h3>
                                <ul>
                                    <li>Envitus Suite to easily view, and analyze, data from multiple sensors and locations</li>
                                    <li>Custom reports and analysis</li>

                                </ul>
                            </div>
                            <div className="block-header">
                                <h3 className="block-title text-uppercase">
                                    Aware </h3>
                                <ul>
                                    <li>Visualize data in real-time</li>
                                    <li>Customize pollutant threshold for automated alerts and push notifications</li>
                                </ul>
                            </div>
                            <div className="block-header">
                                <h3 className="block-title text-uppercase">
                                    Action </h3>
                                <ul>
                                    <li>Micro climate system ensure quick and accurate air quality.</li>
                                    <li>Real-time microclimatic data measurements enables quick action to improve quality of life </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="bg-body-dark">
                <div className="content content-full text-center">

                        <div className="js-slider slick-nav-black" data-autoplay="false">
                            <div className="block-header">
                                <h3 className="block-title text-uppercase">Contact Us</h3>
                            </div>
                            <div className="block-content">
                                <p>Alcodex Technologies Pvt. Ltd,
                                    7/719-B, Plot No: 180, Mavelipuram Colony
                                    Kakkanad, Kochi-682030,Kerala, India </p>
                                <p>info@envitus.co</p>
                                <p>+91 484 2980822 </p>
                            </div>
                        </div>
                </div>
            </div> */}
            <footer id="page-footer" className="opacity-0">
                <div className="content py-20 font-size-sm clearfix">
                    <div className="float-right">
                        <div className="js-year-copy"></div>
                    </div>
                    <div className="float-left">
                        <a className="font-w600">&copy;Alcodex Technologies Pvt Limited. All rights reserved.</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Faq;