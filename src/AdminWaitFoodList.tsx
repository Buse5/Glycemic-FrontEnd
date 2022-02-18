import React, { useEffect, useState } from 'react'
import { zoomIn } from 'react-animations'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { Grid } from 'semantic-ui-react'
import styled, {keyframes } from 'styled-components'
import FoodItems from './components/FoodItems'
import NavBar from './components/NavBar'
import { IFoods, ResultFoods } from './models/IFoods'
import { adminWaitFoodList } from './Services'
import { autControl, control } from './Util'

const animation = keyframes`${zoomIn}`
const AnimateDiv = styled.div`
  animation: forwards 2s ${animation};
`;

export default function AdminWaitFoodList() {

  
  const navigate = useNavigate()
  const [foodsArr, setFoodsArr] = useState<ResultFoods[]>([]);
  var isAdmin = false
    
  // animation
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const usr = control()
    if (usr !== null) {
      usr.roles!.forEach(item => {
        if ( item.name === "ROLE_admin" ) {
          isAdmin = true
        }
      });
    }
    
    if( autControl() === null || isAdmin === false ) {
      localStorage.removeItem("user")
      localStorage.removeItem("aut")
      navigate("/")
    }
    setTimeout(() => {
      setVisible(true)
    }, 500);

    // user food list service
    toast.loading("Yükleniyor.")
    adminWaitFoodList().then( res => {
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
        <h1 style={{ textAlign: "center", color: "tomato", textShadow: "initial", fontFamily: "monospace", fontSize: 50 }}>ONAY BEKLEYEN GIDALAR</h1>
      </AnimateDiv>

      <Grid >
            { foodsArr.map((item, index) => 
                <FoodItems  key={index} item={item} status={true} isAdmin={true} /> 
            )}
        </Grid>
    </>
  )
}