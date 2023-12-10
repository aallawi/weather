import { useState } from "react"
import "./App.css";
import Search from "./components/Search";
import Forecast from "./components/Forecast";
import { dataType } from "./types";


const App = (): JSX.Element => {
  const [data, setData] = useState<dataType | null>(null)

  return (
    <div className="app">
      <div className="center">
        {data ? (<Forecast data={data} setData={setData} />) : (<Search setData={setData} />)}
      </div>
    </div>
  );
};

export default App;
