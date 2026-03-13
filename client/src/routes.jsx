import App from './App'
import Settings from './pages/SettingsPage/SettingsPage'
import ProductPage from './pages/ProductPage/ProductPage'
import Dashboard from './pages/DashBoard/Dashboard'
import Alerts from './pages/Alerts/Alerts'
import Forecast from './pages/Forecast/Forecast'
import Analytics from './pages/Analytics/Analytics'
import ErrorPage from './pages/ErrorPage/ErrorPage'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import PublicLayout from './PublicLayout'

const routes = [
    {
        element:<PublicLayout/>,
        children:[
            {
                path:'/login',
                element:<Login/>
            },
            {
                path:'/signup',
                element:<SignUp/>
            }
        ]
    },
    {
        // path:"/",
        element:<App/>,
        errorElement:<ErrorPage/>,
        children:[
            {
                path:"/",
                element:<Dashboard/>
            },
            {
                path:"/products",
                element:<ProductPage/>
            },
            {
                path:"/analytics",
                element:<Analytics/>
            },
            {
                path:"/forecast",
                element:<Forecast/>
            },
            {
                path:"/alerts",
                element:<Alerts/>
            },
            {
                path:"/settings",
                element:<Settings/>
            },
        ]
    }
]

export default routes