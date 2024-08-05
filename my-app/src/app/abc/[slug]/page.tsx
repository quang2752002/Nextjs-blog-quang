"use client";

import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';


const Detail=(props:any)=>{
    const searchParams = useSearchParams();
    console.log(props.params.slug)
    
    return(
        <div>
            abc
        </div>
    )
}
export default Detail;