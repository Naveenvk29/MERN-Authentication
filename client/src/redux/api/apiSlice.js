import {createApi,fetchBaseQuery} from "@reduxjs/toolkit"
import {BASE_URL} from "../constants"

const baseQuery=fetchBaseQuery({baseUrl:BASE_URL})

export const apiSlice= createApi({
    baseQuery,
    endpoints:()=>({})
})
