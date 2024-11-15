import { Waiting } from "@/components/Waiting"

export default async ({params, searchParams}: {params: any, searchParams: Promise<{name: string}>}) => {
  const {id} = await params
  const {name} = await searchParams
  return <Waiting name = {name} id = {id}/>
}