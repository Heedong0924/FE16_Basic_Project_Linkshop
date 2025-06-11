import { useContext, useEffect, useState } from 'react';

import { styled } from 'styled-components';

import visibilityOffIcon from '../assets/icon/btn_visibility_off.svg?url';
import visibilityOnIcon from '../assets/icon/btn_visibility_on.svg';
import { CreatePageContext } from '../pages/CreateShopPage';
import { applyFontStyles } from '../styles/mixins';
import { FontTypes, ColorTypes } from '../styles/theme';
import theme from '../styles/theme';
import formatNumberWithCommas from '../utils/formatNumberWithCommas';

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

const Field = ({
  placeholder,
  inputId,
  type,
  hasButton = false,
  label,
  name,
  validation,
  onCheckValidForm,
  onSaveProductInfo,
}) => {
  const { isValidating, setIsValidating, setIsInvalidDetected } =
    useContext(CreatePageContext);
  const [value, setValue] = useState('');
  const [displayedValue, setDisplayedValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [passwordType, setpasswordType] = useState('password');
  const [isFieldValid, setIsFieldValid] = useState();
  const [noneValidMessage, setNoneValidMessage] =
    useState('필수 입력 항목입니다.');
  const iconUrl =
    passwordType === 'password' ? visibilityOffIcon : visibilityOnIcon;

  const handleTogglePassword = () => {
    setpasswordType(prev => (prev === 'password' ? 'text' : 'password'));
  };

  const handleInputValue = e => {
    if (name === 'price') {
      let input = e.target.value;

      input = input.replace(/[^0-9]/g, '');

      if (input.length > 1 && input.startsWith('0')) {
        input = input.replace(/^0+/, '');
      }

      setValue(prev => (input === '' ? '' : Number(input)));
    } else {
      setValue(prev => e.target.value);
    }
  };

  const handleCheckEmpty = e => {
    setIsFocused(prev => false);
    if (!e.target.value) {
      setNoneValidMessage(prev => '필수 입력 항목입니다.');
      setIsFieldValid(prev => false);
      onCheckValidForm(prev => false);
      return;
    }
    setIsFieldValid(prev => true);
    onCheckValidForm(prev => true);
  };

  const handlePriceOnFocus = e => {
    setIsFocused(prev => true);
  };

  useEffect(() => {
    if (!onSaveProductInfo) {
      return;
    }
    setDisplayedValue(prev =>
      value === '' ? '' : formatNumberWithCommas(value),
    );
    onSaveProductInfo(prev => {
      if (name === 'shopUrl') {
        return {
          ...prev,
          shop: {
            ...prev.shop,
            [`${name}`]: value,
          },
        };
      } else if (name === 'userId') {
        return {
          ...prev,
          shop: {
            ...prev.shop,
            urlName: value,
          },
          [`${name}`]: value,
        };
      }
      return { ...prev, [`${name}`]: value };
    });
  }, [value]);

  useEffect(() => {
    if (!isValidating) {
      return;
    }

    if (validation) {
      const message = validation(value);
      if (message !== 'valid') {
        setNoneValidMessage(prev => message);
        setIsFieldValid(prev => false);
        onCheckValidForm(prev => false);
        setIsInvalidDetected(prev => true);
        setIsValidating(prev => false);
        return;
      } else {
        setIsFieldValid(prev => true);
        setIsValidating(prev => false);
        return;
      }
    }
    setIsValidating(prev => false);
  }, [isValidating]);

  return (
    <FieldContainer>
      <STLabel htmlFor={inputId}>{label}</STLabel>
      <STInput
        id={inputId}
        type={type === 'password' ? passwordType : type}
        name={name}
        placeholder={placeholder}
        value={name === 'price' && !isFocused ? displayedValue : value}
        onChange={handleInputValue}
        onFocus={handlePriceOnFocus}
        onBlur={handleCheckEmpty}
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
