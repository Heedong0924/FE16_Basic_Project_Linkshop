import { useState } from 'react';

import styled from 'styled-components';

import Field from './CreateField';
import FileField from './CreateFileField';
import { FormContainer } from './CreateItemCard';
import { FormTitle } from './CreateProducts';

const ContainerWrapper = styled.div`
  width: 344px;
  position: relative;
  margin: 0 auto 75px;

  @media (min-width: 768px) {
    width: 696px;
  }
`;

const CreateShop = () => {
  const [isFormValid, setIsFormValid] = useState();
  //커스텀 훅 교체

  return (
    <ContainerWrapper>
      <FormTitle>내 쇼핑몰</FormTitle>
      <FormContainer isFormValid={isFormValid}>
        <FileField
          placeholder='프로필 이미지를 첨부해주세요.'
          inputId='profileImage'
          label='프로필 이미지'
        />
        <Field
          placeholder='표시하고 싶은 이름을 적어 주세요.'
          inputId='shopName'
          type='text'
          label='이름'
        />

        <Field
          placeholder='Url을 입력해주세요.'
          inputId='shopUrl'
          type='url'
          label='Url'
        />

        <Field
          placeholder='유저 ID를 입력해주세요.'
          inputId='userId'
          type='text'
          label='유저 ID'
        />

        <Field
          placeholder='비밀번호를 입력해주세요.'
          inputId='password'
          type='password'
          label='비밀번호'
          hasButton={true}
        />
      </FormContainer>
    </ContainerWrapper>
  );
};

export default CreateShop;
