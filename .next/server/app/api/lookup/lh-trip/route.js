"use strict";(()=>{var e={};e.id=2050,e.ids=[2050],e.modules={72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},92761:e=>{e.exports=require("node:async_hooks")},89176:(e,t,r)=>{r.a(e,async(e,o)=>{try{r.r(t),r.d(t,{originalPathname:()=>m,patchFetch:()=>u,requestAsyncStorage:()=>c,routeModule:()=>l,serverHooks:()=>_,staticGenerationAsyncStorage:()=>d});var a=r(49303),s=r(88716),n=r(60670),i=r(78874),p=e([i]);i=(p.then?(await p)():p)[0];let l=new a.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/lookup/lh-trip/route",pathname:"/api/lookup/lh-trip",filename:"route",bundlePath:"app/api/lookup/lh-trip/route"},resolvedPagePath:"C:\\Users\\phlspxuser\\Documents\\Mrkcde\\Ongoing\\soc5-internalTool\\src\\app\\api\\lookup\\lh-trip\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:c,staticGenerationAsyncStorage:d,serverHooks:_}=l,m="/api/lookup/lh-trip/route";function u(){return(0,n.patchFetch)({serverHooks:_,staticGenerationAsyncStorage:d})}o()}catch(e){o(e)}})},78874:(e,t,r)=>{r.a(e,async(e,o)=>{try{r.r(t),r.d(t,{GET:()=>u});var a=r(87070),s=r(75748),n=r(95456),i=r(69026),p=e([s,n]);[s,n]=p.then?(await p)():p;let u=(0,i.g)("/api/lookup/lh-trip",async e=>{if(!await (0,n.Gg)())return a.NextResponse.json({error:"Unauthorized"},{status:401});let{searchParams:t}=new URL(e.url),r=t.get("lhTrip")||t.get("lh_trip"),o=r?.trim().toUpperCase();if(!o)return a.NextResponse.json({error:"lhTrip is required"},{status:400});let i=await (0,s.I)(`SELECT
       trip_number AS lh_trip_number,
       NULL::text AS cluster_name,
       MAX(to_dest_station_name) AS station_name,
       NULL::text AS region,
       NULLIF(
         STRING_AGG(DISTINCT to_number, ', ') FILTER (WHERE to_number IS NOT NULL),
         ''
       ) AS count_of_to,
       COALESCE(SUM(to_parcel_quantity), 0)::int AS total_oid_loaded,
       NULL::timestamptz AS actual_docked_time,
       NULL::text AS dock_number,
       MAX(departure_timestamp) AS actual_depart_time,
       NULL::text AS processor_name,
       MAX(vehicle_number) AS plate_number,
       MAX(truck_size) AS fleet_size,
       NULL::text AS assigned_ops_id,
       MAX(dispatch_date) AS source_updated_at,
       MAX(updated_at) AS updated_at
     FROM dispatch_google_sheet_rows
     WHERE trip_number = $1
     GROUP BY trip_number`,[o]);return a.NextResponse.json({row:i.rows[0]||null})});o()}catch(e){o(e)}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[9276,5972,5456],()=>r(89176));module.exports=o})();