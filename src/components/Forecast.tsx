import { useEffect, useState } from "react";
import Degree from "./Degree";
import { dataType } from "../types"
import { WiHumidity } from "react-icons/wi";
import { IoMdEye } from "react-icons/io";
import { IoRainySharp, IoArrowUpCircle, IoArrowDownCircleSharp } from "react-icons/io5";
import { PiWindFill } from "react-icons/pi";
import { BsArrowDownLeft, BsArrowLeft, BsArrowUpLeft, BsArrowUp, BsArrowUpRight, BsArrowRight, BsArrowDownRight, BsArrowDown } from "react-icons/bs";


const Forecast = ({ data, setData }: { data: dataType, setData: React.Dispatch<React.SetStateAction<dataType | null>> }) => {
    const [dateTime, setDateTime] = useState<{ formattedDay: string; formattedTime: string; }>({ formattedDay: '', formattedTime: '' });
    const [dayLength, setDayLength] = useState<string>("");
    const [sunrise, setSunrise] = useState<string>("");
    const [sunset, setSunset] = useState<string>("");

    const today = data.list[0]
    console.log(data);

    const convertTimezoneToTime = (TimeDifference: number): { formattedDay: string; formattedTime: string; } => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const currentDate = new Date();
        const utcTimestamp = currentDate.getTime() + currentDate.getTimezoneOffset() * 60 * 1000;
        const gmtTimestamp = utcTimestamp + (60 * 60 * 1000 * 0);

        const date = new Date(gmtTimestamp + TimeDifference * 1000);
        const dayOfWeek = daysOfWeek[date.getDay()];
        const hours = date.getHours();
        const minutes = date.getMinutes();


        const formattedDay = `${dayOfWeek}`;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;

        return { formattedDay, formattedTime };
    };

    const getDayLength = (sunset: number, sunrise: number): string => {
        const timeDifference = Math.abs(sunrise - sunset) * 1000;
        const hours = Math.floor(timeDifference / (60 * 60 * 1000));
        const minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000));
        const dayLength = `${hours}h ${minutes}m`

        return dayLength;
    };

    const getSunTime = (timestamp: number): string => {
        const date = new Date(timestamp * 1000)
        const hours = date.getHours().toString();
        const minutes = date.getMinutes().toString();

        return `${hours}:${minutes}`
    }

    useEffect(() => {
        const timezoneData = convertTimezoneToTime(data.city.timezone);
        const dayLengthData = getDayLength(data.city.sunset, data.city.sunrise);

        setDateTime(timezoneData);
        setDayLength(dayLengthData);
        setSunrise(getSunTime(data.city.sunrise));
        setSunset(getSunTime(data.city.sunset));
    }, [data]);


    const convertTimezoneToDay = (timestamp: number): string => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const milliseconds = timestamp * 1000;
        const date = new Date(milliseconds);
        const dayIndex = date.getUTCDay();
        const dayName = daysOfWeek[dayIndex];

        return dayName;
    };



    // ======================================================

    const remainingTime = (targetTime: number): string => {
        const currentTime = Date.now() / 1000;
        const difference = Math.abs(targetTime - currentTime);
        const hours = Math.floor(difference / 3600);
        const minutes = Math.floor((difference % 3600) / 60);

        const h = hours == 0 ? ("") : (`${hours}h`)
        const m = minutes == 0 ? ("") : (`${minutes}m`)
        return `${h} ${m}`
    }

    // ======================================================

    const getWindDirection = (deg: number): JSX.Element => {
        if (deg > 15 && deg <= 75) return <BsArrowDownLeft />

        if (deg > 76 && deg <= 105) return <BsArrowLeft />
        if (deg > 105 && deg <= 165) return <BsArrowUpLeft />

        if (deg > 166 && deg <= 195) return <BsArrowUp />
        if (deg > 195 && deg <= 255) return <BsArrowUpRight />

        if (deg > 255 && deg <= 285) return <BsArrowRight />
        if (deg > 285 && deg <= 345) return <BsArrowDownRight />

        return <BsArrowDown />
    }

    const getHumidity = (level: number): string => {
        if (level <= 55) return 'Dry and comfortable'
        if (level > 55 && level <= 65) return 'sticky feeling'

        return 'Lots of moisture'
    }

    const getPop = (value: number): string => {
        if (value <= 0.33) return 'Low probability'
        if (value > 0.33 && value <= 0.66) return 'Moderate probability'

        return 'High probability'
    }

    const getVisibility = (number: number): string => {
        if (number <= 50) return 'Dangerously foggy'
        if (number > 50 && number <= 500) return 'Expect heavy fog'
        if (number > 500 && number <= 2000) return 'Expect some fog'
        if (number > 2000 && number <= 9000) return 'Expect some haze'

        return 'Very clear day'
    }

    const back = (): void => {
        setData(null)
    }


    return (
        <>
            <button className="back" onClick={() => back()}>back</button>
            <div className="header">

                <div className="box">
                    <p className="time">{dateTime.formattedTime}</p>
                    <p className="data">{dateTime.formattedDay}</p>
                </div>
                <div className="box fells">
                    <p className="time">Feels like : <Degree temp={Math.round(today.main.feels_like)} /> </p>
                    <p className="">{today.weather[0].description}</p>
                </div>
                <div className="box city">
                    <p className="name">{data.city.name} - {data.city.country}</p>
                    <p className="daylight">length of daylight: {dayLength}</p>
                </div>
                <div className="box sun">
                    <div>
                        <div className="icon"><IoArrowUpCircle /></div>
                        <div className="text">
                            <p>Sunrise {sunrise} AM</p>
                            <span>{remainingTime(data.city.sunrise)}</span>
                        </div>
                    </div>
                    <div>
                        <div className="icon">
                            <IoArrowDownCircleSharp />
                        </div>
                        <div className="text">
                            <p> Sunset {sunset} PM</p>
                            <span>{remainingTime(data.city.sunset)}</span>
                        </div>
                    </div>
                </div>
                <div className="box">
                    <p className="sun ">Hight : <Degree temp={Math.ceil(today.main.temp_max)} /></p>
                    <p className="sun">Low : <Degree temp={Math.floor(today.main.temp_min)} /></p>
                </div>
                <div className="box">
                    <p className="title">wind <PiWindFill /></p>
                    {<p className="num">{`${Math.round(today.wind.speed * 0.5144)}`}<span>m/s  {getWindDirection(today.wind.deg)}</span></p> /* The number was multiplied by 0.5144 to convert from (Kt) To (m/s) */}
                </div>
                <div className="box">
                    <p className="title">Humidity <WiHumidity /></p>
                    <p className="num">{`${today.main.humidity}`}<span>%</span></p>
                    <p className="description">{`${getHumidity(today.main.humidity)}`}</p>
                </div>
                <div className="box">
                    <p className="title">Precipitation <IoRainySharp /></p>
                    <p className="num">{`${Math.round(today.pop * 100)}`}<span>%</span></p>
                    <p className="description">{`${getPop(today.pop)}`}</p>
                </div>
                <div className="box">
                    <p className="title">Visibility <IoMdEye /></p>
                    <p className="num">{`${(today.visibility / 1000).toFixed()}`}<span>km</span></p>
                    <p className="description">{`${getVisibility(today.visibility)}`}</p>
                </div>
            </div>



            <div className="temp">
                <div className="now">
                    <div>
                        <p className="text">Now</p>
                    </div>
                    <div className="img_num">
                        <img
                            alt={`weather-icon-${today.weather[0].description}`}
                            src={`http://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png`}
                        />
                        <p className="num"><Degree temp={Math.round(today.main.temp)} /></p>
                    </div>
                    <div>
                        <p className="description">{today.weather[0].main}</p>
                    </div>
                </div>
                <div className="other">
                    {data.list.map((item, index) => (
                        <>
                            {
                                new Date(item.dt * 1000).getHours() === 2 && index !== 0 &&
                                (<span className="line" ><span className="day">{convertTimezoneToDay(item.dt)}</span></span>)
                            }
                            < div className="item" key={index} >
                                {
                                    new Date(item.dt * 1000).getHours() > 11 ?
                                        (<p className="time">{new Date(item.dt * 1000).getHours() - 12} PM</p>)
                                        : (<p className="time">{new Date(item.dt * 1000).getHours()} AM</p>)
                                }
                                < img
                                    alt={`weather-icon-${item.weather[0].description}`}
                                    src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                                />
                                <p className="deg"><Degree temp={Math.round(item.main.temp)} /></p>
                            </div>
                        </>
                    ))}
                </div>
            </div >


        </>
    )
}

export default Forecast