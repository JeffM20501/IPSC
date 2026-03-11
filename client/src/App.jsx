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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)


  useEffect(()=>{
  
    fetch('/api/check_session')
      .then(r=>{
        if (!r.ok) throw new Error('Not Authenticated')
        return r.json()  //get user 
        
      })
      .then(user=>{
        setUser(user)
        return fetch('/api/products')
      })
        .then(r=>{
          if(!r.ok) throw new Error('Error when Fetching products')
          return r.json()
        })
        .then(products=>{
          setProducts(products.data||[])
          setLoading(false)
        })
        .catch(err=>{
          console.warn('Could not load products', err.message)
          setProducts([])
        })
      .catch(err=>{
        if (err.message==='Not Authenticated'){
          setLoading(false)
        }else{
          setError(err.message)
          setLoading(false)
        }
      })
      .finally(()=>{
        setLoading(false)
      })
    
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
