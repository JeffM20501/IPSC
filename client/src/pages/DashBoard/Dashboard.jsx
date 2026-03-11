import React from 'react'
import { useOutletContext } from 'react-router-dom'
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
  const {user, products} = useOutletContext()

  // variables
  const safeCheckProducts=products||[]

  const filteredProducts=safeCheckProducts.filter(pro=>{
    if(filter==="") return true
    return pro.category === filter
  }) 

  const nonDuplicateCategory = [... new Set(safeCheckProducts.map(item=>item.category))]//avoid duplicates

  // functions
  function handleFilter(filter){
    setFilter(filter)
  }

  function calculateSummary(data){
        let TotalStock = 0
        let totalDemand = 0
        let totalSales = 0 
        let totalAlerts = 0
        data.forEach(item=>{
        totalDemand+=item.demand_forecast||0
        TotalStock+=item.stock||0
        if(item.alerts&&item.alerts.length>0){
            totalAlerts+=item.alerts.length
        }
        if(item.sales&&item.sales.length>0){
            totalSales+=item.sales.reduce((sum, sales)=>sum+sales.unitsSold,0)
        }
        })
        return {TotalStock, totalDemand, totalSales, totalAlerts}
    }
    const {TotalStock, totalDemand, totalSales, totalAlerts} = calculateSummary(products)

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