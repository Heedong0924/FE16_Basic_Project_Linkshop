import styled from 'styled-components';
import { useState, useEffect } from 'react';

import { applyFontStyles } from '../styles/mixins';
import theme, { FontTypes, ColorTypes } from '../styles/theme';
import formatNumberWithCommas from '../utils/formatNumberWithCommas';

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StLabel = styled.label`
  ${applyFontStyles(FontTypes.SEMIBOLD14, ColorTypes.SECONDARY_BLACK)}
`;

const StInput = styled.input`
  ${applyFontStyles(FontTypes.REGULAR17, ColorTypes.SECONDARY_GRAY_300)}
  color: ${props => props.theme.colors[ColorTypes.SECONDARY_BLACK]};
`;

const ErrorMessage = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.err};
`;

const Field = ({
  type,
  inputId,
  label,
  placeholder,
  hasError,
  errorMessage,
  value,
  onChange,
  onBlur,
  autoComplete,
}) => {
  // 입력 필드에 표시될 값을 관리하는 내부 상태
  const [displayValue, setDisplayValue] = useState('');
  // 사용자가 입력 필드에 포커스했는지 여부
  const [isFocused, setIsFocused] = useState(false);

  // 상위 컴포넌트의 value prop이 변경될 때 displayValue 업데이트
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value === 0 ? '' : formatNumberWithCommas(value));
    }
  }, [value, isFocused]);

  const handleInputChange = e => {
    const rawValue = e.target.value.replace(/,/g, ''); // 콤마 제거
    const numericValue = rawValue.replace(/[^0-9]/g, '');

    // 내부 displayValue는 사용자가 입력한 그대로 업데이트
    setDisplayValue(numericValue);

    // 상위 컴포넌트의 onChange에는 순수 숫자 값(또는 빈 문자열)을 전달
    // Number()를 사용하여 숫자로 변환하거나, 빈 문자열이면 '' 전달
    // parseInt나 Number는 빈 문자열을 0으로 바꾸므로 ''를 그대로 전달하는 것이 좋음
    onChange({
      target: {
        id: inputId,
        value: numericValue === '' ? '' : Number(numericValue),
      },
    });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(String(value).replace(/,/g, ''));
  };

  const handleBlur = e => {
    setIsFocused(false);
    setDisplayValue(formatNumberWithCommas(value));
    if (onBlur) {
      onBlur(
        e,
        inputId,
        value === 0 ? '' : Number(String(value).replace(/,/g, '')),
      );
    }
  };

  // 'price' 필드에만 이 로직을 적용
  const isPriceField = type === 'number';

  return (
    <FormGroup>
      <StLabel htmlFor={inputId}>{label}</StLabel>
      <StInput
        type={isPriceField && !isFocused ? 'text' : type} // 포커스 아닐 때만 text 타입으로 변경하여 콤마 표시
        id={inputId}
        name={inputId}
        placeholder={placeholder}
        hasError={hasError}
        value={isPriceField ? displayValue : value} // 가격 필드면 displayValue 사용, 아니면 일반 value 사용
        onChange={isPriceField ? handleInputChange : onChange} // 가격 필드면 커스텀 핸들러 사용
        onFocus={isPriceField ? handleFocus : undefined} // 가격 필드면 포커스 핸들러 추가
        onBlur={isPriceField ? handleBlur : onBlur} // 가격 필드면 블러 핸들러 추가
        inputMode={isPriceField ? 'numeric' : undefined} // 모바일 키패드 숫자 우선
        pattern={isPriceField ? '[0-9]*' : undefined} // 숫자만 입력되도록 패턴 지정
        autoComplete={autoComplete}
      />
      {hasError && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </FormGroup>
  );
};

export default Field;
