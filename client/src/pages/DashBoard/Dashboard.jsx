import React from 'react'
import { useOutletContext,Navigate } from 'react-router-dom'
import './Dashboard.css'
import DashBoardInventory from './components/DashBoardInventory'
import Selector from './components/Selector'
import { useState } from 'react'
import DashForecast from './components/DashForecast'
import Barchart from './components/Barchart'

function Dashboard() {
  //states
  const [filter, setFilter] = useState('')

  // context
  const {user, products, alerts, sales} = useOutletContext()
  if(!user) return <Navigate to='/login'/>

  // variables
  const safeCheckProducts=products||[]

  const filteredProducts=safeCheckProducts.filter(pro=>{
    if(filter==="") return true
    return pro.category === filter
  }) 

  const nonDuplicateCategory = [... new Set(safeCheckProducts.map(item=>item.name||'Electronics'))]//avoid duplicates
  // console.log(nonDuplicateCategory)

  // functions
  function handleFilter(filter){
    setFilter(filter)
  }

  function calculateSummaryProducts(data){
        let TotalStock = 0
        let totalDemand = 0
        data.forEach(item=>{
        totalDemand+=item.demand_forecast||0
        TotalStock+=item.stock||0
        })
        return {TotalStock, totalDemand}
    }
    const {TotalStock, totalDemand} = calculateSummaryProducts(products)

    function calculateSummaryAlerts(data){
      let totalAlerts=0
      if(data&&data.length>0){
        totalAlerts+=data.length
      }
      return totalAlerts
    }
    const totalAlerts=calculateSummaryAlerts(alerts)

    function calculateSummarySales(data){
      let totalSales=0
      if(data&&data.length>0){
        totalSales+=data.reduce((sum, sales)=>sum+sales.unitsSold,0)
      }
      return totalSales
    }
    const totalSales=calculateSummarySales(sales)



  return (
    <>
    <main className='dashboard-main'>
      <div className='dashboard-head'>
        <h1>Invertory OverView</h1>
        <h2>Hello <span>{user.fullname}</span>👋. Welcome back!!</h2>
      </div>
      <DashForecast TotalStock={TotalStock} totalDemand={totalDemand} totalSales={totalSales} totalAlerts={totalAlerts}/>
      <section className='dashboard-chart'>
        <h3>Stocks Chart</h3>
        <Barchart products={products}/>
      </section>
      <section>
        <h3>Inventrory Table</h3>
        <Selector nonDuplicateCategory={nonDuplicateCategory} onFilter={handleFilter}/>
        <DashBoardInventory filteredProducts={filteredProducts}/>
      </section>
    </main>
    </>
  )
}

export default Dashboard