'use client'

import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from '@/context/auth-context/AuthContextProvider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BellIcon, BellAlertIcon } from '@heroicons/react/24/outline'
import {ExclamationCircleIcon, XMarkIcon} from '@heroicons/react/24/outline'
import { RoutesApi } from '@/models/routes.models'
import useSWR from 'swr'
import { ScrollArea } from "@/components/ui/scroll-area"


export default function Profile() {
  const {user, logout} = useAuth()
  const router = useRouter()
  const {data: supplies} = useSWR(RoutesApi.SUPPLIES)
  const [open, setOpen] = React.useState(false)

  return (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant='ghost' size='icon'>
                <BellIcon className='w-4 h-4' />
            </Button>
        </PopoverTrigger>
        <PopoverContent align='end' className='dark:bg-neutral-900 sm:w-96 mt-3 text-sm'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2 w-fit py-2 rounded relative'>
                  <BellAlertIcon className='w-6 h-6'/>
              </div>
              <div>
                <p className='font-semibold capitalize'>Notificaciones del sistema</p>
              </div>
            </div>
            <hr className='mt-4' />
            <div className='my-2'>
                <ScrollArea className={`h-[200px] ${open ? 'open' : ''} `}>
                {
                Array.isArray(supplies) && supplies.map((supply) => {
                    if (supply.quantity_stock <= 5000 && supply.quantity_stock >0 &&supply.unit_measure == 'Gramos' && supply.status == true) {
                    return (
                        <span key={supply.id} className={`flex w-full items-center text-neutral-700 gap-2 rounded cursor-pointer px-3 py-4 hover:bg-gray-100 dark:hover-bg-neutral-700`}>
                        <ExclamationCircleIcon className='w-6 h-6 stroke-yellow-600' />
                        <p><strong>{supply.name}:</strong> Este insumo está cerca de terminarse.</p>
                        </span>
                    );
                    } 
                    if (supply.quantity_stock <= 40 && supply.quantity_stock>0 &&supply.unit_measure == 'Unidades' && supply.status ==true){
                    return(
                        <span  key={supply.id} className={`flex w-full items-center text-neutral-700 gap-2 rounded cursor-pointer px-3 py-4 hover:bg-gray-100 dark:hover-bg-neutral-700`}>
                        <ExclamationCircleIcon className='w-6 h-6 stroke-yellow-600' />
                        <p><strong>{supply.name}:</strong> Este insumo está cerca de terminarse.</p>
                        </span>
                    )
                    }
                    if (supply.quantity_stock == 0  && supply.status ==true){
                    return(
                        <span key={supply.id}  className={`flex w-full items-center text-neutral-700 gap-2 rounded cursor-pointer px-3 py-4 hover:bg-gray-100 dark:hover:bg-neutral-700`}>
                            <XMarkIcon className='w-6 h-6 stroke-red-600' />
                            <p><strong>{supply.name}:</strong> Este insumo no está disponible, recuerda comprar. </p>
                        </span>
                    )
                    }
                })
                }
                </ScrollArea>
            </div>
        </PopoverContent>
    </Popover>
  )
}
