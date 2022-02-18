import React, { SyntheticEvent, useEffect, useState } from 'react';
import { allFoodsList } from './Services';
import { ToastContainer, toast } from 'react-toastify';
import { IFoods, ResultFoods } from './models/IFoods';
import NavBar from './components/NavBar';
import FoodItems from './components/FoodItems';
import { zoomIn } from 'react-animations'
import styled, { keyframes } from 'styled-components';
import { Grid, Icon, Input, Label, Pagination, PaginationProps, Select } from 'semantic-ui-react';
import { categories } from './Datas';

const animation = keyframes`${zoomIn}`
const AnimateDiv = styled.div`
  animation: forwards 2s ${animation};
`;

export default function Home() {


  const [foodsArr, setFoodsArr] = useState<ResultFoods[]>([]);
  const [searchArr, setSearchArr] = useState<ResultFoods[]>([]);

  // select category
  const [selectCategory, setSelectCategory] = useState(0)
  const [searchData, setSearchData] = useState("")

  // pages
  const [pageCount, setPageCount] = useState(0);
  const [postsperpage, setPostsPerPage] = useState(4)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const indexOfLastPost = currentPage * postsperpage;
  const indexOfFirstPost = indexOfLastPost- postsperpage;
  var currentpost = foodsArr.slice(indexOfFirstPost,indexOfLastPost); 
  useEffect(() => {
    
    toast.loading("Yükleniyor.")
    allFoodsList().then( res => {
        const dt:IFoods = res.data;
        setFoodsArr( dt.result! )
        setSearchArr( dt.result! )
        if(Math.round(dt.result!.length%postsperpage) === 0){
          setPageCount(dt.result!.length /postsperpage)            
       }else{           
          setPageCount(Math.ceil(dt.result!.length/postsperpage))              
        } 
        toast.dismiss();
    }).catch( err => {
        toast.dismiss();
        toast.error( ""+err )
    })

  }, []);


  const search = ( q:string ) => {
    setCurrentPage(1)
    setSearchData(q)
    if ( q === "" ) {
      
      var newArr: ResultFoods[] = searchArr
      if ( selectCategory !== 0 ) {
        newArr = newArr.filter( item => item.cid === selectCategory )
      }
      setFoodsArr(newArr)
      if(Math.round(newArr.length%postsperpage) === 0){
        setPageCount(newArr.length / postsperpage)            
      }else{           
        setPageCount(Math.ceil(newArr.length / postsperpage))              
      }
      
    }else {
      q = q.toLowerCase()
      var newArr = searchArr.filter( item => item.name?.toLowerCase().includes(q) || (""+item.glycemicindex).includes(q) )
      if ( selectCategory !== 0 ) {
        newArr = newArr.filter( item => item.cid === selectCategory )
      }
      setFoodsArr(newArr)
      if(Math.round(newArr.length%postsperpage) === 0){
          setPageCount(newArr.length /postsperpage)            
      }else{           
          setPageCount(Math.ceil(newArr.length/postsperpage))              
        }
    }
  }


  // select cat
  const catOnChange = ( str: string ) => {
    const numCat = parseInt(str)
    setCurrentPage(1)
    setSelectCategory( numCat )

    var newArr: ResultFoods[] = searchArr
    if ( numCat !== 0 ) {
      newArr = newArr.filter( item => item.cid === numCat )
    }
    
    if ( searchData !== "" ) {
      newArr = newArr.filter( item => item.name?.toLowerCase().includes(searchData) || (""+item.glycemicindex).includes(searchData) )
    }
    setFoodsArr(newArr)

    console.log( newArr )

    if(Math.round(newArr.length%postsperpage) === 0){
      setPageCount(newArr.length /postsperpage)            
    }else{           
        setPageCount(Math.ceil(newArr.length/postsperpage))              
    }
  }
  return (
    <>
      <ToastContainer />
      <NavBar />
      <AnimateDiv >
        <h1 style={{ textAlign: "center", color: "tomato", textShadow: "initial", fontFamily: "monospace", fontSize: 50 }}> ALL FOODS </h1>
      </AnimateDiv>

      <Grid columns='2'>
        <Grid.Row>
          <Grid.Column>
            <Grid>
              <Grid.Row>
                <Grid.Column width='14'>
                  <Input onChange={(e) => search(e.target.value)}
                    fluid style={{ marginBottom: 10 }}
                    icon='search'
                    iconPosition='left'
                    label={{ tag: true, content: 'Arama' }}
                    labelPosition='right'
                    placeholder='Arama Yap'
                  />
                </Grid.Column>
                <Grid.Column width='2' >
                  <Label style={{ textAlign: "center" }}>
                    <Icon name='hand point down outline' style={{ marginLeft: 7 }} /> {foodsArr.length}
                  </Label>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column>
            <Select onChange={(e, data) => catOnChange("" + data.value)} fluid options={categories} placeholder='Kategori Seç' />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid>
        {
          currentpost.map((item, index) =>
            <FoodItems key={index} item={item} />
          )
        }
      </Grid>

      <Grid>
        <Pagination
          activePage={currentPage}
          pointing
          secondary
          totalPages={pageCount}
          onPageChange={(e: SyntheticEvent, { activePage }: PaginationProps) => setCurrentPage(parseInt("" + activePage!))}
        />
      </Grid>
     
    </>
  );
}