export type optionType = {
  name?: string
  country?: string
  lat: number
  lon: number
}

export type dataType = {
  city : {
    name: string
    country: string
    sunrise: number
    sunset: number
    population: number
    timezone: number
  }
  list: [
    {
      dt: number
      main: {
        feels_like: number
        humidity: number
        pressure: number
        temp: number
        temp_max: number
        temp_min: number
      }
      weather: [
        {
          main: string
          icon: string
          description: string
        }
      ]
      wind: {
        speed: number
        gust: number
        deg: number
      }
      clouds: {
        all: number
        // dt: number
        // dt_txt: string
      }
      pop: number
      visibility: number
    }
  ]
}
