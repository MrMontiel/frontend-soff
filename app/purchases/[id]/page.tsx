
import React from 'react'
import { InfoPurchase, TableOrders } from './components'
import { HeaderModule } from '../components'

// function getTotalOrders(orders:Order[]) {
//   let total:number = 0
//   orders.forEach((order) => {
//     total += order.subtotal
//   })
//   return total
// }

export default async function Page({params}:{params: {id: string}}) {
  
  return (
    <div className="mx-auto max-w-7xl p-4">
      <HeaderModule />
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4'>
        <div className='relative w-full bg-white col-span-12 md:col-start-1 md:col-end-4 border rounded'>
          <InfoPurchase  id={params.id} />
        </div>
        <div className='w-full bg-white col-span-12 md:col-start-4 md:col-end-13'>
          <TableOrders id={params.id}/>
        </div>
      </div>
    </div>
  )
}
