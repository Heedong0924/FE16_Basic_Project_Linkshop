import styled from 'styled-components';

import { applyFontStyles } from '../styles/mixins';
import theme, { FontTypes, ColorTypes } from '../styles/theme';
import UpdateItemCard from './UpdateItemCard';
import PrimaryButton from './PrimaryButton';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0 auto;
  max-width: 696px;

  @media (min-width: 768px) {
    max-width: 696px;
  }
`;

const ProductGroupHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;

  @media (min-width: 768px) {
    justify-content: space-between;
  }
`;

const ProductListTitle = styled.h2`
  ${applyFontStyles(FontTypes.SEMIBOLD16, ColorTypes.SECONDARY_BLACK)}
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;

const AddItemCard = styled(PrimaryButton)`
  text-align: right;
  ${applyFontStyles(FontTypes.MEDIUM16, ColorTypes.PRIMARY)}
  background-color: transparent;
  color: ${theme.colors[ColorTypes.PRIMARY]};
  padding: 0;
  height: auto;
  width: auto;
`;

const UpdateProduct = ({
  products, // 상품 데이터 배열
  onChange, // 상품 정보 변경 핸들러
  productErrors, // 상품별 에러 상태
  onBlur, // 상품 필드 blur 시 유효성 검사 핸들러
  onAddProduct, // 새 상품 추가 핸들러
  productImages, // 각 상품의 이미지 URL
  onImageChange, // 이미지 파일 변경 핸들러
  onDeleteProduct, // 상품 목록 삭제 핸들러
}) => {
  return (
    <Container>
      <ProductGroupHeader>
        <ProductListTitle>대표 상품</ProductListTitle>
        <AddItemCard onClick={onAddProduct}>추가</AddItemCard>
      </ProductGroupHeader>
      {products.map((product, index) => (
        <UpdateItemCard
          key={index}
          idKey={index}
          name={product.name}
          price={product.price}
          onChange={(field, value) => onChange(index, field, value)}
          hasError={
            productErrors[index]?.name.hasError ||
            productErrors[index]?.price.hasError ||
            productErrors[index]?.productImage.hasError
          }
          onBlur={(field, value) => onBlur(index, field, value)}
          productFieldErrors={productErrors[index]}
          currentImage={productImages[index]}
          onImageChange={file => onImageChange(index, file)}
          onDelete={onDeleteProduct}
        />
      ))}
    </Container>
  );
};

export default UpdateProduct;
