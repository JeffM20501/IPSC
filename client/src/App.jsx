import './App.css'
import NavBar from './components/NavBar'
import { Outlet} from 'react-router-dom'
import './index.css'
import Header from './components/Header'
import {useState, useEffect} from 'react'
import SkeletomComp from './components/SkeletomComp'
import FetchError from './components/FetchError'
import Login from './pages/Login/Login'

function App() {
  const [products, setProducts] = useState([])
  const [user, setUser] = useState(null)
  const [suppliers, setSuppliers]=useState([])
  const [orders,setOrders]=useState([])
  const [sales,setSales]=useState([])
  const [alerts,setAlerts]=useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)


  useEffect(()=>{

    async function loadData() {
      try{
        const checkSessionRes=await fetch('/api/check_session')
        if(!checkSessionRes) throw new Error('Not Authenticated')
        
          const userData=await checkSessionRes.json()
          setUser(userData)

          const [productsRes,suppliersRes, ordersRes,salesRes,alertsRes]=await Promise.all([
            fetch('/api/products'),
            fetch('/api/suppliers'),
            fetch('/api/orders'),
            fetch('/api/sales'),
            fetch('/api/alerts')
          ])

          const extractData=async(result)=>{
            if(result.value.ok){
              const json=await result.value.json()
              return json.data||[]
            }
            return []
          }

          setProducts(await extractData(productsRes))
          setOrders(await extractData(ordersRes))
          setSuppliers(await extractData(suppliersRes))
          setAlerts(await extractData(alertsRes))
          setSales(await extractData(salesRes))
          setOrders(await extractData(ordersRes))
      }
      catch(err){
        if(err.message=='Not Authenticated'){
          return
        }else{
          setError(err.message)
        }
      }
      finally{
        setLoading(false)
      }
    }
  
    fetch('/api/check_session')
      .then(r=>{
        if (!r.ok) throw new Error('Not Authenticated')
        return r.json()  //get user 
        
      })
      
      loadData()
    
  },[])

  async function handleProfileEdit(e, formObj){
    e.preventDefault()
    setSending(prev=>!prev)
    const configObj={
      method:'PATCH',
      headers:{
        "Content-Type":'application/json'
      },
      body:JSON.stringify(formObj)
    }
    try{
      const r = await fetch(`/api/users/${encodeURIComponent(formObj.id)}`, configObj)
      
      if(!r.ok){
          throw new Error(`Error status: ${r.status}`)
        }
      
        const updatedUserDta = await r.json()
      setUser(updatedUserDta)
      console.log("Success", updatedUserDta)
    }catch(error){
      console.log(error)
      setError(error.message)
    }finally{
      setSending(prev=>!prev)
    }
  }

  if (loading) return <SkeletomComp/>

  if(!user) return <Login onLogin={setUser}/>

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
            sending:sending
          }}/>
        }
      </section>
    </main>
    </>
  )
}

export default App
