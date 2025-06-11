import { useEffect, useState } from 'react';

import styled from 'styled-components';

import Field from './CreateField';
import FileField, { ButtonX } from './CreateFileField';
import closeBtn from '../assets/icon/btn_close.png';
import theme from '../styles/theme';
import isEmpty from '../utils/isEmpty';

export const FormContainer = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 344px;
  width: 100%;
  padding: 22px 28px;
  border-radius: 25px;
  margin: 0 auto;
  gap: 30px;
  background-color: ${theme.colors.secWhite100};
  border: ${({ className }) =>
    className === 'invalid' ? `1px solid ${theme.colors.err}` : 'none'};

  @media (min-width: 768px) {
    min-width: 696px;
  }
`;

const DeleteFormButton = styled.button`
  width: 24px;
  height: 24px;
  position: absolute;
  top: -2%;
  right: -2%;
  border-radius: 9999px;
  background-color: ${theme.colors.secGray200};

  @media (min-width: 768px) {
    right: -1.2%;
  }
`;

const CreateItemCard = ({
  idKey,
  onDeleteProduct,
  onSaveProductList,
  productListLength,
}) => {
  const [productInfo, setProductInfo] = useState({
    id: idKey,
    imageUrl: null,
    name: null,
    price: null,
  });
  const [isFormValid, setIsFormValid] = useState(null);
  //다수의 form에서 쓰이니까 커스텀 훅 하는게 좋음

  const handleDeleteProduct = () => {
    onDeleteProduct(prev => prev.filter(product => product.id !== idKey));
  };

  //!연산자로 빈 값을 감지하니까 id:0일 때도 감지가 되어버려서 isEmpty라는 유틸 함수 만들어줌
  useEffect(() => {
    for (const key in productInfo) {
      if (isFormValid && isEmpty(productInfo[key])) {
        setIsFormValid(prev => null);
        return;
      }
    }

    //field의 유효성 검사 -> form의 유효성 검사 -> list에 정보 업데이트
    onSaveProductList(prev => {
      return prev.map(product => {
        if (product.id === idKey) {
          return { ...productInfo };
        } else {
          return { ...product };
        }
      });
    });
  }, [isFormValid, productInfo]);

  return (
    <FormContainer className={isFormValid === false ? 'invalid' : 'valid'}>
      {productListLength === 1 ? undefined : (
        <DeleteFormButton type='button' onClick={handleDeleteProduct}>
          <ButtonX src={closeBtn} alt='상품 등록창을 삭제하는 버튼' />
        </DeleteFormButton>
      )}
      <FileField
        placeholder='상품 이미지를 첨부해주세요.'
        inputId={`productImage${idKey}`}
        label='상품 대표 이미지'
        onCheckValidForm={setIsFormValid}
        onSaveProductInfo={setProductInfo}
      />
      <Field
        placeholder='상품 이름을 입력해주세요.'
        inputId={`productName${idKey}`}
        type='text'
        label='상품 이름'
        name='name'
        onCheckValidForm={setIsFormValid}
        onSaveProductInfo={setProductInfo}
      />
      <Field
        placeholder='원화로 표기해 주세요.'
        inputId={`productPrice${idKey}`}
        type='text'
        label='상품 가격'
        name='price'
        onCheckValidForm={setIsFormValid}
        onSaveProductInfo={setProductInfo}
      />
    </FormContainer>
  );
};

export default CreateItemCard;
