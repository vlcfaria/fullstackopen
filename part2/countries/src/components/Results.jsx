import Country from './Country'

const Results = ({ data, setSelCountries }) => {
    if(data.length == 1) {
        return <Country country={data[0]} />
    }

    if(data.length > 10) {
        return <p>Too many matches, specify another filter</p>
    }

    if(data.length > 1) {
        return (
            <ul>
                {data.map(country => 
                <li key={country.name.common}>
                    {country.name.common} 
                    <button onClick={() => setSelCountries([country])}>
                        show
                    </button>
                </li>)}
            </ul>
        )
    }
}

export default Results