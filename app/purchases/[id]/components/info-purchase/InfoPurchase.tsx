'use client'
import { PurchaseConfirm, Order, Purchase } from '@/app/purchases/models/purchase.models'
import { fetcherPut, fetcherDelete} from '@/context/swr-context-provider/SwrContextProvider'
import { RoutesApi } from '@/models/routes.models'
import { convertToCOP } from '@/app/purchases/utils'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BanknotesIcon, CreditCardIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import { HeadTable } from '@/app/providers/components'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"
import { cn } from "@/lib/utils"
import {Command,CommandEmpty,CommandGroup,CommandInput,CommandItem,} from "@/components/ui/command"
import { Popover,PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"

const formPurchaseSchema = z.object({
  provider_id: z.string(),
  invoice_number: z.string()
})

interface Props{
  id: string
}
const clculateTotal = (orders: Array<Order>) => {
  let total = 0
  if(orders !== undefined){
    orders.map(order => {
      total += order.subtotal
    })
  }
  return total
}

const ConfirmPurchaseFetch = async (url: string, arg: PurchaseConfirm) => {
  return await fetcherPut(url, arg)
}

const CancelPurchaseFetch = async (url: string) => {
  return await fetcherDelete(url)
}

export default function InfoPurchase({id}:Props) {
  const {data:providers} = useSWR(`${RoutesApi.PROVIDERS}`)
  const [open, setOpen] = React.useState(false)
  const {data:orders} = useSWR(`${RoutesApi.PURCHASES}/${id}/orders`)
  const {data: purchase} = useSWR<Purchase>(`${RoutesApi.PURCHASES}/${id}`)
  const router = useRouter()
  const { toast } = useToast()
  const [date, setDate] = React.useState<Date>()
  
  const formPurchase = useForm<z.infer<typeof formPurchaseSchema>>({
    resolver: zodResolver(formPurchaseSchema),
    defaultValues: {
      provider_id: '',
      invoice_number: ''
    }
  })

  async function onSubmitPurchase(values: z.infer<typeof formPurchaseSchema>){

    const purchase = {
      purchase_date: date,
      provider_id: values.provider_id,
      invoice_number: values.invoice_number
    }
    
    const res = await ConfirmPurchaseFetch(`${RoutesApi.PURCHASES}/${id}/confirm-purchase`, purchase)
    toast({variant: 'default', title: "Compra confirmada", description: "Se ha confirmado con exito la compra, mira el historial en la sección de compras."})
    router.push('/purchases')
  }

  return (
    <div className='w-full'>
      <div className='w-full text-center mt-1 mb-1 p-4'>
        <h3 className='font-bold'>MANDISA</h3>
        <p className='text-sm text-gray-400'>NIT 71227771-4</p>
        <p className='text-sm text-gray-400'>Navarra/Bello</p>
        <p className='text-sm text-gray-400'>(+57) 3146486791</p>
      </div>
      <hr />
      <Form {...formPurchase}>
        <form onSubmit={formPurchase.handleSubmit(onSubmitPurchase)} className='p-4 h-full flex flex-col justify-between'>
          <div>
          <div className='mb-5'>
          <FormField 
            control={formPurchase.control}
            name="invoice_number"
            render ={({field}) => (
              <FormItem>
                <FormLabel>Fecha de Compra:</FormLabel>
                <FormControl >
                    {/* <Input placeholder='Número de factura'{...field} required/> */}
                    <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[265px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Seleccionar fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={formPurchase.control}
            name="invoice_number"
            render ={({field}) => (
              <FormItem>
                <FormLabel>Número de Factura:</FormLabel>
                <FormControl >
                    <Input placeholder='Número de factura'{...field} required/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formPurchase.control}
            name="provider_id"
            render={({ field }) => (
              <FormItem className="w-full md:w-[260px]">
              <FormLabel>Proveedor</FormLabel>
              
              <div className="w-full xl:w-[260px]">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[260px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? providers?.find((provider_id:any)=>provider_id.id === field.value)?.name
                          : "Seleccione proveedor"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] h-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar proveedor..." />
                        <CommandEmpty>Sin resultados.</CommandEmpty>
                        <CommandGroup>
                          {Array.isArray(providers) && providers.map((provider) => (
                            <CommandItem
                              value={provider.name}
                              key={provider.id}
                              onSelect={() => {
                                formPurchase.setValue("provider_id", provider.id)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  provider.id === field.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {provider.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='mt-4 space-y-2'>
            {/* <UserPlusIcon className="h-4 w-4" /> */}
            <HeadTable/>
          </div> 

          </div>
            <div className='my-3 w-full text-center'>
              <p className='font-bold text-4xl'>${convertToCOP(clculateTotal(orders !== undefined ? orders : [] ))}</p>
              <p className='text-sm text-gray-400'>Total</p>
            </div>
          </div>
          
          <div className='mt-4 space-y-2'>
            <Button className="w-full" type='submit' >
              Consolidar compra
            </Button>
          </div>
          

          <div className='mt-4 space-y-2'>
            <Button className="w-full" variant='outline' onClick={async () => {
              const res = await CancelPurchaseFetch(`${RoutesApi.PURCHASES}/${id}/deletepurchase`)
              toast({variant: 'default', title: "Compra cancelada correctamente", description: "Se ha eliminado la compra con éxito."})
              router.push("/purchases")
            }}>
              Cancelar compra
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
