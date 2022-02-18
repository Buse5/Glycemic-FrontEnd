import React, { useEffect, useState } from 'react'
import { zoomIn } from 'react-animations';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import { Form,InputOnChangeData, Label, Segment } from 'semantic-ui-react'
import styled, { keyframes } from 'styled-components';
import NavBar from './components/NavBar';
import { categories } from './Datas';
import { ISingleFoods } from './models/IFoods';
import { foodAdd } from './Services';
import { autControl } from './Util';

const animation = keyframes`${zoomIn}`
const AnimateDiv = styled.div`
  animation: forwards 2s ${animation};
`;
export default function FoodsAdd() {
  
  const navigate = useNavigate()

  // form item states
  const [name, setName] = useState("")
  const [glycemicindex, setGlycemicindex] = useState("")
  const [source, setSource] = useState("")
  const [cid, setCid] = useState('0')
  const [base64Image, setBase64Image] = useState("")

  // animation
  const [visible, setVisible] = useState(false)

  const fncFoodAdd = () => {
    
    if (name == '') {
      toast.warning('Lütfen gıda ismi alanını doldurunuz!');
    } else if (glycemicindex == "") {
      toast.warning('Lütfen glysemic index alanını doldurunuz!');
    } else if (source == '') {
      toast.warning('Lütfen kaynak alanını doldurunuz!');
    }else if (cid == "") {
      toast.warning('Lütfen bir kategori giriniz!');
    } else if (base64Image == '') {
      toast.warning('Lütfen bir resim yükleyiniz!');
    }else {
      toast.loading("Yükleniyor.")
      
      foodAdd( parseInt(cid), name, parseInt(glycemicindex),  base64Image, source)
      .then(res => { 
        const food:ISingleFoods = res.data
        toast.dismiss(); 
        if ( food.status ) {
          // ekleme başarılı
          toast.success("Ürün ekleme işlemi başarılı") 
          setTimeout(() => {
            navigate("/foodsList")
          }, 1000);        
        }else { 
          toast.error( food.message )
        }
       }).catch(err => {
        toast.dismiss();
        toast.error( "Ürün ekleme işlemi sırasında bir hata oluştu!" )
      })
    }    
  }

  // image to base64
  const imageOnChange = (e:any, d:InputOnChangeData) => {
        const file = e.target.files[0]
        const size:number = file.size / 1024 // kb
        if ( size > 10 ) { // 10 kb
            toast.error("Lütfen max 10 kb bir resim seçiniz!")
        }else {
            getBase64(file).then( res => {
                setBase64Image(""+res)
            })
        } 
  }

  useEffect(() => {
    if( autControl() === null ) {
      localStorage.removeItem("user")
      localStorage.removeItem("aut")
      navigate("/")
    }
    setTimeout(() => {
      setVisible(true)
    }, 500);
  }, [])
  

  const getBase64 = ( file: any ) => {
    return new Promise(resolve => {
        let fileInfo;
        let baseURL:any = "";
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          baseURL = reader.result
          resolve(baseURL);
        };
        console.log(fileInfo);
      });
  }

  return (
    <>
      <ToastContainer />
      <NavBar />
      <AnimateDiv >
        <h1 style={{ textAlign: "center", color: "tomato", textShadow: "initial", fontFamily: "monospace", fontSize: 50 }}>GIDA EKLE</h1>
      </AnimateDiv>

      <Segment raised as='h2'>
        <Label as='a' color='orange' ribbon>
          DİKKAT
        </Label>
        Burada eklediğiniz gıdalar, admin onayını gidip denetimden geçtikten sonra yayına alınır.
      </Segment>

      <Segment style={{marginTop:30}}>
      <Form>
        <Form.Group widths='equal'>
          <Form.Input onChange={(e) => setName(e.target.value)} fluid label='Adı' placeholder='Adı' />
          <Form.Input onChange={(e) => setGlycemicindex(e.target.value)} type='number' min='0' max='150' fluid label='Glisemik İndex' placeholder='Glisemik İndex' />
          <Form.Select  label='Kategori' value={cid} fluid placeholder='Kategori' options={categories} search onChange={(e,d) => setCid( ""+d.value )} />
        </Form.Group>
        
        <Form.Group widths='equal'>
            <Form.Input onChange={(e, d) => imageOnChange(e,d) } type='file' fluid label='Resim' placeholder='Resim' />
            <Form.Input onChange={(e) => setSource(e.target.value)} fluid label='Kaynak' placeholder='Kaynak' />
        </Form.Group>
       
        <Form.Button positive onClick={(e) => fncFoodAdd()} >Gönder</Form.Button>
      </Form>
      </Segment>
    </>
  )
}