import { useState, useEffect } from 'react'

const App = () => {
  const [dogs, setDogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('')
  const [allBreeds, setAllBreeds] = useState([])

  // Fetch all breeds for the filter dropdown
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch('https://dog.ceo/api/breeds/list/all')
        const data = await response.json()
        const breeds = Object.keys(data.message)
        setAllBreeds(breeds)
      } catch (err) {
        setError('Failed to fetch breeds')
      }
    }
    fetchBreeds()
  }, [])

  // Fetch random dog images
  const fetchDogs = async () => {
    setLoading(true)
    setError(null)
    try {
      let url = 'https://dog.ceo/api/breeds/image/random/5'
      if (filter) {
        url = `https://dog.ceo/api/breed/${filter}/images/random/5`
      }
      
      const response = await fetch(url)
      if (!response.ok) throw new Error('Network response was not ok')
      
      const data = await response.json()
      setDogs(data.message)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDogs()
  }, [filter])

  const handleRefresh = () => {
    fetchDogs()
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">Dog Breed Explorer</h1>
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full sm:w-64">
          <label htmlFor="breed-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Breed:
          </label>
          <select
            id="breed-filter"
            value={filter}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Breeds</option>
            {allBreeds.map(breed => (
              <option key={breed} value={breed}>
                {breed.charAt(0).toUpperCase() + breed.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh Dogs'}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          Error: {error}
        </div>
      )}

      {loading && !error ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {dogs.map((dog, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src={dog}
                alt={`Random dog ${index + 1}`}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://via.placeholder.com/300?text=Dog+Image+Not+Found'
                }}
              />
              <div className="p-3 bg-white">
                <p className="text-sm text-gray-600">
                  Breed: {dog.split('/')[4].replace('-', ' ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
