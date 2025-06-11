import { useEffect, useState } from 'react';

import styled from 'styled-components';

import Field from './CreateField';
import FileField from './CreateFileField';
import { FormContainer } from './CreateItemCard';
import { FormTitle } from './CreateProducts';
import isEmpty from '../utils/isEmpty';
import {
  validateUrl,
  validateUserId,
  validatePassword,
} from '../utils/validations';

const MyShopTitle = styled(FormTitle)`
  margin-bottom: 16px;
`;
const ContainerWrapper = styled.div`
  min-width: 344px;
  position: relative;
  margin: 0 auto 75px;

  @media (min-width: 768px) {
    width: 696px;
  }
`;

const CreateShop = ({ onSaveCompleteData }) => {
  const [shopInfo, setShopInfo] = useState({
    shop: {
      imageUrl: null,
      urlName: null,
      shopUrl: null,
    },
    password: null,
    userId: null,
    name: null,
  });
  const [isFormValid, setIsFormValid] = useState(null);
  //커스텀 훅 교체

  useEffect(() => {
    for (const key in shopInfo) {
      if (isFormValid && isEmpty(shopInfo[key])) {
        setIsFormValid(prev => null);
        return;
      }
    }
  }, [isFormValid, shopInfo]);

  useEffect(() => {
    onSaveCompleteData(prev => {
      return {
        ...prev,
        ...shopInfo,
        shop: { ...shopInfo.shop },
      };
    });
  }, [shopInfo]);

  return (
    <ContainerWrapper>
      <MyShopTitle>내 쇼핑몰</MyShopTitle>
      <FormContainer className={isFormValid === false ? 'invalid' : 'valid'}>
        <FileField
          placeholder='프로필 이미지를 첨부해주세요.'
          inputId='profileImage'
          label='프로필 이미지'
          onCheckValidForm={setIsFormValid}
          onSaveProductInfo={setShopInfo}
        />
        <Field
          placeholder='표시하고 싶은 이름을 적어 주세요.'
          inputId='shopName'
          type='text'
          label='이름'
          name='name'
          onCheckValidForm={setIsFormValid}
          onSaveProductInfo={setShopInfo}
        />

        <Field
          placeholder='Url을 입력해주세요.'
          inputId='shopUrl'
          type='url'
          label='Url'
          name='shopUrl'
          validation={validateUrl}
          onCheckValidForm={setIsFormValid}
          onSaveProductInfo={setShopInfo}
        />

        <Field
          placeholder='유저 ID를 입력해주세요.'
          inputId='userId'
          type='text'
          label='유저 ID'
          name='userId'
          validation={validateUserId}
          onCheckValidForm={setIsFormValid}
          onSaveProductInfo={setShopInfo}
        />

        <Field
          placeholder='비밀번호를 입력해주세요.'
          inputId='password'
          type='password'
          label='비밀번호'
          name='password'
          validation={validatePassword}
          hasButton={true}
          onCheckValidForm={setIsFormValid}
          onSaveProductInfo={setShopInfo}
        />
      </FormContainer>
    </ContainerWrapper>
  );
};

export default CreateShop;
