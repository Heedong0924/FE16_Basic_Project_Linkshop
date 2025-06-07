import { useRef, useState } from 'react';

import styled from 'styled-components';

import CreateItemCard from './CreateItemCard';
import { applyFontStyles } from '../styles/mixins';
import { ColorTypes, FontTypes } from '../styles/theme';

const ProductListContainer = styled.div`
  width: 344px;
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 168px 16px 75px;
  gap: 16px;

  @media (min-width: 768px) {
    width: 696px;
  }
`;

export const FormTitle = styled.div`
  position: absolute;
  left: 0;
  top: -45px;
  display: none;
  ${applyFontStyles(FontTypes.SEMIBOLD16)};

  @media (min-width: 768px) {
    display: block;
  }
`;

const AddButton = styled.button`
  position: absolute;
  right: 0;
  top: -45px;
  ${applyFontStyles(FontTypes.BOLD16, ColorTypes.PRIMARY)};
`;

const EMPTY_PRODUCT = {
  price: 0,
  imageUrl: null,
  name: '',
  id: 0,
};

const CreateProducts = () => {
  const [productList, setProductList] = useState([EMPTY_PRODUCT]);
  const productKey = useRef(0);

  const handleAddProduct = () => {
    productKey.current += 1;
    setProductList(prev => [
      { ...EMPTY_PRODUCT, id: productKey.current },
      ...prev,
    ]);
  };

  return (
    <ProductListContainer>
      <FormTitle>대표 상품</FormTitle>
      <AddButton type='button' onClick={handleAddProduct}>
        추가
      </AddButton>
      {productList.map(product => {
        return (
          <CreateItemCard
            key={product.id}
            idKey={product.id}
            onDeleteProduct={setProductList}
            productListLength={productList.length}
          />
        ); //idkey: input-label 1대1 대응 위한 키
      })}
    </ProductListContainer>
  );
};

export default CreateProducts;
