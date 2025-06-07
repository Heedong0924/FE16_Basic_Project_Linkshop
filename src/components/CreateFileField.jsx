import { useState } from 'react';

import styled from 'styled-components';

import { FieldContainer, NoneValidMessage } from './CreateField';
import closeBtn from '../assets/icon/btn_close.png';
import defaultProductImg from '../assets/img/img_product.png';
import defaultProfileImg from '../assets/img/img_profile_full.svg';
import { applyFontStyles } from '../styles/mixins';
import { FontTypes, ColorTypes } from '../styles/theme';
import theme from '../styles/theme';

const AddFileButton = styled.label`
  position: absolute;
  top: 13px;
  right: 0;
  width: 76px;
  height: 31px;
  border: 1px solid ${theme.colors.pri};
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.pri};
  white-space: nowrap;
`;

const STFileInput = styled.input`
  display: none;
`;

const STTitle = styled.div`
  ${applyFontStyles(FontTypes.SEMIBOLD14)};
`;

const STPlaceholder = styled.div`
  ${applyFontStyles(FontTypes.REGULAR17, ColorTypes.SECONDARY_GRAY_300)}
`;

const PreviewWrapper = styled.div`
  position: relative;
  width: 95px;
  height: 95px;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 15px;
`;

export const DeletePreviewButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  background-color: ${theme.colors.secGray300};
`;

export const ButtonX = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: invert(99%) sepia(0%) saturate(0%) hue-rotate(262deg) brightness(110%)
    contrast(101%);
  width: 70%;
  height: 70%;
`;

const FileField = ({ placeholder, inputId, label }) => {
  const [previewImage, setpreviewImage] = useState(() => {
    if (label === '프로필 이미지') {
      return defaultProfileImg;
    } else {
      return defaultProductImg;
    }
  });
  const [isFieldValid, setIsFieldValid] = useState();
  const [noneValidMessage, setNoneValidMessage] =
    useState('이미지를 업로드해 주세요.');
  //다른 예외 상황이 있는지 확인하고, 만약 없으면 메시지 고정이니까 state말고 일반 변수로 관리

  const handleDeletePreview = () => {
    setpreviewImage(prev => null);
    setIsFieldValid(prev => false);
  };

  return (
    <FieldContainer>
      <AddFileButton htmlFor={inputId}>파일 첨부</AddFileButton>
      <STFileInput id={inputId} type='file' />
      <STTitle>{label}</STTitle>
      <STPlaceholder>{placeholder}</STPlaceholder>
      {isFieldValid === false ? (
        <NoneValidMessage>{noneValidMessage}</NoneValidMessage>
      ) : (
        <PreviewWrapper>
          <PreviewImage src={previewImage} alt='첨부 파일 미리보기 이미지' />
          <DeletePreviewButton onClick={handleDeletePreview}>
            <ButtonX src={closeBtn} alt='업로드 이미지를 취소하는 x버튼' />
          </DeletePreviewButton>
        </PreviewWrapper>
      )}
    </FieldContainer>
  );
};

export default FileField;
