import React from "react";
import { Tooltip } from '@mui/material'
import { Routes } from '@/models/routes.models'
import Link from "next/link";
import { Button } from '@/components/ui/button'
import { ArrowSmallLeftIcon } from '@heroicons/react/24/outline'
import { MoveLeft } from "lucide-react";


export function HeaderModuleManual() {
    return (
        <div className='w-full flex justify-between items-center'>
            <div className='mb-5'>
            <p className='scroll-m-20 text-3xl font-extrabold tracking-tight transition-colors first:mt-0'>Manual de usuario</p>
            <p className="leading-7 [&:not(:first-child)]:mt-1 text-gray-500">Este manual le guiará en la navegación del módulo de Usuarios.</p>
            </div>
            <div className='flex justify-end mr-5'>
            <Tooltip placement="top" title="Volver a Roles." arrow>
                <Link href={`${Routes.USERS}`} >  
                <Button variant="outline" size='icon'>
                    <MoveLeft size={16} color="#6f6f6f"/>
                </Button>
                </Link>
            </Tooltip>
            </div>
        </div>
    )
  }