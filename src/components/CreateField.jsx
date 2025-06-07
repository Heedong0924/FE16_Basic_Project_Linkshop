import { useState } from 'react';

import { styled } from 'styled-components';

import visibilityOffIcon from '../assets/icon/btn_visibility_off.svg?url';
import visibilityOnIcon from '../assets/icon/btn_visibility_on.svg';
import { applyFontStyles } from '../styles/mixins';
import { FontTypes, ColorTypes } from '../styles/theme';
import theme from '../styles/theme';

export const FieldContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 10px;
`;

const VisibilityButton = styled.button`
  position: absolute;
  top: 15px;
  right: 0;
`;

export const STLabel = styled.label`
  ${applyFontStyles(FontTypes.SEMIBOLD14)}
`;

export const STInput = styled.input`
  &::placeholder {
    ${applyFontStyles(FontTypes.REGULAR17, ColorTypes.SECONDARY_GRAY_300)}
  }
`;

export const NoneValidMessage = styled.div`
  color: ${theme.colors.err};
  font-size: 12px;
`;

const Field = ({ placeholder, inputId, type, hasButton = false, label }) => {
  const [passwordType, setpasswordType] = useState('password');
  const [isFieldValid, setIsFieldValid] = useState();
  const [noneValidMessage, setNoneValidMessage] =
    useState('항목이 비어있습니다.');
  const iconUrl =
    passwordType === 'password' ? visibilityOffIcon : visibilityOnIcon;

  const handleTogglePassword = () => {
    setpasswordType(prev => (prev === 'password' ? 'text' : 'password'));
  };

  return (
    <FieldContainer>
      <STLabel htmlFor={inputId}>{label}</STLabel>
      <STInput
        id={inputId}
        type={type === 'password' ? passwordType : type}
        placeholder={placeholder}
      />
      {hasButton && (
        <VisibilityButton type='button' onClick={handleTogglePassword}>
          <img src={iconUrl} alt='비밀번호 표시여부를 나타내는 아이콘' />
        </VisibilityButton>
      )}
      {isFieldValid === false ? (
        <NoneValidMessage>{noneValidMessage}</NoneValidMessage>
      ) : undefined}
    </FieldContainer>
  );
};

export default Field;
