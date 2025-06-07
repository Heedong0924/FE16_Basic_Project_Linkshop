import { useState } from 'react';

import styled from 'styled-components';

import Field from './CreateField';
import FileField, { ButtonX } from './CreateFileField';
import closeBtn from '../assets/icon/btn_close.png';
import theme from '../styles/theme';

export const FormContainer = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 344px;
  padding: 22px 28px;
  border-radius: 25px;
  margin: 0 auto;
  gap: 30px;
  background-color: ${theme.colors.secWhite100};
  border: ${({ isFormValid }) =>
    isFormValid === false ? `1px solid ${theme.colors.err}` : 'none'};

  @media (min-width: 768px) {
    width: 696px;
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

const CreateItemCard = ({ idKey, onDeleteProduct, productListLength }) => {
  const [isFormValid, setIsFormValid] = useState();
  //다수의 form에서 쓰이니까 커스텀 훅 하는게 좋음

  const handleDeleteProduct = () => {
    onDeleteProduct(prev => prev.filter(product => product.id !== idKey));
  };

  return (
    <FormContainer isFormValid={isFormValid}>
      {productListLength === 1 ? undefined : (
        <DeleteFormButton type='button' onClick={handleDeleteProduct}>
          <ButtonX src={closeBtn} alt='상품 등록창을 삭제하는 버튼' />
        </DeleteFormButton>
      )}
      <FileField
        placeholder='상품 이미지를 첨부해주세요.'
        inputId={`productImage${idKey}`}
        label='상품 대표 이미지'
      />
      <Field
        placeholder='상품 이름을 입력해주세요.'
        inputId={`productName${idKey}`}
        type='text'
        label='상품 이름'
      />
      <Field
        placeholder='원화로 표기해 주세요.'
        inputId={`productPrice${idKey}`}
        type='number'
        label='상품 가격'
      />
    </FormContainer>
  );
};

export default CreateItemCard;
