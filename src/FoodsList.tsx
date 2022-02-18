import React, { useEffect, useState } from 'react'
import { zoomIn } from 'react-animations';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'
import { Grid, Segment, Transition } from 'semantic-ui-react';
import styled, { keyframes } from 'styled-components';
import FoodItems from './components/FoodItems';
import NavBar from './components/NavBar'
import { IFoods, ResultFoods } from './models/IFoods';
import { userFoodList } from './Services';
import { autControl } from './Util';


const animation = keyframes`${zoomIn}`
const AnimateDiv = styled.div`
  animation: forwards 2s ${animation};
`;
export default function FoodsList() {
    const navigate = useNavigate()
    const [foodsArr, setFoodsArr] = useState<ResultFoods[]>([]);
      
    // animation
    const [visible, setVisible] = useState(false)
    useEffect(() => {
      if( autControl() === null ) {
        localStorage.removeItem("user")
        localStorage.removeItem("aut")
        navigate("/")
      }
      setTimeout(() => {
        setVisible(true)
      }, 500);
  
      // user food list service
      toast.loading("Yükleniyor.")
      userFoodList().then( res => {
          const dt:IFoods = res.data;
          setFoodsArr( dt.result! )
          toast.dismiss(); 
      }).catch(err => {
          toast.dismiss();
          toast.error( "Ürün listeleme işlemi sırasında bir hata oluştu!" )
      })
  
    }, [])
    return (
        <>
            <ToastContainer />
            <NavBar />
            <AnimateDiv >
                <h1 style={{ textAlign: "center", color: "tomato", textShadow: "initial", fontFamily: "monospace", fontSize: 50 ,marginBottom:20}}>EKLDEDİĞİM GIDALAR</h1>
            </AnimateDiv>

            <Grid >
            { foodsArr.map((item, index) => 
                <FoodItems  key={index} item={item} status={true} /> 
            )}
        </Grid>
        </>
    )
}
