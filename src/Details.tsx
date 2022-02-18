import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { Card, Icon, Item } from 'semantic-ui-react'
import NavBar from './components/NavBar'
import { ISingleFoods, ResultFoods } from './models/IFoods'
import { foodDetails } from './Services'


export default function Details() {
    const [food, setFood] = useState<ResultFoods>()
    const { url } = useParams()
    useEffect(() => {
        foodDetails(url!).then(res => {
            const dt: ISingleFoods = res.data;
            setFood(dt.result!)
        }).catch(err => {
            toast.dismiss();
            toast.error("" + err)
        })
    }, [])
    function glyColor(glyIndex: any) {
        if (glyIndex <= 55) {
            return <div style={{ backgroundColor: "#00d900", borderRadius: 20 }}><Icon link name='pointing down' /> Glycemic Index  <Icon link name='pointing down' /></div>
        } else if (glyIndex > 55 && glyIndex <= 70) {
            return <div style={{ backgroundColor: "orange", borderRadius: 20 }}><Icon link name='pointing down' /> Glycemic Index  <Icon link name='pointing down' /> </div>
        } else {
            return <div style={{ backgroundColor: "#ff0000", borderRadius: 20 }}><Icon link name='pointing down' /> Glycemic Index  <Icon link name='pointing down' /> </div>
        }
    
    }
    return (
        <>
             <ToastContainer />
      <NavBar />
        <h1 style={{ textAlign: "center", color: "tomato", textShadow: "initial", fontFamily: "monospace", fontSize: 50 }}> {food?.name} Detayı</h1>
      <Card.Group>
                <Card fluid>
                    <Card.Content>

                        {food?.image !== "" &&
                            <Item.Image              
                                floated='right'
                                size='small'
                                src={food?.image}
                            />
                        }

                        {food?.image === "" &&
                            <Item.Image
                                floated='right'
                                size='tiny'
                                src='../foods.png'
                            />
                        }
                        <div className="meta" >
                            <h3 style={{ textAlign: "center", color: "black", marginRight:380, marginLeft:380, marginTop:20}}>{glyColor(food?.glycemicindex)} {food?.glycemicindex}</h3>
                        </div>
                  
                        <div className="extra content" >Created By:
                        <span style={{marginTop:20}}>
                            {food?.createdBy}
                        </span >
                        <br></br>Modified By:
                        <span style={{marginTop:20}}>
                            {food?.modifiedBy}
                        </span>
                        </div>     
                        <div className="extra content" style={{marginTop:20}}>
                        <span style={{marginTop:20}}>
                        Crated  Date:                     
                            <i className="calendar icon"></i>
                            {moment(food?.createdDate).format("DD/MM/YY")}  
                            </span>   
                            <br></br>                
                            <span style={{marginTop:20}}>
                        Modified Date:                       
                            <i className="calendar icon" ></i>
                            {moment(food?.modifiedDate).format("DD/MM/YY")}       
                            </span>               
                    </div>
                    </Card.Content>

                </Card>
            </Card.Group>
        </>
    )
}