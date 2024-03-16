const Country = ({ country }) => {

    return (
        <div>
            <h2>{country.name.common}</h2>
            <p>capital: {country.capital[0]}</p>
            <p>population: {country.population}</p>
            <h3>languages: </h3>
            <ul>
                {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
            </ul>
            <img src={country.flags.svg} alt={'Flag'}/>
        </div>
    )
}

export default Country