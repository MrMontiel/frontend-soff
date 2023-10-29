'use client'

import { Supply } from '../models/supply.models'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { useEffect } from 'react'
import { RoutesApi } from '@/models/routes.models'
import useSWR, { mutate} from 'swr'
import { fetcherPut } from '@/context/swr-context-provider/SwrContextProvider'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

const DisableSupplyFetch = async (url: string, arg: Supply) => {
    return await fetcherPut(url, arg)
}

interface Props {
    supply: Supply
  }

export default function DisableSupply({supply}: Props) {
    async function onSubmit() {
        const res = await DisableSupplyFetch(`${RoutesApi.SUPPLIES}/${supply.id}/status_update_supply`, supply)
        mutate (RoutesApi.SUPPLIES)
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                <Button className={`h-5 w-20 text-xs font-semibold bg-${supply.status ? "green" : "red"}-500 hover:bg-gray-700`} onClick={onSubmit}>{supply.status ? "Activo" : "Inactivo"}</Button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-500">
                <p className="text-xs font-semibold">Aquí puedes cambiar el estado a: {!supply.status ? "Activo" : "Inactivo"}.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}