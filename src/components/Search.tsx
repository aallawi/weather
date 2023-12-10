import { ChangeEvent, useRef, useState } from "react"
import { dataType, optionType } from "../types/index"
import { FaSearchLocation } from "react-icons/fa";


// interface ImportMetaEnv {
//     VITE_API_KEY: string;
// }

// interface ImportMeta {
//     env: ImportMetaEnv;
// }


const Search = ({ setData }: { setData: React.Dispatch<React.SetStateAction<dataType | null>> }) => {
    const BASE_URL = "http://api.openweathermap.org"
    const RefSearch = useRef<HTMLButtonElement | null>(null);

    const [term, setTerm] = useState<string>("")
    const [city, setCity] = useState<optionType | null>(null)
    const [options, setOptions] = useState<[]>([])

    // fetch Options
    const fetchOptions = async (term: string) => {
        const newTerm = term.replace(/^\s+/, '');
        if (newTerm !== "") {
            try {
                // const response = await fetch(`${BASE_URL}/geo/1.0/direct?q=${newTerm.trim()}&limit=5&lang=en&appid=${import.meta.env.VITE_API_KEY}`);
                const response = await fetch(`${BASE_URL}/geo/1.0/direct?q=${newTerm.trim()}&limit=5&lang=en&appid="13551b69b7558210ad237a5d25848eaf"`);
                const data = await response.json();
                setOptions(data);
            } catch (error) {
                alert(error);
            }
        }
    }

    // fetch Data
    const fetchCountryData = async (city: optionType) => {
        try {
            const response = await fetch(`${BASE_URL}/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=metric&lang=en&appid="13551b69b7558210ad237a5d25848eaf"`);
            const data = await response.json();
            setData({ city: data.city, list: data.list })
        } catch (error) {
            alert(error);
        }
    }

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setTerm(value)
        if (value) {
            fetchOptions(value)
        } else {
            setOptions([])
        }
    }

    const onOptionSelect = (option: optionType) => {
        setCity(option)
        setOptions([])
        if (city && typeof city.name === 'string') {
            setTerm(city.name)
        }
        // setTerm(city.name) 
        setTimeout(() => {
            if (RefSearch.current) {
                RefSearch.current.click();
            }
        }, 500);
    }

    // useEffect(() => {
    //     if (city && typeof city.name === 'string') {
    //         setTerm(city.name)
    //     }
    // }, [city])

    const onSubmit = () => {
        if (city) {
            fetchCountryData(city)
        }
    }

    // Get Location
    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setCity({
                        lat: latitude,
                        lon: longitude
                    })
                    setTimeout(() => {
                        if (RefSearch.current) {
                            RefSearch.current.click();
                        }
                    }, 500);
                },
                (error) => {
                    // alert('Error getting location:', error.message);
                    alert('Error getting location:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };


    return (
        <div className="search">
            <h1>Weather App</h1>
            <button onClick={handleGetLocation} className="btn"><span>current location</span></button>
            <div className="input">
                <input type="text"
                    value={term}
                    onChange={onInputChange}
                />
                <button ref={RefSearch} onClick={onSubmit} ><FaSearchLocation /></button>
            </div>
            <ul className="options">
                {options.length === 0 ? (<p>Type the name of the city in which you want to know the weather.</p>) : (options.map((option: optionType, index: number) => (
                    <li key={index}>
                        <button onClick={() => onOptionSelect(option)}>{option.name} - {option.country}</button>
                    </li>
                )))}
            </ul>
        </div>
    )
}

export default Search