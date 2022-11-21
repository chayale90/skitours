import { useContext } from 'react'
import AppContext from 'front/contexts/AppContext'

const useApp = () => useContext(AppContext)

export default useApp