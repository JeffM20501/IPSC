import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import { FaDollarSign, FaUser, FaChartLine, FaBox } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import './Analytics.css';

const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

function KPICard({ title, value, icon, chart }) {
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <div>
          <h4>{title}</h4>
          <p className="kpi-value">{value}</p>
        </div>
        <div className="kpi-icon">{icon}</div>
      </div>
      {chart && <div className="kpi-chart">{chart}</div>}
    </div>
  );
}

function Analytics() {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [customerGrowth, setCustomerGrowth] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);

  const { products } = useOutletContext();

  useEffect(() => {
    if (!products || products.length === 0) return;

    const monthlyRevenueTotals = {};
    const customerGrowthData = {};
    const categoryTotals = {};
    const productsRevenue = products.map((p) => {
      const totalRevenue = p.sales.reduce((sum, s) => sum + s.unitsSold * p.price, 0);
      categoryTotals[p.category] = (categoryTotals[p.category] || 0) + totalRevenue;

      p.sales.forEach((s) => {
        const month = s.date.substring(0, 7);
        monthlyRevenueTotals[month] = (monthlyRevenueTotals[month] || 0) + totalRevenue;
        customerGrowthData[month] = (customerGrowthData[month] || 0) + 1;
      });

      return { name: p.name, revenue: totalRevenue };
    });

    setMonthlyRevenue(
      Object.keys(monthlyRevenueTotals).map((m) => ({ month: m, revenue: monthlyRevenueTotals[m] }))
    );
    setTopProducts(productsRevenue.sort((a,b)=>b.revenue - a.revenue).slice(0,5));
    setCustomerGrowth(
      Object.keys(customerGrowthData).map((m)=>({ month: m, customers: customerGrowthData[m] }))
    );
    setSalesByCategory(
      Object.keys(categoryTotals).map((c)=>({ category: c, sales: categoryTotals[c] }))
    );
  }, [products]);

  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
  const totalCustomers = customerGrowth.reduce((sum, c) => sum + c.customers, 0);
  const topProduct = topProducts[0]?.name || "-";

  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--textColor').trim();
  const cardBg = getComputedStyle(document.documentElement).getPropertyValue('--cardBg').trim();

  const chartsData = [
    {
      title: "Monthly Revenue Trends",
      chart: (
        <LineChart data={monthlyRevenue}>
          <XAxis dataKey="month" stroke={textColor} />
          <YAxis stroke={textColor} />
          <Tooltip contentStyle={{ backgroundColor: cardBg, color: textColor }} labelStyle={{ color: textColor }} />
          <Line dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
        </LineChart>
      )
    },
    {
      title: "Top 5 Products by Revenue",
      chart: (
        <BarChart data={topProducts}>
          <XAxis dataKey="name" stroke={textColor} />
          <YAxis stroke={textColor} />
          <Tooltip contentStyle={{ backgroundColor: cardBg, color: textColor }} labelStyle={{ color: textColor }} />
          <Legend wrapperStyle={{ color: textColor }} />
          <Bar dataKey="revenue" fill="#10B981" radius={5} />
        </BarChart>
      )
    },
    {
      title: "Customer Growth",
      chart: (
        <AreaChart data={customerGrowth}>
          <XAxis dataKey="month" stroke={textColor} />
          <YAxis stroke={textColor} />
          <Tooltip contentStyle={{ backgroundColor: cardBg, color: textColor }} labelStyle={{ color: textColor }} />
          <Area dataKey="customers" stroke="#F59E0B" fill="rgba(245,158,11,0.2)" />
        </AreaChart>
      )
    },
    {
      title: "Sales by Category",
      chart: (
        <PieChart>
          <Pie data={salesByCategory} dataKey="sales" nameKey="category" outerRadius={80} label>
            {salesByCategory.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: cardBg, color: textColor }} labelStyle={{ color: textColor }} />
          <Legend wrapperStyle={{ color: textColor }} />
        </PieChart>
      )
    }
  ];

  return (
    <div className="analytics-page">
      <h1>Sales & Performance Analytics</h1>

      <div className="kpi-grid">
        <KPICard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={<FaDollarSign />}
          chart={
            <ResponsiveContainer width="100%" height={50}>
              <LineChart data={monthlyRevenue}>
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          }
        />
        <KPICard
          title="Total Customers"
          value={totalCustomers}
          icon={<FaUser />}
          chart={
            <ResponsiveContainer width="100%" height={50}>
              <AreaChart data={customerGrowth}>
                <Area type="monotone" dataKey="customers" stroke="#F59E0B" fill="rgba(245,158,11,0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          }
        />
        <KPICard title="Top Product" value={topProduct} icon={<FaChartLine />} />
        <KPICard title="Categories Sold" value={salesByCategory.length} icon={<FaBox />} />
      </div>

      <div className="charts-grid">
        {chartsData.map((c, i) => (
          <div className="card" key={i}>
            <h3>{c.title}</h3>
            <div className="chart-card-container">
              <ResponsiveContainer width="100%" height="100%">
                {c.chart}
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Analytics;