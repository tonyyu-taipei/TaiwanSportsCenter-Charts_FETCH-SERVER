import { MongoClient } from 'mongodb'
import './loadEnv.js'
const uri = process.env.MONGODB;
const mongo = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const api_url = "https://booking.tpsc.sporetrofit.com/Home/loadLocationPeopleNum"
const lkapi = "https://lkcsc.cyc.org.tw/api"
const tyapi = "https://tycsc.cyc.org.tw/api"
const scapi = "http://www.scsports.com.tw/proxy1.php"
const lzapi = "https://lzcsc.cyc.org.tw/api"
const xzapi = "https://www.xzsports.com.tw/parser.php"
const pqapi = "https://pqfitness.fitbutler.tw/?d=app&m=getMemberCounter&c=company"
const rfapi = "https://refine.fitbutler.tw/?d=app&m=getMemberCounter&c=company"
const zbapi = "https://www.zbsports.com.tw/proxy1.php"
const afapi = `https://17fit.com/appapi/v1.0.0/branch/448/people_flow?agent_token=${process.env.AGGtoken}`

import https from "https"
const options = {
  agent: new https.Agent({
    rejectUnauthorized: false
  })
};
import fetch from 'node-fetch';

    const date = new Date()

    if ((date.getHours() < 22) && (date.getHours() >= 6)) {
        let res = await fetch(api_url, {
            method: 'post',
            agent: new https.Agent({
                rejectUnauthorized: false,
              })
        })

        let list = [];
        let numList = { time: date, locationPeople: [] };
        let data = await res.json()
        await data.locationPeopleNums.forEach(val => {
            list.push({ short: val.LID, name: val.lidName })
            numList.locationPeople.push({ short: val.LID, peoNum: parseInt(val.gymPeopleNum), maxPeo:parseInt(val.gymMaxPeopleNum) })
        })
        let resLK = await fetch(lkapi,{method:'get'})
        let dataLK = await resLK.json();
        numList.locationPeople.push({short:"LKSC",peoNum:parseInt(dataLK.gym[0]),maxPeo:parseInt(dataLK.gym[1])})
        let resTY = await fetch(tyapi,{method:'get'})
        let dataTY = await resTY.json();
        numList.locationPeople.push({short:"TYSC",peoNum:parseInt(dataTY.gym[0]),maxPeo:parseInt(dataTY.gym[1])})
        let resSC = await fetch(scapi,{method:'get'})
        let dataSC = await resSC.json();
        numList.locationPeople.push({short:"SCSC",peoNum:parseInt(dataSC.gym[0]),maxPeo:parseInt(dataSC.gym[1])})
        try{
            let resLZ = await fetch(lzapi,{method:'get'})
            let dataLZ = await resLZ.json();
            numList.locationPeople.push({short:"LZSC",peoNum:parseInt(dataLZ.gym[0]),maxPeo:parseInt(dataLZ.gym[1])})
        }catch(e){
            console.log(e)
        }
        try{
            let resXZ = await fetch(xzapi,{method:'get'})
            let dataXZ = await resXZ.text();
            let resPQ = await fetch(pqapi,{method:'post'})
            let dataPQ = await resPQ.json();
            numList.locationPeople.push({short:"PQFN",peoNum:parseInt(dataPQ.data[0].rooms[0].count),maxPeo:parseInt(dataPQ.data[0].rooms[0].limit)})
            let XZ = await dataXZ.split(',')
            numList.locationPeople.push({short:"XZSC",peoNum:parseInt(XZ[0]),maxPeo:150})
        }
        catch(e){
            console.log(e)
        }
         try{
         let resRF = await fetch(rfapi,{method:'post'})
         let dataRF = await resRF.json();
         numList.locationPeople.push({short:"RFFN",peoNum:parseInt(dataRF.data[0].rooms[0].count),maxPeo:parseInt(dataRF.data[0].rooms[0].limit)})
         }
            catch(err){
                console.log(err)
            }
         try{
            let resZB = await fetch(zbapi,{method:'get'})
            let dataZB = await resZB.json();
            numList.locationPeople.push({short:"ZBSC",peoNum:parseInt(dataZB.gym[0]),maxPeo:parseInt(dataZB.gym[1])})
         }catch(e){
            console.log(e)
         }


        await mongo.connect(err => {
            if (err) console.error(err);
            console.log("Database connected.")

            const database = mongo.db("sports_center");
            const Collection = database.collection("data");
            Collection.insertOne(numList).then(()=>{
                console.log(`inserted data:`);
                console.log(numList.locationPeople);
                process.exit(0)
            })
        })

   }else{
        console.log("營業時間外，現在時間"+date.getHours())
        process.exit(0)
    }

