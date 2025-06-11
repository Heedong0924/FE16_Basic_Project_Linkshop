import { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import CreateItemCard from './CreateItemCard';
import { applyFontStyles } from '../styles/mixins';
import { ColorTypes, FontTypes } from '../styles/theme';

const ProductListContainer = styled.div`
  width: 100%;
  min-width: 344px;
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 168px auto 75px;
  gap: 16px;

  @media (min-width: 768px) {
    width: 100%;
  }
`;
const FormHeader = styled.div`
  display: flex;Add commentMore actions
  justify-content: space-between;
`;
export const FormTitle = styled.div`
  display: none;
  ${applyFontStyles(FontTypes.SEMIBOLD16)};

  @media (min-width: 768px) {
    display: block;
    flex-shrink: 0;
  }
`;

const AddButton = styled.button`
  width: 100%;
  text-align: right;
  ${applyFontStyles(FontTypes.BOLD16, ColorTypes.PRIMARY)};
`;

const INITIAL_PRODUCT = {
  id: 0,
};

const CreateProducts = ({ onSaveCompleteData }) => {
  const [productList, setProductList] = useState([INITIAL_PRODUCT]);
  const productKey = useRef(0);

  const handleAddProduct = () => {
    productKey.current += 1;
    setProductList(prev => [{ id: productKey.current }, ...prev]);
  };

  useEffect(() => {
    onSaveCompleteData(prev => {
      return {
        ...prev,
        products: [...productList],
      };
    });
  }, [productList]);

  return (
    <ProductListContainer>
      <FormHeader>
        <FormTitle>대표 상품</FormTitle>
        <AddButton type='button' onClick={handleAddProduct}>
          추가
        </AddButton>
      </FormHeader>

      {productList.map(product => {
        return (
          <CreateItemCard
            key={product.id}
            idKey={product.id}
            onDeleteProduct={setProductList}
            onSaveProductList={setProductList}
            productListLength={productList.length}
          />
        ); //idkey: input-label 1대1 대응 위한 키
      })}
    </ProductListContainer>
  );
};

export default CreateProducts;
