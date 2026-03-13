import './App.css'
import NavBar from './components/NavBar'
import { Outlet, useNavigate} from 'react-router-dom'
import './index.css'
import Header from './components/Header'
import {useState, useEffect} from 'react'
import SkeletomComp from './components/SkeletomComp'
import FetchError from './components/FetchError'


function App() {

  const navigate=useNavigate()

  const [products, setProducts] = useState([])
  const [user, setUser] = useState(null)
  const [suppliers, setSuppliers]=useState([])
  const [orders,setOrders]=useState([])
  const [sales,setSales]=useState([])
  const [alerts,setAlerts]=useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)


  useEffect(()=>{

    async function loadData() {
      setLoading(true)
      try{
        const checkSessionRes=await fetch('/api/check_session')
        if(!checkSessionRes.ok) throw new Error('Not Authenticated')
        
          const userData=await checkSessionRes.json()
          // console.log(userData)
          setUser(userData)

          const [productsRes,suppliersRes, ordersRes,salesRes,alertsRes]=await Promise.allSettled([
            fetch('/api/products'),
            fetch('/api/suppliers'),
            fetch('/api/users/me/orders'), // user specific data
            fetch('/api/users/me/sales'),
            fetch('/api/alerts')
          ])

          const extractData=async(result)=>{
            if(result.status!=='fulfilled'||!result.value.ok) return []

            try{
              const json=await result.value.json()
              // console.log(json.data)
              // console.log(result.value)
              return json.data||[]
            }catch(err){
              console.log(err)
              return []
            }
          }

          setProducts(await extractData(productsRes))
          setOrders(await extractData(ordersRes))
          setSuppliers(await extractData(suppliersRes))
          setAlerts(await extractData(alertsRes))
          setSales(await extractData(salesRes))
      
      }catch(err){
        if(err.message=='Not Authenticated'){
          setUser(null)
          navigate('/login')
        }else{
          setError(err.message)
        }
      }finally{
        setLoading(false)
      }
    }
      
    loadData()
    
  },[navigate])

  async function handleProfileEdit(e, formObj){
    e.preventDefault()
    setSending(true)
    const configObj={
      method:'PATCH',
      headers:{
        "Content-Type":'application/json'
      },
      body:JSON.stringify(formObj)
    }
    formObj.id
    try{
      const r = await fetch(`/api/users/${encodeURIComponent(formObj.id)}`, configObj)
      
      if(!r.ok) throw new Error(`Error status: ${r.status}`)
        
      const resdata=await r.json()
      
      const updatedUserDta = resdata.data
      setUser(updatedUserDta)
      console.log("Success", updatedUserDta)
    }catch(error){
      console.log(error)
      setError(error.message)
    }finally{
      setSending(false)
    }
  }

  async function handleLogOut(){
    const configObj={
      method:'DELETE',
      headers:{'Content-Type':'application/json'}
    }
    try{
      const r = await fetch('/api/logout', configObj)
      if (!r.ok) throw new Error('Failed to LogOut')
        setUser(null)
        setAlerts([])
        setOrders([])
        setProducts([])
        setSuppliers([])
        setSales([])
        navigate('/login')
    }catch(err){
      setError(err.message)
    }
  }

  if (loading) return <SkeletomComp/>

  return (
    <>
    <main>
      <Header user={user}/>
      <section className='main-wrapper'>
        <aside><NavBar/></aside>
        { error
          ?<FetchError error={error}/>
          :<Outlet context={{
            user:user, 
            products:products,
            sales:sales,
            orders:orders,
            suppliers:suppliers,
            alerts:alerts,
            onProfileEdit:handleProfileEdit,
            onLogOut:handleLogOut,
            sending:sending
          }}/>
        }
      </section>
    </main>
    </>
  )
}

export default App
