import React, { useState } from 'react';
import { Button, Grid, Icon, Label, Segment } from 'semantic-ui-react';
import { ISingleFoods, ResultFoods } from '../models/IFoods';
import Moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { categories } from '../Datas';
import { adminhFoodDelete, adminWaitPushFood } from '../Services';
import { basketAdd } from '../Util';

interface foodsModel {
    item: ResultFoods,
    status?: boolean,
    isAdmin?: boolean,
}
function glyColor(glyIndex: any) {
    if (glyIndex <= 55) {
        return <div style={{ backgroundColor: "#00d900", borderRadius: 20 }}><Icon link name='pointing down' /> Glycemic Index  <Icon link name='pointing down' /></div>
    } else if (glyIndex > 55 && glyIndex <= 70) {
        return <div style={{ backgroundColor: "orange", borderRadius: 20 }}><Icon link name='pointing down' /> Glycemic Index  <Icon link name='pointing down' /> </div>
    } else {
        return <div style={{ backgroundColor: "#ff0000", borderRadius: 20 }}><Icon link name='pointing down' /> Glycemic Index  <Icon link name='pointing down' /> </div>
    }

}

export default function FoodItems(foods: foodsModel) {
    const addBasket=()=>{
        basketAdd(foods.item)
    }
    
    const navigate = useNavigate()
   // goto detail
   const fncGotoDetail = (url:string) => {
    //navigate("/details/"+url)
    window.open("/details/"+url,"_blank")
}

// goto push
const fncPush = () => {
    const itm = foods.item
    itm.enabled = true
    adminWaitPushFood(itm).then( res => {
        const dt:ISingleFoods = res.data
        if ( dt.status === true) {
            window.location.href = "/waitFoodsList"
        }
    }).catch(err => {

    })
}

const deleteItem = () => {
    const itm = foods.item
    adminhFoodDelete( itm.gid! ).then(res => {
        const dt:ISingleFoods = res.data
        if ( dt.status === true) {
            window.location.href = "/waitFoodsList"
        }
    }).catch( err => {

    } )
}

    return <>
        <Grid.Column mobile={8} tablet={8} computer={4}>
            <div className="ui cards " >
                <div className="ui card">
                
                    <div className="header" style={{ textAlign: "center", backgroundColor: "#54f764", opacity: 0.9 }}>{categories[foods.item.cid!].text}</div>
                    {foods.status &&
                            <> 
                                <Label as='a' color={foods.item.enabled === true ? 'blue' : 'red'} ribbon>
                                    {foods.item.enabled === true ? "Yayında" : "İnceleniyor"}
                                </Label>                            
                                                           
                            </>
                        }
                    <div className="header" style={{ textAlign: "center" }}>               
                        {foods.item.image !== "" &&
                            <img src={foods.item.image} ></img>
                        }
                        {foods.item.image === "" &&
                            <img src='./foods.png' style={{ width: 125, height: 125 }} ></img>
                        }
                         
                     
                         <h3 className="header" style={{ textAlign: "center" }}>{foods.item.name}</h3>
                    </div>

                    <div className="content">
                        <div className="meta" >
                            <h3 style={{ textAlign: "center", color: "black" }}>{glyColor(foods.item.glycemicindex)} {foods.item.glycemicindex}</h3>
                        </div>
                    </div>
                    <div className="extra content" >Created By:
                        <span className="right floated">
                            {foods.item.createdBy}
                        </span >
                        <br></br>Modified By:
                        <span className="right floated" >
                            {foods.item.modifiedBy}
                        </span>
                    </div>               
                    <div className="extra content" >
                        <div className='ui two buttons'>
                            {!foods.isAdmin &&
                                <>
                                    <Button basic color="green" onClick={() => fncGotoDetail(foods.item.url!)}>
                                        <Icon name="info" /> Detay
                                    </Button>
                                    <Button onClick={(e,d) => addBasket() } basic color='red' animated='vertical' >
                        <Button.Content visible><Icon name='food'/>Ekle</Button.Content>
                        <Button.Content hidden><Icon name='shop'/>Ekle</Button.Content>
                    </Button>
                                </>
                            }

                            {foods.isAdmin &&
                                <>
                                     <Button  basic color='green' onClick={()=> fncPush() } >
                    <Icon name='info'/>Yayınla
                    </Button>
                    
                    <Button basic color='red' onClick={()=> deleteItem() }>
                    <Icon name='delete'/>Sil
                    </Button>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Grid.Column>
    </>;
}
