import styled from 'styled-components';
import theme, { ColorTypes } from '../styles/theme';

// 실제 파일 업로드 input (숨김)
const StInput = styled.input.attrs({ type: 'file' })`
  display: none;
`;

const StLabel = styled.label`
  border: 1px solid ${theme.colors[ColorTypes.PRIMARY]};
  border-radius: 8px;
  padding: 7px 12px;
  width: 52px;
  height: 17px;

  // 전역스타일 변경 시 REGULAR14로 변경 필요 !
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors[ColorTypes.PRIMARY]};
  cursor: pointer;
`;

const FileField = ({ onFileChange, inputId }) => {
  const handleChange = e => {
    if (onFileChange) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div>
      <StLabel htmlFor={inputId}>파일 첨부</StLabel>
      <StInput
        id={inputId}
        type='file'
        accept='image/*'
        onChange={handleChange}
      />
    </div>
  );
};

export default FileField;
