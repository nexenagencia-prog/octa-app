import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function supabaseServer(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!anon) return null;
  const store=await cookies();
  return createServerClient(url,anon,{
    cookies:{
      getAll(){return store.getAll();},
      setAll(values: Array<{ name: string; value: string; options?: Parameters<typeof store.set>[2] }>){
        try{values.forEach(({name,value,options})=>store.set(name,value,options));}catch{}
      }
    }
  });
}
